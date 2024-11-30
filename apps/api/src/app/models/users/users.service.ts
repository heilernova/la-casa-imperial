import { Injectable } from '@nestjs/common';
import { IUserBase, UserCreateValues, UserUpdateValues } from '@la-casa-imperial/schemas/users';
import { isUUID, isEmail } from 'class-validator';
import { DbConnectionService } from '../../common/db-connection';
import { hash } from 'argon2';
import { capitalize } from '@la-casa-imperial/core';
import { User } from './user.model';

const ROW_FIELDS = [
    'id',
    'created_at as "createdAt"',
    'updated_at as "updatedAt"',
    'role',
    'status',
    'username',
    'email',
    'name',
    'last_name as "lastName"',
    'sex',
    'cellphone',
    'pin',
    'password',
    'permissions'
]
type FilterUserOptions = { ignoreId?: string, role?: "admin" | "collaborator" | "customer" };

@Injectable()
export class UsersService {
    private readonly _fields: string = ROW_FIELDS.join(", ");
    constructor(private readonly _db: DbConnectionService){}

    private generateModel(data: IUserBase): User {
        const user = new User();
        const properties: PropertyDescriptorMap = { 
            "_db": { value: this._db },
            ...Object.fromEntries(Object.entries(data).map(([key, value]) => [key, { value }])) 
        };
        Object.defineProperties(user, properties);
        return user;
    }

    public async get(value: string, raw?: false): Promise<User | undefined>
    public async get(value: string, raw?: true): Promise<IUserBase | undefined>
    public async get(value: string, raw?: boolean): Promise<IUserBase | User | undefined> {
        const field = isUUID(value) ? 'id' : (isEmail(value) ? 'email' : 'username');
        const sql = `SELECT ${this._fields} FROM users WHERE ${field} = $1`;
        const result: IUserBase | undefined = (await this._db.query(sql, [value])).rows[0] ?? undefined;
        if (!result || raw){
            return result;
        }
        return this.generateModel(result);
    }

    public async getAll(options: FilterUserOptions, raw?: true): Promise<IUserBase[]>
    public async getAll(options: FilterUserOptions, raw?: false): Promise<User[]>
    public async getAll(options: FilterUserOptions, raw?: boolean): Promise<(IUserBase | User)[]> {
        let sql = `SELECT ${this._fields} FROM users`;
        let params: string[] | undefined = [];
        const conditions: string[] = [];
        if (options.ignoreId) conditions.push(`id <> $${params.push(options.ignoreId)}`);
        if (options.role) conditions.push(`role = $${params.push(options.role)}`);
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" and ")}`;
        } else {
            params = undefined;
        }
        const result = (await this._db.query<IUserBase>(sql, params)).rows;
        if (raw) {
            return result;
        }
        return result.map(x => this.generateModel(x));
    }

    public async create(data: UserCreateValues, raw?: false): Promise<User>
    public async create(data: UserCreateValues, raw?: true): Promise<IUserBase>
    public async create(data: UserCreateValues, raw?: boolean): Promise<IUserBase | User> {
        data.email = data.email.toLocaleLowerCase();
        data.name = capitalize(data.name);
        data.lastName = capitalize(data.lastName);
        data.password = await hash(data.password);
        const result = (await this._db.insert<IUserBase>("users", data, this._fields)).rows[0];
        if (raw){
            return result;
        }
        return this.generateModel(result);
    }

    public async update(id: string, data: UserUpdateValues): Promise<void> {
        if (data.email) data.email = data.email.toLowerCase();
        if (data.name) data.name = capitalize(data.name);
        if (data.lastName) data.lastName = capitalize(data.lastName);
        if (data.pin) data.pin = await hash(data.pin);
        if (data.password) data.password = await hash(data.password);
        await this._db.update("users", ["id = $1", [id]], { updatedAt: new Date(), ...data });
    }

    public async delete(id: string): Promise<void> {
        await this._db.delete("users", ["id = $1", [id]]);
    }

    public async verifyValues(data: { email?: string, username?: string, ignoreId?: string }): Promise<{ email?: boolean, username?: boolean }> {
        let queries: string[] = [];
        const params: (string | undefined)[] = [];
    
        if (data.email) {
            queries.push(`SELECT COUNT(*) = 0 FROM users WHERE email = lower($${params.push(data.email)})`);
        }
    
        if (data.username) {
            queries.push(`SELECT COUNT(*) = 0 FROM users WHERE lower(username) = lower($${params.push(data.username)})`);
        }
    
        if (queries.length === 0) {
            return {};
        }

        if (data.ignoreId){
            const index = params.push(data.ignoreId);
            queries = queries.map(query => `${query} AND id <> $${index}`);
        }
    
        const sql = `SELECT (${queries.join("), (")})`;
        const results = (await this._db.query<boolean[]>(sql, params, true)).rows[0];
    
        return {
            email: data.email ? results.shift() : undefined,
            username: data.username ? results.shift() : undefined
        };
    }
    
}
