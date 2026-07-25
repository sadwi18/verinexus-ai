const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type ClaimVerdict = {
  sub_claim: string;
  verdict: "supported" | "contradicted" | "unverifiable";
  confidence: number;
  sources: { title: string; url: string }[];
};

export type VerifyResponse = {
  claim: string;
  overall_confidence: number;
  summary: string;
  claims: ClaimVerdict[];
};

export type HistoryItem = {
  id: string;
  claim: string;
  overall_confidence: number;
  created_at: string;
};

export async function verifyClaim(claim: string): Promise<VerifyResponse> {
  const res = await fetch(`${API_URL}/api/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ claim }),
  });
  if (!res.ok) throw new Error(`Verification failed (${res.status})`);
  return res.json();
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_URL}/api/history`);
  if (!res.ok) throw new Error(`Failed to load history (${res.status})`);
  return res.json();
}
