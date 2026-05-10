import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        document.documentElement.classList.toggle("dark", e.matches);
        setDark(e.matches);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      aria-pressed={dark}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/60 backdrop-blur transition-colors hover:bg-surface"
    >
      <Sun
        className={`h-4 w-4 transition-all ${dark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all ${dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
      />
    </button>
  );
}
