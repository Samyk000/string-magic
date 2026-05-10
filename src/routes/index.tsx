import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StructuralBackground } from "@/components/layout/StructuralBackground";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { SetupGuide } from "@/components/sections/SetupGuide";
import { FinalCta } from "@/components/sections/FinalCta";
import { storage } from "@/lib/storage";
import { useReveal } from "@/lib/reveal";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [apiKey, setApiKey] = useState("");
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);

  useEffect(() => {
    const k = storage.getApiKey();
    setApiKey(k);
    if (!k) {
      // Soft nudge: don't auto-open, keep first paint clean
    }
  }, []);

  useReveal();

  return (
    <div className="relative min-h-screen">
      <StructuralBackground />
      <Header onOpenKey={() => setKeyDialogOpen(true)} hasKey={!!apiKey} />
      <main className="pb-20">
        <Hero
          apiKey={apiKey}
          setApiKey={setApiKey}
          keyDialogOpen={keyDialogOpen}
          setKeyDialogOpen={setKeyDialogOpen}
        />
        <HowItWorks />
        <Features />
        <SetupGuide onOpenKey={() => setKeyDialogOpen(true)} />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
