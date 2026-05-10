import { useEffect, useState } from "react";

const STEPS = [
  "Parsing job description",
  "Extracting titles & skills",
  "Drafting Boolean variants",
  "Validating syntax",
];

export function LoadingState() {
  const [progress, setProgress] = useState(8);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p < 94 ? p + Math.max(0.5, (96 - p) / 22) : p));
    }, 110);
    const stepId = setInterval(() => {
      setStepIdx((i) => (i + 1) % STEPS.length);
    }, 1300);
    return () => {
      clearInterval(id);
      clearInterval(stepId);
    };
  }, []);

  return (
    <div className="rounded-xl border border-border bg-surface/70 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="relative inline-flex h-2 w-2 shrink-0">
          <span
            className="absolute inset-0 animate-ping rounded-full opacity-70"
            style={{ background: "var(--accent-blue)" }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: "var(--accent-blue)" }}
          />
        </span>
        <span className="flex-1 truncate text-xs font-medium text-foreground/90">
          {STEPS[stepIdx]}
          <span className="ml-1 inline-flex">
            <span className="loading-dot" style={{ animationDelay: "0ms" }}>.</span>
            <span className="loading-dot" style={{ animationDelay: "180ms" }}>.</span>
            <span className="loading-dot" style={{ animationDelay: "360ms" }}>.</span>
          </span>
        </span>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {Math.floor(progress)}%
        </span>
      </div>
      <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-border/50">
        <div
          className="h-full rounded-full transition-[width] duration-200 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, var(--accent-blue), var(--accent-violet), var(--accent-green))",
            backgroundSize: "200% 100%",
            animation: "shimmerBar 2.4s linear infinite",
          }}
        />
      </div>
    </div>
  );
}
