'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadToStorage } from '@/lib/database/storage';
import { saveToSupabase } from '@/lib/database/db';
import { validateProjectItemLimit } from '@/lib/helpers/validations';
import type { ImageItemData } from '@/features/portfolio/types/portfolio';

interface UploadImageButtonProps {
    projectId: string;
    portfolioId: string;
    portfolioSlug: string;
    variant?: 'default' | 'icon';
}

export function UploadImageButton({ 
    projectId, 
    portfolioId,
    portfolioSlug,
    variant = 'default' 
}: UploadImageButtonProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar que sea imagen
        if (!file.type.startsWith('image/')) {
        alert('Solo se permiten imágenes');
        return;
        }

        setIsUploading(true);

        try {
        // 1. VALIDAR: Límite de items (máximo 15)
        const validation = await validateProjectItemLimit(projectId);
        
        if (!validation.valid) {
            alert(validation.error || 'Límite de items alcanzado');
            setIsUploading(false);
            return;
        }

        // 2. SUBIR IMAGEN A STORAGE
        // Path: userId/portfolioId/projectId/filename
        const storagePath = `${portfolioId}/${projectId}/${Date.now()}-${file.name}`;
        
        const uploadResult = await uploadToStorage(
            'public-assets',
            file,
            storagePath,
            'image'
        );

        if (!uploadResult.success) {
            alert(uploadResult.error || 'Error al subir imagen');
            setIsUploading(false);
            return;
        }

        // 3. CALCULAR POSITION: Obtener items actuales del proyecto
        // (Podríamos hacer esto mejor con una query, pero por simplicidad...)
        const nextPosition = Date.now(); // Temporal, idealmente calcular bien

        // 4. PREPARAR JSON del item
        const imageData: ImageItemData = {
            url: uploadResult.data!.publicUrl,
            storage_path: uploadResult.data!.path,
            alt: file.name.replace(/\.[^/.]+$/, ''), // Filename sin extensión
            width: undefined,
            height: undefined
        };

        const projectItemData = {
            project_id: projectId,
            item_type: 'image' as const,
            data: imageData,
            position: nextPosition
        };

        // 5. GUARDAR item en la base de datos
        const result = await saveToSupabase('project_items', projectItemData, {
            revalidate: `/app/dashboard/${portfolioSlug}`
        });

        if (!result.success) {
            // Si falla guardar en DB, eliminar imagen de Storage
            await fetch('/api/storage/delete', {
            method: 'POST',
            body: JSON.stringify({ path: uploadResult.data!.path })
            });
            
            alert(result.error || 'Error al guardar imagen');
            setIsUploading(false);
            return;
        }

        // 6. ÉXITO
        alert('Imagen subida correctamente');
        router.refresh();

        // Limpiar input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error inesperado al subir imagen');
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
                ? 'p-3 bg-blue text-white rounded-lg hover:bg-blue/90 disabled:opacity-50 transition-colors'
                : 'px-4 py-2 bg-blue text-white rounded-lg font-medium hover:bg-blue/90 disabled:opacity-50 transition-colors inline-flex items-center gap-2'
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