"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function ClaimInput() {
  const router = useRouter();
  const [claim, setClaim] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = claim.trim();
    if (!trimmed) return;
    router.push(`/verify?claim=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="claim" className="sr-only">
        Paste a claim or ask a question
      </label>
      <input
        id="claim"
        name="claim"
        type="text"
        value={claim}
        onChange={(e) => setClaim(e.target.value)}
        placeholder="Paste a claim or ask a question..."
        className="w-full flex-1 rounded-full border border-white/10 bg-white px-6 py-4 text-[15px] text-ink-900 placeholder:text-ink-800/50 shadow-lg shadow-black/20 outline-none ring-accent/40 focus-visible:ring-2"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-accent px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light"
      >
        Verify
      </button>
    </form>
  );
}
