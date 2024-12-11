import { Module } from '@nestjs/common';
import { ProductsAndServicesController } from './products-and-services/products-and-services.controller';

@Module({
  controllers: [ProductsAndServicesController]
})
export class StoreModule {}
