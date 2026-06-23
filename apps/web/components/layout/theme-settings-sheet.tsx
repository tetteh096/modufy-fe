"use client";

import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
import {
  COLOR_SCHEME_OPTIONS,
  SIDEBAR_SIZE_OPTIONS,
  type ColorScheme,
  type MenuColor,
  type SidebarSize,
  type TopbarColor,
} from "@/lib/layout-settings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const SCHEME_ICONS = {
  light: Sun,
  dark: Moon,
  warm: Flame,
} as const;

const SCHEME_SWATCH = {
  light: "bg-[oklch(0.95_0.04_148)] border-primary/40",
  dark: "bg-[oklch(0.2_0.04_265)] border-border",
  warm: "bg-[oklch(0.92_0.06_55)] border-orange-400/50",
} as const;

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border-b px-4 py-4 last:border-b-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function RadioCard({
  selected,
  onSelect,
  label,
  children,
  className,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cn(
          "relative w-full overflow-hidden rounded-lg border-2 bg-muted/30 p-2 transition-colors hover:bg-muted/50",
          selected ? "border-primary ring-1 ring-primary/30" : "border-border",
          className
        )}
      >
        {selected && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            ✓
          </span>
        )}
        {children}
      </button>
      <p className="text-center text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function SidebarSizePreview({ size }: { size: SidebarSize }) {
  const bar = "rounded-sm bg-muted-foreground/25";
  const active = "rounded-sm bg-foreground/40";

  if (size === "hidden") {
    return (
      <div className="flex h-14 w-full">
        <div className="flex flex-1 flex-col gap-1 p-1">
          <div className={cn(active, "h-2 w-full")} />
        </div>
      </div>
    );
  }

  if (size === "full") {
    return (
      <div className="flex h-14 w-full">
        <div className="w-1 shrink-0 bg-muted-foreground/15" />
        <div className="flex flex-1 flex-col gap-1 p-1">
          <div className={cn(active, "h-2 w-full")} />
        </div>
      </div>
    );
  }

  const narrow =
    size === "condensed" || size === "hover"
      ? "w-[18%]"
      : size === "compact"
        ? "w-[28%]"
        : "w-[32%]";

  return (
    <div className="flex h-14 w-full">
      <div className={cn("flex shrink-0 flex-col gap-0.5 border-r border-border/60 p-0.5", narrow)}>
        <div className={cn(active, "h-1.5 w-full")} />
        <div className={cn(bar, "h-1 w-full")} />
        <div className={cn(bar, "h-1 w-full")} />
        <div className={cn(bar, "h-1 w-full")} />
      </div>
      <div className="flex flex-1 flex-col p-0.5">
        <div className={cn(active, "h-2 w-full")} />
      </div>
    </div>
  );
}

export function ThemeSettingsSheet() {
  const { theme, setTheme } = useTheme();
  const open = useUIStore((s) => s.themeSettingsOpen);
  const setOpen = useUIStore((s) => s.setThemeSettingsOpen);
  const topbarColor = useUIStore((s) => s.topbarColor);
  const menuColor = useUIStore((s) => s.menuColor);
  const sidebarSize = useUIStore((s) => s.sidebarSize);
  const setTopbarColor = useUIStore((s) => s.setTopbarColor);
  const setMenuColor = useUIStore((s) => s.setMenuColor);
  const setSidebarSize = useUIStore((s) => s.setSidebarSize);
  const resetLayoutSettings = useUIStore((s) => s.resetLayoutSettings);

  const colorScheme = (theme ?? "light") as ColorScheme;

  function setColorScheme(scheme: ColorScheme) {
    setTheme(scheme);
  }

  function handleReset() {
    resetLayoutSettings();
    setTheme("light");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle>Theme Settings</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <SettingSection title="Color Scheme">
            <div className="grid grid-cols-3 gap-2">
              {COLOR_SCHEME_OPTIONS.map(({ value, label, description }) => {
                const Icon = SCHEME_ICONS[value];
                return (
                  <RadioCard
                    key={value}
                    selected={colorScheme === value}
                    onSelect={() => setColorScheme(value)}
                    label={label}
                  >
                    <div className="flex flex-col items-center justify-center gap-1 py-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2",
                          SCHEME_SWATCH[value]
                        )}
                      >
                        <Icon className="h-5 w-5 text-foreground/80" />
                      </span>
                      <span className="text-[10px] text-muted-foreground">{description}</span>
                    </div>
                  </RadioCard>
                );
              })}
            </div>
          </SettingSection>

          <SettingSection title="Topbar Color">
            <div className="grid grid-cols-2 gap-3">
              {(["light", "dark"] as TopbarColor[]).map((value) => (
                <RadioCard
                  key={value}
                  selected={topbarColor === value}
                  onSelect={() => setTopbarColor(value)}
                  label={value === "light" ? "Light" : "Dark"}
                >
                  <div className="flex h-14 items-center justify-center">
                    <span
                      className={cn(
                        "h-8 w-8 rounded-full border shadow-sm",
                        value === "light"
                          ? "bg-white border-border"
                          : "bg-neutral-900 border-neutral-700"
                      )}
                    />
                  </div>
                </RadioCard>
              ))}
            </div>
          </SettingSection>

          <SettingSection title="Menu Color">
            <div className="grid grid-cols-2 gap-3">
              {(["light", "dark"] as MenuColor[]).map((value) => (
                <RadioCard
                  key={value}
                  selected={menuColor === value}
                  onSelect={() => setMenuColor(value)}
                  label={value === "light" ? "Light" : "Dark"}
                >
                  <div className="flex h-14 items-center justify-center">
                    <span
                      className={cn(
                        "h-8 w-8 rounded-full border shadow-sm",
                        value === "light"
                          ? "bg-white border-border"
                          : "bg-neutral-900 border-neutral-700"
                      )}
                    />
                  </div>
                </RadioCard>
              ))}
            </div>
          </SettingSection>

          <SettingSection title="Sidebar Size">
            <div className="grid grid-cols-3 gap-2">
              {SIDEBAR_SIZE_OPTIONS.map(({ value, label }) => (
                <RadioCard
                  key={value}
                  selected={sidebarSize === value}
                  onSelect={() => setSidebarSize(value)}
                  label={label}
                  className="p-1.5"
                >
                  <SidebarSizePreview size={value} />
                </RadioCard>
              ))}
            </div>
            {sidebarSize === "hover" && (
              <p className="text-xs text-muted-foreground">
                Hover the sidebar to expand. Use the circle button in the sidebar header to pin it open.
              </p>
            )}
          </SettingSection>
        </div>

        <SheetFooter className="flex-row gap-2 border-t px-4 py-3">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button className="flex-1" onClick={() => setOpen(false)}>
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
