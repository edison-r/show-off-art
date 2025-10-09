'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPortfolio } from '@/features/portfolio/actions/portfolios';
import { PortfolioForm } from './PortfolioForm';

interface CreatePortfolioFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CreatePortfolioForm({ 
    onSuccess, 
    onCancel 
}: CreatePortfolioFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Validación básica
        if (!title.trim() || !slug.trim()) {
        setError('All fields are required');
        return;
        }
        
        // Validación de slug
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
        setError('Slug can only contain lowercase letters, numbers and hyphens');
        return;
        }
        
        startTransition(async () => {
        const response = await createPortfolio({
            title,
            slug,
            visibility: 'draft'
        });
        
        if (response.success) {
            setTitle('');
            setSlug('');
            onSuccess?.();
            router.push('/dashboard');
            router.refresh();
        } else {
            setError(response.error || 'Error creating portfolio');
        }
        });
    };
    
    const handleTitleChange = (value: string) => {
        setTitle(value);
        // Auto-generar slug si no ha sido editado manualmente
        if (!slug || slug === generateSlug(title)) {
        setSlug(generateSlug(value));
        }
    };
    
    const generateSlug = (text: string): string => {
        return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
    };
    
    const handleCancel = () => {
        if (!isPending) {
        setError('');
        onCancel?.();
        }
    };
    
    return (
        <PortfolioForm
        title={title}
        slug={slug}
        error={error}
        isPending={isPending}
        onTitleChange={handleTitleChange}
        onSlugChange={setSlug}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        mode="create"
        />
    );
}