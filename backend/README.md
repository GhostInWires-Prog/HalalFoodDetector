# Backend Service

## Overview
FastAPI application exposing endpoints for halal status inference, barcode/E-code lookups, and chatbot orchestration.

## Project Structure
- `src/main.py` – FastAPI app factory and health check.
- `src/api/` – Versioned API routes.
- `src/services/` – Business logic wrappers (e.g., model inference, barcode registry).
- `src/schemas/` – Pydantic response/request models.
- `requirements.txt` – Python dependencies (shared with ML experiments).

## Setup
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

## TODOs
- Implement actual halal classifier service integrating CV models.
- Add persistence layer (MongoDB/Postgres) for cached product verdicts.
- Secure endpoints with JWT and building scoping headers.

