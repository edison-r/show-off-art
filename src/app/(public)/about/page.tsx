"use client"

import { useState } from "react";
import { useNavigationHelper } from '../../../../hooks/useNavigationHelper';
import Header from "../../components/Header";
import { PageWrapper } from "../../components/PageWrapper";

export default function AboutPage() {
    const { navigateWithTransition } = useNavigationHelper();

    return (
        <div className="relative min-h-screen overflow-hidden">
            <main>
                <Header />
                <PageWrapper
                    backgroundColor="blue"
                    className="min-h-screen bg-blue-50 text-foreground flex flex-col items-center justify-center transform-gpu"
                >
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-blue-800">
                                Acerca de Nosotros
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-600 leading-relaxed">
                                Somos una plataforma dedicada a conectar artistas y creadores 
                                con oportunidades increíbles para mostrar su talento al mundo.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-blue-700">Nuestra Misión</h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                                    Democratizar el acceso a oportunidades creativas y profesionales 
                                    para artistas, diseñadores y creadores de contenido.
                                </p>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Creemos que el talento no conoce fronteras y que cada creator 
                                    merece una plataforma para brillar.
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div>
                                        <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                                        <div className="text-gray-600">Artistas</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                                        <div className="text-gray-600">Proyectos</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                                        <div className="text-gray-600">Países</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                                        <div className="text-gray-600">Soporte</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button 
                                onClick={() => navigateWithTransition('/', { 
                                    direction: 'up', 
                                    color: '#E0E2DA',
                                    duration: 1000
                                })}
                                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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
