# ML Workspace

## Structure
- `datasets/` – Raw and processed datasets (excluded from VCS).
- `notebooks/` – Jupyter/Colab notebooks for exploration and prototyping.
- `experiments/` – Training scripts, configs, and outputs.
- `models/` – Exported weights and ONNX/TensorRT bundles.
- `reports/` – Metrics, plots, and experiment summaries.

## Environment
- Recommended: Google Colab or local Python 3.11 with PyTorch 2.3.
- Install dependencies using `pip install -r ../backend/requirements.txt` (shared stack) or create a dedicated `requirements-ml.txt` (to be added).

## Next Steps
- Curate packaging images and E-code label dataset.
- Prototype logo detector (YOLOv8) and OCR pipeline (TrOCR / EasyOCR).
- Log experiments using MLflow or Weights & Biases.

