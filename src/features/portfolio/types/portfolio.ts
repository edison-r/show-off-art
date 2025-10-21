export const PORTFOLIO_LIMITS = {
    MAX_PORTFOLIOS_DRAFT: 6,
    MAX_PORTFOLIOS_PUBLIC: 3,
    MAX_PROJECTS_PER_PORTFOLIO: 6, 
    MAX_ITEMS_PER_PROJECT: 15,
    MAX_STORAGE_PER_USER: 75 * 1024 * 1024, // 75MB
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_CV_SIZE: 2 * 1024 * 1024, // 2MB
} as const;

export type Visibility = 'draft' | 'unlisted' | 'public';

export type ProjectItemType = 'image' | 'embed' | 'text';

export interface Profile {
    id: string;
    username: string;
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
    storage_used: number;
    created_at: string;
    updated_at: string;
}

export interface Portfolio {
    id: string;
    owner_id: string;
    title: string;
    slug: string;
    visibility: Visibility;
    is_featured: boolean;
    template_key: string;
    template_data: {
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
        [key: string]: any;
    };
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: string;
    portfolio_id: string;
    title: string;
    description: string | null;
    cover_image_url: string | null; 
    position: number; 
    created_at: string;
    updated_at: string;
}

export interface ProjectItem {
    id: string;
    project_id: string; // FK a projects.id
    item_type: ProjectItemType;
    data: ProjectItemData; // Varía según el tipo
    position: number;
    created_at: string;
    updated_at: string;
}

export type ProjectItemData = 
  | ImageItemData 
  | EmbedItemData 
  | TextItemData;

export interface ImageItemData {
     url: string;
     alt?: string;
     width?: number;
     height?: number;
     storage_path: string;
}

export interface EmbedItemData {
     provider: 'youtube' | 'vimeo' | 'other';
      url: string;
     embed_url?: string;
}

export interface TextItemData {
    html?: string; 
     md?: string;
}

export interface CVFile {
    id: string;
     portfolio_id: string;
     file_url: string; 
     is_public: boolean;
     created_at: string;
}

export interface PortfolioWithRelations extends Portfolio {
    projects: ProjectWithItems[];
    cv_file: CVFile | null;
}

export interface ProjectWithItems extends Project {
    items: ProjectItem[];
}

export interface CreatePortfolioInput {
    title: string;
    slug: string;
    visibility?: Visibility;
    template_key?: string; 
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
    position?: number;
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
    position?: number; 
}

export interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface UploadResponse {
    success: boolean;
    data?: {
        path: string;
        url: string;
        size: number;
    };
    error?: string;
}