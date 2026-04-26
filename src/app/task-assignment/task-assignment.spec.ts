import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAssignment } from './task-assignment';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('TaskAssignment', () => {
  let component: TaskAssignment;
  let fixture: ComponentFixture<TaskAssignment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAssignment],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAssignment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
