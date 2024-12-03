import { IsNumberString, MaxLength, MinLength } from 'class-validator';

export class UpdatePinDto {
    @IsNumberString()
    @MaxLength(4)
    @MinLength(4)
    pin!: string;
}