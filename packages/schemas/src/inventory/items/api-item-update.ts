import { OmitBy, PartialWithout } from "@la-casa-imperial/core";
import {  } from "./api-item-create.interface";
import { ApiItem } from "./api-item.interface";

export interface ApiItemUpdate extends PartialWithout<OmitBy<ApiItem, "id" | "createdAt" | "updatedAt" | "offer" | "openGraphImages" | "gallery" | "categories" | "cost">, "name" | "price"> {
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