import { OmitBy, PartialWithout } from "@la-casa-imperial/core";
import { IDetail, IOpenGraphImage, ItemFilter, ItemStatus, ItemType } from "@la-casa-imperial/schemas/inventario/items";

export interface IItemDbValues {
    id: string;
    created_at: Date;
    updated_at: Date;
    type: ItemType;
    status: ItemStatus;
    publish: boolean;
    category_id: string;
    code: string;
    unspsc: string | null;
    barcode: string | null;
    stock: number;
    stockMin: number;
    name: string;
    brand: string | null;
    model: string | null;
    cost: number;
    other_cost_value: number;
    other_cost_details: { field: string, value: number }[];
    profit: number;
    price: number;
    order_index: number;
    slug: string;
    flags: { value: string }[];
    tags: string[];
    filter: ItemFilter;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string[];
    details: IDetail[];
    gallery: string[];
    open_graph_images: OmitBy<IOpenGraphImage, "url">[]
    description: string | null
}

export type ItemDbCreate = PartialWithout<OmitBy<IItemDbValues, "id" | "created_at" | "updated_at">, "code" | "name" | "price" | "slug" | "category_id">
export type ItemDbUpdate = Partial<OmitBy<IItemDbValues, "id" | "created_at">>