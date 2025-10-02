"use client";

import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

export default function PortfolioNotFound() {
  const { navigateWithTransition } = useNavigationHelper();

  return (
    <main className="min-h-screen bg-[var(--footer)] text-[var(--footer-gray)]">
      <Header />

      <section className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-titles font-extrabold text-[20vw] sm:text-[15vw] md:text-[12vw] leading-[0.8] mb-8 text-neutral-200 select-none">
            404
          </h1>

          <div className="space-y-6 mb-12">
            <h2 className="font-titles text-3xl md:text-4xl font-bold">
              Portfolio not found
            </h2>
            <p className="text-lg md:text-xl font-light text-neutral-600 max-w-xl mx-auto">
              {`This portfolio doesn't exist, is private, or has been removed.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigateWithTransition("/home", { 
                direction: "down", 
                color: "var(--blue-gray)",
                duration: 1200
              })}
              className="font-mono px-8 py-4 rounded-lg cursor-pointer bg-[var(--footer)] text-[var(--footer-gray)] border border-[var(--footer-gray)] hover:bg-[var(--footer-gray)]/50 hover:text-[var(--footer)] transition-colors font-semibold"
            >
              ← Back to home
            </button>
          </div>

          <div className="mt-16 p-6">
            <p className="font-mono text-sm mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigateWithTransition("/auth/join", { 
                  direction: "down", 
                  color: "var(--olive)",
                  duration: 1200
                })}
                className="font-mono text-sm px-4 py-2 rounded-lg cursor-pointer bg-[var(--footer)] text-[var(--footer-gray)] border border-[var(--footer-gray)] hover:bg-[var(--footer-gray)]/50 hover:text-[var(--footer)] transition-colors font-semibold"
              >
                Create your portfolio
              </button>
              <button
                onClick={() => navigateWithTransition("/about", { 
                  direction: "down", 
                  color: "var(--apple)",
                  duration: 1200
                })}
                className="font-mono text-sm px-4 py-2 rounded-lg cursor-pointer bg-[var(--footer)] text-[var(--footer-gray)] border border-[var(--footer-gray)] hover:bg-[var(--footer-gray)]/50 hover:text-[var(--footer)] transition-colors font-semibold"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}