"use client";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";

export default function Header() {
  const { navigateWithTransition } = useNavigationHelper();

  return (
    <header className="sticky w-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 z-40 top-0 start-0 border-b border-blue/50 backdrop-blur-md">
      <div className="font-mono font-extralight mx-auto py-3 flex items-center justify-between">
        <button 
          onClick={() => navigateWithTransition('/', { 
            direction: 'down', 
            color: 'black',
            duration: 1000 
          })}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded bg-blue text-blue-gray font-titles text-xs">S</span>
          <span className="font-titles tracking-wide text-sm sm:text-base">show-off</span>
        </button>
        
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs sm:text-sm">
          <button 
            onClick={() => navigateWithTransition('/work', { 
              direction: 'down', 
              color: 'purple',
              duration: 1000
            })}
            className="hover:underline cursor-pointer"
          >
            Work
          </button>
          <button 
            onClick={() => navigateWithTransition('/about', { 
              direction: 'down', 
              color: 'blue',
              duration: 1000
            })}
            className="hover:underline cursor-pointer"
          >
            About
          </button>
          <button 
            onClick={() => navigateWithTransition('/contact', { 
              direction: 'down', 
              color: 'yellow',
              duration: 1000
            })}
            className="hover:underline cursor-pointer"
          >
            Contact
          </button>
        </nav>
        
        <button
          onClick={() => navigateWithTransition('/join', { 
            direction: 'down', 
            color: 'green',
            duration: 1000
          })}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-neutral-300 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm hover:bg-neutral-200"
        >
          join us
        </button>
      </div>
    </header>
  );
}