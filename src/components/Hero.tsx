import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-10">
        <p className="font-inter-sans font-extralight text-lg text-blue">Showcasing creativity has never been easier.</p>

        <h1 className="mt-6 font-grotesk font-extrabold text-6xl md:text-[200px] leading-[0.85] tracking-tight text-blue">
          WELCOME<br/>ARTISTS.
        </h1>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="relative aspect-[3/4] bg-neutral-200">
            <Image src="/hero1.jpg" alt="preview 1" fill className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] bg-neutral-200">
            <Image src="/hero2.jpg" alt="preview 2" fill className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] bg-neutral-200">
            <Image src="/hero3.jpg" alt="preview 3" fill className="object-cover" />
          </div>
          <div className="relative aspect-[3/4] bg-neutral-200">
            <Image src="/hero4.jpg" alt="preview 4" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
