"use client";

export const spring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.8,
};

export const playfulSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 18,
  mass: 0.6,
};

export const ease = [0.25, 0.1, 0.25, 1] as const;

export const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
} as const;

export const cardEnter = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
} as const;

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
} as const;

export const staggerAdmin = {
  initial: {},
  animate: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } },
} as const;

export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
};

export const viewportAdmin = {
  once: true,
  margin: "-40px" as const,
};
