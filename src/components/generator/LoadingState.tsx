import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Initializing inference engine",
  "Parsing job description context",
  "Compiling Broad boolean parameters",
  "Optimizing Balanced search criteria",
  "Enforcing Strict exclusion rules",
  "Finalizing syntax validation",
];

export function LoadingState({ streamLength }: { streamLength: number }) {
  const [progress, setProgress] = useState(2);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    // The kinetic model ensures it NEVER stops moving, preventing UX anxiety.
    // Base velocity acts as a smooth creep, while streaming pulses inject extra momentum.
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 99) return p;

        // 1. Base slow creep so it's always actively alive, slowing down asymptotically as it approaches 97%
        const creep = Math.max(0.08, (97 - p) / 75);

        // 2. Inject stream momentum if active
        let velocity = 0;
        if (streamLength > 0) {
          // Estimated text footprint ~600 chars. Scale to 95% linearly
          const streamTarget = Math.min(96, (streamLength / 600) * 100);
          if (streamTarget > p) {
            // Accelerate to catch up to the stream target gently (Zeno's paradox ease)
            velocity = (streamTarget - p) * 0.12;
          }
        }

        return Math.min(99, p + creep + velocity);
      });
    }, 120);

    return () => clearInterval(id);
  }, [streamLength]);

  useEffect(() => {
    const stepId = setInterval(() => {
      setStepIdx((i) => (i + 1) % STEPS.length);
    }, 900);
    return () => clearInterval(stepId);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg bg-surface border border-hairline p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[200px] h-[100px] bg-primary/10 blur-[40px] rounded-full pointer-events-none" />
      
      <div className="relative flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-md bg-card border border-hairline shadow-sm">
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
            <div className="absolute inset-0 rounded-md border border-primary/20 animate-pulse" />
          </div>
          
          <div className="flex flex-col overflow-hidden h-[36px] justify-center">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Processing Request
            </div>
            <div className="relative h-4 w-[280px]">
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  className="absolute inset-0 truncate text-[13px] font-mono text-foreground transition-all duration-500"
                  style={{
                    opacity: i === stepIdx ? 1 : 0,
                    transform: `translateY(${i === stepIdx ? 0 : i < stepIdx ? -10 : 10}px)`,
                  }}
                >
                  {s}<span className="animate-pulse text-primary font-bold">_</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center">
          <span className="font-mono text-[18px] font-bold tracking-tight text-foreground tabular-nums">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>

      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-card border border-hairline">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-primary transition-[width] duration-200 ease-out shadow-[0_0_10px_var(--color-primary)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
