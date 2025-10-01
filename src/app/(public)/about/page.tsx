"use client";

import Header from "@app/components/layout/Header";
import Footer from "@app/components/layout/Footer";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { PageWrapper } from "@app/components/shared/PageWrapper";

/* const team = [
  { name: "Edison Ronquillo", role: "Founder & Creative Director", image: "/hero1.jpg" },
  { name: "Maria Garcia", role: "Lead Designer", image: "/hero2.jpg" },
  { name: "James Chen", role: "Developer", image: "/hero3.jpg" },
  { name: "Sophie Martin", role: "Product Manager", image: "/hero4.jpg" },
]; */

export default function AboutPage() {
    const { navigateWithTransition } = useNavigationHelper();

    return (
        <main className="min-h-screen bg-[var(--apple)] text-[var(--apple-cream)]">
        <Header />
        
        <PageWrapper>
            <section className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 md:py-20">
            <div className="mb-20">
                <h1 className="font-titles font-extrabold text-[16vw] sm:text-[14vw] md:text-[14vw] leading-[0.8] mb-8">
                ABOUT US
                </h1>
                <p className="text-2xl md:text-4xl font-light max-w-4xl leading-tight">
                We are a team of designers, developers, and creators 
                helping artists showcase their work to the world.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                <div className="pointer-events-none hidden md:block"></div>
                <div>
                    <h2 className="font-titles text-3xl md:text-4xl font-bold mb-6">
                        Our Story
                    </h2>
                    <div className="space-y-4 text-lg font-light leading-relaxed">
                        <p>
                        Founded in 2025, Show-off was born from a simple idea: 
                        every artist deserves a beautiful platform to share their work.
                        </p>
                        <p>
                        {`We've worked with hundreds of creatives—photographers, designers, 
                        illustrators, and more—to build portfolios that truly represent 
                        their unique style and vision.`}
                        </p>
                        <p>
                        Today, we are proud to be the go-to platform for artists 
                        who want more than just a template. They want a home for their art.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-24">
                <h2 className="font-titles text-4xl md:text-5xl font-bold mb-12">
                What We Believe
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6">
                    <h3 className="font-titles text-2xl font-bold mb-3">
                    Design First
                    </h3>
                    <p>
                    Beautiful, functional design should be accessible to everyone, 
                    not just those with technical skills.
                    </p>
                </div>
                
                <div className="p-6">
                    <h3 className="font-titles text-2xl font-bold mb-3">
                    Artist-Centric
                    </h3>
                    <p>
                    We build for creators, by creators. Your work should always 
                    be the star of the show.
                    </p>
                </div>
                
                <div className="p-6">
                    <h3 className="font-titles text-2xl font-bold mb-3">
                    Continuous Growth
                    </h3>
                    <p>
                    We are always learning, iterating, and improving based on 
                    feedback from our community.
                    </p>
                </div>
                </div>
            </div>

            {/*<div>
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
                    <p className="font-mono text-sm">{member.role}</p>
                    </div>
                ))}
                </div>
            </div>*/}

            <div className="mt-20 text-center">
                <h2 className="font-titles font-extrabold text-6xl md:text-7xl mb-6">
                    Join our community
                </h2>
                <p className="text-xl mb-8">
                    Start building your portfolio today
                </p>
                <button 
                    onClick={() => navigateWithTransition("/auth/join", {
                        direction: "down",
                        color: "var(--olive)",
                        duration: 1200
                    })}
                    className="font-mono px-8 py-4 rounded-lg cursor-pointer bg-[var(--apple)] text-[var(--apple-cream)] border border-[var(--apple-cream)] hover:bg-[var(--apple-cream)]/50 hover:text-[var(--apple)] transition-colors font-semibold"
                >
                    Get started
                </button>
            </div>
            </section>
        </PageWrapper>

        <Footer />
        </main>
    );
}