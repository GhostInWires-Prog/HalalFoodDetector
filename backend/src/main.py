from fastapi import FastAPI

from .api.routes import api_router
from .core.config import settings


def create_application() -> FastAPI:
    app = FastAPI(
        title="Halal Identifier API",
        version="0.1.0",
        description="Backend services for halal certification inference and product lookup.",
    )

    app.include_router(api_router, prefix=settings.api_prefix)
    return app


app = create_application()


@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    """Simple readiness probe for orchestrators and local checks."""

    return {"status": "ok"}

