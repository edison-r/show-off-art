'use server';

/**
 * SERVER ACTIONS para gestionar proyectos y sus items
 */

import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { revalidatePath } from 'next/cache';
import type {
  Project,
  ProjectItem,
  CreateProjectInput,
  UpdateProjectInput,
  CreateProjectItemInput,
  ActionResponse
} from '@/types/portfolio';
import { PORTFOLIO_LIMITS } from '@/types/portfolio';

/**
 * Crear un nuevo proyecto en un portfolio
 */
export async function createProject(
  input: CreateProjectInput
): Promise<ActionResponse<Project>> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: 'No estás autenticado' };
        }
        
        // 1. Verificar ownership del portfolio
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .select('owner_id, slug')
            .eq('id', input.portfolio_id)
            .single();
        
        if (portfolioError || portfolio?.owner_id !== user.id) {
        return {
            success: false,
            error: 'No tienes permiso para añadir proyectos a este portfolio'
        };
        }
        
        // 2. Verificar límite de 6 proyectos (también hay trigger en DB)
        const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('portfolio_id', input.portfolio_id);
        
        if ((count || 0) >= PORTFOLIO_LIMITS.MAX_PROJECTS_PER_PORTFOLIO) {
        return {
            success: false,
            error: `Has alcanzado el límite de ${PORTFOLIO_LIMITS.MAX_PROJECTS_PER_PORTFOLIO} proyectos por portfolio`
        };
        }
        
        // 3. Si no se proporciona position, calcular la siguiente
        let position = input.position;
        if (position === undefined) {
        // Obtener la posición máxima actual
        const { data: lastProject } = await supabase
            .from('projects')
            .select('position')
            .eq('portfolio_id', input.portfolio_id)
            .order('position', { ascending: false })
            .limit(1)
            .single();
        
        position = lastProject ? lastProject.position + 1 : 0;
        }
        
        // 4. Crear proyecto
        const { data, error } = await supabase
        .from('projects')
        .insert({
            portfolio_id: input.portfolio_id,
            title: input.title,
            description: input.description || null,
            cover_image_url: input.cover_image_url || null,
            position
        })
        .select()
        .single();
        
        if (error) {
        console.error('Error creating project:', error);
        return {
            success: false,
            error: 'Error al crear proyecto'
        };
        }
        
        // 5. Revalidar páginas
        revalidatePath(`/app/dashboard/${portfolio.slug}`);
        
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
 * Actualizar un proyecto
 */
export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<ActionResponse<Project>> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'No estás autenticado' };
    }
    
    // 1. Verificar ownership a través de portfolio
    const { data: project } = await supabase
      .from('projects')
      .select('portfolio_id, portfolios!inner(owner_id, slug)')
      .eq('id', projectId)
      .single();
    
      const portfolio = Array.isArray(project?.portfolios)
      ? project.portfolios[0]
      : project?.portfolios

    if (!project || !portfolio || portfolio.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso para editar este proyecto'
      };
    }
    
    // 2. Actualizar
    const { data, error } = await supabase
      .from('projects')
      .update(input)
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      return {
        success: false,
        error: 'Error al actualizar proyecto'
      };
    }
    
    // 3. Revalidar
    revalidatePath(`/app/dashboard/${portfolio.slug}`);
    
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
 * Eliminar un proyecto
 * CASCADE eliminará automáticamente todos sus project_items
 */
export async function deleteProject(
  projectId: string
): Promise<ActionResponse> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'No estás autenticado' };
    }
    
    // 1. Verificar ownership
    const { data: project } = await supabase
      .from('projects')
      .select('portfolio_id, portfolios!inner(owner_id, slug)')
      .eq('id', projectId)
      .single();
    
      const portfolio = Array.isArray(project?.portfolios)
      ? project.portfolios[0]
      : project?.portfolios

    if (!project || !portfolio || portfolio.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso para eliminar este proyecto'
      };
    }
    
    // 2. Eliminar
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) {
      console.error('Error deleting project:', error);
      return {
        success: false,
        error: 'Error al eliminar proyecto'
      };
    }
    
    // 3. Revalidar
    revalidatePath(`/app/dashboard/${portfolio.slug}`);
    
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
 * Reordenar proyectos
 * Recibe un array de IDs en el orden deseado
 */
export async function reorderProjects(
  portfolioId: string,
  projectIds: string[] // Array ordenado: [id3, id1, id2]
): Promise<ActionResponse> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'No estás autenticado' };
    }
    
    // 1. Verificar ownership
    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('owner_id, slug')
      .eq('id', portfolioId)
      .single();
    
    if (!portfolio || portfolio.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso'
      };
    }
    
    // 2. Actualizar position de cada proyecto
    // El índice del array es la nueva posición
    for (let i = 0; i < projectIds.length; i++) {
      await supabase
        .from('projects')
        .update({ position: i })
        .eq('id', projectIds[i])
        .eq('portfolio_id', portfolioId);
    }
    
    // 3. Revalidar
    revalidatePath(`/app/dashboard/${portfolio.slug}`);
    
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
 * ============================================
 * PROJECT ITEMS (imágenes, embeds, texto)
 * ============================================
 */

