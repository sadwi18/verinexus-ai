const stages = [
  {
    name: "Researcher",
    detail:
      "Breaks your claim into sub-questions and gathers evidence from trusted sources.",
  },
  {
    name: "Verifier",
    detail:
      "Cross-checks each sub-claim against multiple independent sources.",
  },
  {
    name: "Contradiction Detector",
    detail:
      "Flags disagreement between sources and catches hallucinated specifics.",
  },
  {
    name: "Synthesizer",
    detail:
      "Compiles a citation-backed report with a confidence score per claim.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative z-10 border-t border-white/5 bg-ink-950/60 px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          One claim, four agents, one honest answer
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-white/50 sm:text-[15px]">
          Instead of trusting a single model&apos;s first pass, your claim moves
          through a pipeline where agents check and challenge each other.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, i) => (
            <div
              key={stage.name}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6"
            >
              <span className="font-display text-xs font-semibold text-accent-light">
                Agent {i + 1}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold">
                {stage.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {stage.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
