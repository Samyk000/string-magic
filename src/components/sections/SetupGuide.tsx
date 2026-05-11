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
          className="inline-flex h-8 items-center justify-center rounded-full bg-secondary px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-[#c8c8c1] transition-colors"
        >
          Setup · 60 seconds
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[32px] p-8 border-0 bg-background shadow-[0_16px_32px_rgba(0,0,0,0.12)]">
        <DialogHeader>
          <DialogTitle className="text-[22px] font-bold">Setup · 60 seconds</DialogTitle>
          <DialogDescription className="text-base text-foreground mt-2">
            Bring your own key to use free AI models securely.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 border-t border-border/60 pt-4 mt-2">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex items-start gap-4 rounded-2xl bg-card px-4 py-4"
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
