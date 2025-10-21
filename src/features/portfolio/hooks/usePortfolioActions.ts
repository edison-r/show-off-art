'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteFromSupabase, saveToSupabase } from '@/lib/database/db';
import { validatePortfolioDraft, validatePublicPortfolioLimit } from '@/lib/helpers/validations';


export function usePortfolioActions(portfolioId: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    
    try {
      const validation = await validatePortfolioDraft(portfolioId);
      
      if (!validation.valid) {
        alert(validation.error || 'No se puede eliminar este portfolio');
        setIsLoading(false);
        return;
      }

      const result = await deleteFromSupabase('portfolios', portfolioId, {
        revalidate: '/app/dashboard'
      });

      if (!result.success) {
        alert(result.error || 'Error al eliminar portfolio');
        setIsLoading(false);
        return;
      }

      alert('Portfolio eliminado correctamente');
      
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

  const handlePublish = async () => {
    setIsLoading(true);

    try {

      const updates = {
        visibility: 'public' as const,
        published_at: new Date().toISOString()
      };

      const result = await saveToSupabase('portfolios', updates, {
        id: portfolioId,
        revalidate: '/app/dashboard'
      });

      if (!result.success) {
        alert(result.error || 'Error al publicar portfolio');
        setIsLoading(false);
        return;
      }

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

  const handleUnpublish = async () => {
    setIsLoading(true);

    try {
      const updates = {
        visibility: 'draft' as const,
        published_at: null
      };

      const result = await saveToSupabase('portfolios', updates, {
        id: portfolioId,
        revalidate: '/app/dashboard'
      });

      if (!result.success) {
        alert(result.error || 'Error al despublicar portfolio');
        setIsLoading(false);
        return;
      }

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