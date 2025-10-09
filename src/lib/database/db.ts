'use server';

/**
 * FUNCIONES GENÉRICAS PARA CRUD EN SUPABASE
 * 
 * Estas funciones son reutilizables para cualquier tabla de la DB.
 * En lugar de tener funciones específicas (createPortfolio, createProject, etc),
 * tenemos una sola función que funciona para todas las tablas.
 * 
 * VENTAJAS:
 * - Menos código duplicado
 * - Más fácil de mantener
 * - Más rápido de implementar nuevas features
 * 
 * FLUJO:
 * 1. Componente prepara el JSON con los datos
 * 2. Llama a saveToSupabase(tabla, datos)
 * 3. Esta función valida auth y guarda en DB
 * 4. Devuelve resultado (success/error)
 */

import { getSupabaseServer } from '@/lib/supabase/supabaseServer';
import { revalidatePath } from 'next/cache';

/**
 * Tipo de respuesta estándar para todas las operaciones
 */
interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Opciones para saveToSupabase
 */
interface SaveOptions {
    id?: string;              // Si existe, hace UPDATE. Si no, hace INSERT
    userId?: string;          // Para validar que el usuario tenga permisos
    returning?: boolean;      // Si devolver el registro guardado (default: true)
    revalidate?: string;      // Path a revalidar después de guardar (ej: '/dashboard')
}

/**
 * ============================================
 * FUNCIÓN PRINCIPAL: Guardar en cualquier tabla
 * ============================================
 * 
 * Esta es la función más importante. Reemplaza a:
 * - createPortfolio()
 * - createProject()
 * - createProjectItem()
 * - updatePortfolio()
 * - etc.
 * 
 * @param table - Nombre de la tabla ('portfolios', 'projects', 'project_items', etc)
 * @param data - Objeto con los datos a guardar
 * @param options - Configuración adicional (id para update, revalidate, etc)
 * 
 * EJEMPLO DE USO:
 * ```typescript
 * // INSERT (crear nuevo)
 * const result = await saveToSupabase('portfolios', {
 *   owner_id: user.id,
 *   title: 'Mi Portfolio',
 *   slug: 'mi-portfolio'
 * }, {
 *   revalidate: '/dashboard'
 * });
 * 
 * // UPDATE (actualizar existente)
 * const result = await saveToSupabase('portfolios', {
 *   title: 'Nuevo título'
 * }, {
 *   id: 'portfolio-uuid',
 *   revalidate: '/dashboard'
 * });
 * ```
 */
