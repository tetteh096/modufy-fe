import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_LAYOUT_SETTINGS,
  type LayoutSettings,
  type MenuColor,
  type SidebarSize,
  type TopbarColor,
  shouldSidebarStartOpen,
} from "@/lib/layout-settings";

interface UIState extends LayoutSettings {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  themeSettingsOpen: boolean;
  setThemeSettingsOpen: (open: boolean) => void;
  setTopbarColor: (color: TopbarColor) => void;
  setMenuColor: (color: MenuColor) => void;
  setSidebarSize: (size: SidebarSize) => void;
  setSidebarHoverPinned: (pinned: boolean) => void;
  toggleSidebarHoverPinned: () => void;
  resetLayoutSettings: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      ...DEFAULT_LAYOUT_SETTINGS,
      sidebarOpen: true,
      themeSettingsOpen: false,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setThemeSettingsOpen: (open) => set({ themeSettingsOpen: open }),

      setTopbarColor: (topbarColor) => set({ topbarColor }),
      setMenuColor: (menuColor) => set({ menuColor }),
      setSidebarSize: (sidebarSize) =>
        set({
          sidebarSize,
          sidebarOpen: shouldSidebarStartOpen(sidebarSize),
          sidebarHoverPinned: false,
        }),
      setSidebarHoverPinned: (sidebarHoverPinned) =>
        set({ sidebarHoverPinned }),
      toggleSidebarHoverPinned: () =>
        set((s) => ({ sidebarHoverPinned: !s.sidebarHoverPinned })),

      resetLayoutSettings: () =>
        set({
          ...DEFAULT_LAYOUT_SETTINGS,
          sidebarOpen: true,
          themeSettingsOpen: false,
        }),
    }),
    { name: "Modufy-ui" }
  )
);
