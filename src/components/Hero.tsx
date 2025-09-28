// app/components/Hero.tsx
"use client";

import Image from "next/image";
import ParallaxItem from "./ParallaxItem";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto px-4 pt-10">
        <p className="font-extralight text-lg text-blue">
          Showcasing creativity has never been easier.
        </p>

        <div className="relative mt-10">
          <h1 className="relative z-10 font-titles font-extrabold text-[16vw] leading-[0.75] text-blue select-none mt-48">
            WELCOME<br />ARTISTS
          </h1>
          <div className="pointer-events-none relative h-[40vw] md:h-[24vw]">
            <ParallaxItem
              src="/hero1.jpg"
              alt="preview 1"
              speed={-2}
              className="absolute z-20 left-[10vw] top-[-2vw] w-[20vw] aspect-[3/4] overflow-hidden"
            />
            <ParallaxItem
              src="/hero2.jpg"
              alt="preview 1"
              speed={-4}
              className="absolute z-20 left-[65vw] top-[-18vw] w-[22vw] aspect-[3/4] overflow-hidden"
            />
            <ParallaxItem
              src="/hero4.jpg"
              alt="preview 1"
              speed={-1}
              className="absolute z-0 right-[35vw] top-[-5vw] w-[15vw] aspect-[3/4] overflow-hidden"
            />
            <ParallaxItem
              src="/hero3.jpg"
              alt="preview 1"
              speed={0}
              className="absolute left-[0vw] top-[-35vw] w-[15vw] aspect-[3/4] overflow-hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
