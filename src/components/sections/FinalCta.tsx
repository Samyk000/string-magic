import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="reveal mx-auto max-w-7xl px-4 pt-32 md:px-8">
      <div className="card-elevate shine relative overflow-hidden rounded-3xl border border-border bg-surface p-10 md:p-16">
        <div
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--accent-violet)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-25"
          style={{ background: "var(--accent-blue)" }}
        />
        <div className="relative">
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Ready when you are
          </div>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
            Stop hand-typing Boolean strings. Generate them in five seconds.
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-2xl px-6 text-base">
              <a href="#generator">
                <ArrowDown className="mr-2 h-4 w-4" />
                Open the generator
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-2xl px-6 text-base"
            >
              <a href="#setup">First-time setup</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
