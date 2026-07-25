"""
Synthesizer agent.

Job: take the final list of scored sub-claims and compile the citation-backed
report the user sees — overall confidence + a plain-language summary.
"""


async def synthesize(claim: str, scored: list[dict]) -> dict:
    if not scored:
        return {
            "claim": claim,
            "overall_confidence": 0.0,
            "summary": "No verifiable sub-claims were found.",
            "claims": [],
        }

    overall = round(sum(c["confidence"] for c in scored) / len(scored), 2)

    supported = sum(1 for c in scored if c["verdict"] == "supported")
    contradicted = sum(1 for c in scored if c["verdict"] == "contradicted")

    summary = (
        f"{supported} of {len(scored)} sub-claims are supported by sources, "
        f"{contradicted} show contradictions or hallucination risk."
    )

    return {
        "claim": claim,
        "overall_confidence": overall,
        "summary": summary,
        "claims": scored,
    }
