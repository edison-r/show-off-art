"use client";

import { useState, useRef, useMemo } from "react";
import { useScroll, useMotionValueEvent, motion } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import { useSplashControl } from "../../hooks/useSplashControl";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Templates from "@/components/Templates";
import ClientsSection from "@/components/ClientsSection";
import VideoSection from "@/components/VideoSection";
import Impact from "@/components/Impact";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [doParallax, setDoParallax] = useState(false);
  const { shouldShowSplash, isChecking, markSplashAsSeen } = useSplashControl();

  const initialY = shouldShowSplash ? -100 : 0;
  const animateY = shouldShowSplash ? (doParallax ? 0 : -100) : 0;

  const templatesRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLElement>(null);

  const { scrollYProgress: templatesProg } = useScroll({
    target: templatesRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: videoProg } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  });

  const [clientsActive, setClientsActive] = useState(false);
  const [videoActive, setVideoActive] = useState(false);

  useMotionValueEvent(templatesProg, "change", (p) => {
    setClientsActive(p > 0.8);
  });
  useMotionValueEvent(videoProg, "change", (p) => {
    setVideoActive(p > 0.95);
  });

  const theme = useMemo<"default" | "color" | "footer">(() => {
    if (videoActive) return "footer";
    if (clientsActive) return "color";
    return "default";
  }, [clientsActive, videoActive]);

  return (
    <div className="min-h-screen relative">
      <main
        data-theme={theme}
        className="min-h-screen transition-colors duration-700 bg-[var(--bg)] text-[var(--fg)]"
      >
        <Header />
        <motion.div
          className="min-h-screen transform-gpu"
          initial={{ y: initialY }}
          animate={{ y: animateY }}
          transition={{ duration: shouldShowSplash ? 1.3 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <Hero />
          <Templates ref={templatesRef}/>
          <ClientsSection/>
          <VideoSection ref={videoRef}/>
          <Impact />
          <Contact />
          <Footer />
        </motion.div>
      </main>

      {isChecking && (
        <div className="pointer-events-none fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin opacity-50"></div>
        </div>
      )}

      {shouldShowSplash && (
        <SplashScreen
          totalDurationMs={6500}
          onSweepStart={() => setDoParallax(true)}
          onFinish={markSplashAsSeen}
        />
      )}
    </div>
  );
}