/**
 * Crear un item en un proyecto
 * Nota: Para imágenes, primero subir a Storage, luego crear item con la URL
 */
export async function createProjectItem(
  input: CreateProjectItemInput
): Promise<ActionResponse<ProjectItem>> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'No estás autenticado' };
    }
    
    // 1. Verificar ownership del proyecto
    const { data: project } = await supabase
      .from('projects')
      .select(`
        id,
        portfolio_id,
        portfolios!inner(owner_id, slug)
      `)
      .eq('id', input.project_id)
      .single();
    
      const portfolio = Array.isArray(project?.portfolios)
      ? project.portfolios[0]
      : project?.portfolios

    if (!project || !portfolio || portfolio.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso'
      };
    }
    
    // 2. Verificar límite de items
    const { count } = await supabase
      .from('project_items')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', input.project_id);
    
    if ((count || 0) >= PORTFOLIO_LIMITS.MAX_ITEMS_PER_PROJECT) {
      return {
        success: false,
        error: `Has alcanzado el límite de ${PORTFOLIO_LIMITS.MAX_ITEMS_PER_PROJECT} items por proyecto`
      };
    }
    
    // 3. Calcular position si no se proporciona
    let position = input.position;
    if (position === undefined) {
      const { data: lastItem } = await supabase
        .from('project_items')
        .select('position')
        .eq('project_id', input.project_id)
        .order('position', { ascending: false })
        .limit(1)
        .single();
      
      position = lastItem ? lastItem.position + 1 : 0;
    }
    
    // 4. Crear item
    const { data, error } = await supabase
      .from('project_items')
      .insert({
        project_id: input.project_id,
        item_type: input.item_type,
        data: input.data, // JSONB
        position
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating item:', error);
      return {
        success: false,
        error: 'Error al crear item'
      };
    }
    
    // 5. Revalidar
    revalidatePath(`/app/dashboard/${portfolio.slug}`);
    
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
 * Eliminar un item de proyecto
 * Si es imagen, también eliminar de Storage
 */
export async function deleteProjectItem(
  itemId: string
): Promise<ActionResponse> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'No estás autenticado' };
    }
    
    // 1. Obtener item con información del proyecto
    const { data: item } = await supabase
      .from('project_items')
      .select(`
        *,
        projects!inner(
          portfolio_id,
          portfolios!inner(owner_id, slug)
        )
      `)
      .eq('id', itemId)
      .single();
    
    if (!item || item.projects.portfolios.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso'
      };
    }
    
    // 2. Si es imagen, eliminar de Storage
    if (item.item_type === 'image' && item.data.storage_path) {
      await supabase.storage
        .from('public-assets')
        .remove([item.data.storage_path]);
    }
    
    // 3. Eliminar de DB
    const { error } = await supabase
      .from('project_items')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      console.error('Error deleting item:', error);
      return {
        success: false,
        error: 'Error al eliminar item'
      };
    }
    
    // 4. Revalidar
    revalidatePath(`/app/dashboard/${item.projects.portfolios.slug}`);
    
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
 * Reordenar items de un proyecto
 */
export async function reorderProjectItems(
  projectId: string,
  itemIds: string[]
): Promise<ActionResponse> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'No estás autenticado' };
    }
    
    // 1. Verificar ownership
    const { data: project } = await supabase
      .from('projects')
      .select('portfolios!inner(owner_id, slug)')
      .eq('id', projectId)
      .single();
    
      const portfolio = Array.isArray(project?.portfolios)
      ? project.portfolios[0]
      : project?.portfolios

    if (!project || !portfolio || portfolio.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso'
      };
    }
    
    // 2. Actualizar posiciones
    for (let i = 0; i < itemIds.length; i++) {
      await supabase
        .from('project_items')
        .update({ position: i })
        .eq('id', itemIds[i])
        .eq('project_id', projectId);
    }
    
    // 3. Revalidar
    revalidatePath(`/app/dashboard/${portfolio.slug}`);
    
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
 * Actualizar el data de un item (ej: cambiar el alt de una imagen)
 */
export async function updateProjectItemData(
  itemId: string,
  newData: any
): Promise<ActionResponse<ProjectItem>> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'No estás autenticado' };
    }
    
    // 1. Verificar ownership
    const { data: item } = await supabase
      .from('project_items')
      .select(`
        *,
        projects!inner(portfolios!inner(owner_id, slug))
      `)
      .eq('id', itemId)
      .single();
    
    if (!item || item.projects.portfolios.owner_id !== user.id) {
      return {
        success: false,
        error: 'No tienes permiso'
      };
    }
    
    // 2. Actualizar
    const { data, error } = await supabase
      .from('project_items')
      .update({ data: newData })
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating item:', error);
      return {
        success: false,
        error: 'Error al actualizar item'
      };
    }
    
    // 3. Revalidar
    revalidatePath(`/app/dashboard/${item.projects.portfolios.slug}`);
    
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