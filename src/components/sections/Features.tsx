import { Layers, Lock, Cpu, Gauge, Wand2, GitBranch } from "lucide-react";

const ITEMS = [
  {
    icon: Layers,
    title: "Three calibrated variants",
    desc: "Broad for recall, Balanced for production, Strict for surgical sourcing.",
  },
  {
    icon: Lock,
    title: "Bring your own key",
    desc: "Stored in localStorage only. We never see your OpenRouter credentials.",
  },
  {
    icon: Cpu,
    title: "Free models, filtered",
    desc: "We pull OpenRouter's catalog and surface only the zero-cost variants.",
  },
  {
    icon: Wand2,
    title: "Strict JSON output",
    desc: "Boolean syntax is validated, parens balanced, multi-word terms quoted.",
  },
  {
    icon: Gauge,
    title: "Sub-5s generation",
    desc: "Lightweight prompt, low temperature, no streaming overhead in the UI.",
  },
  {
    icon: GitBranch,
    title: "Zero backend",
    desc: "Pure client app. No accounts, no logging, no analytics, no database.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="reveal mx-auto max-w-7xl px-4 pt-32 md:px-8"
    >
      <div className="mb-10 flex items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Architecture
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Built like a tool, not a SaaS.
          </h2>
        </div>
        <div className="hidden font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:block">
          06 modules
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it, i) => (
          <div
            key={it.title}
            className="card-elevate group relative overflow-hidden rounded-2xl border border-border bg-surface p-6"
            style={{ transform: i % 3 === 1 ? "translateY(12px)" : undefined }}
          >
            <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-soft">
              <it.icon className="h-4 w-4" />
            </div>
            <div className="text-base font-semibold">{it.title}</div>
            <p className="mt-1.5 text-sm text-muted-foreground">{it.desc}</p>
            <div
              className="mt-5 h-px w-full animate-pulse-line"
              style={{
                background:
                  "color-mix(in oklab, var(--foreground) 18%, transparent)",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
