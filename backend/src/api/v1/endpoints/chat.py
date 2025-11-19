from fastapi import APIRouter

from ....schemas.chat import ChatCompletionRequest, ChatCompletionResponse
from ....services.chat_service import create_chat_completion

router = APIRouter()


@router.post("/completions", response_model=ChatCompletionResponse)
async def generate_chat_completion(
    request: ChatCompletionRequest,
) -> ChatCompletionResponse:
    return await create_chat_completion(request)

