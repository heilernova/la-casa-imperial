import { Body, Controller, Headers, HttpException, Ip, Post } from '@nestjs/common';
import { ApiSession } from '@la-casa-imperial/schemas/auth';
import { UAParser } from 'ua-parser-js';
import { isEmail } from 'class-validator';
import { CredentialsDto } from './dto';
import { User, UsersService } from '../../models/users';

@Controller()
export class AuthController {
    constructor(
        private readonly _users: UsersService
    ){}

    @Post('sign-in')
    async signIn(@Body() body: CredentialsDto, @Headers("user-agent") userAgentString: string, @Ip() ip: string): Promise<ApiSession> {
        const user: User | undefined = await this._users.get(body.username);
        if (!user) throw new HttpException(`${isEmail(body.username) ? 'Correo electrónico' : 'usuario'} incorrecto`, 400);
        if (!(await user.matchPassword(body.password))) throw new HttpException("Contraseña incorrecta", 400);
        const userAgent = new UAParser(userAgentString);
        const token = await user.generateToken({
            ip,
            device: userAgent.getDevice().type ?? "desktop",
            platform: userAgent.getOS().name ?? null
        });
        return {
            username: user.username,
            name: user.lastName,
            lastName: user.name,
            role: user.role,
            token: token,
            pin: user.pin,
            permissions: user.permissions,
        }
    }
}
