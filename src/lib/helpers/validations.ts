'use server';

import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { PORTFOLIO_LIMITS } from '@/features/portfolio/types/portfolio';

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export async function validatePortfolioLimit(userId: string): Promise<ValidationResult> {
  try {
    const supabase = await getSupabaseServer();
    
    const { count } = await supabase
      .from('portfolios')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId);
    
    if ((count || 0) >= PORTFOLIO_LIMITS.MAX_ITEMS_PER_PROJECT) {
      return {
        valid: false,
        error: `Has alcanzado el límite de ${PORTFOLIO_LIMITS.MAX_ITEMS_PER_PROJECT} items por proyecto`
      };
    }
    
    return { valid: true };
    
  } catch (error) {
    return {
      valid: false,
      error: 'Error al validar límite de items'
    };
  }
}

export async function validatePublicPortfolioLimit(userId: string): Promise<ValidationResult> {
  try {
    const supabase = await getSupabaseServer();
    
    const { count } = await supabase
      .from('portfolios')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId)
      .eq('visibility', 'public');
    
    if ((count || 0) >= PORTFOLIO_LIMITS.MAX_PORTFOLIOS_PUBLIC) {
      return {
        valid: false,
        error: `Solo puedes tener ${PORTFOLIO_LIMITS.MAX_PORTFOLIOS_PUBLIC} portfolios públicos`
      };
    }
    
    return { valid: true };
    
  } catch (error) {
    return {
      valid: false,
      error: 'Error al validar límite de portfolios públicos'
    };
  }
}

export async function validateProjectLimit(portfolioId: string): Promise<ValidationResult> {
  try {
    const supabase = await getSupabaseServer();
    
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('portfolio_id', portfolioId);
    
    if ((count || 0) >= PORTFOLIO_LIMITS.MAX_PROJECTS_PER_PORTFOLIO) {
      return {
        valid: false,
        error: `Has alcanzado el límite de ${PORTFOLIO_LIMITS.MAX_PROJECTS_PER_PORTFOLIO} proyectos por portfolio`
      };
    }
    
    return { valid: true };
    
  } catch (error) {
    return {
      valid: false,
      error: 'Error al validar límite de proyectos'
    };
  }
}

export async function validateProjectItemLimit(projectId: string): Promise<ValidationResult> {
  try {
    const supabase = await getSupabaseServer();
    const { count } = await supabase
      .from('project_items')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);
    
    if ((count || 0) >= PORTFOLIO_LIMITS.MAX_ITEMS_PER_PROJECT) {
      return {
        valid: false,
        error: `Has alcanzado el límite de ${PORTFOLIO_LIMITS.MAX_ITEMS_PER_PROJECT} items`
      };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Error al validar límite de items' };
  }
}

export async function validateSlugUnique(
  slug: string,
  excludeId?: string
): Promise<ValidationResult> {
  try {
    const supabase = await getSupabaseServer();
    
    let query = supabase
      .from('portfolios')
      .select('id')
      .eq('slug', slug);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data } = await query.single();
    
    if (data) {
      return {
        valid: false,
        error: 'Este slug ya está en uso'
      };
    }
    
    return { valid: true };
    
  } catch (error) {
    // @ts-ignore
    if (error?.code === 'PGRST116') {
      return { valid: true };
    }
    
    return {
      valid: false,
      error: 'Error al validar slug'
    };
  }
}

export async function validatePortfolioOwnership(
  portfolioId: string,
  userId: string
): Promise<ValidationResult> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data, error } = await supabase
      .from('portfolios')
      .select('owner_id')
      .eq('id', portfolioId)
      .single();
    
    if (error || !data) {
      return {
        valid: false,
        error: 'Portfolio no encontrado'
      };
    }
    
    if (data.owner_id !== userId) {
      return {
        valid: false,
        error: 'No tienes permiso para modificar este portfolio'
      };
    }
    
    return { valid: true };
    
  } catch (error) {
    return {
      valid: false,
      error: 'Error al validar permisos'
    };
  }
}

export async function validateProjectOwnership(
  projectId: string,
  userId: string
): Promise<ValidationResult> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data, error } = await supabase
      .from('projects')
      .select('portfolios!inner(owner_id)')
      .eq('id', projectId)
      .single();
    
    const portfolio = Array.isArray(data?.portfolios)
      ? data.portfolios[0]
      : data?.portfolios;
    
    if (error || !portfolio) {
      return {
        valid: false,
        error: 'Proyecto no encontrado'
      };
    }
    
    if (portfolio.owner_id !== userId) {
      return {
        valid: false,
        error: 'No tienes permiso para modificar este proyecto'
      };
    }
    
    return { valid: true };
    
  } catch (error) {
    return {
      valid: false,
      error: 'Error al validar permisos'
    };
  }
}


export async function validatePortfolioDraft(
  portfolioId: string
): Promise<ValidationResult> {
  try {
    const supabase = await getSupabaseServer();
    
    const { data, error } = await supabase
      .from('portfolios')
      .select('visibility')
      .eq('id', portfolioId)
      .single();
    
    if (error || !data) {
      return {
        valid: false,
        error: 'Portfolio no encontrado'
      };
    }
    
    if (data.visibility !== 'draft') {
      return {
        valid: false,
        error: 'Solo puedes eliminar portfolios en borrador'
      };
    }
    
    return { valid: true };
    
  } catch (error) {
    return {
      valid: false,
      error: 'Error al validar estado del portfolio'
    };
  }
}