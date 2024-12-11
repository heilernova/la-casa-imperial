import { Test, TestingModule } from '@nestjs/testing';
import { ProductsAndServicesController } from './products-and-services.controller';

describe('ProductsAndServicesController', () => {
  let controller: ProductsAndServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsAndServicesController],
    }).compile();

    controller = module.get<ProductsAndServicesController>(ProductsAndServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
