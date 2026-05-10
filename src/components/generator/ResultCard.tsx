import { useState } from "react";
import { Check, Copy, Globe, Linkedin, Briefcase, Github, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  platform?: string;
};

const ICONS: Record<string, typeof Globe> = {
  global: Globe,
  linkedin: Linkedin,
  indeed: Briefcase,
  github: Github,
  google: Search,
};

export function ResultRow({ label, value, platform }: Props) {
  const [copied, setCopied] = useState(false);
  const Icon = (platform && ICONS[platform]) || Globe;

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

  return (
    <div className="group grid grid-cols-[160px_1fr_auto] items-stretch border-b border-border last:border-0 hover:bg-surface-soft/50 transition-colors">
      <div className="flex items-center gap-2 border-r border-border/60 px-4 py-3">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className="min-w-0 px-4 py-3">
        <pre className="result-scroll max-h-[160px] overflow-auto whitespace-pre-wrap break-all font-mono text-[12.5px] leading-relaxed text-foreground/90">
          {value}
        </pre>
        <div className="mt-1.5 font-mono text-[10px] tabular-nums text-muted-foreground">
          {value.length} chars
        </div>
      </div>
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
