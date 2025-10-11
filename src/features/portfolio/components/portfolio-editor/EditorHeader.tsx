'use client';

import Link from 'next/link';
import { CreateProjectButton } from './CreateProjectButton';

interface EditorHeaderProps {
    portfolioTitle: string;
    portfolioSlug: string;
    portfolioId: string;
    projectCount: number;
}

export function EditorHeader({ 
    portfolioTitle, 
    portfolioSlug, 
    portfolioId,
    projectCount 
}: EditorHeaderProps) {
    return (
        <div className="mb-8">
        {/* Navegación y título */}
        <div className="flex items-center justify-between mb-4">
            <div>
            <Link 
                href="/dashboard"
                className="font-mono text-sm text-[var(--blue)] hover:text-neutral-900 mb-2 inline-flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al Dashboard
            </Link>
            <h1 className="font-titles text-3xl md:text-4xl font-bold mt-2">
                {portfolioTitle}
            </h1>
            <p className="font-mono text-sm text-[var(--blue)] mt-1">
                /{portfolioSlug}
            </p>
            </div>

            <Link
            href={`/preview/${portfolioSlug}`}
            className="text-[var(--blue)] px-4 py-2 border border-[var(--blue)] rounded-lg font-medium hover:bg-neutral-50 hover:text-black hover:border-black transition-colors inline-flex items-center gap-2"
            >
            Vista Previa
            </Link>
        </div>

        {/* Card con información de proyectos */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
            <div className="flex-1">
                <h2 className="font-titles text-xl font-bold mb-2">Proyectos</h2>
                <p className="text-sm text-neutral-600">
                {projectCount} de 6 proyectos creados
                </p>
            </div>
            <CreateProjectButton 
                portfolioId={portfolioId}
                portfolioSlug={portfolioSlug}
            />
            </div>
        </div>
        </div>
    );
}