"use client";

import Header from "@app/components/layout/Header";
import Footer from "@app/components/layout/Footer";
import { PageWrapper } from "@app/components/shared/PageWrapper";

const team = [
  { name: "Alex Johnson", role: "Founder & Creative Director", image: "/hero1.jpg" },
  { name: "Maria Garcia", role: "Lead Designer", image: "/hero2.jpg" },
  { name: "James Chen", role: "Developer", image: "/hero3.jpg" },
  { name: "Sophie Martin", role: "Product Manager", image: "/hero4.jpg" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      
      <PageWrapper>
        <section className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 md:py-20">
          {/* Hero */}
          <div className="mb-20">
            <h1 className="font-titles font-extrabold text-[12vw] sm:text-[10vw] md:text-[8vw] leading-[0.8] mb-8">
              ABOUT US
            </h1>
            <p className="text-2xl md:text-4xl font-light max-w-4xl leading-tight">
              We're a team of designers, developers, and creators 
              helping artists showcase their work to the world.
            </p>
          </div>

          {/* Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            <div>
              <h2 className="font-titles text-3xl md:text-4xl font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg font-light leading-relaxed">
                <p>
                  Founded in 2023, Show-off was born from a simple idea: 
                  every artist deserves a beautiful platform to share their work.
                </p>
                <p>
                  We've worked with hundreds of creatives—photographers, designers, 
                  illustrators, and more—to build portfolios that truly represent 
                  their unique style and vision.
                </p>
                <p>
                  Today, we're proud to be the go-to platform for artists 
                  who want more than just a template. They want a home for their art.
                </p>
              </div>
            </div>
            
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100">
              <img 
                src="/hero1.jpg" 
                alt="Team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mission & Values */}
          <div className="mb-24">
            <h2 className="font-titles text-3xl md:text-4xl font-bold mb-12">
              What We Believe
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-neutral-50 rounded-xl">
                <h3 className="font-titles text-xl font-bold mb-3">
                  Design First
                </h3>
                <p className="text-neutral-600">
                  Beautiful, functional design should be accessible to everyone, 
                  not just those with technical skills.
                </p>
              </div>
              
              <div className="p-6 bg-neutral-50 rounded-xl">
                <h3 className="font-titles text-xl font-bold mb-3">
                  Artist-Centric
                </h3>
                <p className="text-neutral-600">
                  We build for creators, by creators. Your work should always 
                  be the star of the show.
                </p>
              </div>
              
              <div className="p-6 bg-neutral-50 rounded-xl">
                <h3 className="font-titles text-xl font-bold mb-3">
                  Continuous Growth
                </h3>
                <p className="text-neutral-600">
                  We're always learning, iterating, and improving based on 
                  feedback from our community.
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="font-titles text-3xl md:text-4xl font-bold mb-12">
              Meet The Team
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.name} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-neutral-100">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="font-mono text-sm text-neutral-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-24 text-center">
            <h2 className="font-titles text-4xl md:text-5xl font-bold mb-6">
              Join our community
            </h2>
            <p className="text-lg mb-8 text-neutral-600">
              Start building your portfolio today
            </p>
            <button className="px-8 py-4 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors font-semibold">
              Get started
            </button>
          </div>
        </section>
      </PageWrapper>

      <Footer />
    </main>
  );
}