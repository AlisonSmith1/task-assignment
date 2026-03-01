import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Serve } from './serve';

describe('Serve', () => {
  let component: Serve;
  let fixture: ComponentFixture<Serve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Serve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Serve);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
