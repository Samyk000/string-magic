import { ExternalLink, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { onOpenKey: () => void };

const STEPS = [
  {
    n: "01",
    title: "Create a free OpenRouter account",
    body: "OpenRouter is the model gateway we use. Sign up takes 30 seconds — no credit card needed for free models.",
    href: "https://openrouter.ai",
    cta: "Open openrouter.ai",
  },
  {
    n: "02",
    title: "Generate an API key",
    body: "Visit your Keys page and create a new key. Copy the value starting with sk-or-v1-...",
    href: "https://openrouter.ai/keys",
    cta: "Open Keys page",
  },
  {
    n: "03",
    title: "Paste it into String Magic",
    body: "Click 'Set API key' in the header and paste it in. It is saved only in your browser's localStorage.",
  },
];

export function SetupGuide({ onOpenKey }: Props) {
  return (
    <section id="setup" className="reveal mx-auto max-w-7xl px-4 pt-32 md:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Setup
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            New to OpenRouter? It takes a minute.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            String Magic uses your own OpenRouter account so you stay in
            control of cost, rate limits and model choice. We only ever surface
            free-tier models in the picker.
          </p>
          <Button
            onClick={onOpenKey}
            className="mt-6 rounded-2xl"
            size="lg"
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Add your API key
          </Button>
        </div>

        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="card-elevate flex items-start gap-4 rounded-2xl border border-border bg-surface p-5"
            >
              <div className="font-mono text-2xl font-semibold text-muted-foreground/70">
                {s.n}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{s.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                {s.href && (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    {s.cta}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
