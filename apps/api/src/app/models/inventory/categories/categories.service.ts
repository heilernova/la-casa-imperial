import { Injectable } from '@nestjs/common';
import { ICategory } from '@la-casa-imperial/schemas/inventario/categories';
import { DbConnectionService } from '../../../common/db-connection';
import { isHexadecimal } from 'class-validator';
import { generateSlug } from '@la-casa-imperial/core';

@Injectable()
export class CategoriesService {
    constructor(private readonly _db: DbConnectionService){}

    public async get(value: string): Promise<ICategory | undefined>{
        const sql = `SELECT id, parent_id as "parentId", name, slug, description FROM inventory_categories WHERE ${isHexadecimal(value) && value.length == 8 ? "id" : "slug"} = $1`;
        return (await this._db.query<ICategory>(sql, [value])).rows[0] ?? undefined;
    }

    public async getAll(filters?: { parentId?: string | null }): Promise<ICategory[]> {
        let sql = `SELECT id, parent_id as "parentId", name, slug, description FROM inventory_categories`;
        let params: string[] | undefined = [];
        const conditions: string[] = [];
        if (filters?.parentId !== undefined){
            if (filters.parentId === null){
                conditions.push(`parent_id is null`);
            } else {
                conditions.push(`parent_id = $${params.push(filters.parentId)}`);
            }
        }
        if (conditions.length > 0){
            sql += ` WHERE ${conditions.join(" and ")}`;
        } else {
            params = undefined;
        }
        return (await this._db.query(sql, params)).rows;
    }

    public async create(data: { name: string, parentId?: string, description?: string }): Promise<ICategory> {
        const result = await this._db.insert<ICategory>("inventory_categories", data, `id, parent_id as "parentId", name, slug, description`);
        return result.rows[0];
    }

    public async update(id: string, data: { name: string, description?: string | null }): Promise<ICategory | false> {
        const values = {
            name: data.name,
            slug: generateSlug(data.name),
            description: data.description
        }
        const result = await this._db.update("inventory_categories", ["id = $1", [id]], values, `id, parent_id as "parentId", name, slug, description`);
        if (result.rowCount == 1){
            return result.rows[0]
        }
        return false
    }

    public async delete(id: string): Promise<boolean> {
        return (await this._db.delete("inventory_categories", ["id = $1", [id]])).rowCount == 1;
    }

    public async isNameAvailable(name: string, parentId?: string): Promise<boolean> {
        let sql = "SELECT COUNT(*) = 0 FROM inventory_categories WHERE lower(unaccent(name)) = lower(unaccent($1))";
        const params: string[] = [name];
        if (parentId){
            sql += " and parent_id = $2";
            params.push(parentId);
        }
        return (await this._db.query<[boolean]>(sql, params, true)).rows[0][0];
    }
}
