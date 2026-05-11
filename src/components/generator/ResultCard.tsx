import { useState } from "react";
import { Check, Copy, Telescope, Crosshair, Scale } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  index: number;
};

const META: Record<string, { icon: typeof Telescope; tone: string; sub: string }> = {
  Broad: { icon: Telescope, tone: "var(--accent-blue)", sub: "High recall" },
  Balanced: { icon: Scale, tone: "var(--accent-violet)", sub: "Production default" },
  Strict: { icon: Crosshair, tone: "var(--accent-green)", sub: "High precision" },
};

export function ResultRow({ label, value, index }: Props) {
  const [copied, setCopied] = useState(false);
  const m = META[label] ?? META.Balanced;
  const Icon = m.icon;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`Copied ${label}`);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not access clipboard");
    }
  };

  return (
    <div className="group grid grid-cols-[180px_1fr_auto] items-stretch border-b border-border last:border-0 transition-colors hover:bg-surface-soft/60">
      {/* Label cell */}
      <div className="flex flex-col justify-center gap-1 border-r border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded-md"
            style={{
              background: `color-mix(in oklab, ${m.tone} 14%, transparent)`,
              color: m.tone,
            }}
          >
            <Icon className="h-3 w-3" />
          </span>
          <span className="text-sm font-semibold">{label}</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            #{index + 1}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {m.sub}
        </span>
      </div>

      {/* String cell */}
      <div className="min-w-0 px-4 py-3">
        <pre className="result-scroll max-h-[180px] overflow-auto whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-foreground/90">
          {value}
        </pre>
        <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] tabular-nums text-muted-foreground">
          <span>{value.length} chars</span>
          <span className="opacity-40">·</span>
          <span>{value.split(/\s+AND\s+|\s+OR\s+|\s+NOT\s+/).length} tokens</span>
        </div>
      </div>

      {/* Action cell */}
      <div className="flex items-start px-3 py-3">
        <button
          type="button"
          onClick={onCopy}
          aria-live="polite"
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors",
            copied
              ? "border-[var(--accent-green)] text-[var(--accent-green)]"
              : "border-border bg-surface text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
