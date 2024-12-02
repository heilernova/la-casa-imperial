export interface ICategory {
    id: string;
    parentId: string | null;
    name: string;
    slug: string;
    description: string | null;
}