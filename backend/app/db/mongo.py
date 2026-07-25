"""
Thin storage layer for verification reports / history.

For the hackathon MVP this transparently falls back to an in-memory list when
MONGO_URI isn't set, so the app runs with zero external dependencies. Once
MONGO_URI is set in .env, reports/history persist in MongoDB instead — no
route code needs to change.
"""

import uuid
from datetime import datetime, timezone

from app.core.config import settings

_in_memory_history: list[dict] = []

_mongo_client = None
_mongo_collection = None

if settings.mongo_uri:
    from motor.motor_asyncio import AsyncIOMotorClient

    _mongo_client = AsyncIOMotorClient(settings.mongo_uri)
    _mongo_collection = _mongo_client[settings.mongo_db_name]["reports"]


async def save_report(claim: str, overall_confidence: float, report: dict) -> str:
    record = {
        "id": str(uuid.uuid4()),
        "claim": claim,
        "overall_confidence": overall_confidence,
        "report": report,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    if _mongo_collection is not None:
        await _mongo_collection.insert_one(record)
    else:
        _in_memory_history.insert(0, record)

    return record["id"]


async def list_history(limit: int = 50) -> list[dict]:
    if _mongo_collection is not None:
        cursor = _mongo_collection.find().sort("created_at", -1).limit(limit)
        return [doc async for doc in cursor]

    return _in_memory_history[:limit]
