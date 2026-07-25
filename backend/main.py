from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import verify, history

app = FastAPI(
    title="VeriNexus AI",
    description="Autonomous multi-agent research & fact-verification system.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(verify.router)
app.include_router(history.router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "verinexus-ai-backend"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
