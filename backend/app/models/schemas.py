from typing import Literal
from pydantic import BaseModel, Field


class VerifyRequest(BaseModel):
    claim: str = Field(..., min_length=3, max_length=2000)


class Source(BaseModel):
    title: str
    url: str


class ClaimVerdict(BaseModel):
    sub_claim: str
    verdict: Literal["supported", "contradicted", "unverifiable"]
    confidence: float
    sources: list[Source]


class VerifyResponse(BaseModel):
    claim: str
    overall_confidence: float
    summary: str
    claims: list[ClaimVerdict]


class HistoryItem(BaseModel):
    id: str
    claim: str
    overall_confidence: float
    created_at: str
