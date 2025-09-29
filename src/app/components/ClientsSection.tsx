"use client"

export default function ClientsSection(){
  return (
    <section className="relative mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 sm:py-16 md:py-18" >
      <h2 className="font-titles font-extrabold text-[10vw] sm:text-[8vw] md:text-[7vw] lg:text-[8vw] leading-[0.8] mb-12 sm:mb-16 md:mb-18">
        OUR MISSION & <br /> OUR STYLE
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="hidden md:block"></div>
        <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl font-light leading-relaxed">
          <p>
            Our mission is simple: to empower artists with the tools to showcase
            their talent in the most authentic way. 
            We believe portfolios should be more than just galleries, they 
            should tell stories, spark connections, and open doors.
          </p>
          <p>
            Our style blends minimal design with bold personality, 
            creating spaces where your work takes center stage. 
            Every template is built with clarity, creativity, and impact 
            in mind, so your art speaks louder than words.
          </p>
        </div>
      </div>

      <div className="mt-16 sm:mt-20 md:mt-24">
        <p className="font-mono text-xs sm:text-sm md:text-md mb-10 sm:mb-12 md:mb-16">
          Trusted by creators collaborating with:
        </p>
        <p className="ml-2 sm:ml-4 md:ml-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
          Barcelona Activa / IT Academy / 42Barcelona / Adobe / Figma / A24 / VICE Media 
          / MoMA / Tate Modern / Puma / Off-White / Spotify / Sony Music 
        </p>
      </div>
    </section>
  );
}