import { IsString, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    @MaxLength(20)
    password!: string;

    @IsString()
    @MaxLength(20)
    newPassword!: string;

}