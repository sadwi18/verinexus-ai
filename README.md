# VeriNexus AI

**Verify Before You Believe** — an autonomous multi-agent research & fact-verification platform.

Built for Domain 3 (Gen AI) — Problem Statement: *Autonomous Multi-Agent Research & Fact-Verification System*.

## The problem

Generative AI tools are powerful researchers but often hallucinate or state claims without
verification. VeriNexus AI runs a claim through a pipeline of cooperating agents that research,
cross-verify, hunt for contradictions, and compile a citation-backed report with a confidence
score — instead of trusting one model's single pass.

## Agent pipeline

| # | Agent | Job |
|---|-------|-----|
| 1 | **Researcher** | Breaks the claim into sub-questions, searches trusted sources (Tavily) |
| 2 | **Verifier** | Cross-checks each sub-claim against multiple independent sources |
| 3 | **Contradiction Detector** | Flags disagreement between sources or hallucinated specifics |
| 4 | **Synthesizer** | Compiles a citation-backed report with a per-claim confidence score |
| 5 | **Orchestrator** | Runs the above as a LangGraph state machine, retries/branches on conflict |

## Stack

- **Frontend:** Next.js 15 (App Router) + React + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** FastAPI (Python) + LangGraph + Gemini API + Tavily Search API
- **Data:** MongoDB (reports/history) + ChromaDB (source embeddings for re-verification)
- **Auth:** JWT + bcrypt
- **Background jobs:** Celery + Redis (long-running verification jobs)
- **Deploy:** Docker Compose

## Project layout

```
verinexus-ai/
├── frontend/           # Next.js app — landing, verify, history, login
├── backend/             # FastAPI app — agent pipeline, API routes, DB
└── docker-compose.yml   # spins up frontend + backend + mongo + redis
```

## Running locally

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in GEMINI_API_KEY, TAVILY_API_KEY, MONGO_URI
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Visit http://localhost:3000.

### Or with Docker
```bash
docker compose up --build
```

## Pushing to GitHub

```bash
cd verinexus-ai
git init
git add .
git commit -m "Initial commit: VeriNexus AI MVP scaffold"
git branch -M main
git remote add origin https://github.com/<your-username>/verinexus-ai.git
git push -u origin main
```

## Status

This is a hackathon MVP scaffold: the landing page is fully built, the app shell (verify/history/login
pages) is wired up, and the backend exposes the agent pipeline as stubbed-but-runnable endpoints
(deterministic mock output) so the frontend has something real to hit immediately. Swap the mock
logic in `backend/app/agents/*.py` for live Gemini + Tavily calls to go from demo to real.
