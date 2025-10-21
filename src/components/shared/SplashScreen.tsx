"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type SplashScreenProps = {
  onFinish: () => void;
  onSweepStart?: () => void;
  totalDurationMs?: number;
};

const WORDS = [
  "graphic designers",
  "developers",
  "photographers",
  "UX/UI designers",
  "videographers",
  "artists",
];

const SWEEP_PERCENTAGE = 0.2;

export default function SplashScreen({
  onFinish,
  onSweepStart,
  totalDurationMs = 6500,
}: SplashScreenProps) {
  const sweepDuration = Math.round(totalDurationMs * SWEEP_PERCENTAGE); // ~1300ms
  const wordsDuration = totalDurationMs - sweepDuration; // ~5200ms
  const timePerWord = Math.floor(wordsDuration / WORDS.length); // ~867ms

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSweeping, setIsSweeping] = useState(false);
  const hasFinishedRef = useRef(false);

  useLockBodyScroll(true);

  useEffect(() => {
    if (isSweeping) return;

    if (currentWordIndex === WORDS.length - 1) {
      const timer = setTimeout(() => {
        onSweepStart?.();
        setIsSweeping(true);
      }, timePerWord + 1000);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentWordIndex(prev => prev + 1);
    }, timePerWord);

    return () => clearTimeout(timer);
  }, [currentWordIndex, isSweeping, timePerWord, onSweepStart]);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ y: 0 }}
      animate={{ y: isSweeping ? "100vh" : 0 }}
      transition={{
        duration: sweepDuration / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={() => {
        if (isSweeping && !hasFinishedRef.current) {
          hasFinishedRef.current = true;
          onFinish();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-blue-gray"
    >
      <div className="relative text-center text-blue px-6">
        <h1 className="text-2xl md:text-4xl font-medium tracking-tight leading-tight">
          <span className="font-bold">
            designed <span className="font-light">by </span>artists,
          </span>
          <br />
          <span className="font-light">for&nbsp;</span>
          <br />
          
          <span className="font-bold inline-block overflow-hidden align-baseline min-w-[8ch]">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWordIndex}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.45,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="inline-block"
              >
                {WORDS[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>
      </div>
    </motion.div>
  );
}