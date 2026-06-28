"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

type AnimatedStatProps = {
  value: number;
  suffix: string;
  label: string;
  className?: string;
};

export function AnimatedStat({ value, suffix, label, className }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Number.isInteger(value) ? Math.round(latest).toString() : latest.toFixed(1));
    });
    return unsubscribe;
  }, [spring, value]);

  return (
    <div ref={ref} className={className}>
      <p className="text-4xl font-bold text-primary sm:text-5xl">
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
