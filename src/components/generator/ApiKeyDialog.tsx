import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModelSelect } from "./ModelSelect";

type Props = {
  open: boolean;
  initialKey: string;
  onSave: (key: string) => void;
  onClear: () => void;
  model: string;
  onModel: (id: string) => void;
};

export function ApiKeyDialog({
  open,
  onOpenChange,
  initialKey,
  onSave,
  onClear,
  model,
  onModel,
}: Props) {
  const [val, setVal] = useState(initialKey);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) setVal(initialKey);
  }, [open, initialKey]);

  const save = () => {
    const trimmed = val.trim();
    if (!trimmed) {
      toast.error("Please paste your OpenRouter API key.");
      return;
    }
    if (!trimmed.startsWith("sk-or-")) {
      toast.error("That doesn't look like an OpenRouter key (should start with sk-or-).");
      return;
    }
    onSave(trimmed);
    toast.success("API key saved locally.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[32px] p-8 border-0 shadow-[0_16px_32px_rgba(0,0,0,0.12)] bg-background">
        <DialogHeader>
          <DialogTitle className="text-[22px] font-bold">API Configuration</DialogTitle>
          <DialogDescription className="text-base text-foreground mt-2">
            Stored only in your browser's localStorage. Never sent to our
            servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Label htmlFor="ork" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            sk-or-...
          </Label>
          <div className="relative">
            <Input
              id="ork"
              type={show ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="sk-or-v1-..."
              className="pr-10 font-mono"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide key" : "Show key"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="pt-2">
            <Label className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground block mb-1">
              Select Model
            </Label>
            <ModelSelect apiKey={val || initialKey} value={model} onChange={onModel} />
          </div>

          <div className="rounded-2xl border border-border bg-surface-soft p-4 mt-2 text-[13px] text-muted-foreground leading-relaxed">
            Don't have an account?{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-2 hover:underline"
            >
              Create a key on OpenRouter
              <ExternalLink className="h-3 w-3" />
            </a>
            . Sign up is free; using free-tier models costs nothing.
          </div>
        </div>

        <DialogFooter className="mt-4 flex sm:justify-between items-center">
          {initialKey ? (
            <Button
              variant="ghost"
              onClick={() => {
                onClear();
                setVal("");
                toast.success("Key removed.");
                onOpenChange(false);
              }}
              className="text-muted-foreground hover:text-destructive h-10 px-4 rounded-2xl font-bold"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Remove Key
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={save} className="h-10 px-6 rounded-2xl bg-primary hover:bg-[#cc001f] text-primary-foreground font-bold shadow-none">
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
