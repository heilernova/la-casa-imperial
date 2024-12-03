import { Body, Controller, Delete, Get, HttpException, Param, Put, UseGuards } from '@nestjs/common';
import { UpdatePasswordDto, UpdatePinDto, UpdateProfileDto } from './dto';
import { Authenticated, AuthGuard } from '../../authentication';
import { User, UsersService } from '../../models/users';
import { TokensService } from '../../models/tokens';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {

    constructor(
        private readonly _users: UsersService,
        private readonly _tokens: TokensService
    ){}

    @Get()
    async getInfo(@Authenticated("user") user: User){
        return {
            name: user.name,
            lastName: user.lastName,
            sex: user.sex,
            email: user.email,
            username: user.username,
            permissions: user.permissions
        }
    }

    @Put()
    async update(@Authenticated("user") user: User, @Body() body: UpdateProfileDto): Promise<void> {
        await this._users.update(user.id, body);
    }

    @Put('password')
    async updatePassword(@Authenticated("user") user: User, @Body() body: UpdatePasswordDto): Promise<void> {
        const ok: boolean = await user.matchPassword(body.password);
        if (!ok) throw new HttpException("Contraseña incorrecta", 400);
        await this._users.update(user.id, { password: body.newPassword });
    }
    
    @Put('pin')
    async updatePIN(@Authenticated("user") user: User, @Body() body: UpdatePinDto): Promise<void> {
        await this._users.update(user.id, { password: body.pin });
    }

    @Get('tokens')
    async getTokens(@Authenticated("user") user: User){
        const tokens = await this._tokens.getAll({ userId: user.id });
        return tokens.map(x => ({
            id: x.id,
            createdAt: x.createAt,
            exp: x.exp,
            ip: x.ip,
            platform: x.platform,
            device: x.device
        }))
    }

    @Delete('tokens/:id')
    async deleteToken(@Param('id') id: string){
        await this._tokens.delete(id);
    }
}
