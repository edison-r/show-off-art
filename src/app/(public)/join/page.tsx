"use client"

import { useState } from "react";
import { useNavigationHelper } from '../../../../hooks/useNavigationHelper';
import Header from "../../components/Header";
import { PageWrapper } from "../../components/PageWrapper";

export default function JoinPage() {
    const { navigateWithTransition } = useNavigationHelper();

    return (
        <div className="relative min-h-screen overflow-hidden">
            <main>
                <Header />
                <PageWrapper
                    backgroundColor="green"
                    className="min-h-screen bg-green-50 text-foreground flex flex-col items-center justify-center transform-gpu"
                >
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-green-800">
                            Join Us!
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-green-600 leading-relaxed">
                            Únete a nuestra comunidad de creadores y diseñadores. 
                            Descubre oportunidades increíbles para mostrar tu talento.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-bold mb-3 text-green-700">Portfolio</h3>
                                <p className="text-gray-600">Muestra tu trabajo a miles de usuarios</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-bold mb-3 text-green-700">Network</h3>
                                <p className="text-gray-600">Conecta con otros profesionales</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-bold mb-3 text-green-700">Opportunities</h3>
                                <p className="text-gray-600">Encuentra proyectos y colaboraciones</p>
                            </div>
                        </div>

                        <div className="space-x-4">
                            <button className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                                Comenzar ahora
                            </button>
                            <button 
                                onClick={() => navigateWithTransition('/', { 
                                    direction: 'up', 
                                    color: 'black',
                                    duration: 1000
                                })}
                                className="px-8 py-4 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                            >
                                ← Volver al inicio
                            </button>
                        </div>
                    </div>
                </PageWrapper>
            </main>
        </div>
    );
}