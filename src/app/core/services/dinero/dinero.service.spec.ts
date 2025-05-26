import { TestBed } from '@angular/core/testing';

import { DineroService } from './dinero.service';

describe('DineroService', () => {
  let service: DineroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DineroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
