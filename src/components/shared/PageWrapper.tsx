"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
  enableAnimation?: boolean;
  animationDelay?: number;
};

const INITIAL_OFFSET = -50;
const ANIMATION_DURATION = 1.2;

export function PageWrapper({
  children,
  className = "",
  enableAnimation = true,
  animationDelay = 0.05,
}: PageWrapperProps) {
  if (!enableAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`min-h-screen transform-gpu ${className}`}
      initial={{ y: INITIAL_OFFSET, opacity: 0.8 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: ANIMATION_DURATION,
        ease: [0.22, 1, 0.36, 1],
        delay: animationDelay,
      }}
    >
      {children}
    </motion.div>
  );
}