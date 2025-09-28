import Image from "next/image";

export default function Impact() {
  return (
    <section id="about" className="mx-auto py-16">
      <h2 className="font-grotesk text-5xl md:text-7xl text-blue tracking-tight leading-none">
        LASTING FIRST<br/>IMPRESSIONS.
      </h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 grid grid-cols-2 gap-6">
          <div className="relative aspect-square bg-neutral-200">
            <Image src="/rand1.jpg" alt="impact 1" fill className="object-cover" />
          </div>
          <div className="relative aspect-square bg-neutral-200">
            <Image src="/rand2.jpg" alt="impact 2" fill className="object-cover" />
          </div>
        </div>

        <div className="space-y-4 text-blue">
          <p>
            That’s why our platform focuses on delivering beautiful, accessible, and professional portfolios that leave a mark.
          </p>
          <p>
            From sleek templates to intuitive customization, we give creators everything they need to go from concept to showcase.
          </p>
          <p>
            Behind the product is a team of designers, developers, and creators who believe in empowering artists to be seen, shared, and celebrated.
          </p>
        </div>
      </div>
    </section>
  );
}
