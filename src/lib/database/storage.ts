'use server';

import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { PORTFOLIO_LIMITS } from '@/features/portfolio/types/portfolio';

interface StorageResponse {
    success: boolean;
    data?: {
        path: string;
        publicUrl: string;
        size: number;
    };
    error?: string;
}

const ALLOWED_TYPES: {
    image: {
        mimeTypes: readonly string[];
        maxSize: number;
        label: string;
    };
    document: {
        mimeTypes: readonly string[];
        maxSize: number;
        label: string;
    };
} = {
    image: {
        mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        maxSize: PORTFOLIO_LIMITS.MAX_IMAGE_SIZE,
        label: 'imagen'
    },
    document: {
        mimeTypes: ['application/pdf'],
        maxSize: PORTFOLIO_LIMITS.MAX_CV_SIZE,
        label: 'PDF'
    }
};

function sanitizeFileName(fileName: string): string {
    return fileName
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export async function uploadToStorage(
    bucket: 'public-assets' | 'cv',
    file: File,
    path?: string,
    type: 'image' | 'document' = 'image'
): Promise<StorageResponse> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'No estás autenticado' };
        }
        
        const allowedType = ALLOWED_TYPES[type];
        if (!allowedType.mimeTypes.includes(file.type)) {
        return {
            success: false,
            error: `Tipo de archivo no permitido. Solo ${allowedType.label}s: ${allowedType.mimeTypes.join(', ')}`
        };
        }
        
        if (file.size > allowedType.maxSize) {
            const maxMB = (allowedType.maxSize / (1024 * 1024)).toFixed(0);
            return { success: false, error: `El archivo es demasiado grande. Máximo: ${maxMB}MB` };
        }
        
        const { data: files } = await supabase.storage.from(bucket).list(user.id);
        const totalUsed = files?.reduce((sum, f) => sum + (f.metadata?.size || 0), 0) || 0;
        
        if (totalUsed + file.size > PORTFOLIO_LIMITS.MAX_STORAGE_PER_USER) {
            const usedMB = (totalUsed / (1024 * 1024)).toFixed(0);
            const limitMB = (PORTFOLIO_LIMITS.MAX_STORAGE_PER_USER / (1024 * 1024)).toFixed(0);
            return { success: false, error: `Has alcanzado tu límite de almacenamiento (${usedMB}/${limitMB}MB)` };
        }
        
        const finalPath = path || `${user.id}/${Date.now()}-${sanitizeFileName(file.name)}`;
        
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(finalPath, file, {
                cacheControl: '3600',
                upsert: bucket === 'cv'
        });
        
        if (error) {
            console.error('Storage upload error:', error);
            return { success: false, error: error.message || 'Error al subir archivo' };
        }
        
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        
        await supabase
            .from('profiles')
            .update({ storage_used: totalUsed + file.size })
            .eq('id', user.id);
        
        return {
            success: true,
            data: {
                path: data.path,
                publicUrl: urlData.publicUrl,
                size: file.size
            }
        };
        
    } catch (error) {
        console.error('Unexpected upload error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error inesperado' };
    }
}

export async function deleteFromStorage(
    bucket: 'public-assets' | 'cv',
    path: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'No estás autenticado' };
        }
        
        if (!path.startsWith(user.id)) {
            return { success: false, error: 'No tienes permiso para eliminar este archivo' };
        }
        
        const { error } = await supabase.storage.from(bucket).remove([path]);
        
        if (error) {
            console.error('Delete error:', error);
            return { success: false, error: 'Error al eliminar archivo' };
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('Unexpected error in deleteFromStorage:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error inesperado' };
    }
}

export async function getStorageUsage(): Promise<{
    success: boolean;
    data?: {
        used: number;
        limit: number;
        percentage: number;
    };
    error?: string;
}> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
                return { success: false, error: 'No estás autenticado' };
        }
        
        const { data: profile } = await supabase
        .from('profiles')
        .select('storage_used')
        .eq('id', user.id)
        .single();
        
        const used = profile?.storage_used || 0;
        const limit = PORTFOLIO_LIMITS.MAX_STORAGE_PER_USER;
        const percentage = (used / limit) * 100;
        
        return {
            success: true,
            data: {
                used,
                limit,
                percentage: Math.round(percentage)
            }
        };
        
    } catch (error) {
        console.error('Unexpected error in getStorageUsage:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error inesperado' };
    }
}