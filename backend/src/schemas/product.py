from typing import Literal

from pydantic import BaseModel, Field


CaptureMode = Literal["barcode", "logo", "ingredients"]


class IngredientModelInsight(BaseModel):
    status: str = Field(..., description="Top predicted status from the ingredient classifier")
    confidence: float = Field(..., ge=0.0, le=1.0)
    raw_scores: dict[str, float] = Field(
        default_factory=dict,
        description="Per-class probabilities for the ingredient classifier",
    )


class BarcodeModelInsight(BaseModel):
    status: str = Field(..., description="Top predicted status from the barcode classifier")
    confidence: float = Field(..., ge=0.0, le=1.0)
    raw_scores: dict[str, float] = Field(
        default_factory=dict,
        description="Per-class probabilities for the barcode classifier",
    )


class LogoModelInsight(BaseModel):
    detected: bool = Field(..., description="Whether a halal logo was detected on the image")
    confidence: float = Field(..., ge=0.0, le=1.0)


class FeatureBreakdown(BaseModel):
    ingredients: IngredientModelInsight | None = Field(
        None, description="Outputs from the ingredient classifier"
    )
    barcode: BarcodeModelInsight | None = Field(
        None, description="Outputs from the barcode classifier"
    )
    logo: LogoModelInsight | None = Field(None, description="Outputs from the halal logo detector")


class ProductClassificationRequest(BaseModel):
    product_name: str | None = Field(
        None, description="Optional human-readable product label supplied by the client"
    )
    barcode: str | None = Field(
        None,
        description="Scan code when available. Used for traceability, not model inference currently.",
    )
    ingredients_text: str | None = Field(
        None, description="Raw OCR output or manually entered ingredient list"
    )
    image_base64: str | None = Field(
        None,
        description="Base64 encoded product image for halal logo detection",
    )
    capture_mode: CaptureMode | None = Field(
        None, description="Origin of the submission so we can route to appropriate models"
    )


class HalalClassificationResponse(BaseModel):
    product_name: str = Field(..., description="Human-readable product label")
    barcode: str | None = Field(None, description="EAN/UPC code when available")
    halal_status: str = Field(..., description="Halal classification: halal, haram, or doubtful")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence in classification")
    evidence: list[str] = Field(default_factory=list, description="Key detections supporting the decision")
    capture_mode: CaptureMode | None = Field(
        None, description="Capture mode that produced the decision"
    )
    recognized_ingredients_text: str | None = Field(
        None, description="Ingredient text extracted via OCR when supplied image capture is used"
    )
    feature_breakdown: FeatureBreakdown = Field(
        default_factory=FeatureBreakdown,
        description="Detailed outputs for each enabled model",
    )

