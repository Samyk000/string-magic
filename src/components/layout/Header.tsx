import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { onOpenKey: () => void; hasKey: boolean };

export function Header({ onOpenKey, hasKey }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            String Magic
          </span>
        </a>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenKey}
            className="h-8 rounded-lg text-xs"
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
