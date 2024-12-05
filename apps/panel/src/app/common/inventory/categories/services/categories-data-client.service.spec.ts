import { TestBed } from '@angular/core/testing';

import { CategoriesDataClientService } from './categories-data-client.service';

describe('CategoriesDataClientService', () => {
  let service: CategoriesDataClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesDataClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
