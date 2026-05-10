import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StructuralBackground } from "@/components/layout/StructuralBackground";
import { GeneratorPanel } from "@/components/generator/GeneratorPanel";
import { SetupGuide } from "@/components/sections/SetupGuide";
import { storage } from "@/lib/storage";
import { useReveal } from "@/lib/reveal";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);

  useEffect(() => {
    setApiKey(storage.getApiKey());
    setModel(storage.getModelId());
  }, []);

  const onModel = (id: string) => {
    setModel(id);
    storage.setModelId(id);
  };

  useReveal();

  return (
    <div className="relative min-h-screen">
      <StructuralBackground />
      <Header
        onOpenKey={() => setKeyDialogOpen(true)}
        hasKey={!!apiKey}
        apiKey={apiKey}
        model={model}
        onModel={onModel}
      />

      <main className="pb-16">
        <section
          id="top"
          className="mx-auto w-full max-w-3xl px-4 pt-8 md:pt-12"
        >
          <div className="reveal mb-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Boolean strings,{" "}
              <span className="text-muted-foreground">in one click.</span>
            </h1>
          </div>

          <div className="reveal">
            <GeneratorPanel
              apiKey={apiKey}
              setApiKey={setApiKey}
              keyDialogOpen={keyDialogOpen}
              setKeyDialogOpen={setKeyDialogOpen}
              model={model}
            />
          </div>
        </section>

        <SetupGuide onOpenKey={() => setKeyDialogOpen(true)} />
      </main>

      <Footer />
    </div>
  );
}
