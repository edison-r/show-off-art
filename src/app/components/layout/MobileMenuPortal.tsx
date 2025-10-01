"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  go: (path: string, opts: { color: string }) => void;
};

export default function MobileMenuPortal({ open, onClose, go }: Props) {
    const [mounted, setMounted] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
        {open && (
            <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] h-svh w-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            >
            <motion.div
                className="absolute inset-0 h-full w-full backdrop-blur-2xl bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />

            <motion.div
                ref={panelRef}
                className="relative h-full w-full flex flex-col items-center justify-center gap-8 sm:gap-10 p-8 text-[var(--bg)]"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
                <button
                onClick={onClose}
                aria-label="Close menu"
                className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] h-10 w-10 rounded-full bg-white/0 cursor-pointer flex items-center justify-center"
                >
                <div className="space-y-1.5">
                    <motion.span className="block h-0.5 w-6 bg-current" animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }} transition={{ duration: 0.3 }} />
                    <motion.span className="block h-0.5 w-6 bg-current" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.2 }} />
                    <motion.span className="block h-0.5 w-6 bg-current" animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }} transition={{ duration: 0.3 }} />
                </div>
                </button>

                {[
                { label: "Home", path: "/home", color: "var(--blue-gray)", delay: 0.05 },
                { label: "Work", path: "/work", color: "var(--fire)", delay: 0.15 },
                { label: "About", path: "/about", color: "var(--apple)", delay: 0.15 },
                { label: "Contact", path: "/contact", color: "var(--superblue)", delay: 0.20 },
                { label: "Login", path: "/auth/login", color: "var(--olive)", delay: 0.25 },
                ].map((item) => (
                <motion.button
                    key={item.path}
                    onClick={() => { onClose(); setTimeout(() => go(item.path, { color: item.color }), 220); }}
                    className="text-6xl cursor-pointer sm:text-7xl font-titles tracking-tight hover:opacity-80 transition-opacity"
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ delay: item.delay, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                >
                    {item.label}
                </motion.button>
                ))}

                <motion.p
                className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] text-xs font-mono opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                >
                Press ESC to close
                </motion.p>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
}
