import { TestBed } from '@angular/core/testing';

import { DiverSortService } from './diver-sort.service';

describe('DiverSortService', () => {
  let service: DiverSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiverSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
