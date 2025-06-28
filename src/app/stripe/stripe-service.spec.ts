import { TestBed } from '@angular/core/testing';

import { StripeServe } from './stripe-service';

describe('StripeServe', () => {
  let service: StripeServe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeServe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
