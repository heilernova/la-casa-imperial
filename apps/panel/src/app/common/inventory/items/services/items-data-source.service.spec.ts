import { TestBed } from '@angular/core/testing';

import { ItemsDataSourceService } from './items-data-source.service';

describe('ItemsDataSourceService', () => {
  let service: ItemsDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
