import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reason-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './reason-dialog.html',
})
export class ReasonDialog {
  reasonText: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReasonDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  // onConfirm(): void {
  //   console.log('Reason submitted:', this.reasonText);
  //   this.dialogRef.close({
  //     reason: this.reasonText,
  //     date: new Date().toISOString(),
  //   });
  // }
}
