'use server';

import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { revalidatePath } from 'next/cache';

interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

interface SaveOptions {
    id?: string;              
    userId?: string;          
    returning?: boolean;      
    revalidate?: string;      
}


export async function saveToSupabase<T = any>(
    table: string,
    data: Record<string, any>,
    options?: SaveOptions
): Promise<ActionResponse<T>> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
        return {
            success: false,
            error: 'No estás autenticado'
        };
        }
        
        if (options?.userId && options.userId !== user.id) {
        return {
            success: false,
            error: 'No tienes permisos para esta operación'
        };
        }

        if (table === 'portfolios' && !data.owner_id) {
            data.owner_id = user.id;
        }

        if (options?.id) {
        
        const { data: result, error } = await supabase
            .from(table)                 
            .update(data)                
            .eq('id', options.id)         
            .select();                   
        
        if (error) {
            console.error(`Error updating ${table}:`, error);
            return {
                success: false,
                error: `Error al actualizar en ${table}: ${error.message}`
            };
        }
        
        if (options.revalidate) {
            revalidatePath(options.revalidate);
        }
        
        return {
            success: true,
            data: result?.[0] as T
        };
        
        } else {

        const { data: result, error } = await supabase
            .from(table)                  
            .insert(data)             
            .select();                   
        
        if (error) {
            console.error(`Error inserting into ${table}:`, error);
            return {
                success: false,
                error: `Error al crear en ${table}: ${error.message}`
            };
        }
        
        if (options?.revalidate) {
            revalidatePath(options.revalidate);
        }
        
        return {
            success: true,
            data: result?.[0] as T
        };
        }
        
    } catch (error) {
        console.error(`Unexpected error in saveToSupabase (${table}):`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error inesperado'
        };
    }
}

export async function getFromSupabase<T = any>(
    table: string,
    filters?: Record<string, any>,
    options?: {
        select?: string;                               
        single?: boolean;                                    
        orderBy?: { column: string; ascending?: boolean };   
        limit?: number;                                      
    }
): Promise<ActionResponse<T>> {
    try {
        const supabase = await getSupabaseServer();
        
        let query = supabase
        .from(table)
        .select(options?.select || '*'); 

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }
        
        if (options?.orderBy) {
            query = query.order(options.orderBy.column, {
                ascending: options.orderBy.ascending ?? true
            });
        }
        
        if (options?.limit) {
        query = query.limit(options.limit);
        }

        const { data, error } = options?.single
        ? await query.single()
        : await query;
        
        if (error) {
        console.error(`Error fetching from ${table}:`, error);
        return {
            success: false,
            error: `Error al obtener datos de ${table}: ${error.message}`
        };
        }
        
        return {
            success: true,
            data: data as T
        };
        
    } catch (error) {
        console.error(`Unexpected error in getFromSupabase (${table}):`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error inesperado'
        };
    }
}

export async function deleteFromSupabase(
    table: string,
    id: string,
    options?: {
        revalidate?: string;  
    }
): Promise<ActionResponse> {
    try {
        const supabase = await getSupabaseServer();
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
        return {
            success: false,
            error: 'No estás autenticado'
        };
        }

        const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
        
        if (error) {
        console.error(`Error deleting from ${table}:`, error);
        return {
            success: false,
            error: `Error al eliminar de ${table}: ${error.message}`
        };
        }
        
        if (options?.revalidate) {
        revalidatePath(options.revalidate);
        }
        
        return {
            success: true
        };
        
    } catch (error) {
        console.error(`Unexpected error in deleteFromSupabase (${table}):`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error inesperado'
        };
    }
}