'use client';

import { PreviewHeader } from './PreviewHeader';
import { PreviewHero } from './PreviewHero';
import { PreviewProjectCard } from './PreviewProjectCard';
import { PreviewFooter } from './PreviewFooter';
import type { Portfolio, Project, ProjectItem } from '@/features/portfolio/types/portfolio';

interface PortfolioPreviewProps {
  portfolio: Portfolio;
  projects: (Project & { items: ProjectItem[] })[];
}

export function PortfolioPreview({ portfolio, projects }: PortfolioPreviewProps) {
  // Extraer tema del portfolio
  const theme = {
    primaryColor: portfolio.template_data?.theme?.primaryColor || '#8b5cf6',
    backgroundColor: portfolio.template_data?.theme?.backgroundColor || '#ffffff',
    textColor: portfolio.template_data?.theme?.textColor || '#1f2937',
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor 
      }}
    >
      {/* Header fijo */}
      <PreviewHeader portfolioSlug={portfolio.slug} />

      {/* Contenido principal */}
      <div className="pt-24 pb-16">
        {/* Hero section */}
        <PreviewHero 
          title={portfolio.title}
          about={portfolio.template_data?.about}
          specialties={portfolio.template_data?.specialties}
          primaryColor={theme.primaryColor}
        />

        {/* Grid de proyectos */}
        {projects.length === 0 ? (
          <EmptyProjectsMessage />
        ) : (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {projects.map((project) => (
                <PreviewProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <PreviewFooter primaryColor={theme.primaryColor} />
    </div>
  );
}

// Mensaje cuando no hay proyectos
function EmptyProjectsMessage() {
  return (
    <div className="text-center py-20">
      <p className="text-neutral-500">No hay proyectos para mostrar</p>
    </div>
  );
}