'use client';

import { EditorHeader } from './EditorHeader';
import { ProjectCard } from './ProjectCard';
import { EmptyProjectsState } from './EmptyProjectState';
import type { Portfolio, Project, ProjectItem } from '@/features/portfolio/types/portfolio';

interface PortfolioEditorProps {
  portfolio: Portfolio;
  projects: (Project & { items: ProjectItem[] })[];
}

export function PortfolioEditor({ portfolio, projects }: PortfolioEditorProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <EditorHeader 
        portfolioTitle={portfolio.title}
        portfolioSlug={portfolio.slug}
        portfolioId={portfolio.id}
        projectCount={projects.length}
      />

      {/* Lista de proyectos o estado vacío */}
      {projects.length === 0 ? (
        <EmptyProjectsState 
          portfolioId={portfolio.id}
          portfolioSlug={portfolio.slug}
        />
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id}
              project={project}
              portfolioId={portfolio.id}
              portfolioSlug={portfolio.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}