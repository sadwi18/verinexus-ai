"""
Orchestrator.

Runs Researcher -> Verifier -> Contradiction Detector -> Synthesizer in
sequence. This is deliberately a plain async pipeline for the MVP so it's
easy to read and demo end-to-end with zero setup. Swap this function's body
for a LangGraph `StateGraph` once you need branching/retries (e.g. re-running
Researcher when Contradiction Detector flags weak sourcing).
"""

from app.agents import researcher, verifier, contradiction_detector, synthesizer


async def run_pipeline(claim: str) -> dict:
    researched = await researcher.research(claim)
    verified = await verifier.verify(researched)
    checked = await contradiction_detector.detect_contradictions(verified)
    report = await synthesizer.synthesize(claim, checked)
    return report
