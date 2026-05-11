import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2, RefreshCw, Cpu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { fetchFreeModels, type ORModel } from "@/lib/openrouter";
import { toast } from "sonner";

type Props = {
  apiKey: string;
  value: string;
  onChange: (id: string) => void;
  /** compact = header pill style */
  compact?: boolean;
};

export function ModelSelect({ apiKey, value, onChange, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<ORModel[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchFreeModels(apiKey || undefined);
      setModels(list);
      if (!value && list.length) {
        const preferred =
          list.find((m) => m.id === "baidu/cobuddy:free") ??
          list.find((m) => /llama-3\.1.*free/i.test(m.id)) ??
          list.find((m) => /deepseek.*free/i.test(m.id)) ??
          list[0];
        onChange(preferred.id);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const selected = useMemo(
    () => models.find((m) => m.id === value),
    [models, value]
  );

  const triggerLabel = loading
    ? "Loading…"
    : selected
      ? selected.name
      : value || "Select model";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface text-xs font-medium transition-colors hover:border-foreground/25 hover:text-foreground",
            compact
              ? "h-8 max-w-[200px] px-2.5 text-muted-foreground"
              : "h-10 w-full justify-between px-3"
          )}
        >
          <Cpu className="h-3.5 w-3.5 shrink-0 opacity-70" />
          <span className="truncate font-mono">{triggerLabel}</span>
          <ChevronsUpDown className="ml-0.5 h-3 w-3 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 pointer-events-auto" align="start">
        <Command>
          <div className="flex items-center justify-between gap-2 border-b border-border/60 px-2">
            <CommandInput
              placeholder={`Search ${models.length} free models…`}
              className="border-0"
            />
            <button
              type="button"
              onClick={load}
              disabled={loading}
              aria-label="Refresh models"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-soft hover:text-foreground"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto overscroll-contain pointer-events-auto">
            <CommandEmpty>No free models found.</CommandEmpty>
            <CommandGroup>
              {models.map((m) => (
                <CommandItem
                  key={m.id}
                  value={`${m.name} ${m.id}`}
                  onSelect={() => {
                    onChange(m.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === m.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{m.name}</div>
                    <div className="truncate font-mono text-[10px] text-muted-foreground">
                      {m.id}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
