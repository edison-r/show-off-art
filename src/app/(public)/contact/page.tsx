"use client";

import Header from "@app/components/layout/Header";
import Footer from "@app/components/layout/Footer";
import { PageWrapper } from "@app/components/shared/PageWrapper";
import { Input } from "@/app/components/ui/input";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--footer)] text-[var(--footer-gray)]">
      <Header />
      
      <PageWrapper>
        <section className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Info */}
            <div>
              <h1 className="font-titles font-extrabold text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[10vw] leading-[0.8] mb-8">
                {`LET'S TALK`}
              </h1>
              
              <p className="text-xl md:text-2xl font-light mb-12 leading-relaxed">
                Have a project in mind? Want to collaborate?<br />
                {`Or just want to say hi? We'd love to hear from you.`}
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="font-mono text-sm mb-3 text-neutral-500">EMAIL</h3>
                  <a 
                    href="mailto:hello@show-off.com" 
                    className="text-xl md:text-2xl hover:text-blue transition-colors"
                  >
                    hello@show-off.com
                  </a>
                </div>

                <div>
                  <h3 className="font-mono text-sm mb-3 text-neutral-500">PHONE</h3>
                  <a 
                    href="tel:+34600100800" 
                    className="text-xl md:text-2xl hover:text-blue transition-colors"
                  >
                    +34 600 100 800
                  </a>
                </div>

                <div>
                  <h3 className="font-mono text-sm mb-3 text-neutral-500">LOCATION</h3>
                  <p className="text-xl md:text-2xl">
                    Barcelona, Spain
                  </p>
                </div>

                <div>
                  <h3 className="font-mono text-sm mb-3 text-neutral-500">SOCIAL</h3>
                  <div className="flex gap-6 text-lg">
                    <a href="#" className="hover:text-blue transition-colors">Instagram</a>
                    <a href="#" className="hover:text-blue transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-blue transition-colors">Behance</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pt-32">
              <form className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium block">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium block">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium block">
                    Company (optional)
                  </label>
                  <Input
                    id="company"
                    placeholder="Your company"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium block">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us about your project..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-lg bg-[var(--footer-gray)] text-[var(--footer)] border border-[var(--footer-gray)] hover:bg-[var(--footer-gray)]/50 transition-colors font-semibold"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </section>
      </PageWrapper>

      <Footer />
    </main>
  );
}