from fastapi import APIRouter

from app.db.mongo import list_history
from app.models.schemas import HistoryItem

router = APIRouter(prefix="/api", tags=["history"])


@router.get("/history", response_model=list[HistoryItem])
async def get_history() -> list[HistoryItem]:
    records = await list_history()
    return [
        HistoryItem(
            id=r["id"],
            claim=r["claim"],
            overall_confidence=r["overall_confidence"],
            created_at=r["created_at"],
        )
        for r in records
    ]
