import { Injectable } from '@nestjs/common';
import { IToken } from '@la-casa-imperial/schemas/users';
import { DbConnectionService } from '../../common/db-connection';

@Injectable()
export class TokensService {
    constructor(private readonly _db: DbConnectionService){}

    public async get(id: string, userId?: string): Promise<IToken> { 
        let sql = `SELECT id, create_at as "createAt", user_id as "userId", exp, ip, platform, device FROM users_tokens WHERE id = $1`;
        const params: string[] = [id];
        if (userId){
            sql += " and user_id = $2";
            params.push(userId);
        }
        return (await this._db.query(sql, params)).rows[0];
    }

    public async getAll(filters?: { userId?: string }): Promise<IToken[]> {
        const conditions: string[] = [];
        let sql = `id, create_at as "createAt", user_id as "userId", exp, ip, platform, device FROM users_tokens`;
        let params: string[] | undefined = [];
        if (filters?.userId){
            conditions.push(`user_id = $${params.push(filters.userId)}`);
        }

        if (conditions.length > 0)  {
            sql += " where " + conditions.join(" and ");
        } else {
            params = undefined;
        }
        return (await this._db.query(sql, params)).rows;
    }

    public async delete(id: string | string[]): Promise<void> {
        if (Array.isArray(id)){
            await this._db.query("DELETE FORM users_tokens WHERE id = ANY($1)", [id]);
        } else {
            await this._db.query("DELETE FORM users_tokens WHERE id = $1", [id]);
        }
    }
}
