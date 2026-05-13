import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, X, ArrowLeft, Trash2, ChevronDown } from "lucide-react";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { LoadingState } from "./LoadingState";
import { ResultRow } from "./ResultCard";
import { SetupModal } from "@/components/sections/SetupGuide";
import { storage, type HistoryItem } from "@/lib/storage";
import { generateBoolean, type GenerateResult } from "@/lib/openrouter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  onModel: (id: string) => void;
};

/** Extract a short title from history item — first extracted title or first line of JD */
function historyTitle(h: HistoryItem): string {
  const titles = h.result?.extracted?.titles;
  if (titles?.length) return titles.slice(0, 2).join(", ");
  const firstLine = h.jd.split('\n').find(l => l.trim());
  return firstLine?.substring(0, 60) ?? "Untitled";
}

export function GeneratorPanel({
  apiKey,
  setApiKey,
  keyDialogOpen,
  setKeyDialogOpen,
  model,
  onModel,
}: Props) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [streamLength, setStreamLength] = useState(0);

  const max = 5000;
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

  const generate = async (overrideJd?: string) => {
    const targetJd = overrideJd ?? jd;
    if (!apiKey) {
      toast.error("Add your OpenRouter API key first.");
      setKeyDialogOpen(true);
      return;
    }
    if (!model) {
      toast.error("Select a model in the settings.");
      return;
    }
    if (targetJd.trim().length < 40) {
      toast.error("Add a longer job description (40+ characters).");
      return;
    }
    // Abort any previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setResult(null);
    setStreamLength(0);
    try {
      const r = await generateBoolean({ 
        apiKey, model, jd: targetJd, signal: controller.signal,
        onProgress: (text) => setStreamLength(text.length)
      });
      setResult(r);
      if (!overrideJd) {
        const hItem: HistoryItem = {
          id: crypto.randomUUID(),
          jd: targetJd,
          result: r,
          createdAt: Date.now(),
        };
        storage.saveHistory(hItem);
        setHistory(storage.getHistory());
      }

      // Increment local rate limit tracker
      const used = parseInt(localStorage.getItem("local_rate_used") || "0", 10);
      localStorage.setItem("local_rate_used", (used + 1).toString());
      window.dispatchEvent(new Event("ratelimit_update"));

      toast.success("Boolean strings ready");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = () => {
    generate(jd);
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
    <div id="generator" className={cn("relative", !showResults && "grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center")}>
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
        model={model}
        onModel={onModel}
      />

      {!showResults && (
        <div className="flex flex-col text-left animate-fade-in w-full pb-8 lg:pb-0">
          <h1 className="text-[48px] md:text-[64px] leading-[1.05] tracking-[-2.5px] font-bold text-foreground mb-6">
            You know the role. <br />
            <span className="text-primary">Let AI write the search.</span>
          </h1>
          <p className="text-[17px] font-normal text-body mb-10 max-w-lg leading-[1.6]">
            Whether you're a junior recruiter writing your first Boolean string, a hiring manager sourcing for a role outside your expertise, or a senior recruiter tired of hand-crafting operators — paste the JD and get three production-ready search strings in seconds.
          </p>
          <div className="flex items-center">
            <SetupModal onOpenKey={() => setKeyDialogOpen(true)} />
          </div>
        </div>
      )}

      <div className="w-full flex flex-col min-w-0">
      
      {/* Actions outside the box at the top */}
      {showResults && (
        <div className="mb-4 flex items-center justify-between w-full animate-fade-in">
          <Button
            onClick={() => setResult(null)}
            variant="ghost"
            className="group h-9 px-3 -ml-3 hover:bg-surface-soft text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1 text-primary/70" />
            Back to edit
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={regenerate}
              disabled={loading}
              variant="ghost"
              className="group h-9 px-4 rounded-full border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all text-sm font-semibold"
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Regenerate
            </Button>
            <Button
              onClick={reset}
              variant="ghost"
              className="group h-9 px-4 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-bold"
            >
              Create another
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main dashboard card */}
      <div className="relative overflow-hidden rounded-lg bg-card border border-hairline shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
        {/* Top bar (Hidden when results are showing) */}
        {!showResults && (
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border/50">
            <span className="text-xs font-semibold text-muted-foreground">
              {loading ? "Working" : "Job description"}
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              {!loading && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setJd(SAMPLES[sampleIdx]);
                      setSampleIdx((p) => (p + 1) % SAMPLES.length);
                    }}
                    className="text-foreground hover:underline transition-all"
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
        )}

        {/* Body — swaps between input / loading / results */}
        <div className="relative">
          {loading ? (
            <div className="animate-fade-in p-5">
              <LoadingState streamLength={streamLength} />
            </div>
          ) : showResults ? (
            <div className="animate-fade-in">
              {/* Variants FIRST — the primary value */}
              {result!.variants.map((v, i) => (
                <ResultRow key={v.label + i} index={i} label={v.label} value={v.string} />
              ))}

              {/* Extracted Data — organized with grid */}
              {result?.extracted && (
                <div className="border-t border-border/40 px-6 py-5 bg-surface-soft/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/30">
                    {(["titles", "skills", "exclusions"] as const).map((k) => {
                      const items = result.extracted![k] ?? [];
                      if (!items.length) return null;

                      const meta = {
                        titles: { label: "Target Titles", tone: "var(--accent-blue)" },
                        skills: { label: "Must-Have Skills", tone: "var(--accent-violet)" },
                        exclusions: { label: "Exclusions", tone: "var(--accent-red)" },
                      }[k];

                      return (
                        <div key={k} className="flex flex-col gap-2.5 md:px-5 first:pl-0 last:pr-0 py-2 md:py-0 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: meta.tone }} />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
                              {meta.label}
                            </span>
                          </div>
                          <div className="result-scroll flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1.5 pb-1">
                            {items.map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center rounded bg-surface-soft border border-hairline px-2 py-0.5 font-medium text-[11.5px] text-foreground/90 shadow-sm"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Job description — open by default, proper text visibility, larger box */}
              {jd && (
                <div className="border-t border-border/40">
                  <div className="px-6 py-3.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">Job description</span>
                  </div>
                  <div className="px-6 pb-6">
                    <pre className="result-scroll max-h-[450px] overflow-auto whitespace-pre-wrap break-words text-[13px] leading-relaxed text-foreground/90 font-mono bg-surface-soft/40 rounded-lg p-5 border border-hairline">
                      {jd}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value.slice(0, max))}
              placeholder="Drop any job description here — from a quick 3-liner to a full detailed spec. We'll extract every skill, title, and requirement to build perfect Boolean strings for your sourcing pipeline."
              rows={12}
              className="result-scroll w-full resize-none border-0 bg-transparent px-6 py-5 text-base leading-[1.6] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 transition-all"
            />
          )}
        </div>

        {/* Footer row */}
        {!showResults && (
          <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
            {loading ? (
              <Button
                onClick={cancel}
                className="h-10 rounded-md bg-secondary hover:bg-muted text-foreground px-5 text-sm font-semibold shadow-none transition-colors"
              >
                <X className="mr-1.5 h-4 w-4" />
                Cancel
              </Button>
            ) : (
              <Button
                onClick={() => generate()}
                disabled={jd.trim().length < 40}
                className="h-10 rounded-md bg-primary hover:bg-primary-pressed text-primary-foreground px-6 text-sm font-bold transition-all shadow-none hover:shadow-[0_0_20px_rgba(250,255,105,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Strings
              </Button>
            )}
          </div>
        )}
      </div>
      </div>

      {/* History Section */}
      {!showResults && history.length > 0 && (
        <div className="col-span-1 lg:col-span-2 mt-4 lg:mt-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold tracking-tight text-foreground">Recent Searches</h2>
            <Dialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-semibold text-muted-foreground hover:text-destructive rounded-md"
                >
                  Clear History
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm rounded-lg p-6 border border-hairline bg-surface shadow-[0_16px_32px_rgba(0,0,0,0.4)]">
                <DialogHeader>
                  <DialogTitle className="text-[20px] font-bold tracking-[-0.3px]">Clear History?</DialogTitle>
                  <DialogDescription className="text-[14px] text-body mt-2 font-[400]">
                    This will permanently delete all your recent searches. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setConfirmClearOpen(false)}
                    className="rounded-md font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      storage.clearHistory();
                      setHistory([]);
                      toast.success("History cleared");
                      setConfirmClearOpen(false);
                    }}
                    className="rounded-md bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold shadow-none"
                  >
                    Yes, clear it
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-hidden rounded-lg bg-card border border-hairline shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="font-bold p-4 pl-6 w-40">Date</th>
                    <th className="font-bold p-4 w-48">Title</th>
                    <th className="font-bold p-4">Description</th>
                    <th className="font-bold p-4 pr-6 text-right w-20"></th>
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
                      <td className="p-4 pl-6 text-muted-foreground text-sm">
                        {new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 text-foreground text-sm font-semibold truncate max-w-[200px]">
                        {historyTitle(h)}
                      </td>
                      <td className="p-4 text-foreground/60 text-sm max-w-[200px] sm:max-w-md lg:max-w-xl truncate">
                        {h.jd.substring(0, 80)}{h.jd.length > 80 ? '…' : ''}
                      </td>
                      <td className="p-4 pr-6 text-right">
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
