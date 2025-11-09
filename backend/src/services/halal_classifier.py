from __future__ import annotations

import base64
import io
import json
import logging
import re
import unicodedata
import threading

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Optional, cast

import numpy as np
import pandas as pd
from PIL import Image

try:
    import tensorflow as tf
    from tensorflow import keras  # pyright: ignore[reportAttributeAccessIssue]
except ImportError as exc:  # pragma: no cover - handled at runtime
    raise RuntimeError(
        "TensorFlow is required to use HalalClassifierService. "
        "Install it via `pip install tensorflow`."
    ) from exc

try:
    import easyocr
except ImportError:  # pragma: no cover - optional dependency handled at runtime
    easyocr = None

try:
    import joblib  # type: ignore
except ImportError:  # pragma: no cover - optional dependency handled at runtime
    joblib = None

LOGGER = logging.getLogger(__name__)

# We collapse Mushbooh into Doubtful throughout the service for consistency with the UI.
STATUS_HIERARCHY = {"Haram": 3, "Doubtful": 2, "Halal": 1}
DEFAULT_INGREDIENT_CLASSES = ["Halal", "Haram", "Doubtful"]
DEFAULT_BARCODE_CLASSES = ["Halal", "Doubtful"]


@dataclass
class IngredientPrediction:
    status: str
    confidence: float
    raw_scores: dict[str, float]


@dataclass
class LogoPrediction:
    detected: bool
    confidence: float


@dataclass
class BarcodePrediction:
    status: str
    confidence: float
    raw_scores: dict[str, float]


def true_divide(x: Any, y: Any = 1.0, **_: Any) -> tf.Tensor:
    """Compatibility shim for Lambda layers serialized as `TrueDivide`."""

    if isinstance(x, (tuple, list)):
        if len(x) == 1:
            numerator = x[0]
            denominator = y
        elif len(x) >= 2:
            numerator = x[0]
            denominator = x[1]
        else:
            raise ValueError("Unexpected empty input for TrueDivide.")
    else:
        numerator = x
        denominator = y

    if denominator is None:
        denominator = 1.0

    if not tf.is_tensor(denominator):
        denominator = tf.cast(denominator, numerator.dtype)

    return tf.math.truediv(numerator, denominator)


