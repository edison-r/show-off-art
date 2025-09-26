"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls} from "framer-motion";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll"

type SplashScreenProps = {
    onFinish: () => void;
    totalDurationMs?: number;
};

export default function SplashScreen({ onFinish, totalDurationMs = 6500, }: SplashScreenProps){
    const words = useMemo(()=> [
      "developers",
      "graphic designers",
      "photographers",
      "content creators",
      "UX/UI designers",
      "artists",  
    ],[]);

    const sweepPct = 0.2; // el barrido dura el 20% del total
    const sweepDuration = Math.round(totalDurationMs * sweepPct); // 1300ms
    const wordsDuration = totalDurationMs - sweepDuration; // 5200ms
    const perWord = Math.max(500, Math.floor(wordsDuration / words.length)); // mínimo 500ms

    const [index, setIndex] = useState(0);
    const [rotating, setRotating] = useState(true);
    const curtain = useAnimationControls();
    const finishedRef = useRef(false);

    // Bloquear el scroll durante el splash
    useLockBodyScroll(true);

    useEffect(() => {
        if (!rotating) return;

        if(index >= words.length - 1){
            setRotating(false);

            const t = setTimeout(() => {
                void startSweep();
            }, Math.max(250, perWord * 0.6));

            return () => clearTimeout(t);
        }

        const id = setTimeout(() => setIndex((i) => i + 1), perWord);
        return () => clearTimeout(id);

    }, [index, rotating, perWord, words.length]);

    const startSweep = async () => {
        await curtain.start({
            y: ["-100vh", "0vh", "100vh"],
            transition: { 
              duration: sweepDuration / 1000, 
              times: [0, 0.45, 1],
              ease: [0.22, 1, 0.36, 1] },
        });
        onFinish();
    };

    return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      {/* Texto central */}
      <div className="relative z-20 px-6 text-center text-blue">
        <div className="text-2xl md:text-4xl font-medium tracking-tight">
          <span className="font-bold">designed <span className="font-light">by </span>artists,</span><br></br>
          <span className="font-light">for </span><br></br>
          <span className="font-bold min-w-[12ch]">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="inline-block"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>

      {/* Cortina para el barrido */}
      <motion.div
        initial={{ y: "-100hv" }}
        animate={curtain}
        exit={{ y: 0 }}
        className="pointer-events-none fixed inset-0 z-10 bg-black"
        style={{ willChange: "transform" }}
      />
    </div>
  )  ;
}
