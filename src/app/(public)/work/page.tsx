// /work/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@app/components/layout/Header";
import Footer from "@app/components/layout/Footer";
import { PageWrapper } from "@app/components/shared/PageWrapper";

const projects = [
  { id: 1, title: "Minimal Portfolio", category: "Web Design", image: "/tpl1.jpg" },
  { id: 2, title: "Brand Identity", category: "Branding", image: "/tpl2.jpg" },
  { id: 3, title: "Photography Series", category: "Photography", image: "/tpl3.jpg" },
  { id: 4, title: "App Interface", category: "UI/UX", image: "/tpl4.jpg" },
  { id: 5, title: "Editorial Design", category: "Print", image: "/tpl1.jpg" },
  { id: 6, title: "Motion Graphics", category: "Animation", image: "/tpl2.jpg" },
];

export default function WorkPage() {
    const [filter, setFilter] = useState("all");

    const categories = ["all", "Web Design", "Branding", "Photography", "UI/UX", "Print", "Animation"];
    
    const filteredProjects = filter === "all" 
        ? projects 
        : projects.filter(p => p.category === filter);

    return (
        <main className="min-h-screen bg-background text-foreground">
        <Header />
        
        <PageWrapper>
            <section className="relative px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 md:py-20">
            {/* Hero */}
            <div className="mb-16">
                <h1 className="font-titles font-extrabold text-[12vw] sm:text-[10vw] md:text-[8vw] leading-[0.8] mb-6">
                OUR WORK
                </h1>
                <p className="text-xl md:text-2xl font-light max-w-3xl">
                A curated selection of projects showcasing creativity, 
                craftsmanship, and collaboration with talented artists worldwide.
                </p>
            </div>

            {/* Filter */}
            <div className="mb-12 flex flex-wrap gap-3">
                {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                    filter === cat
                        ? "bg-blue text-white"
                        : "bg-neutral-100 hover:bg-neutral-200"
                    }`}
                >
                    {cat}
                </button>
                ))}
            </div>

            {/* Grid */}
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
                    className="group cursor-pointer"
                >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4 bg-neutral-100">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <h3 className="font-titles text-xl font-semibold mb-1">
                    {project.title}
                    </h3>
                    <p className="font-mono text-sm text-neutral-600">
                    {project.category}
                    </p>
                </motion.article>
                ))}
            </motion.div>

            {/* CTA */}
            <div className="mt-20 text-center">
                <h2 className="font-titles text-4xl md:text-5xl font-bold mb-6">
                Want to work with us?
                </h2>
                <p className="font-mono text-lg mb-8 text-neutral-600">
                Let's create something amazing together
                </p>
                <button className="px-8 py-4 bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors font-semibold">
                Start a project
                </button>
            </div>
            </section>
        </PageWrapper>

        <Footer />
        </main>
    );
}