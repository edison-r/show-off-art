/**
 * CONSTANTES - Límites y configuración
 */

export const PORTFOLIO_LIMITS = {
    MAX_PORTFOLIOS_DRAFT: 6, // Máximo de portfolios en draft
    MAX_PORTFOLIOS_PUBLIC: 3, // Máximo de portfolios públicos
    MAX_PROJECTS_PER_PORTFOLIO: 6, // Enforced en DB con trigger
    MAX_ITEMS_PER_PROJECT: 15,
    MAX_STORAGE_PER_USER: 75 * 1024 * 1024, // 75MB
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_CV_SIZE: 2 * 1024 * 1024, // 2MB
} as const;
/**
 * TIPOS BASE - Reflejan exactamente la estructura de la DB
 * Estos son los tipos que corresponden a cada tabla de Supabase
 */

// Enum de visibilidad (igual que en DB)
export type Visibility = 'draft' | 'unlisted' | 'public';

// Enum de tipo de item (igual que en DB)
export type ProjectItemType = 'image' | 'embed' | 'text';

// Tipo para el perfil (tabla profiles)
export interface Profile {
    id: string; // UUID del usuario (viene de auth.users)
    username: string; // Único, para URL /u/username
    display_name: string;
    avatar_url: string | null;
    bio: string | null;
    socials: {
        instagram?: string;
        github?: string;
        behance?: string;
        website?: string;
    };
    role: 'admin' | 'user';
    storage_used: number; // Bytes usados en storage
    created_at: string;
    updated_at: string;
}

// Tipo para portfolio (tabla portfolios)
export interface Portfolio {
    id: string; // UUID generado por DB
    owner_id: string; // FK a profiles.id
    title: string; // Ej: "Frontend Portfolio"
    slug: string; // Único global, para URL /u/username/slug
    visibility: Visibility;
    is_featured: boolean; // Para destacar en home
    template_key: string; // Ej: "bento_v1", "minimal", etc
    template_data: {
        // Datos específicos del template (flexible, JSON)
        about?: string;
        specialties?: string[];
        contact?: {
        email?: string;
        phone?: string;
        };
        theme?: {
        primaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
        };
        [key: string]: any; // Permite otros campos custom
    };
    published_at: string | null; // Se setea automáticamente al publicar
    created_at: string;
    updated_at: string;
}

// Tipo para proyecto (tabla projects)
export interface Project {
    id: string;
    portfolio_id: string; // FK a portfolios.id
    title: string; // Ej: "E-commerce App"
    description: string | null;
    cover_image_url: string | null; // URL de imagen en Supabase Storage
    position: number; // Para ordenar (0, 1, 2...)
    created_at: string;
    updated_at: string;
}

// Tipo para item de proyecto (tabla project_items)
export interface ProjectItem {
    id: string;
    project_id: string; // FK a projects.id
    item_type: ProjectItemType;
    data: ProjectItemData; // Varía según el tipo
    position: number;
    created_at: string;
    updated_at: string;
}

// Union type para data según el tipo de item
export type ProjectItemData = 
  | ImageItemData 
  | EmbedItemData 
  | TextItemData;

// Data para items tipo "image"
export interface ImageItemData {
     url: string; // URL de Supabase Storage
     alt?: string;
     width?: number;
     height?: number;
     storage_path: string; // Path en storage: user-id/portfolio-id/project-id/filename
}

// Data para items tipo "embed"
export interface EmbedItemData {
     provider: 'youtube' | 'vimeo' | 'other';
      url: string; // URL original del video
     embed_url?: string; // URL procesada para iframe
}

// Data para items tipo "text"
export interface TextItemData {
    html?: string; // HTML del texto
     md?: string; // Markdown alternativo
}

// Tipo para CV (tabla cv_files)
export interface CVFile {
    id: string;
     portfolio_id: string;
     file_url: string; // URL de Supabase Storage (bucket cv)
     is_public: boolean;
     created_at: string;
}

/**
 * TIPOS EXTENDIDOS - Para uso en el frontend
 * Incluyen relaciones y datos anidados
 */

// Portfolio con sus relaciones cargadas
export interface PortfolioWithRelations extends Portfolio {
    projects: ProjectWithItems[];
    cv_file: CVFile | null;
}

// Proyecto con sus items cargados
export interface ProjectWithItems extends Project {
    items: ProjectItem[];
}

/**
 * TIPOS PARA FORMS - Para crear/editar
 * No incluyen IDs ni timestamps (los genera la DB)
 */

export interface CreatePortfolioInput {
    title: string;
    slug: string; // Debe ser único globalmente
    visibility?: Visibility; // Default 'draft'
    template_key?: string; // Default 'bento_v1'
    template_data?: Portfolio['template_data'];
}

export interface UpdatePortfolioInput {
    title?: string;
    slug?: string;
    visibility?: Visibility;
    template_key?: string;
    template_data?: Portfolio['template_data'];
    is_featured?: boolean;
}

export interface CreateProjectInput {
    portfolio_id: string;
    title: string;
    description?: string;
    cover_image_url?: string;
    position?: number; // Se auto-calcula si no se proporciona
}

export interface UpdateProjectInput {
    title?: string;
    description?: string;
    cover_image_url?: string;
    position?: number;
}

export interface CreateProjectItemInput {
    project_id: string;
    item_type: ProjectItemType;
    data: ProjectItemData;
    position?: number; // Se auto-calcula si no se proporciona
}

/**
 * TIPOS PARA RESPUESTAS DE API
 * Incluyen éxito/error estandarizados
 */

export interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

// Respuesta de subida de archivos
export interface UploadResponse {
    success: boolean;
    data?: {
        path: string; // Path en storage
        url: string; // URL pública
        size: number; // Tamaño en bytes
    };
    error?: string;
}