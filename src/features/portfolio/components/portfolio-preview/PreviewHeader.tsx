'use client';

import Link from 'next/link';

interface PreviewHeaderProps {
    portfolioSlug: string;
}

export function PreviewHeader({ portfolioSlug }: PreviewHeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
            <Link 
                href={`/dashboard/${portfolioSlug}`}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a editar
            </Link>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-mono font-medium rounded-full">
                PREVIEW
            </span>
            </div>
        </div>
        </header>
    );
}