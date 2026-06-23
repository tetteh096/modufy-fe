/**
 * Cash-flow colours
 * Light (warm): cash in = green, cash out = near-black (high contrast on cream)
 * Dark: cash in = green, cash out = amber
 */

export const cashInClass = "text-primary";
export const cashInBarClass = "bg-primary hover:bg-primary/90";

export const cashOutClass =
  "text-neutral-900 dark:text-amber-400 boron:text-destructive";
export const cashOutBarClass =
  "bg-neutral-900 hover:bg-neutral-800 dark:bg-amber-400 dark:hover:bg-amber-300 boron:bg-destructive boron:hover:opacity-90";

export const cashOutLegendClass =
  "bg-neutral-900 dark:bg-amber-400 boron:bg-destructive";

export const cashOutRingClass =
  "border-neutral-900/20 bg-neutral-100 text-neutral-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 boron:border-destructive/30 boron:bg-destructive/10 boron:text-destructive";

export const cashOutDotClass =
  "bg-neutral-900 dark:bg-amber-400 boron:bg-destructive";

/** Recharts SVG — use raw CSS vars (theme uses oklch, not hsl(...)). */
export const rechartsAxisTick = {
  fontSize: 11,
  fill: "var(--muted-foreground)",
} as const;

export const rechartsLegendStyle = {
  fontSize: 12,
  paddingTop: 16,
  color: "var(--foreground)",
} as const;

export const rechartsTooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
} as const;
