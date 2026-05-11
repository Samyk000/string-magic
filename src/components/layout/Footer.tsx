import { Sparkles, Info, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary" fill="currentColor" />
          <span>String Magic © {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6">
          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                How this works
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[32px] p-8 border-0 bg-background shadow-[0_16px_32px_rgba(0,0,0,0.12)]">
              <DialogHeader>
                <DialogTitle className="text-[22px] font-bold flex items-center gap-2">
                  <Info className="h-6 w-6 text-primary" /> How it works
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4 text-sm text-foreground/80 leading-relaxed">
                <p>String Magic securely pairs OpenRouter's API infrastructure with modern prompts to output accurate Boolean search strings.</p>
                <ol className="space-y-3 list-decimal pl-4 font-medium text-foreground">
                  <li>Provide a key that grants local browser access to OpenRouter.</li>
                  <li>Input any length job description text.</li>
                  <li>The LLM analyzes core skills, exact titles, and exclusion constraints.</li>
                  <li>It generates Broad, Balanced, and Strict variants instantly.</li>
                </ol>
                <div className="bg-surface-soft rounded-2xl p-4 text-xs text-muted-foreground font-mono mt-2 border border-border/50">
                  No servers. No logs. Fully client-side operation.
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                Best Free Models
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[32px] p-8 border-0 bg-background shadow-[0_16px_32px_rgba(0,0,0,0.12)]">
              <DialogHeader>
                <DialogTitle className="text-[22px] font-bold flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" /> Top Free Models
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2.5 mt-4">
                {[
                  { name: "Baidu Qianfan: CoBuddy", desc: "Free" },
                  { name: "Poolside: Laguna M.1", desc: "Free" },
                  { name: "Arcee AI: Trinity Large Thinking", desc: "Top-tier reasoning" },
                  { name: "NVIDIA: Nemotron 3 Super", desc: "Free" },
                  { name: "MiniMax: MiniMax M2.5", desc: "Free" },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between bg-card rounded-2xl px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-[14px] text-foreground">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{m.desc}</span>
                    </div>
                    <span className="text-primary/30 font-mono text-[24px] font-black leading-none">#{i + 1}</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <div className="hidden sm:block text-muted-foreground font-mono opacity-50 scale-90">
            v1.0
          </div>
        </div>
      </div>
    </footer>
  );
}
