"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { fetchHistory, HistoryItem } from "@/lib/api";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-ink-900 pb-24">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pt-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">History</h1>
        <p className="mt-2 text-sm text-white/50">Claims you&apos;ve already verified.</p>

        {loading && <p className="mt-8 text-sm text-white/40">Loading…</p>}
        {error && (
          <div className="mt-8 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-300">
            {error} — is the backend running?
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="mt-8 text-sm text-white/40">
            No claims verified yet. <Link href="/" className="text-accent-light">Verify one now.</Link>
          </p>
        )}

        <ul className="mt-8 divide-y divide-white/5">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-white/85">{item.claim}</p>
                <p className="mt-1 text-xs text-white/35">{item.created_at}</p>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                {Math.round(item.overall_confidence * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
