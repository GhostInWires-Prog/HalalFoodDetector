from functools import lru_cache

from ..core.config import settings
from ..services.halal_classifier import HalalClassifierService


@lru_cache
def _get_classifier() -> HalalClassifierService:
    service = HalalClassifierService(model_dir=settings.model_registry_path)
    service.load()
    return service


def get_halal_classifier_service() -> HalalClassifierService:
    return _get_classifier()

