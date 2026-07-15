"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  light,
}: {
  className?: string;
  light?: boolean;
}) {
  const { theme, toggleTheme, ready } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full transition",
        light
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-brand-sea-grey hover:bg-muted dark:text-white/80 dark:hover:bg-white/10",
        className
      )}
    >
      {!ready ? (
        <Sun className="h-4 w-4 opacity-40" />
      ) : theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
