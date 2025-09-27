"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import { useSplashControl } from "../../hooks/useSplashControl";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Templates from "@/components/Templates";
import Impact from "@/components/Impact";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [doParallax, setDoParallax] = useState(false);
  const { shouldShowSplash, markSplashAsSeen} = useSplashControl();

  const initialY = shouldShowSplash ? -100 : 0;
  const animateY = shouldShowSplash ? (doParallax ? 0 : -100) : 0;
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      <main>
        <Header />
        <motion.div
          className="min-h-screen bg-background text-foreground items-center justify-center transform-gpu"
          initial={{ y: initialY }}
          animate={{ y: animateY }}
          transition={{ duration: shouldShowSplash ? 1.3 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <Hero />
          <Intro />
          <Templates />
          <Impact />
          <Contact />
          <Footer />
        </motion.div>
      </main>

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
