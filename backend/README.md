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

## Environment configuration

Create a `.env` file inside the `backend/` directory before starting the server:

```env
OPENROUTER_API_KEY=sk-or-***
OPENROUTER_DEFAULT_MODEL=deepseek/deepseek-chat-v3.1:free
# Optional but recommended so OpenRouter can attribute usage
OPENROUTER_REFERER=http://localhost:3000
OPENROUTER_TITLE=HalalIdentifier
```

Without `OPENROUTER_API_KEY` the chat completion endpoint will respond with a 500 error.

## TODOs
- Implement actual halal classifier service integrating CV models.
- Add persistence layer (MongoDB/Postgres) for cached product verdicts.
- Secure endpoints with JWT and building scoping headers.

