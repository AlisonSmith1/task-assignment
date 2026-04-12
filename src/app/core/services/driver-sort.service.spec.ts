import { TestBed } from '@angular/core/testing';

import { DriverSortService } from './driver-sort.service';

describe('DriverSortService', () => {
  let service: DriverSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
