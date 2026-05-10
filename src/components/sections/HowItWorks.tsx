const STEPS = [
  { n: "01", title: "Paste", desc: "Drop in a job description." },
  { n: "02", title: "Generate", desc: "Pick a platform and free model." },
  { n: "03", title: "Search", desc: "Copy a variant, paste, source." },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="reveal mx-auto mt-28 max-w-3xl px-4 text-center"
    >
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        How it works
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="rounded-2xl border border-border bg-surface/60 p-5 text-left backdrop-blur transition-colors hover:border-foreground/20"
          >
            <div className="font-mono text-[11px] tracking-widest text-muted-foreground">
              {s.n}
            </div>
            <div className="mt-1.5 text-base font-semibold">{s.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
