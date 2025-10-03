'use server';

/**
 * SERVER ACTIONS para gestionar portfolios
 * 
 * Qué son Server Actions:
 * - Funciones que se ejecutan en el servidor (no en el navegador)
 * - Pueden acceder a la DB de forma segura
 * - Se llaman desde componentes client con 'use server'
 * - Automáticamente validan que el usuario esté autenticado
 */

import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { revalidatePath } from 'next/cache';
import type {
  Portfolio,
  CreatePortfolioInput,
  UpdatePortfolioInput,
  ActionResponse,
  PortfolioWithRelations,
  Project,
  ProjectItem,
} from '@/types/portfolio';
import { PORTFOLIO_LIMITS } from '@/types/portfolio';
import { Projector } from 'lucide-react';

/**
 * Obtener todos los portfolios del usuario autenticado
 * Se usa en: /app/dashboard
 */
export async function getUserPortfolios(): Promise<ActionResponse<Portfolio[]>> {
    try {
        const supabase = await getSupabaseServer();
        
        // 1. Verificar autenticación
        // getUser() devuelve el usuario actual de la sesión
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
        return {
            success: false,
            error: 'No estás autenticado'
        };
        }
        
        // 2. Obtener portfolios de la DB
        const { data, error } = await supabase
            .from('portfolios') // → selecciona la tabla
            .select('*') // → trae todas las columnas
            .eq('owner_id', user.id) // → WHERE owner_id = user.id
            .order('created_at', { ascending: false }); // → ordena por fecha de creación
        
        if (error) {
            console.error('Error fetching portfolios:', error);
            return {
                success: false,
                error: 'Error al cargar portfolios'
            };
        }
        
        return {
            success: true,
            data: data || []
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
 * Obtener UN portfolio específico con todas sus relaciones
 * Se usa en: /app/dashboard/[portfolioSlug], /app/preview/[portfolioSlug]
 */
export async function getPortfolioBySlug(
  slug: string
): Promise<ActionResponse<PortfolioWithRelations>> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'No estás autenticado' };
        }
        
        // Query con relaciones anidadas
        // .select() con sintaxis especial para traer datos relacionados:
        // 'projects(*)' → trae todos los projects de este portfolio
        // 'projects(*), project_items(*)' → anida project_items dentro de projects
        const { data, error } = await supabase
            .from('portfolios')
            .select(`*,projects (*,project_items (*)),cv_files (*)`)
            .eq('slug', slug)
            .eq('owner_id', user.id) // Solo puede ver sus propios portfolios
            .single(); // Espera solo 1 resultado (lanza error si hay 0 o más de 1)
        
        if (error) {
        console.error('Error fetching portfolio:', error);
        return {
            success: false,
            error: 'Portfolio no encontrado'
        };
        }
        
        // Ordenar projects y sus items por position
        if (data.projects) {
            data.projects.sort((a: Project, b: Project) => a.position - b.position);
            data.projects.forEach((project: Project & { project_items?: ProjectItem[] }) => {
                if (project.project_items) {
                    project.project_items.sort((a: ProjectItem, b: ProjectItem) => a.position - b.position);
                }
            });
        }
        
        return {
            success: true,
            data: {
                ...data,
                cv_file: data.cv_files?.[0] || null
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

/**
 * Crear un nuevo portfolio
 * Se usa en: /app/dashboard → botón "Nuevo Portfolio"
 */
export async function createPortfolio(
  input: CreatePortfolioInput
): Promise<ActionResponse<Portfolio>> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
        return { success: false, error: 'No estás autenticado' };
        }
        
        // 1. Verificar límite de portfolios
        const { count } = await supabase
            .from('portfolios')
            .select('*', { count: 'exact', head: true }) // Solo cuenta, no trae datos
            .eq('owner_id', user.id);
        
        if ((count || 0) >= PORTFOLIO_LIMITS.MAX_PORTFOLIOS_DRAFT) {
        return {
            success: false,
            error: `Has alcanzado el límite de ${PORTFOLIO_LIMITS.MAX_PORTFOLIOS_DRAFT} portfolios`
        };
        }
        
        // 2. Verificar que el slug sea único globalmente
        const { data: existing } = await supabase
            .from('portfolios')
            .select('slug')
            .eq('slug', input.slug)
            .single();
        
        if (existing) {
        return {
            success: false,
            error: 'Este nombre de portfolio ya está en uso'
        };
        }
        
        // 3. Crear el portfolio en la DB
        // .insert() → INSERT INTO
        // Campos no proporcionados usan valores por defecto de la DB
        const { data, error } = await supabase
            .from('portfolios')
            .insert({
                owner_id: user.id, // FK al usuario autenticado
                title: input.title,
                slug: input.slug,
                visibility: input.visibility || 'draft', // Default draft
                template_key: input.template_key || 'bento_v1',
                template_data: input.template_data || {}
            })
            .select() // Devuelve el registro creado
            .single();
        
        if (error) {
            console.error('Error creating portfolio:', error);
            return {
                success: false,
                error: 'Error al crear portfolio'
            };
        }
        
        // 4. Revalidar cache de Next.js
        // Esto hace que la página /dashboard se actualice automáticamente
        revalidatePath('/app/dashboard');
        
        return {
            success: true,
            data
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
 * Actualizar un portfolio existente
 * Se usa en: /app/dashboard/[portfolioSlug] → Configuración
 */
export async function updatePortfolio(
  portfolioId: string,
  input: UpdatePortfolioInput
): Promise<ActionResponse<Portfolio>> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
        return { success: false, error: 'No estás autenticado' };
        }
        
        // 1. Verificar ownership (que el portfolio sea del usuario)
        const { data: portfolio, error: ownerError } = await supabase
            .from('portfolios')
            .select('owner_id')
            .eq('id', portfolioId)
            .single();
        
        if (ownerError || portfolio?.owner_id !== user.id) {
        return {
            success: false,
            error: 'No tienes permiso para editar este portfolio'
        };
        }
        
        // 2. Si se cambia el slug, verificar que sea único
        if (input.slug) {
        const { data: existing } = await supabase
            .from('portfolios')
            .select('id')
            .eq('slug', input.slug)
            .neq('id', portfolioId) // Excluir el portfolio actual
            .single();
        
        if (existing) {
            return {
            success: false,
            error: 'Este nombre de portfolio ya está en uso'
            };
        }
        }
        
        // 3. Actualizar en DB
        // .update() → UPDATE SET
        // Solo actualiza los campos proporcionados en input
        const { data, error } = await supabase
            .from('portfolios')
            .update(input)
            .eq('id', portfolioId)
            .select()
            .single();
        
        if (error) {
        console.error('Error updating portfolio:', error);
        return {
            success: false,
            error: 'Error al actualizar portfolio'
        };
        }
        
        // 4. Revalidar páginas relevantes
        revalidatePath('/app/dashboard');
        revalidatePath(`/app/dashboard/${data.slug}`);
        if (data.visibility === 'public') {
        // También revalidar la página pública
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
        
        if (profile) {
            revalidatePath(`/u/${profile.username}/${data.slug}`);
        }
        }
        
        return {
            success: true,
            data
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
 * Eliminar un portfolio
 * Solo se puede eliminar si está en draft
 */
export async function deletePortfolio(
  portfolioId: string
): Promise<ActionResponse> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'No estás autenticado' };
        }
        
        // 1. Verificar ownership y que sea draft
        const { data: portfolio, error: checkError } = await supabase
            .from('portfolios')
            .select('owner_id, visibility')
            .eq('id', portfolioId)
            .single();
        
        if (checkError || portfolio?.owner_id !== user.id) {
        return {
            success: false,
            error: 'No tienes permiso para eliminar este portfolio'
        };
        }
        
        if (portfolio.visibility !== 'draft') {
        return {
            success: false,
            error: 'Solo puedes eliminar portfolios en borrador'
        };
        }
        
        // 2. Eliminar (CASCADE eliminará automáticamente projects y project_items)
        const { error } = await supabase
            .from('portfolios')
            .delete()
            .eq('id', portfolioId);
        
        if (error) {
            console.error('Error deleting portfolio:', error);
            return {
                success: false,
                error: 'Error al eliminar portfolio'
            };
        }
        
        // 3. Revalidar dashboard
        revalidatePath('/app/dashboard');
        
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
 * Publicar un portfolio (draft → public)
 * Valida que no supere el límite de portfolios públicos
 */
