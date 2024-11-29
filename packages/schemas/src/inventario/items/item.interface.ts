import exp = require("constants");
import { ItemFilter, ItemStatus, ItemType } from "./item.types";

export interface IItem {
    id: string,
    createdAt: Date,
    updatedAt: Date,
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
        basePrice: number
        percentage: number
        date: Date | null
    } | null,
    orderIndex: number,
    slug: string,
    flags: {
        value: string
    }[],
    tags: string[],
    filters: ItemFilter,
    categories: IItemCategory[],
    seo: {
        title: string | null,
        description: string | null,
        keywords: string[]
    },
    details: IDetail[],
    gallery: string[],
    openGraphImages: IOpenGraphImage[],
    description: string | null
}


export interface IItemCategory {
    id: string;
    name: string;
    slug: string
}

export interface IDetail {
    title: string
    items: IDetailItem[]
}

export interface IDetailItem {
    field: string;
    value: string;
}

export interface IOpenGraphImage {
    name: string;
    type: string;
    width: number;
    height: number;
    size: number;
    url: string;
}