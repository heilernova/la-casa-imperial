import { IsHexadecimal, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CategoryCreateDto {
    @IsString()
    @MaxLength(50)
    name!: string;

    @IsString()
    @MaxLength(200)
    @IsOptional()
    @IsNotEmpty()
    description!: string;

    @IsHexadecimal()
    @MaxLength(8)
    @MinLength(8)
    @IsOptional()
    parentId!: string;
}