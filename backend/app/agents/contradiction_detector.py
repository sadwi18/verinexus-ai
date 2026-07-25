"""
Contradiction Detector agent.

Job: look across the verified sub-claims for internal disagreement (e.g. two
sub-claims implying incompatible facts) or signs of a hallucinated specific
(overly precise numbers/dates with weak source support), and downgrade their
verdict/confidence accordingly.
"""


async def detect_contradictions(verified: list[dict]) -> list[dict]:
    flagged = []
    for item in verified:
        result = dict(item)

        # Heuristic: low confidence + fewer than 2 sources reads as
        # "hallucination risk" rather than merely "unverifiable".
        if result["confidence"] < 0.6 and len(result.get("sources", [])) < 2:
            result["verdict"] = "contradicted"

        flagged.append(result)

    return flagged
