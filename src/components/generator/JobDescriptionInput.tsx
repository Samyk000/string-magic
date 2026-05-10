const SAMPLE = `Senior Backend Engineer (Remote, US)

We're hiring a Senior Backend Engineer to design and scale our payments platform. You'll own services in Go and Python, work with PostgreSQL and Kafka, and ship to AWS via Kubernetes.

Requirements:
- 5+ years building distributed systems in production
- Strong with Go or Python; experience with gRPC and REST APIs
- Deep PostgreSQL knowledge; comfortable with event streaming (Kafka)
- AWS, Docker, Kubernetes
- Bonus: fintech / payments experience (Stripe, Adyen)

Not a fit: junior engineers, frontend-only backgrounds, agency-only experience.`;

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export function JobDescriptionInput({ value, onChange, disabled }: Props) {
  const max = 8000;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="jd"
          className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
        >
          Job description
        </label>
        <button
          type="button"
          onClick={() => onChange(SAMPLE)}
          className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Try sample JD
        </button>
      </div>
      <textarea
        id="jd"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        disabled={disabled}
        placeholder="Paste a job description here…"
        rows={10}
        className="w-full resize-y rounded-2xl border border-border bg-surface-soft p-4 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
      />
      <div className="flex justify-end font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {value.length} / {max}
      </div>
    </div>
  );
}
