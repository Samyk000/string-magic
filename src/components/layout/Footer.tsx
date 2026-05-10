import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold">String Magic</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A zero-backend recruiter utility. Your OpenRouter key never leaves
            your browser.
          </p>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <div className="mb-3">Resources</div>
          <ul className="space-y-2 normal-case tracking-normal">
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
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground md:text-right">
          <div className="mb-3">System</div>
          <div className="normal-case tracking-normal">
            <div className="text-foreground/80">No accounts. No tracking.</div>
            <div className="mt-1">Built with TanStack Start.</div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>© {new Date().getFullYear()} String Magic</span>
          <span>v1.0 — Stateless</span>
        </div>
      </div>
    </footer>
  );
}
