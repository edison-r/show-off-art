import Link from "next/link";

export default function Contact() {
  return (
    <section id="contact" className="md:px-16 xl:px-24 px-4 mt-50">
      <div className="mx-auto mb-16">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="md:col-span-2">
            <h3 className="font-titles font-extrabold text-[8vw]">SAY HI!</h3>
          </div>

          <div className="space-y-4 -mt-16">
            <h4 className="font-mono text-sm md:text-md mb-8">Contact us</h4>
            <p className="font-light text-xl">
              Tell us about your project.<br></br> Let’s collaborate and make great stuff.
            </p>

            <div className="flex flex-row gap-20 font-mono text-sm">
              <Link href="mailto:hello@showoff.dev" className="relative font-mono text-sm group"> 
              Write us
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-footer-gray transition-all duration-500 group-hover:w-full"></span>
              </Link>

              <a href="tel:+34600100800" className="relative font-mono text-sm group">
              +34 600 100 800
              <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-footer-gray transition-all duration-500 group-hover:w-full"></span>
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
