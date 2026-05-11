import { Sparkles, KeyRound, Activity, Info, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      const hr = localStorage.getItem("or_rate_remaining");
      const hl = localStorage.getItem("or_rate_limit");
      if (hr && hl) {
        setRateLimit({ remaining: parseInt(hr, 10), limit: parseInt(hl, 10) });
        return;
      }
      
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
        <div className="flex items-center gap-8">
          <a href="#top" className="flex shrink-0 items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" fill="currentColor" />
            </span>
            <span className="text-base font-bold tracking-tight text-foreground">
              String Magic
            </span>
          </a>

          {/* Left nav items */}
          <nav className="hidden md:flex items-center gap-6">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary/60" />
                  Why use this?
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg rounded-xl p-0 border border-hairline bg-surface shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="bg-gradient-to-br from-surface to-surface-soft p-8 border-b border-border/50">
                  <DialogHeader>
                    <DialogTitle className="text-[24px] font-bold tracking-tight text-foreground flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Sparkles className="h-4.5 w-4.5" />
                      </span>
                      Supercharge Your Sourcing
                    </DialogTitle>
                  </DialogHeader>
                  <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
                    Stop wrestling with commas, brackets, and quote marks. String Magic turns manual string-crafting from a chore into a single-click miracle.
                  </p>
                </div>

                <div className="p-6 grid gap-4">
                  <div className="flex gap-4 rounded-lg border border-border/40 bg-background/50 p-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 rounded-md bg-primary/5 text-primary">
                        <Activity className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Zero-Effort Extraction</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Instantly separates essential hard-skills, exact job titles, and negative keywords directly from raw JD text.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-lg border border-border/40 bg-background/50 p-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 rounded-md bg-primary/5 text-primary">
                        <Trophy className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Three Tiers of Precision</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Instantly outputs Broad, Balanced, and Strict boolean versions tailored for varying candidate pool sizes.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-lg border border-border/40 bg-background/50 p-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 rounded-md bg-primary/5 text-primary">
                        <KeyRound className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Ready to Paste</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Zero syntax hallucinations. Every single quote is engineered perfectly for LinkedIn Recruiter, Google, and your ATS.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-surface-soft px-6 py-4 flex items-center justify-between text-xs border-t border-hairline">
                  <span className="text-muted-foreground font-medium">Designed for modern recruiters.</span>
                  <span className="font-bold text-primary">No training required.</span>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-primary/60" />
                  Recommended Models
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-lg p-8 border border-hairline bg-surface shadow-[0_16px_32px_rgba(0,0,0,0.4)]">
                <DialogHeader>
                  <DialogTitle className="text-[22px] font-bold flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" /> Recommended Free Models
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2.5 mt-4">
                  {[
                    { name: "Baidu Qianfan: CoBuddy", desc: "Fast & Precise" },
                    { name: "Poolside: Laguna M.1", desc: "Fast & Free" },
                    { name: "Arcee AI: Trinity Large", desc: "High Reasoning" },
                    { name: "MiniMax: MiniMax M2.5", desc: "Excellent Free Tier" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-card border border-hairline rounded-xl px-4 py-3 shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-[14px] text-foreground">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.desc}</span>
                      </div>
                      <span className="text-primary/20 font-mono text-[20px] font-black leading-none">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </nav>
        </div>

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
