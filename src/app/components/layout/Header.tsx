"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import MobileMenuPortal from "../layout/MobileMenuPortal";

export default function Header() {
  const { navigateWithTransition } = useNavigationHelper();
  const [open, setOpen] = useState(false);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (path: string, opts: { color: string }) => {
    setOpen(false);
    setTimeout(() => {
      navigateWithTransition(path, { direction: "down", duration: 1000, ...opts });
    }, 200);
  };
  return (
    <header className="sticky w-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 z-40 top-0 start-0 border-b border-blue-gray-ghost backdrop-blur-md">
      <div className="font-mono font-extralight mx-auto py-3 flex items-center justify-between">
        <button 
          onClick={() => navigateWithTransition('/home', { 
            direction: 'down', 
            color: "var(--blue-gray)",
            duration: 1000 
          })}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
        <span className="font-titles cursor-pointer tracking-wide text-sm sm:text-base">show-off</span>
        </button>
        
        <nav className="hidden md:flex items-center justify-between gap-4 lg:gap-6 text-xs sm:text-sm">
          <button 
            onClick={() => navigateWithTransition('/home', { 
              direction: 'down', 
              color: "var(--blue-gray)",
              duration: 1200
            })}
            className="hover:underline cursor-pointer"
          >
            Home
          </button>          
          <button 
            onClick={() => navigateWithTransition('/work', { 
              direction: 'down', 
              color: "var(--superblue)",
              duration: 1200
            })}
            className="hover:underline cursor-pointer"
          >
            Work
          </button>
          <button 
            onClick={() => navigateWithTransition('/about', { 
              direction: 'down', 
              color: "var(--apple)",
              duration: 1200
            })}
            className="hover:underline cursor-pointer"
          >
            About
          </button>
          <button 
            onClick={() => navigateWithTransition('/contact', { 
              direction: 'down', 
              color: "var(--superblue)",
              duration: 1200
            })}
            className="hover:underline cursor-pointer"
          >
            Contact
          </button>
          <button
            onClick={() => navigateWithTransition('/auth/join', { 
              direction: 'down', 
              color: "var(--olive)",
              duration: 1200
            })}
            className="ml-12 hover:underline cursor-pointer"
          >
            Join Us
          </button>
          <button
            onClick={() => navigateWithTransition('/auth/login', { 
              direction: 'down', 
              color: "var(--olive)",
              duration: 1200
            })}
            className="hover:underline cursor-pointer"
          >
            Log In
          </button>          
        </nav>
        
        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded hover:bg-white/10 transition-colors"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <div className="space-y-1.5">
            <motion.span className="block h-0.5 w-6 bg-current" animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0, opacity: open ? 0 : 1}} transition={{ duration: 0.3 }} />
            <motion.span className="block h-0.5 w-6 bg-current" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.3 }} />
            <motion.span className="block h-0.5 w-6 bg-current" animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0, opacity: open ? 0 : 1 }} transition={{ duration: 0.3 }} />
          </div>
        </button>
      </div>

      <MobileMenuPortal open={open} onClose={() => setOpen(false)} go={go} />

    </header>
  );
}