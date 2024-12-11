import { TestBed } from '@angular/core/testing';

import { ProductsDataSourceService } from './products-data-source.service';

describe('ProductsDataSourceService', () => {
  let service: ProductsDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
