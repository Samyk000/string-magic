import { Globe, Linkedin, Briefcase, Github, Search } from "lucide-react";
import type { Platform } from "@/lib/prompt";
import { cn } from "@/lib/utils";

const ITEMS: { id: Platform; label: string; icon: typeof Globe }[] = [
  { id: "global", label: "Global", icon: Globe },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "indeed", label: "Indeed", icon: Briefcase },
  { id: "github", label: "GitHub", icon: Github },
  { id: "google", label: "Google X-Ray", icon: Search },
];

export function PlatformTabs({
  value,
  onChange,
  disabled,
}: {
  value: Platform;
  onChange: (p: Platform) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label="Target platform"
      className="inline-flex flex-wrap items-center gap-1 rounded-2xl border border-border bg-surface-soft p-1"
    >
      {ITEMS.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onChange(it.id)}
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200",
              active
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:bg-surface hover:text-foreground",
              disabled && "opacity-60",
            )}
          >
            <it.icon className="h-3.5 w-3.5" />
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
