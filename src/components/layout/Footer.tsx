import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Sparkles className="h-4 w-4 text-primary" fill="currentColor" />
          <span>String Magic © {new Date().getFullYear()}</span>
        </div>
        <div className="text-muted-foreground font-mono opacity-50 scale-90">
          v1.0
        </div>
      </div>
    </footer>
  );
}
