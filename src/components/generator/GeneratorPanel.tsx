import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { PlatformTabs } from "./PlatformTabs";
import { LoadingState } from "./LoadingState";
import { ResultRow } from "./ResultCard";
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
  model: string;
};

export function GeneratorPanel({
  apiKey,
  setApiKey,
  keyDialogOpen,
  setKeyDialogOpen,
  model,
}: Props) {
  const [platforms, setPlatforms] = useState<Platform[]>(["global"]);
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
    if (!platforms.length) {
      toast.error("Pick at least one platform.");
      return;
    }
    if (jd.trim().length < 40) {
      toast.error("Add a longer job description (40+ characters).");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await generateBoolean({ apiKey, model, jd, platforms });
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

      {/* Loading bar — sits ABOVE the generate area */}
      {loading && (
        <div className="mb-3 animate-fade-in">
          <LoadingState />
        </div>
      )}

      {/* Main dashboard card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 shadow-sm backdrop-blur-xl">
        {/* JD textarea */}
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value.slice(0, max))}
          disabled={loading}
          placeholder="Paste a job description here…"
          rows={10}
          className="w-full resize-none border-0 bg-transparent p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0 disabled:opacity-60"
        />

        {/* Footer row: platforms + meta + generate */}
        <div className="flex flex-col gap-3 border-t border-border/70 bg-surface-soft/60 p-3 md:flex-row md:items-center md:justify-between">
          <PlatformTabs
            value={platforms}
            onChange={setPlatforms}
            disabled={loading}
          />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-[10px] tabular-nums text-muted-foreground">
              <button
                type="button"
                onClick={() => setJd(SAMPLE)}
                disabled={loading}
                className="text-foreground/70 underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
              >
                Try sample
              </button>
              <span className="opacity-40">·</span>
              <span>
                {jd.length}/{max}
              </span>
            </div>
            <Button
              onClick={generate}
              disabled={loading}
              className="h-9 rounded-lg px-4 text-sm font-semibold transition-transform active:scale-[0.98]"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {loading ? "Generating…" : "Generate"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && !loading && (
        <div id="results" className="mt-6 animate-fade-in">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent-green)" }}
            />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Results · {result.variants.length} string
              {result.variants.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {result.variants.map((v, i) => (
              <ResultRow
                key={(v.platform ?? v.label) + i}
                label={v.label}
                value={v.string}
                platform={v.platform}
              />
            ))}
          </div>

          {result.rationale && (
            <div className="mt-3 rounded-xl border border-border bg-surface-soft p-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/70">
                Rationale ·{" "}
              </span>
              {result.rationale}
            </div>
          )}

          {result.extracted && (
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              {(["titles", "skills", "exclusions"] as const).map((k) => (
                <div
                  key={k}
                  className="rounded-xl border border-border bg-surface-soft p-3"
                >
                  <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {k}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(result.extracted[k] ?? []).map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10.5px]"
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
