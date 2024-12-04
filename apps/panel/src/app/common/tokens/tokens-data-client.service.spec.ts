import { TestBed } from '@angular/core/testing';

import { TokensDataClientService } from './tokens-data-client.service';

describe('TokensDataClientService', () => {
  let service: TokensDataClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokensDataClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
