import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { onOpenKey: () => void; hasKey: boolean };

export function Header({ onOpenKey, hasKey }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-semibold tracking-tight">String Magic</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            v1.0
          </span>
        </a>

        <nav className="hidden items-center gap-1 rounded-2xl border border-border bg-surface/60 p-1 backdrop-blur md:flex">
          {[
            { href: "#generator", label: "Generator" },
            { href: "#how", label: "How it works" },
            { href: "#features", label: "Features" },
            { href: "#setup", label: "Setup" },
          ].map((i) => (
            <a
              key={i.href}
              href={i.href}
              className="rounded-xl px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              {i.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenKey}
            className="rounded-xl"
          >
            <KeyRound className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {hasKey ? "API key" : "Set API key"}
            </span>
            <span className="sm:hidden">Key</span>
            <span
              className={`ml-2 inline-block h-1.5 w-1.5 rounded-full ${hasKey ? "bg-[var(--accent-green)]" : "bg-[var(--accent-amber)]"}`}
            />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
