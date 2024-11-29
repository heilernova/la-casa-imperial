import { OmitBy, PartialWithout } from '@la-casa-imperial-nx/core';
import { ApiItem } from "./api-item.interface";

export interface ApiItemCreate extends PartialWithout<OmitBy<ApiItem, "id" | "createdAt" | "updatedAt" | "offer" | "openGraphImages" | "gallery" | "categories" | "cost">, "name" | "price"> {
    categoryId: string
    cost?: {
        baseCost?: number
        otherCosts?: {
            total: number,
            details: {
                field: string
                value: number
            }[]
        }
    }
}
