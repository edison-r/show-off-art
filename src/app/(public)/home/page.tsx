"use client";

import { useState, useRef, useMemo } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import SplashScreen from "@/components/shared/SplashScreen";
import { useSplashControl } from "@/hooks/useSplashControl";

import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Templates from "@/components/home/Templates";
import ClientsSection from "@/components/home/ClientsSection";
import VideoSection from "@/components/home/VideoSection";
import Impact from "@/components/home/Impact";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";
import { PageWrapper } from "@/components/shared/PageWrapper";

// Temas disponibles para diferentes secciones
type PageTheme = "default" | "color" | "footer";

// Umbrales de scroll para cambiar temas
const THEME_THRESHOLDS = {
  COLOR: 0.8,   // Cuando Templates está 80% visible → tema color
  FOOTER: 0.95, // Cuando Video está 95% visible → tema footer
};

/**
 * Página principal con efectos visuales orchestrados
 * 
 * EFECTOS:
 * 1. Splash screen en primera visita
 * 2. Entrada suave de página (parallax)
 * 3. Cambio de tema según scroll
 */
export default function HomePage() {
  const { shouldShowSplash, isChecking, markSplashAsSeen } = useSplashControl();

  // Estado para controlar el parallax de entrada
  const [enableParallax, setEnableParallax] = useState(!shouldShowSplash);

  // Refs para tracking de scroll de secciones
  const templatesRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLElement>(null);

  // Obtener progreso de scroll de cada sección
  const { scrollYProgress: templatesProgress } = useScroll({
    target: templatesRef,
    offset: ["start end", "end start"], // Empieza cuando entra viewport, termina cuando sale
  });

  const { scrollYProgress: videoProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  });

  // Estados para activación de temas
  const [isColorThemeActive, setIsColorThemeActive] = useState(false);
  const [isFooterThemeActive, setIsFooterThemeActive] = useState(false);

  // Escuchar cambios en el scroll para activar temas
  useMotionValueEvent(templatesProgress, "change", (progress) => {
    setIsColorThemeActive(progress > THEME_THRESHOLDS.COLOR);
  });

  useMotionValueEvent(videoProgress, "change", (progress) => {
    setIsFooterThemeActive(progress > THEME_THRESHOLDS.FOOTER);
  });

  // Determinar tema actual basado en scroll
  const currentTheme = useMemo<PageTheme>(() => {
    if (isFooterThemeActive) return "footer";
    if (isColorThemeActive) return "color";
    return "default";
  }, [isColorThemeActive, isFooterThemeActive]);

  // Calcular valores para animación de entrada
  const entryAnimation = {
    initial: shouldShowSplash ? -100 : 0,
    animate: shouldShowSplash ? (enableParallax ? 0 : -100) : 0,
  };

  return (
    <div className="min-h-screen relative">
      <PageWrapper>
        <main
          data-theme={currentTheme}
          className="min-h-screen transition-colors duration-700 bg-[var(--bg)] text-[var(--fg)]"
        >
          <Header />

          {/* Contenedor principal con animación de entrada */}
          <motion.div
            className="min-h-screen transform-gpu"
            initial={{ y: entryAnimation.initial }}
            animate={{ y: entryAnimation.animate }}
            transition={{
              duration: shouldShowSplash ? 1.3 : 0,
              ease: [0.22, 1, 0.36, 1], // easeOutQuart
            }}
          >
            <Hero />
            <Templates ref={templatesRef} />
            <ClientsSection />
            <VideoSection ref={videoRef} />
            <Impact />
            <Contact />
            <Footer />
          </motion.div>
        </main>
      </PageWrapper>

      {/* Loading indicator mientras verifica splash */}
      {isChecking && (
        <div className="pointer-events-none fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin opacity-50" />
        </div>
      )}

      {/* Splash screen si debe mostrarse */}
      {shouldShowSplash && (
        <SplashScreen
          totalDurationMs={6500}
          onSweepStart={() => setEnableParallax(true)}
          onFinish={markSplashAsSeen}
        />
      )}
    </div>
  );
}