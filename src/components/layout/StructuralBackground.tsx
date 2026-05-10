export function StructuralBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div
        className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-[140px] opacity-25 animate-float"
        style={{ background: "var(--accent-blue)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full blur-[140px] opacity-15 animate-float"
        style={{ background: "var(--accent-violet)", animationDelay: "2s" }}
      />
    </div>
  );
}
