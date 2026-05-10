import { GeneratorPanel } from "@/components/generator/GeneratorPanel";

type Props = {
  apiKey: string;
  setApiKey: (k: string) => void;
  keyDialogOpen: boolean;
  setKeyDialogOpen: (v: boolean) => void;
};

export function Hero(props: Props) {
  return (
    <section
      id="top"
      className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pt-16 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pt-24"
    >
      <div className="reveal flex flex-col justify-center">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 backdrop-blur">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent-green)" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Live · Free models · Zero backend
          </span>
        </div>
        <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Boolean search strings,
          <br />
          <span className="text-muted-foreground">engineered by AI.</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Paste a job description. Get three calibrated Boolean strings — broad,
          balanced and strict — ready for LinkedIn Recruiter and X-Ray search.
          Powered by your own free OpenRouter model.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
          {[
            { v: "<5s", k: "Generation" },
            { v: "0$", k: "Inference cost" },
            { v: "3", k: "String variants" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-2xl border border-border bg-surface/60 p-3 backdrop-blur"
            >
              <div className="text-xl font-semibold tracking-tight md:text-2xl">
                {s.v}
              </div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.k}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="reveal">
        <GeneratorPanel {...props} />
      </div>
    </section>
  );
}
