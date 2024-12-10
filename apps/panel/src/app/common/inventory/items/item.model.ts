import { IDetail, IItem, IItemCategory, IOpenGraphImage, ItemFilter } from "@la-casa-imperial/schemas/inventory/items";

export class Item implements IItem {
    public readonly id!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly type!: "product" | "service" | "combo";
    public readonly status!: "active" | "stopped" | "discontinued";
    public readonly publish!: boolean;
    public readonly code!: string;
    public readonly unspsc!: string | null;
    public readonly barcode!: string | null;
    public readonly stock!: number;
    public readonly stockMin!: number;
    public readonly name!: string;
    public readonly brand!: string | null;
    public readonly model!: string | null;
    public readonly cost!: { baseCost: number; otherCosts: { total: number; details: { field: string; value: number; }[]; }; total: number; };
    public readonly profit!: number;
    public readonly price!: number;
    public readonly offer!: { basePrice: number; percentage: number; exp: Date | null; } | null;
    public readonly orderIndex!: number;
    public readonly slug!: string;
    public readonly flags!: { value: string; }[];
    public readonly tags!: string[];
    public readonly filters!: ItemFilter;
    public readonly categories!: IItemCategory[];
    public readonly seo!: { title: string | null; description: string | null; keywords: string[]; };
    public readonly details!: IDetail[];
    public readonly gallery!: string[];
    public readonly openGraphImages!: IOpenGraphImage[];
    public readonly description!: string | null;
 
}