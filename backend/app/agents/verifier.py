"""
Verifier agent.

Job: for each sub-claim + candidate sources from the Researcher, decide
whether the evidence supports, contradicts, or fails to settle the claim,
assign a confidence score, and explain the reasoning. Uses Groq (Llama) to
weigh the retrieved source snippets. Falls back to a deterministic heuristic
when no API key is configured.
"""

import hashlib
import json
import logging

from app.core.config import settings

logger = logging.getLogger("verifier")


async def verify(researched: list[dict]) -> list[dict]:
    if settings.groq_api_key:
        return await _verify_live(researched)
    return [_verify_mock(item) for item in researched]


async def _verify_live(researched: list[dict]) -> list[dict]:
    from langchain_groq import ChatGroq

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        groq_api_key=settings.groq_api_key,
        temperature=0,
    )

    results = []
    for item in researched:
        verdict, confidence, reasoning = await _verify_one(llm, item)
        results.append({
            **item,
            "verdict": verdict,
            "confidence": confidence,
            "reasoning": reasoning,
        })
    return results


async def _verify_one(llm, item: dict) -> tuple[str, float, str]:
    sub_claim = item["sub_claim"]
    sources = item.get("sources", [])

    evidence = (
        "\n".join(
            f"- {s.get('title', 'Source')} ({s.get('url', '')}): {s.get('content', '')[:400]}"
            for s in sources
            if s.get("content")
        )
        or "No sources found."
    )

    prompt = (
        "You are a rigorous fact-verification agent. Given a claim and evidence "
        "snippets, decide whether the evidence supports, contradicts, or is "
        "insufficient to verify the claim.\n\n"
        "Be careful: if the claim itself contains a factual error (wrong name, "
        "wrong date, wrong number, wrong place, etc.), the correct verdict is "
        "'contradicted', not 'unverifiable' — even if the general topic is "
        "covered by the sources. Explain specifically what is wrong.\n\n"
        f"Claim: {sub_claim}\n\nEvidence:\n{evidence}\n\n"
        "Respond with ONLY JSON in this exact shape:\n"
        '{"verdict": "supported"|"contradicted"|"unverifiable", '
        '"confidence": <float 0-1>, '
        '"reasoning": "<1-3 sentences citing specifics from the evidence>"}. '
        "No markdown, no explanation outside the JSON."
    )

    try:
        response = await llm.ainvoke(prompt)
        text = _strip_code_fence(response.content)
        data = json.loads(text)

        verdict = data.get("verdict", "unverifiable")
        if verdict not in ("supported", "contradicted", "unverifiable"):
            verdict = "unverifiable"

        confidence = float(data.get("confidence", 0.5))
        confidence = max(0.0, min(1.0, confidence))

        reasoning = str(data.get("reasoning", "")).strip() or "No reasoning provided by model."

        return verdict, round(confidence, 2), reasoning

    except Exception as e:
        logger.error("Groq verification failed for sub-claim %r: %s", sub_claim, e, exc_info=True)
        return (
            "unverifiable",
            0.0,
            f"Verification failed due to a system error ({type(e).__name__}: {e}). "
            "This is not a real confidence score — check server logs.",
        )


def _strip_code_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        text = text.removeprefix("json").strip()
    return text.strip()


def _verify_mock(item: dict) -> dict:
    digest = hashlib.sha256(item["sub_claim"].encode()).hexdigest()
    score = (int(digest[:4], 16) % 40 + 55) / 100

    verdict = "supported" if score >= 0.6 else "unverifiable"

    return {
        **item,
        "verdict": verdict,
        "confidence": round(score, 2),
        "reasoning": (
            "Mock mode: no GROQ_API_KEY configured, so this is a deterministic "
            "placeholder score, not a real evaluation of the evidence."
        ),
    }