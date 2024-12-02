import { ApiItemCreate, ITEM_STATUS_LIST, ITEM_TYPE_LIST, ItemFilter } from '@la-casa-imperial/schemas/inventory/items';
import { ArrayNotEmpty, IsArray, IsHexadecimal, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { Type } from "class-transformer";
import { DetailDto } from './item-detail.dto';


export class ItemOtherCostDetail{
    @IsString()
    field!: string;

    @IsNumber()
    value!: number;
}

export class ItemOtherCost {
    @IsNumber()
    total!: number;

    @ArrayNotEmpty({ message: 'El array no puede estar vacío' })
    @ValidateNested({ each: true })
    @Type(() => ItemOtherCostDetail)
    details!: ItemOtherCostDetail[];
}


export class ItemCostDto {
    @IsNumber()
    @IsOptional()
    baseCost?: number;

    @ValidateNested()
    @Type(() => ItemOtherCost)
    @IsOptional()
    otherCosts?: ItemOtherCost
}

export class ItemSEODto {
    @IsString()
    @MaxLength(100)
    @IsOptional()
    title!: string;

    @IsString()
    @MaxLength(200)
    @IsOptional()
    description!: string;

    @IsString({ each: true })
    @IsOptional()
    keywords!: string[];
}

export class ItemCreateDto implements ApiItemCreate {

    @IsIn(ITEM_TYPE_LIST)
    @IsOptional()
    type?: 'product' | 'service' | undefined;

    @IsIn(ITEM_STATUS_LIST)
    @IsOptional()
    status?: 'active' | 'stopped' | undefined;

    @IsNumberString()
    @IsOptional()
    code?: string | undefined;

    @IsNumberString()
    @IsOptional()
    unspsc?: null | undefined;
    
    @IsNumberString()
    @IsOptional()
    barcode?: null | undefined;

    @IsNumber()
    @IsOptional()
    stock?: number | undefined;

    @IsNumber()
    @IsOptional()
    stockMin?: number | undefined;

    @IsString()
    @MaxLength(200)
    @IsNotEmpty()
    name!: string;

    @IsString()
    @MaxLength(30)
    @IsOptional()
    brand?: string | null | undefined;
    
    @IsString()
    @MaxLength(30)
    @IsOptional()
    model?: string | null | undefined;
    
    @ValidateNested()
    @Type(() => ItemCostDto)
    @IsOptional()
    cost?: ItemCostDto
    
    @IsNumber()
    @Max(1)
    @Min(0)
    @IsOptional()
    profit?: number | undefined;
    
    @IsNumber()
    price!: number;

    @IsNumber()
    @IsOptional()
    orderIndex?: number;

    @IsString()
    @MaxLength(200)
    @IsOptional()
    slug?: string | undefined;
    
    
    // flags?: ItemFlag[] | undefined;

    @IsHexadecimal()
    @Length(8)
    categoryId!: string;
    
    @IsString({ each: true})
    @IsOptional()
    tags?: string[] | undefined;

    @IsOptional()
    filters?: ItemFilter | undefined;

    @ValidateNested()
    @Type(() => ItemSEODto)
    @IsOptional()
    seo?: { title: string | null; description: string | null; keywords: []; } | undefined;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetailDto)
    @IsOptional()
    details?: DetailDto[] | undefined;
    
    @IsString()
    @MaxLength(500)
    @IsOptional()
    description?: string | null | undefined;
}