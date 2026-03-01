import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonDialog } from './reason-dialog';

describe('ReasonDialog', () => {
  let component: ReasonDialog;
  let fixture: ComponentFixture<ReasonDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReasonDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReasonDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
