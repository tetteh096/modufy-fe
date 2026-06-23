"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const EXIT_MS = 200;

export interface SlidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  side?: "left" | "right";
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function SlidePanel({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  defaultWidth = 420,
  minWidth = 320,
  maxWidth = 720,
  children,
  footer,
  className,
}: SlidePanelProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [mounted, setMounted] = useState(false);
  /** Keeps panel in DOM while exit animation runs */
  const [present, setPresent] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(defaultWidth);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setPresent(true);
      setWidth(Math.min(maxWidth, Math.max(minWidth, defaultWidth)));
    } else if (present) {
      const t = window.setTimeout(() => setPresent(false), EXIT_MS);
      return () => window.clearTimeout(t);
    }
  }, [open, defaultWidth, present]);

  useEffect(() => {
    if (!present) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [present, onOpenChange]);

  const onResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = side === "right" ? startX.current - e.clientX : e.clientX - startX.current;
      const next = Math.min(maxWidth, Math.max(minWidth, startWidth.current + delta));
      setWidth(next);
    },
    [side, minWidth, maxWidth]
  );

  const onResizeEnd = useCallback(() => {
    dragging.current = false;
    document.removeEventListener("mousemove", onResizeMove);
    document.removeEventListener("mouseup", onResizeEnd);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [onResizeMove]);

  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onResizeMove);
      document.addEventListener("mouseup", onResizeEnd);
    },
    [width, onResizeMove, onResizeEnd]
  );

  if (!mounted || !present) return null;

  const slideOut =
    side === "right" ? "data-closed:slide-out-to-right-4" : "data-closed:slide-out-to-left-4";
  const slideIn =
    side === "right" ? "slide-in-from-right-4" : "slide-in-from-left-4";

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close panel"
        data-open={open ? "" : undefined}
        data-closed={!open ? "" : undefined}
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] duration-200",
          "data-open:animate-in data-open:fade-in-0",
          "data-closed:animate-out data-closed:fade-out-0"
        )}
        onClick={() => onOpenChange(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "slide-panel-title" : undefined}
        data-open={open ? "" : undefined}
        data-closed={!open ? "" : undefined}
        style={{ width: Math.min(maxWidth, Math.max(minWidth, width)) }}
        className={cn(
          "fixed top-0 bottom-0 z-50 flex flex-col border bg-background shadow-2xl duration-200 ease-out",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          "data-open:animate-in data-open:fade-in-0",
          open && slideIn,
          "data-closed:animate-out data-closed:fade-out-0",
          slideOut,
          className
        )}
      >
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel"
          onMouseDown={onResizeStart}
          className={cn(
            "absolute top-0 bottom-0 w-1.5 cursor-col-resize z-10 hover:bg-primary/20 active:bg-primary/30 transition-colors",
            side === "right" ? "left-0" : "right-0"
          )}
        />

        <header className="flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4 pl-6">
          <div className="min-w-0 pr-8">
            {title && (
              <h2 id="slide-panel-title" className="text-lg font-semibold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-3.5 right-3 shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 pl-6">{children}</div>

        {footer && (
          <footer className="shrink-0 border-t px-5 py-4 pl-6 flex flex-wrap justify-end gap-2">
            {footer}
          </footer>
        )}
      </aside>
    </>,
    document.body
  );
}

export function useSlidePanel(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  return { open, setOpen, onOpenChange: setOpen };
}
