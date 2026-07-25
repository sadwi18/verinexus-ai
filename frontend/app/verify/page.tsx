"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { verifyClaim, VerifyResponse } from "@/lib/api";

function confidenceColor(score: number) {
  if (score >= 0.75) return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
  if (score >= 0.4) return "text-amber-400 border-amber-400/30 bg-amber-400/10";
  return "text-rose-400 border-rose-400/30 bg-rose-400/10";
}

function verdictLabel(v: string) {
  if (v === "supported") return "Supported";
  if (v === "contradicted") return "Contradicted";
  return "Unverifiable";
}

function VerifyContent() {
  const params = useSearchParams();
  const initialClaim = params.get("claim") ?? "";

  const [claim, setClaim] = useState(initialClaim);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);

  async function runVerification(c: string) {
    if (!c.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await verifyClaim(c.trim());
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong reaching the verification service."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialClaim) runVerification(initialClaim);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-ink-900 pb-24">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 pt-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Verify a claim</h1>
        <p className="mt-2 text-sm text-white/50">
          Every claim is researched, cross-checked, and scored by four cooperating agents.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runVerification(claim);
          }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="Paste a claim or ask a question..."
            className="w-full flex-1 rounded-full border border-white/10 bg-white px-6 py-3.5 text-[15px] text-ink-900 outline-none ring-accent/40 focus-visible:ring-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-full bg-accent px-8 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>
        </form>

        {error && (
          <div className="mt-8 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-300">
            {error} — is the backend running on the configured API URL?
          </div>
        )}

        {loading && (
          <div className="mt-10 space-y-3 text-sm text-white/40">
            <p>Researcher agent gathering sources…</p>
            <p>Verifier agent cross-checking claims…</p>
            <p>Contradiction detector scanning for conflicts…</p>
          </div>
        )}

        {result && !loading && (
          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-lg font-semibold">Overall confidence</h2>
                <span
                  className={`rounded-full border px-3 py-1 text-sm font-semibold ${confidenceColor(
                    result.overall_confidence
                  )}`}
                >
                  {Math.round(result.overall_confidence * 100)}%
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{result.summary}</p>
            </div>

            <div className="space-y-4">
              {result.claims.map((c, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium text-white/85">{c.sub_claim}</p>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${confidenceColor(
                        c.confidence
                      )}`}
                    >
                      {verdictLabel(c.verdict)} · {Math.round(c.confidence * 100)}%
                    </span>
                  </div>
                  {c.sources.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {c.sources.map((s, j) => (
                        <li key={j}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-accent-light hover:border-accent-light/40"
                          >
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
