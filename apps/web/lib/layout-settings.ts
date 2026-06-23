export type TopbarColor = "light" | "dark";
export type MenuColor = "light" | "dark";
export type ColorScheme = "light" | "dark" | "warm";

export const COLOR_SCHEME_OPTIONS: {
  value: ColorScheme;
  label: string;
  description: string;
}[] = [
  { value: "light", label: "Green", description: "Fresh & clean" },
  { value: "dark", label: "Dark", description: "Easy on the eyes" },
  { value: "warm", label: "Warm", description: "Orange & cozy" },
];

/** Matches Boron data-sidenav-size values (fullscreen → hidden). */
export type SidebarSize =
  | "default"
  | "compact"
  | "condensed"
  | "hover"
  | "full"
  | "hidden";

export type LayoutSettings = {
  topbarColor: TopbarColor;
  menuColor: MenuColor;
  sidebarSize: SidebarSize;
  /** Hover View: pin sidebar expanded (Boron sm-hover-active). */
  sidebarHoverPinned: boolean;
};

export const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = {
  topbarColor: "light",
  menuColor: "dark",
  sidebarSize: "default",
  sidebarHoverPinned: false,
};

export function getSidebarCollapsible(
  size: SidebarSize
): "icon" | "offcanvas" {
  if (size === "full" || size === "hidden") return "offcanvas";
  return "icon";
}

export function shouldSidebarStartOpen(size: SidebarSize): boolean {
  return size === "default" || size === "compact";
}

export const SIDEBAR_SIZE_OPTIONS: {
  value: SidebarSize;
  label: string;
}[] = [
  { value: "default", label: "Default" },
  { value: "compact", label: "Compact" },
  { value: "condensed", label: "Condensed" },
  { value: "hover", label: "Hover View" },
  { value: "full", label: "Full Layout" },
  { value: "hidden", label: "Hidden" },
];
