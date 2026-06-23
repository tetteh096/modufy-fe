"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function StorefrontThemeToggle({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "pill" | "footer";
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (variant === "pill") {
    return (
      <div className={cn("storefront-theme-pill", className)} role="group" aria-label="Theme">
        <button
          type="button"
          className={cn(!isDark && "is-active")}
          onClick={() => setTheme("light")}
          aria-pressed={!isDark}
        >
          <Sun className="h-3.5 w-3.5" />
          Light
        </button>
        <button
          type="button"
          className={cn(isDark && "is-active")}
          onClick={() => setTheme("dark")}
          aria-pressed={isDark}
        >
          <Moon className="h-3.5 w-3.5" />
          Dark
        </button>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={cn("storefront-theme-footer", className)}>
        <span className="storefront-theme-footer-label">Appearance</span>
        <StorefrontThemeToggle variant="pill" />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={cn("storefront-icon-btn storefront-theme-toggle", className)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
