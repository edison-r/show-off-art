// Header.tsx - FINAL CON TODAS LAS NAVEGACIONES
"use client";
import { useNavigationHelper } from "../../hooks/useNavigationHelper";

export default function Header() {
    const { navigateWithTransition } = useNavigationHelper();

    return (
        <header className="sticky top-0 z-40 bg-transparent backdrop-blur border-b border-blue-grey-ghost">
            <div className="text-blue mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <button 
                    onClick={() => navigateWithTransition('/', { 
                        direction: 'down', 
                        color: 'black',
                        duration: 1000 
                    })}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white font-mono text-xs">S</span>
                    <span className="font-grotesk tracking-wide">show-off</span>
                </button>
                
                <nav className="hidden md:flex items-center gap-6 text-sm">
                    <button 
                        onClick={() => navigateWithTransition('/work', { 
                            direction: 'down', 
                            color: 'purple',
                            duration: 1000
                        })}
                        className="hover:underline"
                    >
                        Work
                    </button>
                    <button 
                        onClick={() => navigateWithTransition('/about', { 
                            direction: 'down', 
                            color: 'blue',
                            duration: 1000
                        })}
                        className="hover:underline"
                    >
                        About
                    </button>
                    <button 
                        onClick={() => navigateWithTransition('/contact', { 
                            direction: 'down', 
                            color: 'yellow',
                            duration: 1000
                        })}
                        className="hover:underline"
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
                    className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-200"
                >
                    join us
                </button>
            </div>
        </header>
    );
}