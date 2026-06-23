"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import type { CSSProperties, ReactNode } from "react";

export const sfEase = [0.22, 1, 0.36, 1] as const;

/** Shared timing — tuned for a slower, editorial feel */
const sfTiming = {
  page: 0.85,
  reveal: 1.05,
  fade: 0.95,
  scale: 1,
  staggerChild: 0.85,
  heroLine: 1.1,
  heroLineGap: 0.16,
  heroLineBase: 0.3,
  staggerGap: 0.16,
  staggerStart: 0.14,
  heroStaggerGap: 0.18,
  heroStaggerStart: 0.4,
  drawer: 0.55,
  backdrop: 0.45,
  loading: 0.65,
} as const;

export const sfReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: sfTiming.reveal, ease: sfEase },
  },
};

export const sfRevealFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: sfTiming.fade, ease: sfEase },
  },
};

export const sfRevealScale: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: sfTiming.scale, ease: sfEase },
  },
};

export const sfStaggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: sfTiming.staggerGap, delayChildren: sfTiming.staggerStart },
  },
};

export const sfStaggerChild: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: sfTiming.staggerChild, ease: sfEase },
  },
};

export const sfHeroChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: sfTiming.heroLine,
      ease: sfEase,
      delay: sfTiming.heroLineBase + i * sfTiming.heroLineGap,
    },
  }),
};

type RevealTag = "div" | "section" | "article";

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  variant?: "up" | "fade" | "scale";
  amount?: number;
  as?: RevealTag;
};

export function SfReveal({
  children,
  className,
  style,
  delay = 0,
  variant = "up",
  amount = 0.18,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const variants =
    variant === "fade" ? sfRevealFade : variant === "scale" ? sfRevealScale : sfReveal;
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -48px 0px" }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

export function SfStagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={sfStaggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function SfStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={sfStaggerChild}>
      {children}
    </motion.div>
  );
}

export function SfPageEnter({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: sfTiming.page, ease: sfEase }}
    >
      {children}
    </motion.div>
  );
}

export function SfHeroStagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: sfTiming.heroStaggerGap, delayChildren: sfTiming.heroStaggerStart },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function SfHeroItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={sfHeroChild} custom={index}>
      {children}
    </motion.div>
  );
}

export function StorefrontLoadingMotion() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="storefront-loading sf-loading-motion"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: sfTiming.loading, ease: sfEase }}
    >
      <motion.div
        className="storefront-loading-hero sf-loading-shimmer"
        animate={reduce ? undefined : { opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="storefront-loading-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="storefront-loading-card sf-loading-shimmer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 + i * 0.1, ease: sfEase }}
          />
        ))}
      </div>
      <motion.p
        className="sf-loading-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.7, ease: sfEase }}
      >
        Loading your store…
      </motion.p>
    </motion.div>
  );
}

export function SfDrawerBackdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <SfDrawerBackdropBase open={open} onClose={onClose} className="sf-mobile-backdrop is-open" />
  );
}

export function SfShopFiltersBackdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <SfDrawerBackdropBase open={open} onClose={onClose} className="sf-shop-filters-backdrop" />
  );
}

export function SfDrawerPanel({
  open,
  children,
  className,
  ariaLabel,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          className={className}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          initial={reduce ? false : { x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: sfTiming.drawer, ease: sfEase }}
        >
          {children}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export function SfLeftDrawerPanel({
  open,
  children,
  className,
  ariaLabel,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          className={className}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          initial={reduce ? false : { x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: sfTiming.drawer, ease: sfEase }}
        >
          {children}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export function SfDrawerBackdropBase({
  open,
  onClose,
  className,
}: {
  open: boolean;
  onClose: () => void;
  className: string;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <motion.button
          type="button"
          className={className}
          aria-label="Close"
          onClick={onClose}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: sfTiming.backdrop, ease: sfEase }}
        />
      ) : null}
    </AnimatePresence>
  );
}
