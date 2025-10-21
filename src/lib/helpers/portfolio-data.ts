'use server';

import { getFromSupabase } from '@/lib/database/db';
import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import type { Portfolio, Project, ProjectItem } from '@/features/portfolio/types/portfolio';

export type ProjectWithItems = Project & {
    items: ProjectItem[];
};

export type PortfolioData = {
    portfolio: Portfolio;
    projects: ProjectWithItems[];
};

export async function getPortfolioWithProjects(
    slug: string,
    userId?: string
): Promise<PortfolioData | null> {
    try {
        let ownerId = userId;
        
        if (!ownerId) {
        const supabase = await getSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return null;
        
        ownerId = user.id;
        }

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

        const projectsResult = await getFromSupabase<Project[]>('projects', {
        portfolio_id: portfolio.id
        }, {
        orderBy: { column: 'position', ascending: true }
        });

        const projects = projectsResult.data || [];

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
        console.error('Error in getPortfolioWithProjects:', error);
        return null;
    }
}

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

export async function getPublicPortfolio(
    username: string,
    slug: string
): Promise<PortfolioData | null> {
    try {
        const supabase = await getSupabaseServer();

        const { data: profile } = await getFromSupabase('profiles', {
        username: username
        }, {
        single: true,
        select: 'id'
        });

        if (!profile) return null;

        const portfolioResult = await getFromSupabase<Portfolio>('portfolios', {
        slug: slug,
        owner_id: profile.id,
        visibility: 'public'
        }, {
        single: true
        });

        if (!portfolioResult.success || !portfolioResult.data) {
        return null;
        }

        const portfolio = portfolioResult.data;

        const projectsResult = await getFromSupabase<Project[]>('projects', {
        portfolio_id: portfolio.id
        }, {
        orderBy: { column: 'position', ascending: true }
        });

        const projects = projectsResult.data || [];

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