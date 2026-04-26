import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServeComponent } from './serve';

describe('Serve', () => {
  let component: ServeComponent;
  let fixture: ComponentFixture<ServeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
