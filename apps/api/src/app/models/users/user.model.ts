import { verify } from 'argon2';
import { Sex } from "@la-casa-imperial/schemas/global";
import { DbConnectionService } from '../../common/db-connection';

export class User {
    private readonly _db: DbConnectionService;
    private readonly pin: string | null;
    private readonly password: string;
    
    public readonly id: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly role: "admin" | "collaborator" | "customer";
    public readonly status: "active" | "lock";
    public readonly username: string;
    public readonly email: string;
    public readonly name: string;
    public readonly lastName: string;
    public readonly sex: Sex;
    public readonly cellphone: string;
    public readonly permissions: string[];


    public async matchPassword(password: string): Promise<boolean> {
        return verify(this.password, password);
    }

    public async matchPIN(pin: string): Promise<boolean> {
        if (this.pin){
            return await verify(this.pin, pin);
        }
        return false;
    }

    public async generateToken(data: { ip: string, platform: string | null, device: string }): Promise<string> {
        const exp = new Date();
        exp.setHours(exp.getHours() + 1);
        const values = {
            userId: this.id,
            ip: data.ip,
            platform: data.platform,
            device: data.device,
            exp: exp
        }

        const tokens: string[] = (await this._db.query<[string]>("SELECT id FROM users_tokens WHERE user_id = $1 ORDER BY created_at", [this.id], true)).rows.map(x => x[0]);
        if (tokens.length > 3){
            const deleteTokens = tokens.slice(0, tokens.length - 3);
            await this._db.query("DELETE FROM users_tokens WHERE id = ANY($1)", [deleteTokens]);
        }

        return (await this._db.insert<{ id: string }>("users_tokens", values, "id")).rows[0].id;
    }

    public async verifyToken(id: string): Promise<{ id: string, platform: string, device: string, exp: Date | null } | undefined> {
        const result = (await this._db.query<{ id: string, platform: string, device: string, exp: Date | null }>("SELECT id, ip, platform, device, exp FROM user_tokens WHERE user_id = $1", [id])).rows[0] ?? undefined;
        return result;
    }
}