import { useEffect, useState } from "react";

const STEPS = [
  "Parsing job description",
  "Extracting titles & skills",
  "Drafting Boolean variants",
  "Validating syntax",
];

export function LoadingState() {
  const [progress, setProgress] = useState(6);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.max(0.6, (96 - p) / 22) : p));
    }, 120);
    const stepId = setInterval(() => {
      setStepIdx((i) => (i + 1) % STEPS.length);
    }, 1400);
    return () => {
      clearInterval(id);
      clearInterval(stepId);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-surface-soft p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span
              className="absolute inset-0 animate-ping rounded-full opacity-60"
              style={{ background: "var(--accent-blue)" }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--accent-blue)" }}
            />
          </span>
          <span className="text-sm font-medium">{STEPS[stepIdx]}…</span>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {Math.floor(progress)}%
        </span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-border/60">
        <div
          className="h-full rounded-full transition-[width] duration-200 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, var(--accent-blue), var(--accent-violet))",
          }}
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl border border-border bg-surface"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
