import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GeneratorPanel } from "@/components/generator/GeneratorPanel";

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
    <div className="relative min-h-screen bg-background">
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
          className="mx-auto w-full max-w-7xl px-4 md:px-6 pt-16"
        >
          <div className="reveal">
            <GeneratorPanel
              apiKey={apiKey}
              setApiKey={setApiKey}
              keyDialogOpen={keyDialogOpen}
              setKeyDialogOpen={setKeyDialogOpen}
              model={model}
              onModel={onModel}
            />
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
