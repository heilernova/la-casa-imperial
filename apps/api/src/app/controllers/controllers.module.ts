import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { AuthController } from './auth/auth.controller';
import { RouterModule } from '@nestjs/core';
import { ProfileController } from './profile/profile.controller';
import { MediaController } from './media/media.controller';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    InventoryModule,
    StoreModule,
    RouterModule.register([
      { path: 'inventory', module: InventoryModule },
      { path: 'store', module: StoreModule }
    ]),
  ],
  controllers: [
    AuthController,
    ProfileController,
    MediaController
  ]
})
export class ControllersModule {}
