'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/features/portfolio/actions/projects';
import type { CreateProjectInput } from '@/features/portfolio/types/portfolio';

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

    // Validación básica del cliente
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    startTransition(async () => {
      try {
        // Preparar datos del proyecto
        const projectInput: CreateProjectInput = {
          portfolio_id: portfolioId,
          title: title.trim(),
          description: description.trim() || undefined
        };

        // Crear proyecto usando la acción del servidor
        // Esta acción se encarga de:
        // 1. Verificar autenticación
        // 2. Validar ownership del portfolio
        // 3. Verificar límite de 6 proyectos
        // 4. Calcular la position correcta
        // 5. Insertar en la base de datos
        // 6. Revalidar la página
        const result = await createProject(projectInput);

        if (!result.success) {
          setError(result.error || 'Error al crear el proyecto');
          return;
        }

        // Éxito: limpiar formulario y cerrar
        setTitle('');
        setDescription('');
        setError('');
        setShowForm(false);
        
        // Refrescar la página para mostrar el nuevo proyecto
        router.refresh();

      } catch (error) {
        console.error('Error inesperado al crear proyecto:', error);
        setError('Error inesperado. Por favor, intenta de nuevo.');
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

  // Si el formulario no está visible, mostrar solo el botón
  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={
          variant === 'large'
            ? 'px-8 py-4 bg-blue text-white rounded-xl font-semibold text-lg hover:bg-blue/90 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2'
            : 'px-4 py-2 bg-blue text-white rounded-lg font-medium hover:bg-blue/90 transition-colors inline-flex items-center gap-2'
        }
      >
        Crear Proyecto
      </button>
    );
  }

  // Formulario completo
  return (
    <div className="flex-5 bg-white border border-neutral-200 rounded-xl p-6 shadow-lg">
      {/* Header del formulario */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-titles text-xl font-bold">
          Nuevo Proyecto
        </h3>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de título */}
        <div className="space-y-2">
          <label 
            htmlFor="project-title" 
            className="text-sm font-mono font-bold block"
          >
            Título del Proyecto
          </label>
          <input
            id="project-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            placeholder="Ej: E-commerce App"
            maxLength={100}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed transition-all"
            required
            autoFocus
          />
          <p className="text-xs text-neutral-500 font-mono">
            {title.length}/100 caracteres
          </p>
        </div>

        {/* Campo de descripción */}
        <div className="space-y-2">
          <label 
            htmlFor="project-description" 
            className="text-sm font-mono font-bold block"
          >
            Descripción <span className="text-neutral-400 font-normal">(opcional)</span>
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            placeholder="Breve descripción del proyecto..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed transition-all resize-none"
          />
          <p className="text-xs text-neutral-500 font-mono">
            {description.length}/500 caracteres
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg 
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || !title.trim()}
            className="flex-1 px-4 py-3 bg-blue text-white rounded-lg font-semibold hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg 
                  className="w-5 h-5 animate-spin" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creando...
              </>
            ) : (
              <>
                Crear Proyecto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}