"use client";
import { m } from "motion/react";
import { spring, viewportOnce } from "@/lib/motion";

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...spring, delay }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
      variants={{
        initial: {},
        animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
