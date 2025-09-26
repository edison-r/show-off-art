"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";

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
        className="min-h-screen bg-background text-foreground flex items-center justify-center transform-gpu"
        initial={{ y: -100 }}
        animate={{ y: doParallax ? 0 : -100 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-3xl text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold">Home content</h1>
          <p className="mt-4 opacity-80">
            Precargado desde el inicio. Desciende mientras la cortina baja.
          </p>
        </div>
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
