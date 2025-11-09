## Halal Product Identifier Suite

This workspace hosts everything required to research, build, and document the halal product identifier project, including the computer-vision pipeline, backend services, Expo-based Smart App, and written deliverables.

### Directory Overview

- `app/` – Expo React Native Smart App (camera, barcode scan, halal assistant chatbot).
- `backend/` – FastAPI service that exposes halal verification APIs and integrates with ML models.
- `ml/` – Datasets, notebooks, experiments, and model artifacts for computer-vision and NLP pipelines.
- `docs/` – Research report, user guide, slide assets, and summary briefs.

### Getting Started

1. **Expo App**
   - Install dependencies: `cd app && npm install`
   - Run on device with Expo Go (USB debugging via ADB): `npm run start`

2. **Backend**
   - Create virtual environment: `cd backend && .\.venv\Scripts\activate`
   - Install packages (to be added in `requirements.txt`).

3. **ML Experiments**
   - Use `ml/notebooks/` within Google Colab or local Jupyter; sync datasets into `ml/datasets/`.

4. **Docs**
   - Draft the research paper inside `docs/research-report/` using the provided templates (to be added).

### Next Steps

- Scaffold FastAPI entrypoint in `backend/src/main.py` with placeholder routes.
- Create shared `apiClient` module for Expo app that points to backend service.
- Draft research outline and required tables inside `docs/research-report/`.


