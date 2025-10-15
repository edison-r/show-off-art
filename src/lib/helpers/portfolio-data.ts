'use server';

/**
 * HELPERS para obtener datos de portfolios
 * 
 * Principios:
 * - KISS: Una función, un propósito
 * - DRY: Reutilizable en múltiples páginas
 * - YAGNI: Solo lo que necesitamos ahora
 */

import { getFromSupabase } from '@/lib/database/db';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import type { Portfolio, Project, ProjectItem } from '@/features/portfolio/types/portfolio';

/**
 * Tipo para proyectos con sus items
 */
export type ProjectWithItems = Project & {
    items: ProjectItem[];
};

/**
 * Tipo para el resultado completo
 */
export type PortfolioData = {
    portfolio: Portfolio;
    projects: ProjectWithItems[];
};

/**
 * Obtener portfolio con todos sus proyectos e items
 * 
 * @param slug - El slug del portfolio
 * @param userId - (Opcional) ID del usuario para validar ownership
 * @returns Portfolio con proyectos o null si no existe
 */
export async function getPortfolioWithProjects(
    slug: string,
    userId?: string
): Promise<PortfolioData | null> {
    try {
        // 1. Si no se pasa userId, obtenerlo del usuario autenticado
        let ownerId = userId;
        
        if (!ownerId) {
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return null;
        
        ownerId = user.id;
        }

        // 2. Obtener portfolio
        const portfolioResult = await getFromSupabase<Portfolio>('portfolios', {
        slug: slug,
        owner_id: ownerId
        }, {
        single: true
        });

        if (!portfolioResult.success || !portfolioResult.data) {
        return null;
        }

        const portfolio = portfolioResult.data;

        // 3. Obtener proyectos
        const projectsResult = await getFromSupabase<Project[]>('projects', {
        portfolio_id: portfolio.id
        }, {
        orderBy: { column: 'position', ascending: true }
        });

        const projects = projectsResult.data || [];

        // 4. Obtener items de cada proyecto
        const projectsWithItems = await Promise.all(
        projects.map(async (project) => {
            const itemsResult = await getFromSupabase<ProjectItem[]>('project_items', {
            project_id: project.id
            }, {
            orderBy: { column: 'position', ascending: true }
            });

            return {
            ...project,
            items: itemsResult.data || []
            };
        })
        );

        // 5. Devolver datos completos
        return {
        portfolio,
        projects: projectsWithItems
        };

    } catch (error) {
        console.error('Error in getPortfolioWithProjects:', error);
        return null;
    }
}

/**
 * Obtener solo el portfolio (sin proyectos)
 * Útil para páginas que solo necesitan info básica
 */
export async function getPortfolio(
    slug: string,
    userId?: string
): Promise<Portfolio | null> {
    try {
        let ownerId = userId;
        
        if (!ownerId) {
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return null;
        
        ownerId = user.id;
        }

        const result = await getFromSupabase<Portfolio>('portfolios', {
        slug: slug,
        owner_id: ownerId
        }, {
        single: true
        });

        return result.success ? (result.data ?? null) : null;

    } catch (error) {
        console.error('Error in getPortfolio:', error);
        return null;
    }
}

/**
 * Obtener todos los portfolios del usuario autenticado
 * Ordenados por fecha de creación (más recientes primero)
 */
export async function getUserPortfolios(
    userId?: string
): Promise<Portfolio[]> {
    try {
        let ownerId = userId;
        
        if (!ownerId) {
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return [];
        
        ownerId = user.id;
        }

        const result = await getFromSupabase<Portfolio[]>('portfolios', {
        owner_id: ownerId
        }, {
        orderBy: { column: 'created_at', ascending: false }
        });

        return result.success ? (result.data || []) : [];

    } catch (error) {
        console.error('Error in getUserPortfolios:', error);
        return [];
    }
}

/**
 * Obtener portfolio público por username y slug
 * Solo devuelve portfolios con visibility = 'public'
 * NO requiere autenticación
 */
export async function getPublicPortfolio(
    username: string,
    slug: string
): Promise<PortfolioData | null> {
    try {
        const supabase = await getSupabaseServer();

        // 1. Buscar usuario por username
        const { data: profile } = await getFromSupabase('profiles', {
        username: username
        }, {
        single: true,
        select: 'id'
        });

        if (!profile) return null;

        // 2. Buscar portfolio público del usuario
        const portfolioResult = await getFromSupabase<Portfolio>('portfolios', {
        slug: slug,
        owner_id: profile.id,
        visibility: 'public' // Solo portfolios públicos
        }, {
        single: true
        });

        if (!portfolioResult.success || !portfolioResult.data) {
        return null;
        }

        const portfolio = portfolioResult.data;

        // 3. Obtener proyectos
        const projectsResult = await getFromSupabase<Project[]>('projects', {
        portfolio_id: portfolio.id
        }, {
        orderBy: { column: 'position', ascending: true }
        });

        const projects = projectsResult.data || [];

        // 4. Obtener items de cada proyecto
        const projectsWithItems = await Promise.all(
        projects.map(async (project) => {
            const itemsResult = await getFromSupabase<ProjectItem[]>('project_items', {
            project_id: project.id
            }, {
            orderBy: { column: 'position', ascending: true }
            });

            return {
            ...project,
            items: itemsResult.data || []
            };
        })
        );

        return {
        portfolio,
        projects: projectsWithItems
        };

    } catch (error) {
        console.error('Error in getPublicPortfolio:', error);
        return null;
    }
}