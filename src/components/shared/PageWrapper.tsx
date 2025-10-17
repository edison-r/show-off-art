"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
  enableAnimation?: boolean; // Permitir deshabilitar animación
  animationDelay?: number; // Delay antes de animar (en segundos)
};

const INITIAL_OFFSET = -50; // Offset inicial en píxeles
const ANIMATION_DURATION = 1.2; // Duración en segundos

/**
 * Wrapper para páginas con animación de entrada suave
 * 
 * CÓMO FUNCIONA:
 * - La página inicia ligeramente arriba (y: -50px)
 * - Se anima hacia su posición normal (y: 0)
 * - Usa easing suave para sensación profesional
 * 
 * USO:
 * <PageWrapper>
 *   <Header />
 *   <Content />
 * </PageWrapper>
 */
export function PageWrapper({
  children,
  className = "",
  enableAnimation = true,
  animationDelay = 0.05,
}: PageWrapperProps) {
  // Si la animación está deshabilitada, renderizar sin motion
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