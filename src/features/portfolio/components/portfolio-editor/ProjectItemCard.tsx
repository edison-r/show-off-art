'use client';

import Image from 'next/image';
import type { ProjectItem, ImageItemData, EmbedItemData, TextItemData } from '@/features/portfolio/types/portfolio';

interface ProjectItemCardProps {
    item: ProjectItem;
}

export function ProjectItemCard({ item }: ProjectItemCardProps) {
    // Imagen
    if (item.item_type === 'image') {
        const imageData = item.data as ImageItemData;
        return (
        <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 group">
            <Image
            src={imageData.url}
            alt={imageData.alt || 'Project image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            />
        </div>
        );
    }

    // Embed (video)
    if (item.item_type === 'embed') {
        return (
        <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        );
    }

    // Texto
    if (item.item_type === 'text') {
        const textData = item.data as TextItemData;
        return (
        <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 p-4 flex items-start">
            <p className="text-xs text-neutral-600 line-clamp-6">
            {textData.html || textData.md || 'Texto'}
            </p>
        </div>
        );
    }

    return null;
}