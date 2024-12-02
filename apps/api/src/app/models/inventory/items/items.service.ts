import { HttpException, Injectable } from '@nestjs/common';
import { IItem, IItemCreateValues, IItemUpdateValues, ItemType } from '@la-casa-imperial/schemas/inventory/items'
import { DbConnectionService } from '../../../common/db-connection';
import { SQL_QUERY_PRODUCTS } from './sql-query-products';
import { isNumberString, isUUID } from 'class-validator';
import { ItemDbCreate, ItemDbUpdate } from './item-db-values.interfaces';
import { generateSlug } from '@la-casa-imperial/core';

type FilterOption = {
    publish?: boolean,
    type?: ItemType,
    category?: string[],
    name?: string
}

@Injectable()
export class ItemsService {
    constructor(
        private readonly _db: DbConnectionService
    ){}

    public async getLastId(): Promise<number> {
        const code = (await this._db.query<[number]>("SELECT MAX(code)::int FROM inventory_items", undefined, true)).rows[0][0];
        return code;
    }

    public async get(value: string): Promise<IItem | undefined> {
        const sql = `${SQL_QUERY_PRODUCTS} WHERE a.${isUUID(value) ? 'id' : (isNumberString(value) ? 'code' : 'slug') } = $1`;
        const item: IItem | undefined = (await this._db.query(sql, [value])).rows[0] ?? undefined;
        return item;
    }
    
    public async getAll(filter: FilterOption): Promise<IItem[]> {
        let sql = SQL_QUERY_PRODUCTS;
        let params: unknown[] | undefined = [];
        const conditions: string[] = [];
        if (filter.publish){
            conditions.push(`publish = $${params.push(true)}`);
        }

        if (filter.type) {
            conditions.push(`type = $${params.push(filter.type)}`)
        }

        if (filter.category){
            conditions.push(`app_match_categories(a.categories, $${filter.category})`);
        }

        if (conditions.length > 0){
            sql += ` WHERE ${conditions.join(" AND ")}`;
        } else {
            params = undefined;
        }

        return (await this._db.query<IItem>(sql, params)).rows;
    }

    public async create(data: IItemCreateValues): Promise<IItem>{
        const values: ItemDbCreate = {
            type: data.type ?? "product",
            publish: undefined,
            status: undefined,
            code: data.code ?? (await this.getLastId() + 1).toString(),
            barcode: data.barcode,
            category_id: data.categoryId,
            unspsc: data.unspsc,
            name: data.name.trim(),
            brand: data.brand,
            model: data.model,
            stock: data.stock,
            stockMin: data.stockMin,
            cost: data.cost?.baseCost,
            other_cost_value: data.cost?.otherCosts?.total,
            other_cost_details: data.cost?.otherCosts?.details,
            profit: data.price,
            price: data.price,
            order_index: data.orderIndex,
            slug: data.slug ?? generateSlug(data.name.trim()),
            flags: data.flags,
            tags: data.tags,
            filter: data.filters,
            seo_title: data.seo?.title,
            seo_description: data.seo?.description,
            seo_keywords: data.seo?.keywords,
            details: data.details,
            gallery: [],
            open_graph_images: [],
            description: data.description,
        };

        const id = (await this._db.insert<{ id: string }>("inventory_items", values, "id")).rows[0].id;
        const item = await this.get(id);
        if (!item) throw new HttpException(`Error al obtener la información del producto creado con el id ${id}`, 500);
        return item;
    }

    public async update(id: string, data: IItemUpdateValues): Promise<void> {
        const values: ItemDbUpdate = {
            type: data.type ?? "product",
            publish: data.publish,
            status: data.status,
            code: data.code ?? (await this.getLastId() + 1).toString(),
            barcode: data.barcode,
            category_id: data.categoryId,
            unspsc: data.unspsc,
            name: data.name?.trim(),
            brand: data.brand,
            model: data.model,
            stock: data.stock,
            stockMin: data.stockMin,
            cost: data.cost?.baseCost,
            other_cost_value: data.cost?.otherCosts?.total,
            other_cost_details: data.cost?.otherCosts?.details,
            profit: data.price,
            price: data.price,
            order_index: data.orderIndex,
            slug: data.slug,
            flags: data.flags,
            tags: data.tags,
            filter: data.filters,
            seo_title: data.seo?.title,
            seo_description: data.seo?.description,
            seo_keywords: data.seo?.keywords,
            details: data.details,
            gallery: data.gallery,
            open_graph_images: data.openGraphImages,
            description: data.description,
        }
        await this._db.update("inventory_items", ["id = $1", [id]], values);
    }

    public async isNameAvailable(name: string): Promise<boolean> {
        return (await this._db.query<[boolean]>("SELECT COUNT(*) = 0 FROM inventory_items WHERE LOWER(unaccent(name)) = LOWER(unaccent($1))", [name], true)).rows[0][0]
    }

    public async delete(id: string): Promise<boolean> {
        return (await this._db.delete("inventory_items", ["id", [id]])).rowCount == 1;
    }
}
