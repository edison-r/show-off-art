import Link from "next/link";

export default function Contact() {
  return (
    <section id="contact" className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 mt-20 sm:mt-34 md:mt-42">
      <div className="mx-auto mb-12 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-start">
          <div className="md:col-span-2">
            <h3 className="font-titles font-extrabold text-[12vw] sm:text-[10vw] md:text-[8vw]">SAY HI!</h3>
          </div>

          <div className="space-y-3 sm:space-y-4 md:-mt-16">
            <h4 className="font-mono text-xs sm:text-sm md:text-md mb-6 sm:mb-8">Contact us</h4>
            <p className="font-light text-lg sm:text-xl">
              Tell us about your project.<br />Let's collaborate and make great stuff.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 md:gap-20 font-mono text-xs sm:text-sm pt-4">
              <Link href="mailto:hello@showoff.dev" className="relative group"> 
                Write us
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-footer-gray transition-all duration-500 group-hover:w-full"></span>
              </Link>

              <a href="tel:+34600100800" className="relative group">
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
