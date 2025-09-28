import Link from "next/link";

export default function Contact() {
  return (
    <section id="contact" className="md:px-16 xl:px-24 px-4 mt-48 bg-neutral-900 text-neutral-50">
      <div className="mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="md:col-span-2">
            <h3 className="font-grotesk text-6xl md:text-7xl">SAY HI!</h3>
          </div>

          <div className="space-y-4">
            <h4 className="font-grotesk text-xl">Contact us</h4>
            <p className="text-neutral-300 text-sm">
              Tell us about your project. Let’s collaborate and make great stuff.
            </p>

            <div className="flex flex-col gap-2 text-sm">
              <Link href="mailto:hello@showoff.dev" className="underline">hello@showoff.dev</Link>
              <a href="tel:+34600100800" className="underline">+34 600 100 800</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
