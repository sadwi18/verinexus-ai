import ClaimInput from "./ClaimInput";

export default function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center px-6 pb-32 pt-20 text-center sm:pt-28">
      <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
        Veri<span className="text-accent-light">Nexus</span> AI
      </h1>

      <p className="mt-5 font-display text-2xl font-semibold text-white/90 sm:text-3xl">
        Verify Before You Believe
      </p>

      <p className="mx-auto mt-6 max-w-xl text-balance text-[15px] leading-relaxed text-white/60 sm:text-base">
        AI-powered multi-agent fact verification that checks claims against
        trusted sources and provides confidence scores.
      </p>

      <div className="mt-10 w-full">
        <ClaimInput />
      </div>
    </section>
  );
}
