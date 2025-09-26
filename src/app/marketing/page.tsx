"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Templates from "@/components/Templates";
import Impact from "@/components/Impact";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [doParallax, setDoParallax] = useState(false); // cuando empieza el wipe

  useEffect(() => {
    const id = setTimeout(() => setShowSplash(false), 9000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.main
        className="min-h-screen bg-background text-foreground items-center justify-center transform-gpu"
        initial={{ y: -100 }}
        animate={{ y: doParallax ? 0 : -100 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Header />
        <Hero />
        <Intro />
        <Templates />
        <Impact />
        <Contact />
        <Footer />
      </motion.main>

      {showSplash && (
        <SplashScreen
          totalDurationMs={6500}
          onSweepStart={() => setDoParallax(true)} // sincroniza el parallax
          onFinish={() => setShowSplash(false)}    // desmonta el splash
        />
      )}
    </div>
  );
}
