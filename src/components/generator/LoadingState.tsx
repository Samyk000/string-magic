import { useEffect, useState } from "react";

const STEPS = [
  "Parsing job description",
  "Extracting titles & skills",
  "Drafting Broad variant",
  "Drafting Balanced variant",
  "Drafting Strict variant",
  "Validating Boolean syntax",
];

export function LoadingState() {
  const [progress, setProgress] = useState(6);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p < 95 ? p + Math.max(0.4, (97 - p) / 26) : p));
    }, 100);
    const stepId = setInterval(() => {
      setStepIdx((i) => (i + 1) % STEPS.length);
    }, 1100);
    return () => {
      clearInterval(id);
      clearInterval(stepId);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-soft px-4 py-3">

      <div className="relative flex items-center gap-3">
        <span className="relative inline-flex h-2 w-2 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full opacity-70 bg-primary" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>

        <div className="flex-1 overflow-hidden">
          <div className="relative h-4">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className="absolute inset-0 truncate text-xs font-medium text-foreground/90 transition-all duration-500"
                style={{
                  opacity: i === stepIdx ? 1 : 0,
                  transform: `translateY(${i === stepIdx ? 0 : i < stepIdx ? -8 : 8}px)`,
                }}
              >
                {s}
                <span className="ml-1 inline-flex">
                  <span className="loading-dot" style={{ animationDelay: "0ms" }}>.</span>
                  <span className="loading-dot" style={{ animationDelay: "180ms" }}>.</span>
                  <span className="loading-dot" style={{ animationDelay: "360ms" }}>.</span>
                </span>
              </span>
            ))}
          </div>
        </div>

        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {Math.floor(progress)}%
        </span>
      </div>

      <div className="relative mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-border/50">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
