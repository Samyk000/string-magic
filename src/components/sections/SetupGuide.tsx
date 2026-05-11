import { ExternalLink, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = { onOpenKey: () => void };

const STEPS = [
  {
    n: "1",
    title: "Sign up",
    desc: "Free OpenRouter account.",
    href: "https://openrouter.ai",
    cta: "openrouter.ai",
  },
  {
    n: "2",
    title: "Create key",
    desc: "Generate sk-or-v1-…",
    href: "https://openrouter.ai/keys",
    cta: "Keys page",
  },
  {
    n: "3",
    title: "Paste it",
    desc: "Stored in your browser only.",
    action: true,
  },
];

export function SetupModal({ onOpenKey }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-foreground/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground/80 transition-all duration-500 hover:border-foreground/80 hover:text-foreground hover:bg-foreground/5 animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]"
        >
          Setup · 60 seconds
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Setup · 60 seconds</DialogTitle>
          <DialogDescription>
            Bring your own key to use free AI models securely.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 border-t border-border/60 pt-4 mt-2">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-4 rounded-xl border border-border/50 bg-surface-soft/50 px-4 py-3.5 transition-colors hover:bg-surface-soft"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs font-bold text-background shadow-sm">
                {s.n}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-semibold tracking-tight text-foreground">
                  {s.title}
                </div>
                <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {s.desc}
                </div>
                {s.href && (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {s.cta}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {s.action && (
                  <button
                    onClick={onOpenKey}
                    className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Open dialog
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
