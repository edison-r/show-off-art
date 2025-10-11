'use client';

import { CreateProjectButton } from './CreateProjectButton';

interface EmptyProjectsStateProps {
    portfolioId: string;
    portfolioSlug: string;
}

export function EmptyProjectsState({ 
    portfolioId, 
    portfolioSlug 
}: EmptyProjectsStateProps) {
    return (
        <div className="text-center py-20 bg-white rounded-xl border border-neutral-200">
        <h3 className="font-titles text-2xl font-bold mb-2">
            No hay proyectos aún
        </h3>
        <p className="text-neutral-600 mb-6">
            Crea tu primer proyecto para empezar
        </p>
        <CreateProjectButton 
            portfolioId={portfolioId}
            portfolioSlug={portfolioSlug}
            variant="large"
        />
        </div>
    );
}