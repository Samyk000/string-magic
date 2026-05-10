export function StructuralBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg" />
      {/* Ambient orbs */}
      <div
        className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full blur-[120px] opacity-30 animate-float"
        style={{ background: "var(--accent-blue)" }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full blur-[140px] opacity-20 animate-float"
        style={{ background: "var(--accent-violet)", animationDelay: "1.4s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full blur-[120px] opacity-15 animate-float"
        style={{ background: "var(--accent-green)", animationDelay: "2.8s" }}
      />
      {/* Sparse geometry */}
      <div className="absolute top-24 right-[18%] h-24 w-24 rounded-full border border-border animate-slow-spin" />
      <div className="absolute top-[42%] left-[8%] h-16 w-16 rounded-2xl border border-border" />
      <div className="absolute bottom-32 right-[10%] h-32 w-32 rounded-3xl border border-border" />
      <div
        className="absolute top-[60%] left-1/2 h-px w-48 animate-pulse-line"
        style={{ background: "color-mix(in oklab, var(--foreground) 25%, transparent)" }}
      />
    </div>
  );
}
