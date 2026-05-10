import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, KeyRound } from "lucide-react";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { ModelSelect } from "./ModelSelect";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { ResultCard } from "./ResultCard";
import { storage } from "@/lib/storage";
import { generateBoolean, type GenerateResult } from "@/lib/openrouter";
import { toast } from "sonner";

type Props = {
  apiKey: string;
  setApiKey: (k: string) => void;
  keyDialogOpen: boolean;
  setKeyDialogOpen: (v: boolean) => void;
};

export function GeneratorPanel({
  apiKey,
  setApiKey,
  keyDialogOpen,
  setKeyDialogOpen,
}: Props) {
  const [model, setModel] = useState<string>("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);

  useEffect(() => {
    setModel(storage.getModelId());
  }, []);

  const onModel = (id: string) => {
    setModel(id);
    storage.setModelId(id);
  };

  const generate = async () => {
    if (!apiKey) {
      toast.error("Add your OpenRouter API key first.");
      setKeyDialogOpen(true);
      return;
    }
    if (!model) {
      toast.error("Select a free model.");
      return;
    }
    if (jd.trim().length < 40) {
      toast.error("Add a longer job description (40+ characters).");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await generateBoolean({ apiKey, model, jd });
      setResult(r);
      toast.success("Boolean strings ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="generator" className="relative">
      <ApiKeyDialog
        open={keyDialogOpen}
        onOpenChange={setKeyDialogOpen}
        initialKey={apiKey}
        onSave={(k) => {
          storage.setApiKey(k);
          setApiKey(k);
        }}
        onClear={() => {
          storage.clearApiKey();
          setApiKey("");
        }}
      />

      <div className="card-elevate shine relative overflow-hidden rounded-3xl border border-border bg-surface/80 p-5 backdrop-blur-xl md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface-soft">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Boolean Generator
            </span>
          </div>
          {!apiKey && (
            <button
              onClick={() => setKeyDialogOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              <KeyRound className="h-3 w-3" /> Add key
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Model · free only
            </label>
            <ModelSelect apiKey={apiKey} value={model} onChange={onModel} />
          </div>

          <JobDescriptionInput value={jd} onChange={setJd} disabled={loading} />

          <Button
            onClick={generate}
            disabled={loading}
            size="lg"
            className="h-12 w-full rounded-2xl text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Boolean strings
              </>
            )}
          </Button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {result.rationale && (
            <div className="rounded-2xl border border-border bg-surface-soft p-4 text-sm text-muted-foreground">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest">
                Rationale
              </div>
              {result.rationale}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {result.variants.map((v, i) => (
              <ResultCard
                key={v.label + i}
                label={v.label}
                value={v.string}
                accent={i === 0 ? "blue" : i === 1 ? "violet" : "green"}
              />
            ))}
          </div>
          {result.extracted && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {(["titles", "skills", "exclusions"] as const).map((k) => (
                <div
                  key={k}
                  className="rounded-2xl border border-border bg-surface-soft p-4"
                >
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {k}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(result.extracted[k] ?? []).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                    {!(result.extracted[k] ?? []).length && (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
