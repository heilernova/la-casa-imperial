import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CategoryUpdateDto {
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    @IsOptional()
    name!: string;
    
    @IsString()
    @MaxLength(200)
    @IsOptional()
    @IsNotEmpty()
    description!: string;
}