export async function publishPortfolio(
  portfolioId: string
): Promise<ActionResponse<Portfolio>> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'No estás autenticado' };
        }
        
        // 1. Contar portfolios públicos actuales
        const { count } = await supabase
            .from('portfolios')
            .select('*', { count: 'exact', head: true })
            .eq('owner_id', user.id)
            .eq('visibility', 'public');
        
        if ((count || 0) >= PORTFOLIO_LIMITS.MAX_PORTFOLIOS_PUBLIC) {
        return {
            success: false,
            error: `Solo puedes tener ${PORTFOLIO_LIMITS.MAX_PORTFOLIOS_PUBLIC} portfolios públicos. Despublica otro primero.`
        };
        }
        
        // 2. Publicar
        // El trigger set_published_at() establecerá published_at automáticamente
        const { data, error } = await supabase
            .from('portfolios')
            .update({ visibility: 'public' })
            .eq('id', portfolioId)
            .eq('owner_id', user.id)
            .select()
            .single();
        
        if (error) {
            console.error('Error publishing portfolio:', error);
        return {
            success: false,
            error: 'Error al publicar portfolio'
        };
        }
        
        // 3. Revalidar páginas
        revalidatePath('/app/dashboard');
        const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
            
        if (profile) {
            revalidatePath(`/u/${profile.username}/${data.slug}`);
        }
        
        return {
            success: true,
            data
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
 * Borrar un portfolio
 */

export async function unpublishPortfolio(portfolioId: string) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('portfolios')
      .update({ 
        visibility: 'draft',
        published_at: null 
      })
      .eq('id', portfolioId)
      .eq('owner_id', user.id);

    if (error) throw error;

    revalidatePath('/app/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}