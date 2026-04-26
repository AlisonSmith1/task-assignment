import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonDialog } from './reason-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ReasonDialog', () => {
  let component: ReasonDialog;
  let fixture: ComponentFixture<ReasonDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReasonDialog],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
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
