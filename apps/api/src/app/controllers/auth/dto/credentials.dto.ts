import { ApiCredentials } from '@la-casa-imperial/schemas/auth';
import { IsString, MaxLength } from 'class-validator';

export class CredentialsDto implements ApiCredentials {
    @IsString()
    @MaxLength(100)
    username!: string;

    @IsString()
    @MaxLength(30)
    password!: string;
}