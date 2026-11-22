"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Storefront theme switch. The document attribute is set before paint by the
 * inline script in the root layout, so this only mirrors and updates it.
 */
export function ThemeToggle({ className, label = false }: { className?: string; label?: boolean }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("dorika-theme", next);
    } catch {
      /* storage may be blocked — the switch still works for this visit */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === "dark"}
      className={cn(
        "group inline-flex h-9 items-center justify-center gap-2 rounded-xs text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink",
        label ? "px-3" : "w-9",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-[17px] w-[17px]" strokeWidth={1.5} />
      ) : (
        <Moon className="h-[17px] w-[17px]" strokeWidth={1.5} />
      )}
      {label && (
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
          {theme === "dark" ? "Daylight" : "Evening"}
        </span>
      )}
    </button>
  );
}
