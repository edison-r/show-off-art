"use client";

import ParallaxItem from "./ParallaxItem";

export default function Hero() {
  return (
    <section className="relative py-8 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 overflow-visible">
      <div className="mx-auto pt-6 sm:pt-8 md:pt-10">
        <p className="relative z-20 font-mono font-light text-base sm:text-lg md:text-xl">
          Showcasing creativity has never been easier.
        </p>

        <div className="relative mt-8 sm:mt-10">
          <h1 className="relative z-10 font-titles font-extrabold text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[16vw] leading-[0.75] select-none mt-24 sm:mt-32 md:mt-40 lg:mt-48 ml-2 sm:ml-4 md:ml-6">
            WELCOME<br />ARTISTS
          </h1>
          <div className="pointer-events-none relative h-[45vw] sm:h-[40vw] md:h-[32vw] lg:h-[28vw] xl:h-[24vw]">
            <ParallaxItem
              src="/hero1.jpg"
              alt="preview 1"
              speed={-2}
              className="absolute z-20 left-[8vw] sm:left-[10vw] top-[0vw] w-[24vw] sm:w-[20vw] aspect-[3/4] overflow-hidden"
            />
            <ParallaxItem
              src="/hero2.jpg"
              alt="preview 2"
              speed={-4}
              className="absolute z-20 left-[60vw] sm:left-[65vw] top-[-15vw] sm:top-[-18vw] w-[26vw] sm:w-[22vw] aspect-[3/4] overflow-hidden"
            />
            <ParallaxItem
              src="/hero4.jpg"
              alt="preview 3"
              speed={-1}
              className="absolute z-0 right-[30vw] sm:right-[35vw] top-[-30vw] sm:top-[-35vw] w-[18vw] sm:w-[15vw] aspect-[3/4] overflow-hidden"
            />
            <ParallaxItem
              src="/hero3.jpg"
              alt="preview 4"
              speed={0}
              className="absolute left-[-8vw] sm:left-[-10vw] top-[-30vw] sm:top-[-35vw] w-[18vw] sm:w-[15vw] aspect-[3/4] overflow-hidden"
            />
          </div>
        </div>
        <div className="-mt-8 sm:-mt-10 md:mt-8 lg:mt-14 max-w-6xl">
          <p className="mb-10 sm:mb-12 md:mb-14 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight">
            With our platform, artists and creators can build a professional portfolio designed to highlight
            your work, your style, and your journey.
          </p>
        </div>
      </div>
    </section>
  );
}