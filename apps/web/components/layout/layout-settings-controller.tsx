"use client";

import { useLayoutEffect, useEffect } from "react";
import { useUIStore } from "@/store/ui";
import { shouldSidebarStartOpen } from "@/lib/layout-settings";

function syncLayoutAttributes(
  topbarColor: string,
  menuColor: string,
  sidebarSize: string,
  sidebarHoverPinned: boolean,
) {
  const html = document.documentElement;
  html.setAttribute("data-topbar-color", topbarColor);
  html.setAttribute("data-menu-color", menuColor);
  html.setAttribute("data-sidenav-size", sidebarSize);

  const sidebar = document.querySelector('[data-slot="sidebar"]');
  if (sidebar) {
    if (sidebarSize === "hover") {
      sidebar.setAttribute("data-hover-pinned", sidebarHoverPinned ? "true" : "false");
      sidebar.setAttribute("data-sidebar-strip", sidebarHoverPinned ? "false" : "true");
    } else {
      sidebar.removeAttribute("data-hover-pinned");
      sidebar.removeAttribute("data-sidebar-strip");
    }
  }
}

/** Syncs layout prefs to <html> data attributes and sidebar open state (Boron pattern). */
export function LayoutSettingsController() {
  const topbarColor = useUIStore((s) => s.topbarColor);
  const menuColor = useUIStore((s) => s.menuColor);
  const sidebarSize = useUIStore((s) => s.sidebarSize);
  const sidebarHoverPinned = useUIStore((s) => s.sidebarHoverPinned);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  useLayoutEffect(() => {
    syncLayoutAttributes(topbarColor, menuColor, sidebarSize, sidebarHoverPinned);
  }, [topbarColor, menuColor, sidebarSize, sidebarHoverPinned]);

  useEffect(() => {
    if (sidebarSize !== "hover") return;
    const sidebar = document.querySelector('[data-slot="sidebar"]');
    if (!sidebar) return;
    sidebar.setAttribute("data-sidebar-strip", sidebarHoverPinned ? "false" : "true");
  }, [sidebarSize, sidebarHoverPinned]);

  useEffect(() => {
    function adjustForViewport() {
      const w = window.innerWidth;
      const html = document.documentElement;
      const storedSize = useUIStore.getState().sidebarSize;

      if (w <= 767) {
        html.setAttribute("data-sidenav-size", "full");
        setSidebarOpen(false);
      } else if (w <= 1140) {
        if (storedSize !== "full" && storedSize !== "hidden") {
          html.setAttribute("data-sidenav-size", "condensed");
        }
      } else {
        html.setAttribute("data-sidenav-size", storedSize);
        setSidebarOpen(shouldSidebarStartOpen(storedSize));
      }
    }

    adjustForViewport();
    window.addEventListener("resize", adjustForViewport);
    return () => window.removeEventListener("resize", adjustForViewport);
  }, [sidebarSize, setSidebarOpen]);

  return null;
}
