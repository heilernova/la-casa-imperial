import { IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @MaxLength(20)
    @IsOptional()
    name!: string;

    @IsString()
    @MaxLength(20)
    @IsOptional()
    lastName!: string;
    
    @IsString()
    @MaxLength(20)
    @IsOptional()
    username!: string;
    
    @IsEmail()
    @MaxLength(100)
    @IsOptional()
    email!: string;

    @IsIn(['M', 'F'])
    @IsOptional()
    sex!: 'M' | 'F' | null;

    @IsString({ each: true })
    @IsOptional()
    permissions!: string[];
}