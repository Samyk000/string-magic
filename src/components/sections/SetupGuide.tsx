import { ExternalLink, KeyRound, ArrowRight } from "lucide-react";

type Props = { onOpenKey: () => void };

const STEPS = [
  {
    n: "1",
    title: "Sign up",
    desc: "Free OpenRouter account.",
    href: "https://openrouter.ai",
    cta: "openrouter.ai",
  },
  {
    n: "2",
    title: "Create key",
    desc: "Generate sk-or-v1-…",
    href: "https://openrouter.ai/keys",
    cta: "Keys page",
  },
  {
    n: "3",
    title: "Paste it",
    desc: "Stored in your browser only.",
    action: true,
  },
];

export function SetupGuide({ onOpenKey }: Props) {
  return (
    <section id="setup" className="reveal mx-auto mt-16 max-w-3xl px-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Setup · 60 seconds
        </div>
        <button
          onClick={onOpenKey}
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-foreground hover:underline"
        >
          <KeyRound className="h-3 w-3" /> Add key
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.n} className="relative">
            <div className="group flex h-full flex-col rounded-xl border border-border bg-surface/70 p-4 backdrop-blur transition-colors hover:border-foreground/25">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground font-mono text-[10px] font-bold text-background">
                  {s.n}
                </span>
                <span className="text-sm font-semibold">{s.title}</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
              {s.href && (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] text-foreground/80 underline-offset-2 hover:underline"
                >
                  {s.cta}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {s.action && (
                <button
                  onClick={onOpenKey}
                  className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] text-foreground/80 underline-offset-2 hover:underline"
                >
                  Open dialog
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="pointer-events-none absolute right-[-10px] top-1/2 hidden -translate-y-1/2 sm:block"
                aria-hidden="true"
              >
                <ArrowRight className="h-3 w-3 text-muted-foreground/60" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
