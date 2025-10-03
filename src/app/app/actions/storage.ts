// src/app/actions/storage.ts
'use server';

/**
 * SERVER ACTIONS para subir archivos a Supabase Storage
 * 
 * Estructura de paths en Storage:
 * - public-assets: user_id/portfolio_id/project_id/filename.jpg
 * - cv: user_id/portfolio_id/cv.pdf
 * 
 * Las Storage Policies que tienes configuradas verifican automáticamente que:
 * - Solo el owner puede subir a su carpeta (user_id)
 * - El portfolio_id corresponde a un portfolio del usuario
 */

import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import type { UploadResponse } from '@/types/portfolio';
import { PORTFOLIO_LIMITS } from '@/types/portfolio';

/**
 * Validar tipo de archivo
 */
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

const ALLOWED_CV_TYPES = ['application/pdf'];

/**
 * Sanitizar nombre de archivo
 * Remueve caracteres especiales y espacios
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Subir imagen a un proyecto
 * 
 * @param formData - FormData con el archivo en key "file"
 * @param portfolioId - ID del portfolio
 * @param projectId - ID del proyecto
 * @returns URL pública de la imagen subida
 */
export async function uploadProjectImage(
  formData: FormData,
  portfolioId: string,
  projectId: string
): Promise<UploadResponse> {
  try {
    const supabase = await getSupabaseServer();
    
    // 1. Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: 'No estás autenticado'
      };
    }
    
    // 2. Verificar que el portfolio y proyecto sean del usuario
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('portfolios!inner(owner_id)')
      .eq('id', projectId)
      .eq('portfolio_id', portfolioId)
      .single();
    
    const portfolio = Array.isArray(project?.portfolios)
    ? project.portfolios[0]
    : project?.portfolios

    if (projectError || !portfolio || portfolio.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso para subir archivos a este proyecto'
      };
    }
    
    // 3. Obtener archivo del FormData
    const file = formData.get('file') as File;
    if (!file) {
      return {
        success: false,
        error: 'No se encontró el archivo'
      };
    }
    
    // 4. Validar tipo de archivo
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Tipo de archivo no permitido. Usa: ${ALLOWED_IMAGE_TYPES.join(', ')}`
      };
    }
    
    // 5. Validar tamaño (5MB)
    if (file.size > PORTFOLIO_LIMITS.MAX_IMAGE_SIZE) {
      const maxMB = PORTFOLIO_LIMITS.MAX_IMAGE_SIZE / (1024 * 1024);
      return {
        success: false,
        error: `El archivo es demasiado grande. Máximo: ${maxMB}MB`
      };
    }
    
    // 6. Verificar almacenamiento total del usuario
    // Listar todos los archivos del usuario para calcular espacio usado
    const { data: files } = await supabase.storage
      .from('public-assets')
      .list(user.id);
    
    const totalUsed = files?.reduce((sum, f) => sum + (f.metadata?.size || 0), 0) || 0;
    
    if (totalUsed + file.size > PORTFOLIO_LIMITS.MAX_STORAGE_PER_USER) {
      const usedMB = (totalUsed / (1024 * 1024)).toFixed(0);
      const limitMB = (PORTFOLIO_LIMITS.MAX_STORAGE_PER_USER / (1024 * 1024)).toFixed(0);
      return {
        success: false,
        error: `Has alcanzado tu límite de almacenamiento (${usedMB}/${limitMB}MB)`
      };
    }
    
    // 7. Generar path único
    // Formato: user_id/portfolio_id/project_id/timestamp-random-filename.jpg
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const sanitizedName = sanitizeFileName(file.name);
    const storagePath = `${user.id}/${portfolioId}/${projectId}/${timestamp}-${random}-${sanitizedName}`;
    
    // 8. Subir a Supabase Storage
    // Las Storage Policies verificarán automáticamente los permisos
    const { data, error } = await supabase.storage
      .from('public-assets')
      .upload(storagePath, file, {
        cacheControl: '3600', // Cache de 1 hora
        upsert: false // No sobrescribir si existe (por el timestamp, nunca debería)
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: error.message || 'Error al subir archivo'
      };
    }
    
    // 9. Obtener URL pública
    // Como el bucket es público, cualquiera puede acceder a esta URL
    const { data: urlData } = supabase.storage
      .from('public-assets')
      .getPublicUrl(data.path);
    
    // 10. Actualizar storage_used en profiles (opcional pero recomendado)
    await supabase
      .from('profiles')
      .update({ storage_used: totalUsed + file.size })
      .eq('id', user.id);
    
    return {
      success: true,
      data: {
        path: data.path,
        url: urlData.publicUrl,
        size: file.size
      }
    };
    
  } catch (error) {
    console.error('Unexpected upload error:', error);
    return {
      success: false,
      error: 'Error inesperado al subir archivo'
    };
  }
}

/**
 * Subir CV en PDF
 * 
 * @param formData - FormData con el archivo
 * @param portfolioId - ID del portfolio
 */
export async function uploadCV(
  formData: FormData,
  portfolioId: string
): Promise<UploadResponse> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: 'No estás autenticado'
      };
    }
    
    // 1. Verificar ownership del portfolio
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolios')
      .select('owner_id')
      .eq('id', portfolioId)
      .single();
    
    if (portfolioError || portfolio?.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso'
      };
    }
    
    // 2. Obtener archivo
    const file = formData.get('file') as File;
    if (!file) {
      return {
        success: false,
        error: 'No se encontró el archivo'
      };
    }
    
    // 3. Validar que sea PDF
    if (!ALLOWED_CV_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Solo se permiten archivos PDF'
      };
    }
    
    // 4. Validar tamaño (2MB)
    if (file.size > PORTFOLIO_LIMITS.MAX_CV_SIZE) {
      const maxMB = PORTFOLIO_LIMITS.MAX_CV_SIZE / (1024 * 1024);
      return {
        success: false,
        error: `El archivo es demasiado grande. Máximo: ${maxMB}MB`
      };
    }
    
    // 5. Path fijo para CV: user_id/portfolio_id/cv.pdf
    // Siempre se llama cv.pdf para facilitar el acceso
    const storagePath = `${user.id}/${portfolioId}/cv.pdf`;
    
    // 6. Subir (con upsert:true para reemplazar si ya existe)
    const { data, error } = await supabase.storage
      .from('cv')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true // Reemplazar CV anterior
      });
    
    if (error) {
      console.error('CV upload error:', error);
      return {
        success: false,
        error: error.message || 'Error al subir CV'
      };
    }
    
    // 7. Obtener URL
    const { data: urlData } = supabase.storage
      .from('cv')
      .getPublicUrl(data.path);
    
    // 8. Crear o actualizar registro en cv_files
    await supabase
      .from('cv_files')
      .upsert({
        portfolio_id: portfolioId,
        file_url: urlData.publicUrl,
        is_public: false // Por defecto privado
      }, {
        onConflict: 'portfolio_id' // Si ya existe, actualizar
      });
    
    return {
      success: true,
      data: {
        path: data.path,
        url: urlData.publicUrl,
        size: file.size
      }
    };
    
  } catch (error) {
    console.error('Unexpected CV upload error:', error);
    return {
      success: false,
      error: 'Error inesperado al subir CV'
    };
  }
}

/**
 * Actualizar visibilidad del CV (público/privado)
 */
export async function updateCVVisibility(
  portfolioId: string,
  isPublic: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: 'No estás autenticado'
      };
    }
    
    // Verificar ownership
    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('owner_id')
      .eq('id', portfolioId)
      .single();
    
    if (!portfolio || portfolio.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso'
      };
    }
    
    // Actualizar visibilidad
    const { error } = await supabase
      .from('cv_files')
      .update({ is_public: isPublic })
      .eq('portfolio_id', portfolioId);
    
    if (error) {
      return {
        success: false,
        error: 'Error al actualizar visibilidad'
      };
    }
    
    return {
      success: true
    };
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'Error inesperado'
    };
  }
}

/**
 * Eliminar archivo de storage
 * Útil si el usuario quiere eliminar una imagen sin eliminar el item
 */
export async function deleteStorageFile(
  bucket: 'public-assets' | 'cv',
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: 'No estás autenticado'
      };
    }
    
    // Verificar que el path empiece con el user.id (seguridad)
    if (!path.startsWith(user.id)) {
      return {
        success: false,
        error: 'No tienes permiso para eliminar este archivo'
      };
    }
    
    // Eliminar
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: 'Error al eliminar archivo'
      };
    }
    
    return {
      success: true
    };
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'Error inesperado'
    };
  }
}

/**
 * Obtener uso de almacenamiento del usuario
 */
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
      return {
        success: false,
        error: 'No estás autenticado'
      };
    }
    
    // Opción 1: Leer de profiles.storage_used (si se mantiene actualizado)
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
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'Error inesperado'
    };
  }
}