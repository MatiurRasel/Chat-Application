import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  confirm() {
    this.dialogRef.close(true);
  }

  decline() {
    this.dialogRef.close(false);
  }
}

export interface ConfirmDialogData {
  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;
}
