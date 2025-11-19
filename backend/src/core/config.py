from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    api_prefix: str = "/api"
    app_env: str = "development"
    cors_allow_origins: list[str] = ["*"]
    model_registry_path: Path = BASE_DIR / "src" / "models"
    openrouter_api_key: str | None = None
    openrouter_default_model: str = "deepseek/deepseek-chat-v3.1:free"
    openrouter_referer: str | None = None
    openrouter_title: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

