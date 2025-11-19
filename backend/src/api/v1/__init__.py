from fastapi import APIRouter

from .endpoints import chat, health, products


router = APIRouter()
router.include_router(health.router, tags=["Health"])
router.include_router(products.router, prefix="/products", tags=["Products"])
router.include_router(chat.router, prefix="/chat", tags=["Chat"])

