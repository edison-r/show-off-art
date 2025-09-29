"use client"

import { useState } from "react";
import { useNavigationHelper } from '../../../hooks/useNavigationHelper';
import Header from "@/components/Header";
import { PageWrapper } from "../../components/PageWrapper";

export default function ContactPage() {
    const { navigateWithTransition } = useNavigationHelper();

    return (
        <div className="relative min-h-screen overflow-hidden">
            <main>
                <Header />
                <PageWrapper
                    backgroundColor="yellow"
                    className="min-h-screen bg-yellow-50 text-foreground transform-gpu"
                >
                    <div className="max-w-4xl mx-auto px-6 py-16">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-yellow-800">
                                Contáctanos
                            </h1>
                            <p className="text-xl md:text-2xl text-yellow-600 leading-relaxed">
                                ¿Tienes alguna pregunta o quieres colaborar? 
                                Estamos aquí para ayudarte.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Formulario */}
                            <div className="bg-white p-8 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold mb-6 text-yellow-700">Envíanos un mensaje</h2>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input 
                                            type="email" 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                                        <textarea 
                                            rows={5}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                            placeholder="Cuéntanos en qué podemos ayudarte..."
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit"
                                        className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                                    >
                                        Enviar mensaje
                                    </button>
                                </form>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 text-yellow-700">Información de contacto</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-yellow-200 rounded-full flex-shrink-0 mt-1"></div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Email</h3>
                                                <p className="text-gray-600">hello@show-off.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-yellow-200 rounded-full flex-shrink-0 mt-1"></div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Teléfono</h3>
                                                <p className="text-gray-600">+1 (555) 123-4567</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="w-6 h-6 bg-yellow-200 rounded-full flex-shrink-0 mt-1"></div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Ubicación</h3>
                                                <p className="text-gray-600">Barcelona, España</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="font-semibold text-yellow-700 mb-3">Síguenos</h3>
                                    <div className="flex space-x-4">
                                        <div className="w-10 h-10 bg-yellow-200 rounded-full"></div>
                                        <div className="w-10 h-10 bg-yellow-200 rounded-full"></div>
                                        <div className="w-10 h-10 bg-yellow-200 rounded-full"></div>
                                        <div className="w-10 h-10 bg-yellow-200 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <button 
                                onClick={() => navigateWithTransition('/', { 
                                    direction: 'right', 
                                    color: 'black',
                                    duration: 1600
                                })}
                                className="px-8 py-4 border border-yellow-600 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors font-semibold"
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