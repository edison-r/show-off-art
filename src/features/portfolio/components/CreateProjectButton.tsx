'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveToSupabase } from '@/lib/database/db';
import { validateProjectLimit } from '@/lib/validations';

interface CreateProjectButtonProps {
  portfolioId: string;
  portfolioSlug: string;
  variant?: 'default' | 'large';
}

export function CreateProjectButton({ 
  portfolioId, 
  portfolioSlug,
  variant = 'default' 
}: CreateProjectButtonProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    startTransition(async () => {
        try {
            // 1. VALIDAR: Límite de proyectos (máximo 6)
            const validation = await validateProjectLimit(portfolioId);
            
            if (!validation.valid) {
            setError(validation.error || 'Error de validación');
            alert(validation.error);
            return;
            }

            // 2. CALCULAR POSITION: Obtener la siguiente posición
            const { data: projects } = await saveToSupabase('projects', {}, {
            // Usamos un truco: hacer una query para obtener el count
            });

            // Obtener proyectos actuales para calcular position
            const currentProjects = await fetch(`/api/projects?portfolio_id=${portfolioId}`);
            const { data: existingProjects } = await currentProjects.json();
            const nextPosition = existingProjects?.length || 0;

            // 3. PREPARAR JSON del proyecto
            const projectData = {
            portfolio_id: portfolioId,
            title: title.trim(),
            description: description.trim() || null,
            cover_image_url: null,
            position: nextPosition
            };

            // 4. GUARDAR proyecto
            const result = await saveToSupabase('projects', projectData, {
            revalidate: `/app/dashboard/${portfolioSlug}`
            });

            if (!result.success) {
            setError(result.error || 'Error al crear proyecto');
            alert(result.error || 'Error al crear proyecto');
            return;
            }

            // 5. ÉXITO
            alert('Proyecto creado correctamente');
            setTitle('');
            setDescription('');
            setShowForm(false);
            
            router.refresh();

        } catch (error) {
            console.error('Error creating project:', error);
            setError('Error inesperado al crear proyecto');
            alert('Error inesperado');
        }
        });
    };

    const handleCancel = () => {
        if (!isPending) {
        setTitle('');
        setDescription('');
        setError('');
        setShowForm(false);
        }
    };

    // Renderizar botón según variant
    if (!showForm) {
        return (
        <button
            onClick={() => setShowForm(true)}
            className={
            variant === 'large'
                ? 'px-8 py-4 bg-blue text-white rounded-xl font-semibold text-lg hover:bg-blue/90 transition-all shadow-lg hover:shadow-xl'
                : 'px-4 py-2 bg-blue text-white rounded-lg font-medium hover:bg-blue/90 transition-colors inline-flex items-center gap-2'
            }
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Proyecto
        </button>
        );
    }

    // Renderizar formulario
    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-titles text-xl font-bold">Nuevo Proyecto</h3>
            <button
            onClick={handleCancel}
            disabled={isPending}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Cerrar"
            >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-mono font-bold block">
                Título del Proyecto *
            </label>
            <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
                placeholder="Ej: E-commerce App"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent disabled:bg-neutral-100 transition-all"
                required
            />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-mono font-bold block">
                Descripción (opcional)
            </label>
            <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                placeholder="Breve descripción del proyecto..."
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent disabled:bg-neutral-100 transition-all resize-none"
            />
            </div>

            {/* Error Message */}
            {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
            </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
            <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-3 bg-blue text-white rounded-lg font-semibold hover:bg-blue/90 disabled:opacity-50 transition-colors"
            >
                {isPending ? 'Creando...' : 'Crear Proyecto'}
            </button>
            </div>
        </form>
        </div>
    );
}