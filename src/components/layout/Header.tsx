import { Sparkles, KeyRound, Activity } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  onOpenKey: () => void;
  hasKey: boolean;
  apiKey: string;
  model: string;
  onModel: (id: string) => void;
};

export function Header({ onOpenKey, hasKey, apiKey, model, onModel }: Props) {
  const [rateLimit, setRateLimit] = useState<{ remaining: number; limit: number }>({ remaining: 50, limit: 50 });

  useEffect(() => {
    const updateLimit = () => {
      // 1. Check if OpenRouter provided live headers
      const hr = localStorage.getItem("or_rate_remaining");
      const hl = localStorage.getItem("or_rate_limit");
      if (hr && hl) {
        setRateLimit({ remaining: parseInt(hr, 10), limit: parseInt(hl, 10) });
        return;
      }
      
      // 2. Fallback: Local deterministic tracking (50 per day)
      const date = new Date().toLocaleDateString();
      const storedDate = localStorage.getItem("local_rate_date");
      if (storedDate !== date) {
        localStorage.setItem("local_rate_date", date);
        localStorage.setItem("local_rate_used", "0");
      }
      const used = parseInt(localStorage.getItem("local_rate_used") || "0", 10);
      setRateLimit({ remaining: Math.max(0, 50 - used), limit: 50 });
    };

    updateLimit();
    window.addEventListener("ratelimit_update", updateLimit);
    return () => window.removeEventListener("ratelimit_update", updateLimit);
  }, []);

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

        <div className="flex min-w-0 items-center gap-4">
          {rateLimit && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-hairline text-xs font-medium text-muted-foreground animate-fade-in" title="Free API limits resetting daily">
              <Activity className="h-3 w-3 text-primary/70" />
              <span>{rateLimit.remaining} <span className="opacity-50">/ {rateLimit.limit}</span> calls left</span>
            </div>
          )}

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
        </div>
      </div>
    </header>
  );
}
