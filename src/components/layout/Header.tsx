import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Sparkles, KeyRound } from "lucide-react";
import { ModelSelect } from "@/components/generator/ModelSelect";

type Props = {
  onOpenKey: () => void;
  hasKey: boolean;
  apiKey: string;
  model: string;
  onModel: (id: string) => void;
};

export function Header({ onOpenKey, hasKey, apiKey, model, onModel }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between gap-2 px-4">
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-surface">
            <Sparkles className="h-3 w-3" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            String Magic
          </span>
        </a>

        <div className="flex min-w-0 items-center gap-1.5">
          <ModelSelect
            compact
            apiKey={apiKey}
            value={model}
            onChange={onModel}
          />
          <button
            type="button"
            onClick={onOpenKey}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {hasKey ? "API key" : "Set API key"}
            </span>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background: hasKey
                  ? "var(--accent-green)"
                  : "var(--accent-amber)",
              }}
            />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
