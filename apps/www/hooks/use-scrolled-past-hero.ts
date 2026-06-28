"use client";

import { useEffect, useState } from "react";

const HEADER_OFFSET = 100;

export function useScrolledPastHero(enabled: boolean) {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setScrolledPast(false);
      return;
    }

    const hero = document.querySelector("[data-hero-section]");
    if (!hero) {
      setScrolledPast(false);
      return;
    }

    function update() {
      const { bottom } = hero!.getBoundingClientRect();
      setScrolledPast(bottom <= HEADER_OFFSET);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  return scrolledPast;
}
