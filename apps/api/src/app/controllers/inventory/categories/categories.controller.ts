import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ICategory } from '@la-casa-imperial/schemas/inventario/categories';
import { CategoryCreateDto, CategoryUpdateDto } from './dto';
import { CategoriesService } from '../../../models/inventory';
import { CategoryPipe } from '../../../models/inventory/categories';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly _categories: CategoriesService
    ) {}

    @Get()
    async getAll(@Query('parent') parent?: string ){
        return this._categories.getAll({ parentId: parent ? (parent == 'null' ? null : parent) : undefined })
    }

    @Post()
    async create(@Body() body: CategoryCreateDto){
        const valid = await this._categories.isNameAvailable(body.name, body.parentId);
        if (!valid) throw new HttpException("Ya existe la categoría", 400);
        return await this._categories.create({ ...body });
    }

    @Put(':id')
    async update(@Param('id', CategoryPipe) category: ICategory, @Body() body: CategoryUpdateDto){
        const valid = await this._categories.isNameAvailable(body.name, category.parentId ?? undefined);
        if (!valid) throw new HttpException("Ya existe la categoría", 400);
        const result = await this._categories.update(category.id, body);
        if (!result) throw new HttpException("No se pudo actualizar la categoría", 400);

        return {
            id: result.id,
            parentId: result.id,
            name: result.name,
            description: result.description,
            slug: result.slug
        }
    }

    @Delete(':id')
    async delete(@Param('id', CategoryPipe) category: ICategory){
        await this._categories.delete(category.id);
    }

    @Get(':id/children')
    async getChildren(@Param('id', CategoryPipe) category: ICategory){
        const result = await this._categories.getAll({ parentId: category.id });
        return result;
    }
}