class HalalClassifierService:
    """Facade for orchestrating CV+NLP inference pipelines."""

    def __init__(self, model_dir: Path) -> None:
        self.model_dir = model_dir
        self._ingredient_model: Optional["keras.Model"] = None
        self._logo_model: Optional["keras.Model"] = None
        self._barcode_model: Optional["keras.Model"] = None
        self._logo_interpreter: Optional["tf.lite.Interpreter"] = None
        self._logo_interpreter_lock = threading.Lock()
        self._logo_input_details: Optional[list[dict[str, Any]]] = None
        self._logo_output_details: Optional[list[dict[str, Any]]] = None
        self._logo_input_shape: Optional[tuple[int, int, int]] = None
        self._logo_input_quant: Optional[tuple[float, float]] = None
        self._logo_output_quant: Optional[tuple[float, float]] = None
        self._logo_input_dtype: Optional[np.dtype[Any]] = None
        self._ecode_lookup: Optional[pd.DataFrame] = None
        self._ocr_reader: Optional[Any] = None
        self._ingredient_label_order: list[str] = DEFAULT_INGREDIENT_CLASSES.copy()
        self._barcode_label_order: list[str] = DEFAULT_BARCODE_CLASSES.copy()
        self._logo_label_encoder: Optional[Any] = None

    def load(self) -> None:
        """Load ML model artifacts lazily."""
        LOGGER.info("Loading halal classifier assets from %s", self.model_dir)
        self._load_ingredient_model()
        self._load_logo_model()
        self._load_barcode_model()
        self._load_ecode_lookup()
        self._load_logo_label_encoder()
        self._load_ocr_reader()

    def predict(self, payload: dict[str, Any]) -> dict[str, Any]:
        product_name = payload.get("product_name")
        barcode = payload.get("barcode")
        ingredients_text = self._normalize_ingredients_text(payload.get("ingredients_text"))
        image_base64 = payload.get("image_base64")
        capture_mode = payload.get("capture_mode")

        extracted_ingredients_text: Optional[str] = None
        if not ingredients_text and image_base64:
            extracted_ingredients_text = self._extract_text_from_image(image_base64)
            normalized = self._normalize_ingredients_text(extracted_ingredients_text)
            if normalized:
                LOGGER.info("OCR extracted ingredient text of length %s", len(normalized))
                ingredients_text = normalized
                extracted_ingredients_text = normalized
            else:
                LOGGER.info("OCR did not extract any usable ingredient text from provided image.")

        ingredient_prediction = self._predict_from_ingredients(ingredients_text)
        logo_prediction = self._predict_from_logo(image_base64)
        barcode_prediction = self._predict_from_barcode(barcode)
        ecode_evidence = self._extract_ecode_evidence(ingredients_text)

        final_status = "Doubtful"
        final_confidence = 0.5
        evidence: list[str] = []

        if ingredient_prediction:
            final_status = ingredient_prediction.status
            final_confidence = ingredient_prediction.confidence
            evidence.append(
                f"Ingredient classifier suggests {ingredient_prediction.status} "
                f"(confidence {ingredient_prediction.confidence:.2f})"
            )

        if barcode_prediction:
            evidence.append(
                f"Barcode classifier suggests {barcode_prediction.status} "
                f"(confidence {barcode_prediction.confidence:.2f})"
            )
            if STATUS_HIERARCHY[barcode_prediction.status] > STATUS_HIERARCHY[final_status]:
                final_status = barcode_prediction.status
                final_confidence = max(final_confidence, barcode_prediction.confidence)

        if extracted_ingredients_text:
            preview = extracted_ingredients_text.strip().replace("\n", " ")
            if len(preview) > 200:
                preview = preview[:200].rstrip() + "..."
            evidence.append(f"OCR extracted ingredient text: {preview}")

        if ecode_evidence:
            evidence.extend(
                f"{item['code']} labeled {item['halal_status']} – {item['description'] or 'No description provided'}"
                for item in ecode_evidence
            )
            max_status = max(
                (self._map_status(item["halal_status"]) for item in ecode_evidence),
                key=lambda status: STATUS_HIERARCHY[status],
            )
            if STATUS_HIERARCHY[max_status] > STATUS_HIERARCHY[final_status]:
                final_status = max_status
                final_confidence = max(final_confidence, 0.85)

        if logo_prediction:
            if logo_prediction.detected:
                evidence.append(
                    f"Halal logo detected with confidence {logo_prediction.confidence:.2f}"
                )
                if STATUS_HIERARCHY["Halal"] > STATUS_HIERARCHY[final_status]:
                    final_status = "Halal"
                    final_confidence = max(final_confidence, logo_prediction.confidence)
            else:
                evidence.append(
                    "Halal logo not detected on provided image – manual review recommended"
                )
                final_confidence = min(final_confidence, 0.6)
                if final_status == "Halal":
                    final_status = "Doubtful"

        # If no signals were produced, provide default evidence.
        if not evidence:
            evidence.append("No model signals available; returning neutral assessment.")

        feature_breakdown = {
            "ingredients": self._serialize_dataclass(ingredient_prediction),
            "barcode": self._serialize_dataclass(barcode_prediction),
            "logo": self._serialize_dataclass(logo_prediction),
        }

        return {
            "product_name": product_name or "Unnamed product",
            "barcode": barcode,
            "halal_status": final_status,
            "confidence": float(np.clip(final_confidence, 0.0, 1.0)),
            "evidence": evidence,
            "capture_mode": capture_mode,
            "recognized_ingredients_text": extracted_ingredients_text,
            "feature_breakdown": {k: v for k, v in feature_breakdown.items() if v is not None},
        }

    # --------------------------------------------------------------------- #
    # Internal helpers
    # --------------------------------------------------------------------- #
    def _load_ingredient_model(self) -> None:
        if self._ingredient_model is not None:
            return
        model_path = self.model_dir / "ingredient_text_classifier.h5"
        if not model_path.exists():
            LOGGER.warning("Ingredient classifier model not found at %s", model_path)
            return
        LOGGER.info("Loading ingredient classifier model from %s", model_path)
        self._ingredient_model = keras.models.load_model(
            model_path, custom_objects=self._get_custom_objects()
        )
        self._ingredient_label_order = self._load_label_order(
            "ingredient_text_labels.json", DEFAULT_INGREDIENT_CLASSES
        )
        self._hydrate_ingredient_vectorizer()

    def _load_logo_model(self) -> None:
        if self._logo_interpreter is not None or self._logo_model is not None:
            return

        tflite_path = self.model_dir / "halal_logo_detector.tflite"
        if tflite_path.exists():
            try:
                interpreter = tf.lite.Interpreter(model_path=str(tflite_path))
                interpreter.allocate_tensors()
                self._logo_interpreter = interpreter
                self._logo_input_details = interpreter.get_input_details()
                self._logo_output_details = interpreter.get_output_details()
                self._logo_input_dtype = self._logo_input_details[0]["dtype"]
                shape_slice = tuple(int(dim) for dim in self._logo_input_details[0]["shape"][1:4])
                self._logo_input_shape = cast(tuple[int, int, int], shape_slice)
                self._logo_input_quant = self._extract_quant_params(self._logo_input_details[0])
                self._logo_output_quant = self._extract_quant_params(self._logo_output_details[0])
                LOGGER.info("Loaded halal logo detector TFLite model from %s", tflite_path)
                return
            except Exception as exc:  # pragma: no cover - runtime safety
                LOGGER.warning("Failed to load TFLite logo model at %s: %s", tflite_path, exc)
                self._logo_interpreter = None

        # Fall back to the newer Keras format.
        keras_path = self.model_dir / "halal_logo_detector.keras"
        if keras_path.exists():
            try:
                LOGGER.info("Loading halal logo detector model from %s", keras_path)
                self._logo_model = keras.models.load_model(keras_path, compile=False)
                return
            except Exception as exc:  # pragma: no cover
                LOGGER.warning("Failed to load %s: %s", keras_path, exc)

        # Final fallback to legacy H5 format.
        h5_path = self.model_dir / "halal_logo_detector.h5"
        if not h5_path.exists():
            LOGGER.warning("Halal logo detector model not found at %s", h5_path)
            return
        LOGGER.info("Loading halal logo detector model from %s", h5_path)
        self._logo_model = keras.models.load_model(
            h5_path, custom_objects=self._get_custom_objects()
        )

    def _load_barcode_model(self) -> None:
        if self._barcode_model is not None:
            return
        model_path = self.model_dir / "barcode_status_classifier.h5"
        if not model_path.exists():
            LOGGER.warning("Barcode classifier model not found at %s", model_path)
            return
        LOGGER.info("Loading barcode classifier model from %s", model_path)
        self._barcode_model = keras.models.load_model(
            model_path, custom_objects=self._get_custom_objects()
        )
        self._barcode_label_order = self._load_label_order(
            "barcode_status_labels.json", DEFAULT_BARCODE_CLASSES
        )

    def _load_ecode_lookup(self) -> None:
        if self._ecode_lookup is not None:
            return
        csv_path = self.model_dir / "ecode_database.csv"
        if not csv_path.exists():
            LOGGER.warning("E-code lookup database not found at %s", csv_path)
            return
        LOGGER.info("Loading E-code lookup table from %s", csv_path)
        self._ecode_lookup = pd.read_csv(csv_path)
        # Normalize data for faster lookups
        self._ecode_lookup["e_code_number"] = self._ecode_lookup["e_code_number"].str.upper()

    def _load_logo_label_encoder(self) -> None:
        if self._logo_label_encoder is not None or joblib is None:
            return
        encoder_path = self.model_dir / "logo_label_encoder.joblib"
        if not encoder_path.exists():
            return
        try:
            self._logo_label_encoder = joblib.load(encoder_path)
            LOGGER.info("Loaded logo label encoder from %s", encoder_path)
        except Exception as exc:  # pragma: no cover - runtime safety
            LOGGER.warning("Failed to load logo label encoder: %s", exc)
            self._logo_label_encoder = None

    def _load_ocr_reader(self) -> None:
        if self._ocr_reader is not None or easyocr is None:
            if easyocr is None:
                LOGGER.warning("easyocr is not installed; OCR ingredient extraction will be unavailable.")
            return
        try:
            self._ocr_reader = easyocr.Reader(["en"], gpu=False)
            LOGGER.info("Initialized easyocr reader for ingredient extraction.")
        except Exception as exc:  # pragma: no cover - runtime safety
            LOGGER.warning("Failed to initialize easyocr reader: %s", exc)
            self._ocr_reader = None

    def _predict_from_ingredients(self, text: Optional[str]) -> Optional[IngredientPrediction]:
        if not text or self._ingredient_model is None:
            return None

        processed = self._normalize_ingredients_text(text)
        if not processed:
            return None

        try:
            input_payload = np.array([processed], dtype=object)
            predictions = self._ingredient_model.predict(input_payload, verbose=0)[0]
        except Exception as exc:  # pragma: no cover - runtime safety
            LOGGER.warning("Ingredient model inference failed: %s", exc)
            return None

        if predictions.ndim == 0:
            LOGGER.warning("Unexpected ingredient model output shape: %s", predictions.shape)
            return None

        scores = np.asarray(predictions, dtype=np.float32).flatten()
        label_order = self._ingredient_label_order or DEFAULT_INGREDIENT_CLASSES
        if scores.size != len(label_order):
            LOGGER.warning(
                "Ingredient model returned %s classes, expected %s",
                scores.size,
                len(label_order),
            )
            return None

        raw_scores = {
            label_order[idx]: float(np.clip(scores[idx], 0.0, 1.0))
            for idx in range(len(label_order))
        }
        best_index = int(np.argmax(scores))
        best_class = label_order[best_index]
        confidence = float(np.clip(scores[best_index], 0.0, 1.0))

        return IngredientPrediction(status=best_class, confidence=confidence, raw_scores=raw_scores)

    def _predict_from_logo(self, image_base64: Optional[str]) -> Optional[LogoPrediction]:
        if not image_base64:
            return None

        image_bytes = self._decode_base64_image(image_base64)

        if self._logo_interpreter is not None:
            scores = self._run_logo_interpreter(image_bytes)
            if scores is None:
                return None
        elif self._logo_model is not None:
            try:
                prepared = self._prepare_image(image_bytes, model=self._logo_model)
                predictions = self._logo_model.predict(prepared, verbose=0)[0]
            except Exception as exc:  # pragma: no cover - runtime safety
                LOGGER.warning("Logo detection model inference failed: %s", exc)
                return None
            scores = np.asarray(predictions, dtype=np.float32).flatten()
        else:
            LOGGER.warning("No halal logo detector model is loaded.")
            return None

        if scores.size == 0:
            LOGGER.warning("Logo detection model returned empty predictions.")
            return None

        confidence = float(np.clip(scores.max(), 0.0, 1.0))
        if scores.size == 1:
            detected = confidence >= 0.5
        else:
            best_index = int(np.argmax(scores))
            if self._logo_label_encoder is not None:
                try:
                    labels = list(getattr(self._logo_label_encoder, "classes_", []))
                    detected = (
                        labels[best_index].lower() in {"halal", "logo", "positive"}
                        if best_index < len(labels)
                        else best_index == 1
                    )
                except Exception:  # pragma: no cover - runtime safety
                    detected = best_index == 1
            else:
                detected = best_index == 1

        return LogoPrediction(detected=detected, confidence=confidence)

    def _run_logo_interpreter(self, image_bytes: bytes) -> Optional[np.ndarray]:
        interpreter = self._logo_interpreter
        if (
            interpreter is None
            or self._logo_input_details is None
            or self._logo_output_details is None
            or self._logo_input_dtype is None
        ):
            return None

        try:
            if self._logo_input_shape is None:
                height = int(self._logo_input_details[0]["shape"][1])
                width = int(self._logo_input_details[0]["shape"][2])
            else:
                height, width, _ = self._logo_input_shape

            float_input = self._prepare_image(image_bytes, height=height, width=width)
            input_data = self._apply_input_quantization(float_input)

            with self._logo_interpreter_lock:
                interpreter.set_tensor(self._logo_input_details[0]["index"], input_data)
                interpreter.invoke()
                output_data = interpreter.get_tensor(self._logo_output_details[0]["index"])
        except Exception as exc:  # pragma: no cover - runtime safety
            LOGGER.warning("TFLite logo inference failed: %s", exc)
            return None

        return self._apply_output_dequantization(output_data)

    def _predict_from_barcode(self, barcode: Optional[str]) -> Optional[BarcodePrediction]:
        if not barcode or self._barcode_model is None:
            return None

        processed = self._normalize_barcode(barcode)
        if not processed:
            return None

        try:
            payload = np.array([processed], dtype=object)
            predictions = self._barcode_model.predict(payload, verbose=0)[0]
        except Exception as exc:  # pragma: no cover - runtime safety
            LOGGER.warning("Barcode model inference failed: %s", exc)
            return None

        scores = np.asarray(predictions, dtype=np.float32).flatten()
        label_order = self._barcode_label_order or DEFAULT_BARCODE_CLASSES
        if scores.size != len(label_order):
            LOGGER.warning(
                "Barcode model returned %s classes, expected %s",
                scores.size,
                len(label_order),
            )
            return None

        raw_scores = {
            label_order[idx]: float(np.clip(scores[idx], 0.0, 1.0)) for idx in range(len(label_order))
        }
        best_index = int(np.argmax(scores))
        best_class = label_order[best_index]
        confidence = float(np.clip(scores[best_index], 0.0, 1.0))

        return BarcodePrediction(status=best_class, confidence=confidence, raw_scores=raw_scores)

    def _extract_ecode_evidence(self, text: Optional[str]) -> list[dict[str, str]]:
        if not text or self._ecode_lookup is None:
            return []

        codes = {code.upper() for code in re.findall(r"\bE\d{1,4}[A-Z]?\b", text, flags=re.IGNORECASE)}
        if not codes:
            return []

        lookup = self._ecode_lookup[self._ecode_lookup["e_code_number"].isin(list(codes))]
        if lookup.empty:
            return []

        evidence = []
        for _, row in lookup.iterrows():
            status = self._map_status(row.get("halal_status"))
            evidence.append(
                {
                    "code": row.get("e_code_number", ""),
                    "halal_status": status,
                    "description": row.get("description") or row.get("name") or "",
                }
            )
        return evidence

    @staticmethod
    def _map_status(raw_status: Optional[str]) -> str:
        if not raw_status:
            return "Doubtful"
        formatted = raw_status.strip().capitalize()
        if formatted == "Mushbooh":
            return "Doubtful"
        if formatted not in STATUS_HIERARCHY:
            return "Doubtful"
        return formatted

    def _normalize_barcode(self, value: Optional[str]) -> Optional[str]:
        if not value:
            return None
        alphanumerics = re.sub(r"[^0-9A-Za-z]", "", value)
        return alphanumerics or None

    def _hydrate_ingredient_vectorizer(self) -> None:
        if self._ingredient_model is None:
            return

        vocab_path = self.model_dir / "ingredient_text_vocab.json"
        if not vocab_path.exists():
            LOGGER.warning("Ingredient vocabulary not found at %s", vocab_path)
            return

        try:
            with open(vocab_path, "r", encoding="utf-8") as handle:
                vocabulary = json.load(handle)
            if not isinstance(vocabulary, list):
                raise ValueError("Vocabulary file must contain a JSON list.")
        except Exception as exc:  # pragma: no cover - runtime safety
            LOGGER.warning("Failed to load ingredient vocabulary: %s", exc)
            return

        try:
            layer = self._ingredient_model.get_layer("text_vectorization")
        except ValueError:
            LOGGER.warning(
                "Ingredient model does not expose a layer named 'text_vectorization'; "
                "skipping vocabulary hydration."
            )
            return

        try:
            layer.set_vocabulary(vocabulary)
            LOGGER.info("Hydrated ingredient text vectorizer with %s tokens.", len(vocabulary))
        except Exception as exc:  # pragma: no cover - runtime safety
            LOGGER.warning("Failed to hydrate ingredient vectorizer: %s", exc)

    def _apply_input_quantization(self, array: np.ndarray) -> np.ndarray:
        dtype = self._logo_input_dtype or np.float32
        quant = self._logo_input_quant
        if quant is None:
            return array.astype(dtype, copy=False)

        scale, zero_point = quant
        converted = array / scale + zero_point

        if np.issubdtype(dtype, np.integer):
            info = np.iinfo(dtype)
            converted = np.clip(np.round(converted), info.min, info.max)
        return converted.astype(dtype)

    def _apply_output_dequantization(self, output: np.ndarray) -> np.ndarray:
        quant = self._logo_output_quant
        if quant is None:
            return np.asarray(output, dtype=np.float32).flatten()

        scale, zero_point = quant
        dequant = (np.asarray(output, dtype=np.float32) - zero_point) * scale
        return dequant.flatten()

    def _load_label_order(self, filename: str, default: list[str]) -> list[str]:
        label_path = self.model_dir / filename
        if not label_path.exists():
            LOGGER.warning("Label file not found at %s; using defaults.", label_path)
            return default.copy()
        try:
            with open(label_path, "r", encoding="utf-8") as handle:
                loaded = json.load(handle)
            if not isinstance(loaded, list):
                raise ValueError("Label file does not contain a list.")
            normalized = [self._map_status(str(item)) for item in loaded]
            return normalized or default.copy()
        except Exception as exc:  # pragma: no cover - runtime safety
            LOGGER.warning("Failed to load label mapping from %s: %s", label_path, exc)
            return default.copy()

    def _get_custom_objects(self) -> dict[str, Any]:
        custom_objects: dict[str, Any] = {
            "TrueDivide": true_divide,
        }
        return custom_objects

    @staticmethod
    def _decode_base64_image(data: str) -> bytes:
        if "," in data:
            data = data.split(",", 1)[1]
        return base64.b64decode(data, validate=True)

    @staticmethod
    def _prepare_image(
        image_bytes: bytes,
        *,
        model: Optional["keras.Model"] = None,
        height: Optional[int] = None,
        width: Optional[int] = None,
    ) -> np.ndarray:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        if model is not None:
            input_shape = model.input_shape
            if isinstance(input_shape, list):
                input_shape = input_shape[0]
            if len(input_shape) != 4:
                raise ValueError(f"Unexpected model input shape: {input_shape}")
            height = int(input_shape[1])
            width = int(input_shape[2])
        if height is None or width is None:
            raise ValueError("Either a model or explicit height/width must be provided.")

        resized = image.resize((width, height))
        array = np.asarray(resized, dtype=np.float32) / 255.0
        return np.expand_dims(array, axis=0)

    def _extract_text_from_image(self, image_base64: str) -> Optional[str]:
        self._load_ocr_reader()
        if self._ocr_reader is None:
            return None

        try:
            image_bytes = self._decode_base64_image(image_base64)
            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image_array = np.asarray(pil_image)
            results = self._ocr_reader.readtext(image_array, detail=0, paragraph=True)
            if not results:
                return None
            text = "\n".join(result.strip() for result in results if result.strip())
            return text or None
        except Exception as exc:  # pragma: no cover - runtime safety
            LOGGER.warning("OCR extraction failed: %s", exc)
            return None

    @staticmethod
    def _normalize_ingredients_text(text: Optional[str]) -> Optional[str]:
        if not text:
            return None

        normalized = unicodedata.normalize("NFKD", text)
        normalized = normalized.lower()
        normalized = normalized.replace("ingredients:", " ")
        normalized = re.sub(r"[^a-z0-9\s,.;:/%()\-&]", " ", normalized)
        normalized = re.sub(r"\s+", " ", normalized).strip()
        if len(normalized) > 1000:
            normalized = normalized[:1000].rstrip()
        return normalized or None

    @staticmethod
    def _serialize_dataclass(obj: Any) -> Optional[dict[str, Any]]:
        if obj is None:
            return None
        try:
            return asdict(obj)
        except TypeError:
            return None

    @staticmethod
    def _extract_quant_params(detail: dict[str, Any]) -> Optional[tuple[float, float]]:
        quant = detail.get("quantization")
        if not quant:
            return None

        scale, zero_point = quant

        def _first_scalar(value: Any) -> Optional[float]:
            if isinstance(value, (list, tuple)):
                if len(value) != 1:
                    return None
                return float(value[0])
            if isinstance(value, np.ndarray):
                if value.size != 1:
                    return None
                return float(value.flatten()[0])
            if value is None:
                return None
            return float(value)

        scale_value = _first_scalar(scale)
        zero_point_value = _first_scalar(zero_point)

        if not scale_value or scale_value == 0.0:
            return None

        if zero_point_value is None:
            zero_point_value = 0.0

        return float(scale_value), float(zero_point_value)
