import { IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class DetailItemDto {
    @IsString()
    field!: string;

    @IsString()
    value!: string;
}

export class DetailDto {
    @IsString()
    title!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetailItemDto)
    items!: DetailItemDto[];
}