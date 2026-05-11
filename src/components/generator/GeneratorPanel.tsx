import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from "lucide-react";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { LoadingState } from "./LoadingState";
import { ResultRow } from "./ResultCard";
import { storage } from "@/lib/storage";
import { generateBoolean, type GenerateResult } from "@/lib/openrouter";
import { toast } from "sonner";

const SAMPLE = `Senior Backend Engineer (Remote, US)

We're hiring a Senior Backend Engineer to design and scale our payments platform. You'll own services in Go and Python, work with PostgreSQL and Kafka, and ship to AWS via Kubernetes.

Requirements:
- 5+ years building distributed systems in production
- Strong with Go or Python; experience with gRPC and REST APIs
- Deep PostgreSQL knowledge; comfortable with event streaming (Kafka)
- AWS, Docker, Kubernetes
- Bonus: fintech / payments experience (Stripe, Adyen)

Not a fit: junior engineers, frontend-only backgrounds, agency-only experience.`;

type Props = {
  apiKey: string;
  setApiKey: (k: string) => void;
  keyDialogOpen: boolean;
  setKeyDialogOpen: (v: boolean) => void;
  model: string;
};

export function GeneratorPanel({
  apiKey,
  setApiKey,
  keyDialogOpen,
  setKeyDialogOpen,
  model,
}: Props) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const max = 8000;

  const generate = async () => {
    if (!apiKey) {
      toast.error("Add your OpenRouter API key first.");
      setKeyDialogOpen(true);
      return;
    }
    if (!model) {
      toast.error("Select a free model in the header.");
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

  const reset = () => {
    setResult(null);
  };

  const showResults = !!result && !loading;

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

      {/* Main dashboard card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 shadow-sm backdrop-blur-xl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-surface-soft/40 px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {showResults ? "Results · 3 strings" : loading ? "Working" : "Job description"}
          </span>
          <div className="flex items-center gap-2 font-mono text-[10px] tabular-nums text-muted-foreground">
            {showResults ? (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
              >
                <RotateCcw className="h-3 w-3" /> Search another
              </button>
            ) : !loading ? (
              <>
                <button
                  type="button"
                  onClick={() => setJd(SAMPLE)}
                  className="text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
                >
                  Try sample
                </button>
                <span className="opacity-40">·</span>
                <span>
                  {jd.length}/{max}
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* Body — swaps between input / loading / results */}
        <div className="relative">
          {loading ? (
            <div className="animate-fade-in p-5">
              <LoadingState />
            </div>
          ) : showResults ? (
            <div className="animate-fade-in">
              {result!.variants.map((v, i) => (
                <ResultRow key={v.label + i} index={i} label={v.label} value={v.string} />
              ))}
            </div>
          ) : (
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value.slice(0, max))}
              placeholder="Paste a job description here…"
              rows={12}
              className="w-full resize-none border-0 bg-transparent p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0"
            />
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-3 border-t border-border/70 bg-surface-soft/60 px-3 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {showResults
              ? "Broad · Balanced · Strict"
              : "Outputs 3 strings · Broad · Balanced · Strict"}
          </span>
          {showResults ? (
            <Button
              onClick={reset}
              variant="outline"
              className="h-9 rounded-lg px-4 text-sm font-semibold"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Search another
            </Button>
          ) : (
            <Button
              onClick={generate}
              disabled={loading}
              className="h-9 rounded-lg px-4 text-sm font-semibold transition-transform active:scale-[0.98]"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {loading ? "Generating…" : "Generate"}
            </Button>
          )}
        </div>
      </div>

      {/* Extras below results */}
      {showResults && (
        <div className="mt-4 animate-fade-in space-y-3">
          {result!.rationale && (
            <div className="rounded-xl border border-border bg-surface-soft p-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/70">
                Rationale ·{" "}
              </span>
              {result!.rationale}
            </div>
          )}

          {result!.extracted && (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {(["titles", "skills", "exclusions"] as const).map((k) => (
                <div
                  key={k}
                  className="rounded-xl border border-border bg-surface-soft p-3"
                >
                  <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {k}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(result!.extracted![k] ?? []).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10.5px]"
                      >
                        {t}
                      </span>
                    ))}
                    {!(result!.extracted![k] ?? []).length && (
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
