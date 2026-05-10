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

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialKey: string;
  onSave: (key: string) => void;
  onClear: () => void;
};

export function ApiKeyDialog({
  open,
  onOpenChange,
  initialKey,
  onSave,
  onClear,
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>OpenRouter API key</DialogTitle>
          <DialogDescription>
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

          <div className="rounded-xl border border-border bg-surface-soft p-3 text-sm text-muted-foreground">
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

        <DialogFooter className="gap-2 sm:justify-between">
          {initialKey ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onClear();
                setVal("");
                toast.success("API key cleared.");
              }}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Clear
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save key</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
