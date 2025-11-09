from fastapi import APIRouter


router = APIRouter()


@router.get("/ping", summary="API heartbeat")
async def ping() -> dict[str, str]:
    return {"message": "pong"}

