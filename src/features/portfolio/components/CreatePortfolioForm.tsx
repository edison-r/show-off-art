'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioForm } from './PortfolioForm';
import { saveToSupabase } from '@/lib/database/db';
import { validateSlugUnique } from '@/lib/validations';
import { validateSlugFormat } from '@/lib/validations-client';

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
    
    if (!title.trim() || !slug.trim()) {
        setError('All fields are required');
        return;
    }
    
    startTransition(async () => {
        // ✅ PASO 1: Validar formato (CLIENTE - síncrona)
        const formatValidation = validateSlugFormat(slug);
        if (!formatValidation.valid) {
            setError(formatValidation.error || 'Error de validación');
            return;
        }
        
        // ✅ PASO 2: Validar unicidad (SERVIDOR - async)
        const uniqueValidation = await validateSlugUnique(slug);
        if (!uniqueValidation.valid) {
            setError(uniqueValidation.error || 'Error de validación');
            return;
        }
        
        // ✅ PASO 3: Preparar JSON
        const portfolioData = {
            title: title.trim(),
            slug: slug.trim(),
            visibility: 'draft',
            template_key: 'bento_v1',
            template_data: {
                about: '',
                specialties: [],
                theme: {
                    primaryColor: '#8b5cf6',
                    backgroundColor: '#ffffff',
                    textColor: '#1f2937'
                }
            }
        };
        
        // ✅ PASO 4: Guardar
        const response = await saveToSupabase('portfolios', portfolioData, {
            revalidate: '/dashboard'
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