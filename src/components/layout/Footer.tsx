import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold">String Magic</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            A zero-backend recruiter utility. Your OpenRouter key never leaves
            your browser.
          </p>
        </div>
        <div className="text-xs">
          <div className="mb-3 font-mono uppercase tracking-widest text-muted-foreground">
            Resources
          </div>
          <ul className="space-y-1.5">
            <li>
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 hover:text-foreground"
              >
                OpenRouter →
              </a>
            </li>
            <li>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 hover:text-foreground"
              >
                Get an API key →
              </a>
            </li>
            <li>
              <a
                href="https://openrouter.ai/models?max_price=0"
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 hover:text-foreground"
              >
                Free models catalog →
              </a>
            </li>
          </ul>
        </div>
        <div className="text-xs">
          <div className="mb-3 font-mono uppercase tracking-widest text-muted-foreground">
            System
          </div>
          <div className="space-y-1 text-foreground/80">
            <div>No accounts. No tracking.</div>
            <div>Built with TanStack Start.</div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>© {new Date().getFullYear()} String Magic</span>
          <span>v1.0 — Stateless</span>
        </div>
      </div>
    </footer>
  );
}
