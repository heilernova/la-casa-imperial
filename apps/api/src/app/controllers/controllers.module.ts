import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { AuthController } from './auth/auth.controller';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    InventoryModule,
    RouterModule.register([
      { path: 'inventory', module: InventoryModule }
    ])
  ],
  controllers: [
    AuthController
  ]
})
export class ControllersModule {}
