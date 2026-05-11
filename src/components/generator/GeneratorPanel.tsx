import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, X, ArrowLeft, Trash2 } from "lucide-react";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { LoadingState } from "./LoadingState";
import { ResultRow } from "./ResultCard";
import { SetupModal } from "@/components/sections/SetupGuide";
import { storage, type HistoryItem } from "@/lib/storage";
import { generateBoolean, type GenerateResult } from "@/lib/openrouter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SAMPLES = [
  `Senior Backend Engineer (Remote, US)\n\nWe're hiring a Senior Backend Engineer to design and scale our payments platform. You'll own services in Go and Python, work with PostgreSQL and Kafka, and ship to AWS via Kubernetes.\n\nRequirements:\n- 5+ years building distributed systems in production\n- Strong with Go or Python; experience with gRPC and REST APIs\n- Deep PostgreSQL knowledge; comfortable with event streaming (Kafka)\n- AWS, Docker, Kubernetes\n- Bonus: fintech / payments experience (Stripe, Adyen)\n\nNot a fit: junior engineers, frontend-only backgrounds, agency-only experience.`,
  `Frontend React Developer\n\nLooking for a React expert to build our next-generation dashboard. Must have deep knowledge of React 18, TypeScript, Tailwind CSS, and state management (Zustand or Redux).\n\nRequirements:\n- 4+ years of frontend experience\n- Expert in React and TypeScript\n- Experience with performance optimization and Web Vitals\n- Familiarity with Vite and TanStack query\n\nDo not apply if you only have Angular or Vue experience.`,
  `Product Manager (B2B SaaS)\n\nSeeking a data-driven PM to lead our core billing product. You will work closely with engineering and design to ship features that reduce churn and increase revenue.\n\nRequirements:\n- 3+ years PM experience in B2B SaaS\n- Strong analytical skills (SQL, Amplitude, Mixpanel)\n- Experience with agile methodologies and Jira\n- Excellent communication skills`,
  `Machine Learning Engineer\n\nJoin our AI team to build and deploy LLM applications. You will fine-tune models, optimize inference, and build robust MLOps pipelines.\n\nRequirements:\n- MS/PhD in Computer Science or related field\n- Experience with PyTorch, Transformers, and LLMs (Llama, Mistral)\n- Strong Python skills and C++ is a plus\n- Knowledge of vector databases (Pinecone, Weaviate)\n\nNo pure data scientists without engineering background.`,
  `Account Executive (Mid-Market)\n\nWe are looking for a hungry Account Executive to close mid-market deals. You will manage the full sales cycle from discovery to close.\n\nRequirements:\n- 3-5 years of B2B SaaS closing experience\n- Track record of hitting or exceeding quota\n- Experience with Salesforce and MEDDPICC framework\n- Excellent presentation and negotiation skills`
];

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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sampleIdx, setSampleIdx] = useState(0);
  const max = 8000;
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setHistory(storage.getHistory());
  }, []);

  // Abort any in-flight request on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

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
    // Abort any previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setResult(null);
    try {
      const r = await generateBoolean({ apiKey, model, jd, signal: controller.signal });
      setResult(r);
      const hItem: HistoryItem = {
        id: crypto.randomUUID(),
        jd,
        result: r,
        createdAt: Date.now(),
      };
      storage.saveHistory(hItem);
      setHistory(storage.getHistory());
      toast.success("Boolean strings ready");
    } catch (e) {
      // Silently swallow abort errors — user intentionally cancelled
      if (e instanceof DOMException && e.name === "AbortError") return;
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const reset = () => {
    abortRef.current?.abort();
    setResult(null);
    setJd("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showResults = !!result && !loading;

  return (
    <div id="generator" className={cn("relative", !showResults && "grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16 items-start")}>
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

      {!showResults && (
        <div className="flex flex-col lg:pt-8 text-left animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
            Boolean strings,<br />
            <span className="text-muted-foreground">in one click.</span>
          </h1>
          <p className="text-[15px] text-muted-foreground mb-8 max-w-sm leading-relaxed">
            Stop wrestling with complex search syntax. Paste any job description, and instantly get production-ready boolean strings built for high recall, precision, and perfect balance. The daily struggle of every recruiter, solved.
          </p>
          <div className="flex items-center">
            <SetupModal onOpenKey={() => setKeyDialogOpen(true)} />
          </div>
        </div>
      )}

      <div className="w-full flex flex-col min-w-0">
        {showResults && (
        <div className="mb-4 flex justify-start animate-fade-in">
          <Button
            onClick={reset}
            variant="ghost"
            className="group h-10 px-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Button>
        </div>
      )}

      {/* Main dashboard card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 shadow-sm backdrop-blur-xl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-surface-soft/40 px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {showResults ? "Results · 3 strings" : loading ? "Working" : "Job description"}
          </span>
          <div className="flex items-center gap-2 font-mono text-[10px] tabular-nums text-muted-foreground">
            {!showResults && !loading && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setJd(SAMPLES[sampleIdx]);
                    setSampleIdx((p) => (p + 1) % SAMPLES.length);
                  }}
                  className="text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
                >
                  Try sample
                </button>
                <span className="opacity-40">·</span>
                <span>
                  {jd.length}/{max}
                </span>
              </>
            )}
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
              {result!.rationale && (
                <div className="border-b border-border/60 bg-surface-soft/40 p-4 text-[13px] leading-relaxed text-muted-foreground">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/70 block mb-1">
                    Rationale
                  </span>
                  {result!.rationale}
                </div>
              )}
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
              className="result-scroll w-full resize-none border-0 bg-transparent p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-0"
            />
          )}
        </div>

        {/* Footer row */}
        {!showResults && (
          <div className="flex items-center justify-end gap-3 border-t border-border/70 bg-surface-soft/60 px-3 py-2.5">
            {loading ? (
              <Button
                onClick={cancel}
                variant="outline"
                className="h-9 rounded-lg px-4 text-sm font-semibold"
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancel
              </Button>
            ) : (
              <Button
                onClick={generate}
                className="h-9 rounded-lg px-4 text-sm font-semibold transition-transform active:scale-[0.98]"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Generate
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Extras below results */}
      {showResults && result?.extracted && (
        <div className="mt-4 animate-fade-in space-y-3">
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

      {/* History Section */}
      {!showResults && history.length > 0 && (
        <div className="col-span-1 lg:col-span-2 mt-4 lg:mt-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Recent Searches</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                storage.clearHistory();
                setHistory([]);
                toast.success("History cleared");
              }}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Clear History
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-border/70 bg-surface/40 shadow-sm backdrop-blur">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border/50 bg-surface-soft/40 text-muted-foreground">
                    <th className="font-medium p-3.5 pl-4 w-36">Date</th>
                    <th className="font-medium p-3.5">Job snippet</th>
                    <th className="font-medium p-3.5 pr-4 text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr
                      key={h.id}
                      className="border-b border-border/50 last:border-0 hover:bg-surface-soft/60 transition-colors cursor-pointer group"
                      onClick={() => {
                        setJd(h.jd);
                        setResult(h.result);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <td className="p-3.5 pl-4 text-muted-foreground text-[13px]">
                        {new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3.5 text-foreground/80 text-[13px] max-w-[200px] sm:max-w-md lg:max-w-2xl truncate">
                        {h.jd.substring(0, 150)}{h.jd.length > 150 ? '...' : ''}
                      </td>
                      <td className="p-3.5 pr-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            storage.deleteHistory(h.id);
                            setHistory(storage.getHistory());
                            toast.success("History item deleted");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
