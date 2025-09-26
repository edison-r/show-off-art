import Image from "next/image";

export default function Templates() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {["tpl1.jpg", "tpl2.jpg", "tpl3.jpg", "tpl4.jpg"].map((src, i) => (
          <article key={i} className="relative bg-white border border-neutral-200 shadow-sm">
            <div className="relative aspect-[3/4]">
              <Image src={`/${src}`} alt={`template ${i + 1}`} fill className="object-cover" />
            </div>
            <div className="p-3 text-sm text-neutral-600">
              <div className="font-grotesk text-neutral-900">Template {i + 1}</div>
              <div>Clean, flexible, and fast to customize.</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
