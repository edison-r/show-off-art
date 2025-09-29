"use client";

import ParallaxItem from "./ParallaxItem";

export default function Hero() {
  return (
    <section className="relative py-8 md:px-16 xl:px-24 px-4 overflow-visible">
      <div className="mx-auto px-4 pt-10">
        <p className="relative z-20 font-light text-xl text-blue">
          Showcasing creativity has never been easier.
        </p>

        <div className="relative mt-10">
          <h1 className="relative z-10 font-titles font-extrabold text-[16vw] leading-[0.75] text-blue select-none mt-48 ml-6">
            WELCOME<br />ARTISTS
          </h1>
          <div className="pointer-events-none relative h-[40vw] md:h-[24vw]">
            <ParallaxItem
              src="/hero1.jpg"
              alt="preview 1"
              speed={-2}
              className="absolute z-20 left-[10vw] top-[0vw] w-[20vw] aspect-[3/4] overflow-hidden"
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
              className="absolute z-0 right-[35vw] top-[-35vw] w-[15vw] aspect-[3/4] overflow-hidden"
            />
            <ParallaxItem
              src="/hero3.jpg"
              alt="preview 1"
              speed={0}
              className="absolute left-[-10vw] top-[-35vw] w-[15vw] aspect-[3/4] overflow-hidden"
            />
          </div>
        </div>
        <div className="-mt-14 md:mt-14 max-w-6xl">
          <p className="mb-14 text-2xl md:text-5xl font-light leading-tight text-blue">
            With our platform, artists and creators can build a professional portfolio designed to highlight
            your work, your style, and your journey.
          </p>
        </div>
      </div>
    </section>
  );
}
