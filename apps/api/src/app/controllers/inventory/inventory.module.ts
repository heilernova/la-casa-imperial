import { Module } from '@nestjs/common';
import { ItemsController } from './items/items.controller';
import { CategoriesController } from './categories/categories.controller';

@Module({
    controllers: [
        CategoriesController,
        ItemsController
    ]
})
export class InventoryModule {}
