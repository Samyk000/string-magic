import { useState } from "react";
import { ChevronDown, ExternalLink, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);

  return (
    <section id="setup" className="reveal mx-auto mt-10 w-full max-w-5xl px-4">
      <div className="overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-soft/60"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Setup · 60 seconds
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform duration-300",
              open && "rotate-180",
            )}
          />
        </button>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 gap-2 border-t border-border/60 p-3 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="flex items-start gap-3 rounded-lg border border-border/70 bg-surface px-3 py-2.5"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[10px] font-bold text-background">
                    {s.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold leading-tight">
                      {s.title}
                    </div>
                    <div className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {s.desc}
                    </div>
                    {s.href && (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] text-foreground/80 underline-offset-2 hover:underline"
                      >
                        {s.cta}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {s.action && (
                      <button
                        onClick={onOpenKey}
                        className="mt-1.5 inline-flex items-center gap-1 font-mono text-[10px] text-foreground/80 underline-offset-2 hover:underline"
                      >
                        Open dialog
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
