import { TestBed } from '@angular/core/testing';

import { ItemsDataClientService } from './items-data-client.service';

describe('ItemsDataClientService', () => {
  let service: ItemsDataClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsDataClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
