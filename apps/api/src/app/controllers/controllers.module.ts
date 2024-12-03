import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { AuthController } from './auth/auth.controller';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    AuthController,
    InventoryModule,
    RouterModule.register([
      { path: 'inventory', module: InventoryModule }
    ])
  ]
})
export class ControllersModule {}
