'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteFromSupabase, saveToSupabase } from '@/lib/database/db';
import { validatePortfolioDraft, validatePublicPortfolioLimit } from '@/lib/validations';

/**
 * Hook para manejar acciones de portfolio (delete, publish, unpublish)
 * Refactorizado para usar funciones genéricas en lugar de acciones específicas
 */
export function usePortfolioActions(portfolioId: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * ELIMINAR PORTFOLIO
   * Solo permite eliminar portfolios en draft
   */
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. VALIDAR: Solo se pueden eliminar portfolios en draft
      const validation = await validatePortfolioDraft(portfolioId);
      
      if (!validation.valid) {
        alert(validation.error || 'No se puede eliminar este portfolio');
        setIsLoading(false);
        return;
      }

      // 2. ELIMINAR de la base de datos
      const result = await deleteFromSupabase('portfolios', portfolioId, {
        revalidate: '/app/dashboard'
      });

      if (!result.success) {
        alert(result.error || 'Error al eliminar portfolio');
        setIsLoading(false);
        return;
      }

      // 3. ÉXITO
      alert('Portfolio eliminado correctamente');
      
      // Usar transition para navegación optimista
      startTransition(() => {
        router.refresh();
      });

    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Error inesperado al eliminar');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * PUBLICAR PORTFOLIO
   * Cambia visibility a 'public' y establece published_at
   */
  const handlePublish = async () => {
    setIsLoading(true);

    try {
      // 1. VALIDAR: Límite de portfolios públicos (máximo 3)
      // Nota: Esta validación necesita el userId, así que debes obtenerlo
      // Opción 1: Pasar userId como parámetro al hook
      // Opción 2: Hacer la validación en el servidor (más seguro)
      // Por ahora, dejamos que saveToSupabase maneje los permisos
      
      // ALTERNATIVA: Validar en el cliente antes de enviar
      // const validation = await validatePublicPortfolioLimit(userId);
      // if (!validation.valid) {
      //   alert(validation.error);
      //   setIsLoading(false);
      //   return;
      // }

      // 2. PREPARAR datos de actualización
      const updates = {
        visibility: 'public' as const,
        published_at: new Date().toISOString()
      };

      // 3. GUARDAR cambios
      const result = await saveToSupabase('portfolios', updates, {
        id: portfolioId,
        revalidate: '/app/dashboard'
      });

      if (!result.success) {
        alert(result.error || 'Error al publicar portfolio');
        setIsLoading(false);
        return;
      }

      // 4. ÉXITO
      alert('Portfolio publicado correctamente');
      
      startTransition(() => {
        router.refresh();
      });

    } catch (error) {
      console.error('Error publishing portfolio:', error);
      alert('Error inesperado al publicar');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * DESPUBLICAR PORTFOLIO
   * Cambia visibility a 'draft' y limpia published_at
   */
  const handleUnpublish = async () => {
    setIsLoading(true);

    try {
      // 1. PREPARAR datos de actualización
      const updates = {
        visibility: 'draft' as const,
        published_at: null
      };

      // 2. GUARDAR cambios
      const result = await saveToSupabase('portfolios', updates, {
        id: portfolioId,
        revalidate: '/app/dashboard'
      });

      if (!result.success) {
        alert(result.error || 'Error al despublicar portfolio');
        setIsLoading(false);
        return;
      }

      // 3. ÉXITO
      alert('Portfolio despublicado correctamente');
      
      startTransition(() => {
        router.refresh();
      });

    } catch (error) {
      console.error('Error unpublishing portfolio:', error);
      alert('Error inesperado al despublicar');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDelete,
    handlePublish,
    handleUnpublish,
    isPending: isPending || isLoading
  };
}