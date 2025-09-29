"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll"

type SplashScreenProps = {
  onFinish: () => void;
  onSweepStart?: () => void;
  totalDurationMs?: number;
};

export default function SplashScreen({
  onFinish,
  onSweepStart,
  totalDurationMs = 6500,
}: SplashScreenProps) {
  const words = useMemo(
    () => [
      "graphic designers", 
      "developers",
      "photographers",
      "UX/UI designers",
      "videographers",
      "artists",
    ],
    []
  );

  // 80% rotación palabras, 20% barrido
  const sweepPct = 0.2;
  const sweepDuration = Math.round(totalDurationMs * sweepPct); // ~1300ms
  const wordsDuration = totalDurationMs - sweepDuration;        // ~5200ms
  const perWord = Math.max(500, Math.floor(wordsDuration / words.length));

  const [index, setIndex] = useState(0);
  const [slideOut, setSlideOut] = useState(false);
  const finishedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Bloquear scroll mientras haya splash
  useLockBodyScroll(true);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (slideOut) return;

    if (index >= words.length) {
      onSweepStart?.();
      setSlideOut(true);
      return;
    }

    if (index === words.length - 1) {
      timeoutRef.current = setTimeout(() => {
        onSweepStart?.();
        setSlideOut(true);
      }, perWord + 1000);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setIndex((i) => i + 1);
    }, perWord);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [index, slideOut, perWord, words.length, onSweepStart]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ y: 0 }}
      animate={{ y: slideOut ? "100vh" : "0vh" }}
      transition={{ duration: sweepDuration / 1000, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (slideOut && !finishedRef.current) {
          finishedRef.current = true;
          onFinish();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-blue-gray"
      style={{ willChange: "transform" }}
    >
      <div className="relative z-40 px-6 text-center text-blue">
        <div className="z-40 text-2xl md:text-4xl font-medium tracking-tight leading-tight">
          <span className="font-bold">
            designed <span className="font-light">by </span>artists,
          </span>
          <br />
          <span className="font-light">for&nbsp;</span><br />
          <span className="font-bold inline-block overflow-hidden align-baseline min-w-[8ch]">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="inline-block"
              >
                {words[index] || words[words.length - 1]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>
    </motion.div>
  );
}