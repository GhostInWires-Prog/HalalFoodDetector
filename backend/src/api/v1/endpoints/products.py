from fastapi import APIRouter, Depends, HTTPException, status

from src.api.deps import get_halal_classifier_service
from src.schemas.product import HalalClassificationResponse, ProductClassificationRequest
from src.services.halal_classifier import HalalClassifierService


router = APIRouter()


@router.get("/sample", response_model=HalalClassificationResponse)
async def sample_product() -> HalalClassificationResponse:
    """Placeholder endpoint demonstrating API response contract."""

    return HalalClassificationResponse(
        product_name="Sample Chocolate Bar",
        barcode="0000000000",
        halal_status="Doubtful",
        confidence=0.5,
        evidence=[
            "Detected additive E120 (Cochineal) requires manual verification",
            "Halal logo not detected on packaging scan",
        ],
    )


@router.post(
    "/classify",
    response_model=HalalClassificationResponse,
    summary="Run halal classification using trained models",
)
async def classify_product(
    request: ProductClassificationRequest,
    classifier: HalalClassifierService = Depends(get_halal_classifier_service),
) -> HalalClassificationResponse:
    if not any([request.ingredients_text, request.image_base64, request.barcode]):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Provide at least one of ingredients_text, image_base64, or barcode for classification.",
        )

    prediction = classifier.predict(request.model_dump())
    return HalalClassificationResponse(**prediction)

