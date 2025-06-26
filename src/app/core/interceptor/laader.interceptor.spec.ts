import { TestBed } from '@angular/core/testing';

import { LaaderInterceptor } from './laader.interceptor';

describe('LaaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LaaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LaaderInterceptor = TestBed.inject(LaaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
