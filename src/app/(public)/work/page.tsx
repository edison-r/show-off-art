// /work/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigationHelper } from "@/hooks/useNavigationHelper";
import { PageWrapper } from "@app/components/shared/PageWrapper";

import Header from "@app/components/layout/Header";
import Footer from "@app/components/layout/Footer";

const projects = [
  { id: 1, title: "Minimal Portfolio", category: "Web Design", image: "/images/tpl1.jpg" },
  { id: 2, title: "Brand Identity", category: "Branding", image: "/images/tpl2.jpg" },
  { id: 3, title: "Photography Series", category: "Photography", image: "/images/tpl3.jpg" },
  { id: 4, title: "App Interface", category: "UI/UX", image: "/images/tpl1.jpg" },
  { id: 5, title: "Editorial Design", category: "Print", image: "/images/tpl2.jpg" },
  { id: 6, title: "Motion Graphics", category: "Animation", image: "/images/tpl3.jpg" },
];

export default function WorkPage() {
    const [filter, setFilter] = useState("all");
    const { navigateWithTransition } = useNavigationHelper();


    const categories = ["all", "Web Design", "Branding", "Photography", "UI/UX", "Print", "Animation"];
    
    const filteredProjects = filter === "all" 
        ? projects 
        : projects.filter(p => p.category === filter);

    return (
        <main className="min-h-screen bg-[var(--superblue)] text-[var(--superblue-gray)]">
        <Header />
        
        <PageWrapper>
            <section className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 md:py-20">
            <div className="mb-16">
                <h1 className="font-titles font-extrabold text-[16vw] sm:text-[14vw] md:text-[14vw] leading-[0.8] mb-6">
                OUR WORK
                </h1>
                <p className="text-xl md:text-2xl font-light max-w-3xl">
                A curated selection of projects showcasing creativity, 
                craftsmanship, and collaboration with talented artists worldwide.
                </p>
            </div>

            <div className="mb-12 flex flex-wrap gap-3">
                {categories.map((c) => (
                <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`px-4 py-2 rounded-sm cursor-pointer border border-[var(--superblue-gray)] font-mono text-sm transition-colors ${
                    filter === c
                        ? "bg-[var(--superblue-gray)] text-[var(--superblue)]"
                        : "bg-[var(--superblue)] hover:bg-[var(--superblue-gray)]/50 hover:text-[var(--superblue)]"
                    }`}
                >
                    {c}
                </button>
                ))}
            </div>

            <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
                {filteredProjects.map((project) => (
                <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group"
                >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4 bg-neutral-100">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <h3 className="font-mono text-lg mb-1">
                    {project.category}
                    </h3>
                </motion.article>
                ))}
            </motion.div>

            <div className="mt-20 text-center">
                <h2 className="font-titles font-extrabold text-6xl md:text-7xl mb-6">
                Want to work with us?
                </h2>
                <p className="text-xl mb-8">
                Let's create something amazing together
                </p>
                <button 
                    onClick={() => navigateWithTransition('/auth/join', {
                        direction: 'down',
                        color: "var(--olive)",
                        duration: 1200
                    })}
                    className="font-mono px-8 py-4 rounded-lg cursor-pointer bg-[var(--superblue)] text-[var(--superblue-gray)] border border-[var(--superblue-gray)] hover:bg-[var(--superblue-gray)]/50 hover:text-[var(--superblue)] transition-colors font-semibold"
                >
                Start a project
                </button>
            </div>
            </section>
        </PageWrapper>

        <Footer />
        </main>
    );
}