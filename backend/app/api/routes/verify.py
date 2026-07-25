from fastapi import APIRouter

from app.agents.orchestrator import run_pipeline
from app.db.mongo import save_report
from app.models.schemas import VerifyRequest, VerifyResponse

router = APIRouter(prefix="/api", tags=["verify"])


@router.post("/verify", response_model=VerifyResponse)
async def verify_claim(payload: VerifyRequest) -> VerifyResponse:
    report = await run_pipeline(payload.claim)
    await save_report(payload.claim, report["overall_confidence"], report)
    return VerifyResponse(**report)
