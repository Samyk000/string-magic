import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  label: string;
  value: string;
  accent?: "blue" | "violet" | "green";
};

export function ResultCard({ label, value, accent = "blue" }: Props) {
  const [copied, setCopied] = useState(false);

  const accentVar =
    accent === "violet"
      ? "var(--accent-violet)"
      : accent === "green"
        ? "var(--accent-green)"
        : "var(--accent-blue)";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`Copied ${label} string`);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not access clipboard");
    }
  };

  const charCount = value.length;

  return (
    <div className="card-elevate group relative overflow-hidden rounded-2xl border border-border bg-surface">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: accentVar, opacity: 0.5 }}
      />
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: accentVar }}
          />
          <span className="font-semibold">{label}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {charCount} chars
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="h-8 rounded-lg"
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
            </>
          )}
        </Button>
      </div>
      <div className="result-scroll max-h-[320px] overflow-auto p-4">
        <pre
          className="whitespace-pre-wrap break-all font-mono text-[12.5px] leading-relaxed text-foreground/90"
        >
          {value}
        </pre>
      </div>
    </div>
  );
}
