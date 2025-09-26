"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setShowSplash(false), 8000);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {showSplash && (
        <SplashScreen
          totalDurationMs={6500} // ajusta 6000–7000ms a tu gusto
          onFinish={() => setShowSplash(false)}
        />
      )}

      {/* Landing real */}
      <main
        className={`min-h-screen transition-opacity duration-500 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* TODO: tu landing/hero/sections */}
        <section className="flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div><div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div><div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div><div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div><div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div><div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div><div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div><div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
          <div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div><div className="max-w-3xl px-6 text-center text-blue">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Show-Off<span className="opacity-50">.art</span>
            </h1>
            <p className="mt-4 text-base md:text-lg">
              Portfolio templates crafted for creators. Publish your work in minutes.
            </p>
          </div>
        </section>
        
        {/* ...resto de la homepage */}
      </main>
    </>
  );
}
