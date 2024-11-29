import { ItemFilter, ItemStatus, ItemType } from "./item.types";

export interface ApiItem {
    id: string,
    createdAt: string,
    updatedAt: string,
    type: ItemType,
    status: ItemStatus,
    publish: boolean
    code: string,
    unspsc: string | null,
    barcode: string | null,
    stock: number,
    stockMin: number,
    name: string,
    brand: string | null,
    model: string | null,
    cost: {
        baseCost: number,
        otherCosts: {
            total: number,
            details: { field: string, value: number }[]
        }
        total: number;
    },
    profit: number,
    price: number,
    offer: {
        basePrice: number;
        percentage: number;
        exp: string | null;
    } | null,
    orderIndex: number,
    slug: string,
    flags: {
        value: string
    }[],
    tags: string[],
    filters: ItemFilter,
    categories: {
        id: string,
        name: string,
        slug: string
    }[],
    seo: {
        title: string | null,
        description: string | null,
        keywords: string[]
    },
    details: {
        title: string
        items: {
            field: string
            value: string
        }[]
    }[],
    gallery: string[],
    openGraphImages: {
        name: string;
        type: string;
        width: number;
        height: number;
        size: number;
        url: string;
    }[],
    description: string | null
}