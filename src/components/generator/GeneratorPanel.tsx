import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, KeyRound } from "lucide-react";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { ModelSelect } from "./ModelSelect";
import { PlatformTabs } from "./PlatformTabs";
import { LoadingState } from "./LoadingState";
import { ResultCard } from "./ResultCard";
import { storage } from "@/lib/storage";
import { generateBoolean, type GenerateResult } from "@/lib/openrouter";
import type { Platform } from "@/lib/prompt";
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
};

export function GeneratorPanel({
  apiKey,
  setApiKey,
  keyDialogOpen,
  setKeyDialogOpen,
}: Props) {
  const [model, setModel] = useState<string>("");
  const [platform, setPlatform] = useState<Platform>("global");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const max = 8000;

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
      const r = await generateBoolean({ apiKey, model, jd, platform });
      setResult(r);
      toast.success("Boolean strings ready");
      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
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

      {/* Main dashboard card */}
      <div className="card-elevate relative overflow-hidden rounded-3xl border border-border bg-surface/80 p-5 shadow-sm backdrop-blur-xl md:p-7">
        {/* Top row: platform tabs + key/model */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <PlatformTabs value={platform} onChange={setPlatform} disabled={loading} />
          <div className="flex items-center gap-2">
            {!apiKey && (
              <button
                onClick={() => setKeyDialogOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-soft px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <KeyRound className="h-3.5 w-3.5" /> Add API key
              </button>
            )}
            <div className="min-w-[220px]">
              <ModelSelect apiKey={apiKey} value={model} onChange={onModel} />
            </div>
          </div>
        </div>

        {/* JD textarea */}
        <div className="mt-5">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value.slice(0, max))}
            disabled={loading}
            placeholder="Paste a job description here…"
            rows={11}
            className="w-full resize-y rounded-2xl border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:outline-none focus:ring-4 focus:ring-foreground/5 disabled:opacity-60"
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setJd(SAMPLE)}
              disabled={loading}
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
            >
              Try a sample JD
            </button>
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              {jd.length} / {max}
            </span>
          </div>
        </div>

        {/* Generate */}
        <Button
          onClick={generate}
          disabled={loading}
          size="lg"
          className="mt-4 h-12 w-full rounded-2xl text-base font-semibold transition-transform active:scale-[0.99]"
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

      {/* Loading + Results */}
      {loading && (
        <div className="mt-6 animate-fade-in">
          <LoadingState />
        </div>
      )}

      {result && !loading && (
        <div id="results" className="mt-8 space-y-5 animate-fade-in">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent-green)" }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Results · {platform}
            </span>
          </div>

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

          {result.rationale && (
            <div className="rounded-2xl border border-border bg-surface-soft p-4 text-sm leading-relaxed text-muted-foreground">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/70">
                Rationale ·{" "}
              </span>
              {result.rationale}
            </div>
          )}

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
