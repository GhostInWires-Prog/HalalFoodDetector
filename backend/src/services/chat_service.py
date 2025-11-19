from __future__ import annotations

from typing import Any

import httpx
from fastapi import HTTPException, status

from ..core.config import settings
from ..schemas.chat import (
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatCompletionUsage,
    ChatMessage,
)


OPENROUTER_COMPLETIONS_URL = "https://openrouter.ai/api/v1/chat/completions"


async def create_chat_completion(payload: ChatCompletionRequest) -> ChatCompletionResponse:
    if not settings.openrouter_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenRouter API key is not configured. Please set OPENROUTER_API_KEY.",
        )

    request_body: dict[str, Any] = {
        "model": payload.model or settings.openrouter_default_model,
        "messages": [message.model_dump() for message in payload.messages],
    }

    if payload.temperature is not None:
        request_body["temperature"] = payload.temperature

    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
    }

    if settings.openrouter_referer:
        headers["HTTP-Referer"] = settings.openrouter_referer

    if settings.openrouter_title:
        headers["X-Title"] = settings.openrouter_title

    async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
        response = await client.post(
            OPENROUTER_COMPLETIONS_URL,
            json=request_body,
            headers=headers,
        )

    try:
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=exc.response.status_code,
            detail=f"OpenRouter request failed: {exc.response.text}",
        ) from exc

    data = response.json()
    try:
        first_choice = data["choices"][0]
        assistant_message = ChatMessage.model_validate(first_choice["message"])
    except (KeyError, IndexError) as exc:  # pragma: no cover - defensive programming
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="OpenRouter returned an unexpected response payload.",
        ) from exc

    usage_payload = data.get("usage")
    usage = (
        ChatCompletionUsage.model_validate(usage_payload)
        if isinstance(usage_payload, dict)
        else None
    )

    return ChatCompletionResponse(
        message=assistant_message,
        model=data.get("model", request_body["model"]),
        usage=usage,
    )

