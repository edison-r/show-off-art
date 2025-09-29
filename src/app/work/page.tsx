"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigationHelper } from '../../../hooks/useNavigationHelper';
import Header from "@/components/Header";
import { PageWrapper } from "../../components/PageWrapper";

export default function WorkPage() {
    const { navigateWithTransition } = useNavigationHelper();
    const [doParallax, setDoParallax] = useState(true);

    const projects = [
        { id: 1, title: "Brand Identity Design", category: "Branding", color: "bg-purple-100", textColor: "text-purple-800" },
        { id: 2, title: "Mobile App UI/UX", category: "Digital", color: "bg-orange-100", textColor: "text-orange-800" },
        { id: 3, title: "Photography Series", category: "Photography", color: "bg-pink-100", textColor: "text-pink-800" },
        { id: 4, title: "Web Development", category: "Development", color: "bg-indigo-100", textColor: "text-indigo-800" },
        { id: 5, title: "Illustration Collection", category: "Illustration", color: "bg-teal-100", textColor: "text-teal-800" },
        { id: 6, title: "3D Animation", category: "Motion", color: "bg-red-100", textColor: "text-red-800" }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden">
            <main>
                <Header />
                <PageWrapper
                    backgroundColor="purple"
                    className="min-h-screen bg-purple-50 text-foreground transform-gpu"
                >
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-purple-800">
                                Nuestro Trabajo
                            </h1>
                            <p className="text-xl md:text-2xl text-purple-600 leading-relaxed max-w-3xl mx-auto">
                                Explora una selección curada de proyectos excepcionales 
                                creados por nuestra comunidad de talentosos artistas.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {projects.map((project) => (
                                <div key={project.id} className={`${project.color} p-8 rounded-lg hover:scale-105 transition-transform cursor-pointer`}>
                                    <div className="aspect-square bg-white rounded-md mb-4 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${project.textColor}`}>
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm uppercase tracking-wide">
                                        {project.category}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <div className="space-x-4">
                                <button className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                                    Ver todos los proyectos
                                </button>
                                <button 
                                    onClick={() => navigateWithTransition('/', { 
                                        direction: 'left', 
                                        color: 'black',
                                        duration: 1600
                                    })}
                                    className="px-8 py-4 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
                                >
                                    ← Inicio
                                </button>
                            </div>
                        </div>
                    </div>
                </PageWrapper>
            </main>
        </div>
    );
}