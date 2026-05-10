import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, Loader2, RefreshCw } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchFreeModels, type ORModel } from "@/lib/openrouter";
import { toast } from "sonner";

type Props = {
  apiKey: string;
  value: string;
  onChange: (id: string) => void;
};

export function ModelSelect({ apiKey, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<ORModel[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchFreeModels(apiKey || undefined);
      setModels(list);
      if (!value && list.length) {
        // Prefer a known good free default
        const preferred =
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

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-10 w-full justify-between rounded-xl font-mono text-xs"
          >
            <span className="truncate">
              {loading
                ? "Loading models…"
                : selected
                  ? selected.name
                  : value || "Select a free model"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[min(560px,90vw)] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${models.length} free models…`} />
            <CommandList>
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
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={load}
        disabled={loading}
        aria-label="Refresh models"
        className="h-10 w-10 rounded-xl"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
