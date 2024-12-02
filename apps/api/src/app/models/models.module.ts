import { Global, Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CategoriesService } from './inventory/categories/categories.service';
import { ItemsService } from './inventory/items/items.service';
import { TokensService } from './tokens/tokens.service';

const services = [UsersService, CategoriesService, ItemsService, TokensService];

@Global()
@Module({
  providers: services,
  exports: [UsersService, CategoriesService, ItemsService, TokensService]
})
export class ModelsModule {}
