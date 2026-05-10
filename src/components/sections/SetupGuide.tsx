import { ExternalLink, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { onOpenKey: () => void };

const STEPS = [
  {
    n: "01",
    title: "Create a free OpenRouter account",
    href: "https://openrouter.ai",
    cta: "openrouter.ai",
  },
  {
    n: "02",
    title: "Generate an API key (sk-or-v1-…)",
    href: "https://openrouter.ai/keys",
    cta: "Keys page",
  },
  {
    n: "03",
    title: "Paste it in — saved only in your browser.",
  },
];

export function SetupGuide({ onOpenKey }: Props) {
  return (
    <section
      id="setup"
      className="reveal mx-auto mt-20 max-w-3xl px-4"
    >
      <div className="rounded-3xl border border-border bg-surface/60 p-6 backdrop-blur md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Setup
            </div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
              New to OpenRouter? One minute.
            </h2>
          </div>
          <Button onClick={onOpenKey} className="rounded-xl">
            <KeyRound className="mr-2 h-4 w-4" />
            Add your API key
          </Button>
        </div>

        <ol className="mt-6 space-y-2">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {s.n}
              </span>
              <span className="flex-1">{s.title}</span>
              {s.href && (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-2 hover:underline"
                >
                  {s.cta}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
