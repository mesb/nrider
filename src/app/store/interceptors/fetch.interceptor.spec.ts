import { TestBed } from '@angular/core/testing';

import { FetchInterceptor } from './fetch.interceptor';

describe('FetchInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FetchInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: FetchInterceptor = TestBed.inject(FetchInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
