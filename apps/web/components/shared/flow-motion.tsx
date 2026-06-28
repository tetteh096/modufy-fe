"use client";

import {
  memo,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  forwardRef,
} from "react";
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";
import "./flow-motion.css";

// ==================== Box reveal ====================

type FlowBoxRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** CSS color for the wipe overlay */
  wipeColor?: string;
};

export const FlowBoxReveal = memo(function FlowBoxReveal({
  children,
  className,
  delay = 0,
  duration = 0.45,
  wipeColor = "var(--flow-wipe-color, #16a34a)",
}: FlowBoxRevealProps) {
  const reduced = useReducedMotion();
  const mainControls = useAnimation();
  const slideControls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (reduced) {
      mainControls.set("visible");
      slideControls.set("visible");
      return;
    }
    if (isInView) {
      slideControls.start("visible");
      mainControls.start("visible");
    }
  }, [isInView, mainControls, slideControls, reduced]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 28 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay: delay + 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{ hidden: { left: 0 }, visible: { left: "100%" } }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: duration * 0.85, delay, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-y-1 left-0 z-10 w-full rounded-md"
        style={{ background: wipeColor }}
        aria-hidden
      />
    </div>
  );
});

// ==================== Ripple ====================

type FlowRippleProps = {
  className?: string;
  mainCircleSize?: number;
  numCircles?: number;
  borderClassName?: string;
};

export const FlowRipple = memo(function FlowRipple({
  className,
  mainCircleSize = 180,
  numCircles = 9,
  borderClassName = "border-emerald-400/20 bg-emerald-400/5",
}: FlowRippleProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden",
        "[mask-image:linear-gradient(to_bottom,black,transparent)]",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 56;
        const opacity = 0.22 - i * 0.018;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";

        return (
          <span
            key={i}
            className={cn(
              "absolute rounded-full border",
              borderClassName,
              !reduced && "flow-animate-ripple",
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: Math.max(opacity, 0.04),
              animationDelay: `${i * 0.07}s`,
              borderStyle,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
});

// ==================== Orbit ring ====================

type FlowOrbitRingProps = {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
};

export const FlowOrbitRing = memo(function FlowOrbitRing({
  children,
  className,
  reverse = false,
  duration = 22,
  delay = 0,
  radius = 120,
}: FlowOrbitRingProps) {
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <div
        style={
          {
            "--flow-orbit-duration": `${duration}s`,
            "--flow-orbit-delay": `${delay}s`,
            "--flow-orbit-radius": `${radius}px`,
          } as React.CSSProperties
        }
        className={cn(
          "flow-animate-orbit",
          reverse && "[animation-direction:reverse]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
});

// ==================== Glow input ====================

type FlowGlowInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  glowColor?: string;
  inputClassName?: string;
};

export const FlowGlowInput = memo(
  forwardRef<HTMLInputElement, FlowGlowInputProps>(function FlowGlowInput(
    { className, hasError, glowColor = "rgb(34 197 94 / 0.45)", inputClassName, ...props },
    ref,
  ) {
    const reduced = useReducedMotion();
    const [active, setActive] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const glow = useMotionTemplate`
      radial-gradient(
        ${active ? "120px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        ${glowColor},
        transparent 80%
      )
    `;

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
      const { left, top } = event.currentTarget.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    }

    if (reduced) {
      return (
        <input
          ref={ref}
          className={cn("flow-glow-field", inputClassName, hasError && "border-destructive", className)}
          {...props}
        />
      );
    }

    return (
      <motion.div
        style={{ background: glow }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        className={cn("flow-glow-field rounded-[0.8rem] p-[2px] transition duration-300", className)}
      >
        <input
          ref={ref}
          className={cn(inputClassName, hasError && "border-destructive")}
          {...props}
        />
      </motion.div>
    );
  }),
);

FlowGlowInput.displayName = "FlowGlowInput";

/** Bottom shine on hover — use inside relative buttons */
export function FlowButtonShine() {
  return (
    <>
      <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="pointer-events-none absolute inset-x-[15%] -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
}
