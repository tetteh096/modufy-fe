"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const MENU_EASE = [0.16, 1, 0.3, 1] as const;
const MENU_EXIT_EASE = [0.4, 0, 0.68, 0.2] as const;

type CenteredMegaMenuPortalProps = {
  open: boolean;
  menuId: string;
  headerOffset?: number;
  onHoverEnter?: () => void;
  onHoverLeave?: (event: React.PointerEvent) => void;
  children: React.ReactNode;
};

export function CenteredMegaMenuPortal({
  open,
  menuId,
  headerOffset = 96,
  onHoverEnter,
  onHoverLeave,
  children,
}: CenteredMegaMenuPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [top, setTop] = useState(headerOffset);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function updateTop() {
      const header = document.querySelector("[data-site-header]");
      if (header) {
        setTop(header.getBoundingClientRect().bottom + 6);
      } else {
        setTop(headerOffset);
      }
    }

    if (open) {
      updateTop();
      window.addEventListener("scroll", updateTop, true);
      window.addEventListener("resize", updateTop);
    }

    return () => {
      window.removeEventListener("scroll", updateTop, true);
      window.removeEventListener("resize", updateTop);
    };
  }, [open, headerOffset]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key={menuId}
          initial={{ opacity: 0, y: 14, scale: 0.985 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.44, ease: MENU_EASE },
          }}
          exit={{
            opacity: 0,
            y: 10,
            scale: 0.99,
            transition: { duration: 0.34, ease: MENU_EXIT_EASE },
          }}
          className={cn(
            "fixed left-1/2 z-[200] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2",
            "pt-8 -mt-8"
          )}
          style={{ top }}
          data-mega-menu={menuId}
          onPointerEnter={onHoverEnter}
          onPointerLeave={onHoverLeave}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function MegaMenuBackdrop({ open }: { open: boolean; onClose?: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, ease: MENU_EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.32, ease: MENU_EXIT_EASE } }}
          className="pointer-events-none fixed inset-0 z-[190] bg-brand-sea-grey/12 backdrop-blur-[2px]"
          data-mega-backdrop
          aria-hidden
        />
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

const OPEN_DELAY_MS = 110;
const CLOSE_DELAY_MS = 560;

export function useMegaMenuHover() {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelOpen() {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleOpen(onOpen: () => void) {
    cancelOpen();
    openTimer.current = setTimeout(onOpen, OPEN_DELAY_MS);
  }

  function scheduleClose(onClose: () => void) {
    cancelOpen();
    cancelClose();
    closeTimer.current = setTimeout(onClose, CLOSE_DELAY_MS);
  }

  return { scheduleClose, scheduleOpen, cancelClose, cancelOpen };
}

export function useMegaMenuTrigger({
  menuOpen,
  onMenuChange,
}: {
  menuOpen?: boolean;
  onMenuChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const openedAt = useRef(0);
  const { scheduleClose, scheduleOpen, cancelClose, cancelOpen } = useMegaMenuHover();

  const isOpen = open || Boolean(menuOpen);

  useEffect(() => {
    if (menuOpen === false) setOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    function handleClickOutside(event: MouseEvent) {
      if (Date.now() - openedAt.current < 320) return;

      const target = event.target as Node;
      if (ref.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-mega-menu]")) return;
      closeMenu();
    }

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  function setIsOpen(next: boolean) {
    setOpen(next);
    onMenuChange?.(next);
  }

  function openMenu() {
    cancelClose();
    cancelOpen();
    openedAt.current = Date.now();
    setIsOpen(true);
  }

  function closeMenu() {
    cancelClose();
    cancelOpen();
    setIsOpen(false);
  }

  function toggle() {
    if (isOpen) closeMenu();
    else openMenu();
  }

  function handleTriggerEnter() {
    cancelClose();

    const siblingMenuOpen = Boolean(document.querySelector("[data-mega-menu]"));
    if (isOpen || siblingMenuOpen) {
      openMenu();
      return;
    }

    scheduleOpen(openMenu);
  }

  function handlePointerLeave(event: React.PointerEvent) {
    cancelOpen();

    const related = event.relatedTarget as HTMLElement | null;
    if (related?.closest("[data-mega-menu]")) return;
    if (related && ref.current?.contains(related)) return;
    scheduleClose(closeMenu);
  }

  function handleMenuPointerLeave(event: React.PointerEvent) {
    const related = event.relatedTarget as HTMLElement | null;
    if (related?.closest("[data-mega-menu]")) return;
    if (related && ref.current?.contains(related)) return;
    scheduleClose(closeMenu);
  }

  return {
    ref,
    isOpen,
    open: handleTriggerEnter,
    close: closeMenu,
    toggle,
    handlePointerLeave,
    handleMenuPointerLeave,
    cancelClose,
  };
}
