import { TestBed } from '@angular/core/testing';

import { CommonHttpService } from './common-http.service';

describe('TestService', () => {
  let service: CommonHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
