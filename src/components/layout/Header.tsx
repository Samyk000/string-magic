import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sparkles, KeyRound } from "lucide-react";

type Props = {
  onOpenKey: () => void;
  hasKey: boolean;
  apiKey: string;
  model: string;
  onModel: (id: string) => void;
};

export function Header({ onOpenKey, hasKey, apiKey, model, onModel }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 md:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" fill="currentColor" />
          </span>
          <span className="text-base font-bold tracking-tight text-foreground">
            String Magic
          </span>
        </a>

        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenKey}
            className="inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-bold transition-colors shadow-none"
            style={{
              backgroundColor: hasKey ? "var(--secondary)" : "var(--primary)",
              color: hasKey ? "var(--foreground)" : "var(--primary-foreground)",
            }}
          >
            <KeyRound className="h-4 w-4" />
            <span className="hidden sm:inline">
              {hasKey ? "Free API key" : "Set Free API key"}
            </span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
