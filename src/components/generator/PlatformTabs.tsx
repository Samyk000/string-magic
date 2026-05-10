import { Globe, Linkedin, Briefcase, Github, Search, Check } from "lucide-react";
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
  value: Platform[];
  onChange: (p: Platform[]) => void;
  disabled?: boolean;
}) {
  const toggle = (id: Platform) => {
    if (value.includes(id)) {
      if (value.length === 1) return; // keep at least one
      onChange(value.filter((p) => p !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ITEMS.map((it) => {
        const active = value.includes(it.id);
        return (
          <button
            key={it.id}
            type="button"
            role="checkbox"
            aria-checked={active}
            disabled={disabled}
            onClick={() => toggle(it.id)}
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
              active
                ? "border-foreground/80 bg-foreground text-background shadow-sm"
                : "border-border bg-surface text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              disabled && "opacity-50",
            )}
          >
            {active ? (
              <Check className="h-3 w-3" />
            ) : (
              <it.icon className="h-3 w-3" />
            )}
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
