import { TestBed } from '@angular/core/testing';

import { TaskSortService } from './taskSort.service';

describe('TaskSortService', () => {
  let service: TaskSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
