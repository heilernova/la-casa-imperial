export interface ApiCategory {
    id: string;
    name: string;
    description: string | null;
    parentId: string | null;
    slug: string;
}

export interface ApiCategoryCreate {
    name: string;
    description?: string | null;
    parentId?: string | null
}

export interface ApiCategoryUpdate {
    name?: string;
    description?: string | null;
}