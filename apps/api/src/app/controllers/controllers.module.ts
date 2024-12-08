import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { AuthController } from './auth/auth.controller';
import { RouterModule } from '@nestjs/core';
import { ProfileController } from './profile/profile.controller';

@Module({
  imports: [
    InventoryModule,
    RouterModule.register([
      { path: 'inventory', module: InventoryModule }
    ])
  ],
  controllers: [
    AuthController,
    ProfileController
  ]
})
export class ControllersModule {}
