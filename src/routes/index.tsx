import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StructuralBackground } from "@/components/layout/StructuralBackground";
import { GeneratorPanel } from "@/components/generator/GeneratorPanel";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SetupGuide } from "@/components/sections/SetupGuide";
import { storage } from "@/lib/storage";
import { useReveal } from "@/lib/reveal";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [apiKey, setApiKey] = useState("");
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);

  useEffect(() => {
    setApiKey(storage.getApiKey());
  }, []);

  useReveal();

  return (
    <div className="relative min-h-screen">
      <StructuralBackground />
      <Header onOpenKey={() => setKeyDialogOpen(true)} hasKey={!!apiKey} />

      <main className="pb-24">
        {/* Centered dashboard */}
        <section
          id="top"
          className="mx-auto w-full max-w-3xl px-4 pt-12 md:pt-20"
        >
          <div className="reveal mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Boolean strings,{" "}
              <span className="text-muted-foreground">in one click.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Paste a job description. Pick a platform. Get three calibrated
              Boolean strings, ready to paste.
            </p>
          </div>

          <div className="reveal">
            <GeneratorPanel
              apiKey={apiKey}
              setApiKey={setApiKey}
              keyDialogOpen={keyDialogOpen}
              setKeyDialogOpen={setKeyDialogOpen}
            />
          </div>
        </section>

        <HowItWorks />
        <SetupGuide onOpenKey={() => setKeyDialogOpen(true)} />
      </main>

      <Footer />
    </div>
  );
}
