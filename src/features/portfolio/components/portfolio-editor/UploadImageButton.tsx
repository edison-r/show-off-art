'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadToStorage } from '@/lib/database/storage';
import { createProjectItem } from '@/features/portfolio/actions/projects';
import type { ImageItemData } from '@/features/portfolio/types/portfolio';

interface UploadImageButtonProps {
  projectId: string;
  portfolioId: string;
  portfolioSlug: string;
  variant?: 'default' | 'icon';
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export function UploadImageButton({ 
  projectId, 
  portfolioId,
  portfolioSlug,
  variant = 'default',
  onError,
  onSuccess
}: UploadImageButtonProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Solo se permiten imágenes';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // 0. OBTENER USER ID
      const { supabase } = await import('@/lib/supabase/supabaseClient');
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        const errorMsg = 'No estás autenticado';
        setError(errorMsg);
        onError?.(errorMsg);
        setIsUploading(false);
        return;
      }

      // 1. SUBIR IMAGEN A STORAGE
      // Path: user_id/portfolio_id/project_id/timestamp-filename
      const storagePath = `${user.id}/${portfolioId}/${projectId}/${Date.now()}-${file.name}`;
      
      const uploadResult = await uploadToStorage(
        'public-assets',
        file,
        storagePath,
        'image'
      );

      if (!uploadResult.success) {
        const errorMsg = uploadResult.error || 'Error al subir imagen';
        setError(errorMsg);
        onError?.(errorMsg);
        setIsUploading(false);
        return;
      }

      // 2. PREPARAR datos de la imagen
      const imageData: ImageItemData = {
        url: uploadResult.data!.publicUrl,
        storage_path: uploadResult.data!.path,
        alt: file.name.replace(/\.[^/.]+$/, ''), // Filename sin extensión
        width: undefined,
        height: undefined
      };

      // 3. CREAR PROJECT ITEM usando la acción que:
      //    - Valida límites (máximo 15 items)
      //    - Calcula position automáticamente
      //    - Verifica ownership
      const result = await createProjectItem({
        project_id: projectId,
        item_type: 'image',
        data: imageData
      });

      if (!result.success) {
        // Si falla guardar en DB, intentar eliminar imagen de Storage
        try {
          await fetch('/api/storage/delete', {
            method: 'POST',
            body: JSON.stringify({ path: uploadResult.data!.path })
          });
        } catch (deleteError) {
          console.error('Error cleaning up storage:', deleteError);
        }
        
        const errorMsg = result.error || 'Error al guardar imagen';
        setError(errorMsg);
        onError?.(errorMsg);
        setIsUploading(false);
        return;
      }

      // 4. ÉXITO
      onSuccess?.();
      router.refresh();

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMsg = 'Error inesperado al subir imagen';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Button */}
      <button
        onClick={handleClick}
        disabled={isUploading}
        className={
          variant === 'icon'
            ? 'p-3 bg-blue text-white cursor-pointer rounded-lg hover:bg-blue/90 disabled:opacity-50 transition-colors'
            : 'px-4 py-2 bg-blue cursor-pointer text-white rounded-lg font-medium hover:bg-blue/90 disabled:opacity-50 transition-colors inline-flex items-center gap-2'
        }
        aria-label="Subir imagen"
      >
        {isUploading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {variant === 'default' && <span>Subiendo...</span>}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {variant === 'default' && <span>Subir Imagen</span>}
          </>
        )}
      </button>
    </>
  );
}