export async function saveToSupabase<T = any>(
    table: string,
    data: Record<string, any>,
    options?: SaveOptions
): Promise<ActionResponse<T>> {
    try {
        const supabase = await getSupabaseServer();
        
        // 1. AUTENTICACIÓN
        // Siempre verificar que el usuario esté logueado
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
        return {
            success: false,
            error: 'No estás autenticado'
        };
        }
        
        // 2. VALIDACIÓN DE PERMISOS (opcional)
        // Si pasas options.userId, valida que coincida con el usuario actual
        // Útil para asegurar que solo modifiques tus propios datos
        if (options?.userId && options.userId !== user.id) {
        return {
            success: false,
            error: 'No tienes permisos para esta operación'
        };
        }

        if (table === 'portfolios' && !data.owner_id) {
            data.owner_id = user.id;
        }
        
        // 3. DECIDIR ENTRE INSERT O UPDATE
        // Si hay options.id → UPDATE (modificar existente)
        // Si NO hay options.id → INSERT (crear nuevo)
        
        if (options?.id) {
        // ============================================
        // UPDATE: Actualizar registro existente
        // ============================================
        
        const { data: result, error } = await supabase
            .from(table)                  // Tabla a actualizar
            .update(data)                 // Campos a actualizar
            .eq('id', options.id)         // WHERE id = options.id
            .select();                    // Devolver el registro actualizado
        
        if (error) {
            console.error(`Error updating ${table}:`, error);
            return {
                success: false,
                error: `Error al actualizar en ${table}: ${error.message}`
            };
        }
        
        // 4. REVALIDAR CACHE DE NEXT.JS (si se especificó)
        // Esto hace que las páginas afectadas se actualicen automáticamente
        if (options.revalidate) {
            revalidatePath(options.revalidate);
        }
        
        return {
            success: true,
            data: result?.[0] as T
        };
        
        } else {
        // ============================================
        // INSERT: Crear nuevo registro
        // ============================================
        
        const { data: result, error } = await supabase
            .from(table)                  // Tabla donde insertar
            .insert(data)                 // Datos a insertar
            .select();                    // Devolver el registro creado
        
        if (error) {
            console.error(`Error inserting into ${table}:`, error);
            return {
                success: false,
                error: `Error al crear en ${table}: ${error.message}`
            };
        }
        
        // 4. REVALIDAR CACHE
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

/**
 * ============================================
 * FUNCIÓN: Obtener datos de cualquier tabla
 * ============================================
 * 
 * Reemplaza a:
 * - getUserPortfolios()
 * - getPortfolioBySlug()
 * - getProjectsByPortfolio()
 * - etc.
 * 
 * @param table - Nombre de la tabla
 * @param filters - Filtros WHERE (ej: { owner_id: 'uuid', slug: 'mi-slug' })
 * @param options - Configuración adicional
 * 
 * EJEMPLO DE USO:
 * ```typescript
 * // Obtener múltiples registros
 * const portfolios = await getFromSupabase('portfolios', {
 *   owner_id: user.id
 * }, {
 *   orderBy: { column: 'created_at', ascending: false }
 * });
 * 
 * // Obtener un solo registro
 * const portfolio = await getFromSupabase('portfolios', {
 *   slug: 'mi-portfolio'
 * }, {
 *   single: true,
 *   select: '*, projects(*, project_items(*))'  // Con relaciones
 * });
 * ```
 */
export async function getFromSupabase<T = any>(
    table: string,
    filters?: Record<string, any>,
    options?: {
        select?: string;                                     // Columnas a traer (default: '*')
        single?: boolean;                                    // Si esperar solo 1 resultado
        orderBy?: { column: string; ascending?: boolean };   // Orden
        limit?: number;                                      // Límite de resultados
    }
): Promise<ActionResponse<T>> {
    try {
        const supabase = await getSupabaseServer();
        
        // 1. CONSTRUIR QUERY BASE
        // Empezamos con select, luego añadimos filtros, orden, etc.
        let query = supabase
        .from(table)
        .select(options?.select || '*');  // Por defecto trae todas las columnas
        
        // 2. APLICAR FILTROS
        // Convierte { owner_id: 'uuid', visibility: 'public' }
        // en: WHERE owner_id = 'uuid' AND visibility = 'public'
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }
        
        // 3. APLICAR ORDEN
        if (options?.orderBy) {
            query = query.order(options.orderBy.column, {
                ascending: options.orderBy.ascending ?? true
            });
        }
        
        // 4. APLICAR LÍMITE
        if (options?.limit) {
        query = query.limit(options.limit);
        }
        
        // 5. EJECUTAR QUERY
        // Si options.single = true → espera 1 resultado (lanza error si hay 0 o más de 1)
        // Si options.single = false → devuelve array
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

/**
 * ============================================
 * FUNCIÓN: Eliminar de cualquier tabla
 * ============================================
 * 
 * Reemplaza a:
 * - deletePortfolio()
 * - deleteProject()
 * - deleteProjectItem()
 * - etc.
 * 
 * @param table - Nombre de la tabla
 * @param id - ID del registro a eliminar
 * @param options - Configuración adicional
 * 
 * EJEMPLO DE USO:
 * ```typescript
 * const result = await deleteFromSupabase('portfolios', 'portfolio-uuid', {
 *   revalidate: '/dashboard'
 * });
 * ```
 */
export async function deleteFromSupabase(
    table: string,
    id: string,
    options?: {
        revalidate?: string;  // Path a revalidar después de eliminar
    }
): Promise<ActionResponse> {
    try {
        const supabase = await getSupabaseServer();
        
        // 1. AUTENTICACIÓN
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
        return {
            success: false,
            error: 'No estás autenticado'
        };
        }
        
        // 2. ELIMINAR
        // CASCADE en la DB eliminará automáticamente registros relacionados
        // Ej: Al eliminar portfolio → elimina projects → elimina project_items
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
        
        // 3. REVALIDAR
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