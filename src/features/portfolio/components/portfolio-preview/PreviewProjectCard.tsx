'use client';

import Image from 'next/image';
import type { Project, ProjectItem, ImageItemData } from '@/features/portfolio/types/portfolio';

interface PreviewProjectCardProps {
    project: Project & { items: ProjectItem[] };
}

export function PreviewProjectCard({ project }: PreviewProjectCardProps) {
    // Filtrar solo imágenes
    const images = project.items.filter(item => item.item_type === 'image');

    return (
        <article className="group">
        {/* Cover Image */}
        <ProjectCoverImage 
            coverUrl={project.cover_image_url}
            firstImage={images[0]}
            title={project.title}
        />

        {/* Info */}
        <div>
            <h3 className="font-titles text-2xl font-bold mb-2 group-hover:opacity-80 transition-opacity">
            {project.title}
            </h3>
            {project.description && (
            <p className="text-neutral-600">
                {project.description}
            </p>
            )}
        </div>

        {/* Gallery Grid */}
        {images.length > 1 && (
            <ProjectGallery images={images} />
        )}
        </article>
    );
}

// Cover image del proyecto
function ProjectCoverImage({ 
    coverUrl, 
    firstImage, 
    title 
}: { 
    coverUrl: string | null;
    firstImage?: ProjectItem;
    title: string;
}) {
    return (
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 mb-4">
        {coverUrl ? (
            <Image
            src={coverUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
        ) : firstImage ? (
            <Image
            src={(firstImage.data as ImageItemData).url}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
        ) : (
            <EmptyImagePlaceholder />
        )}
        </div>
    );
}

// Placeholder cuando no hay imagen
function EmptyImagePlaceholder() {
    return (
        <div className="w-full h-full flex items-center justify-center">
        <svg className="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        </div>
    );
}

// Grid de imágenes adicionales
function ProjectGallery({ images }: { images: ProjectItem[] }) {
    return (
        <div className="grid grid-cols-3 gap-2 mt-4">
        {images.slice(1, 4).map((item) => {
            const imageData = item.data as ImageItemData;
            return (
            <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
                <Image
                src={imageData.url}
                alt={imageData.alt || ''}
                fill
                className="object-cover"
                />
            </div>
            );
        })}
        {images.length > 4 && (
            <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-900/80 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
                +{images.length - 4}
            </span>
            </div>
        )}
        </div>
    );
}