"""
Researcher agent.

Job: take the raw claim, split it into checkable sub-claims, and gather
candidate sources for each. Uses Groq (Llama) to draft sub-claims and Tavily
to search real sources for each one. Falls back to a deterministic mock when
no API keys are configured, so the pipeline still runs end-to-end for a demo.
"""

import json

from app.core.config import settings


async def research(claim: str) -> list[dict]:
    if settings.tavily_api_key and settings.groq_api_key:
        return await _research_live(claim)
    return _research_mock(claim)


async def _research_live(claim: str) -> list[dict]:
    from tavily import TavilyClient

    sub_claims = await _split_into_sub_claims(claim)
    tavily = TavilyClient(api_key=settings.tavily_api_key)

    researched = []
    for sc in sub_claims:
        try:
            results = tavily.search(sc, max_results=3, search_depth="basic")
            sources = [
                {
                    "title": r.get("title") or "Source",
                    "url": r.get("url", ""),
                    "content": r.get("content", ""),
                }
                for r in results.get("results", [])
            ]
        except Exception:
            sources = []
        researched.append({"sub_claim": sc, "sources": sources})

    return researched


async def _split_into_sub_claims(claim: str) -> list[str]:
    from langchain_groq import ChatGroq

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        groq_api_key=settings.groq_api_key,
        temperature=0,
    )

    prompt = (
        "Split the following claim into 1-4 short, independently fact-checkable "
        "sub-claims. Respond with ONLY a JSON array of strings — no markdown, "
        "no explanation.\n\n"
        f"Claim: {claim}"
    )

    try:
        response = await llm.ainvoke(prompt)
        text = _strip_code_fence(response.content)
        parsed = json.loads(text)
        if isinstance(parsed, list) and parsed:
            return [str(s) for s in parsed][:4]
    except Exception:
        pass

    return [claim]


def _strip_code_fence(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        text = text.removeprefix("json").strip()
    return text.strip()


def _research_mock(claim: str) -> list[dict]:
    sentences = [s.strip() for s in claim.replace("?", ".").split(".") if s.strip()]
    sub_claims = sentences[:3] or [claim]

    return [
        {
            "sub_claim": sc,
            "sources": [
                {
                    "title": "Wikipedia",
                    "url": f"https://en.wikipedia.org/wiki/Special:Search?search={sc.replace(' ', '+')}",
                },
                {
                    "title": "Google Scholar",
                    "url": f"https://scholar.google.com/scholar?q={sc.replace(' ', '+')}",
                },
            ],
        }
        for sc in sub_claims
    ]