import ParallaxItem from "./ParallaxItem";

export default function Impact() {
  return (
    <section id="about" className="relative mx-auto md:px-16 xl:px-24 px-4 py-8 overflow-visible">
      <h2 className="relative z-10 font-titles font-extrabold text-[8vw] leading-[0.75] select-none mt-10">
        LASTING FIRST<br/>IMPRESSIONS.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="pointer-events-none">
            {/* <ParallaxItem
              src="/rand1.jpg"
              alt="random image"
              speed={-1}
              className="absolute z-0 left-[-5vw] top-[15vw] w-[20vw] aspect-[3/4] overflow-hidden"
            />
            <ParallaxItem
              src="/rand2.jpg"
              alt="random image"
              speed={-2}
              className="absolute z-0 left-[10vw] top-[25vw] w-[20vw] aspect-[3/4] overflow-hidden"
            /> */}
          </div>
        <div className="mt-24 text-lg md:text-xl font-light leading-tight">
          <p>
            That’s why our platform focuses on delivering beautiful, accessible, and professional portfolios that leave a mark.
          </p><br></br>
          <p>
            From sleek templates to intuitive customization, we give creators everything they need to go from concept to showcase.
          </p><br></br>
          <p>
            Behind the product is a team of designers, developers, and creators who believe in empowering artists to be seen, shared, and celebrated.
          </p>
        </div>
      </div>
    </section>
  );
}
