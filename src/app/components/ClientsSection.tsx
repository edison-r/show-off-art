"use client";

export default function ClientsSection(){
  return (
    <section className="relative mx-auto px-4 md:px-16 xl:px-24 py-18" >
      <h2 className="font-titles font-extrabold text-[8vw] leading-[0.8] mb-18">
        OUR MISSION & <br /> OUR STYLE
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div></div>
            <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed">
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

      <div className="mt-24">
        <p className="font-mono text-sm md:text-md mb-16">
          Trusted by creators collaborating with:
        </p>
        <p className="ml-6 text-6xl font-light leading-tight">
            Barcelona Activa / IT Academy / 42Barcelona / Adobe / Figma / A24 / VICE Media 
            / MoMA / Tate Modern / Puma / Off-White / Spotify / Sony Music 
        </p>
      </div>
    </section>
  );
};
