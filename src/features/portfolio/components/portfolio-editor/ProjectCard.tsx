'use client';

import { UploadImageButton } from './UploadImageButton';
import { ProjectItemCard } from './ProjectItemCard';
import type { Project, ProjectItem } from '@/features/portfolio/types/portfolio';

interface ProjectCardProps {
    project: Project & { items: ProjectItem[] };
    portfolioId: string;
    portfolioSlug: string;
}

export function ProjectCard({ 
    project, 
    portfolioId,
    portfolioSlug 
}: ProjectCardProps) {
    return (
        <article className="bg-white rounded-xl border border-neutral-200 p-6">
        {/* Header del proyecto */}
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
            <h3 className="font-titles text-xl font-bold mb-1">
                {project.title}
            </h3>
            {project.description && (
                <p className="text-sm text-neutral-600">
                {project.description}
                </p>
            )}
            </div>
            <UploadImageButton 
            projectId={project.id}
            portfolioId={portfolioId}
            portfolioSlug={portfolioSlug}
            variant="icon"
            />
        </div>

        {/* Items del proyecto */}
        {project.items.length === 0 ? (
            <EmptyProjectState 
            projectId={project.id}
            portfolioId={portfolioId}
            portfolioSlug={portfolioSlug}
            />
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {project.items.map((item) => (
                <ProjectItemCard key={item.id} item={item} />
            ))}
            </div>
        )}

        {/* Footer con info */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-xs text-neutral-500 font-mono">
            {project.items.length} items • Posición: {project.position}
            </p>
        </div>
        </article>
    );
}

// Estado vacío cuando no hay items
function EmptyProjectState({ 
    projectId, 
    portfolioId, 
    portfolioSlug 
}: { 
    projectId: string;
    portfolioId: string;
    portfolioSlug: string;
}) {
    return (
        <div className="border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center">
        <p className="text-sm text-neutral-500 mb-4">
            No hay contenido en este proyecto
        </p>
        <UploadImageButton 
            projectId={projectId}
            portfolioId={portfolioId}
            portfolioSlug={portfolioSlug}
        />
        </div>
    );
}