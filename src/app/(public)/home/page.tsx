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

type PageTheme = "default" | "color" | "footer";

const THEME_THRESHOLDS = {
  COLOR: 0.8,
  FOOTER: 0.95,
};

export default function HomePage() {
  const { shouldShowSplash, isChecking, markSplashAsSeen } = useSplashControl();

  const [enableParallax, setEnableParallax] = useState(!shouldShowSplash);

  const templatesRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLElement>(null);

  const { scrollYProgress: templatesProgress } = useScroll({
    target: templatesRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: videoProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  });

  const [isColorThemeActive, setIsColorThemeActive] = useState(false);
  const [isFooterThemeActive, setIsFooterThemeActive] = useState(false);

  useMotionValueEvent(templatesProgress, "change", (progress) => {
    setIsColorThemeActive(progress > THEME_THRESHOLDS.COLOR);
  });

  useMotionValueEvent(videoProgress, "change", (progress) => {
    setIsFooterThemeActive(progress > THEME_THRESHOLDS.FOOTER);
  });

  const currentTheme = useMemo<PageTheme>(() => {
    if (isFooterThemeActive) return "footer";
    if (isColorThemeActive) return "color";
    return "default";
  }, [isColorThemeActive, isFooterThemeActive]);

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

          <motion.div
            className="min-h-screen transform-gpu"
            initial={{ y: entryAnimation.initial }}
            animate={{ y: entryAnimation.animate }}
            transition={{
              duration: shouldShowSplash ? 1.3 : 0,
              ease: [0.22, 1, 0.36, 1],
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

      {isChecking && (
        <div className="pointer-events-none fixed inset-0 z-[9999] bg-[var(--bg)] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin opacity-50" />
        </div>
      )}

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