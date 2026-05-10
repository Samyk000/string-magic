import { ClipboardPaste, Sparkles, Search } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardPaste,
    label: "01 · Paste",
    title: "Drop in a job description",
    desc: "Any length, any format. We extract titles, skills, seniority and exclusions.",
  },
  {
    icon: Sparkles,
    label: "02 · Generate",
    title: "Pick a free model, hit run",
    desc: "We send a precision prompt to OpenRouter and parse a strict JSON response.",
  },
  {
    icon: Search,
    label: "03 · Search",
    title: "Copy into LinkedIn or X-Ray",
    desc: "Three calibrated variants — Broad, Balanced, Strict — ready to paste.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="reveal mx-auto max-w-7xl px-4 pt-32 md:px-8">
      <div className="mb-10 max-w-2xl">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          How it works
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          From job description to sourcing string in three steps.
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.label}
            className="card-elevate rounded-2xl border border-border bg-surface p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-soft">
                <s.icon className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="text-lg font-semibold">{s.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
