import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  dialogRef?: MatDialogRef<ConfirmDialogComponent, boolean>;

  constructor(private dialog: MatDialog) { }

  confirm(
    title = 'Confirmation',
    message = 'Are you sure you want to do this?',
    btnOkText = 'Ok',
    btnCancelText = 'Cancel'
  ): Observable<boolean> {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title,
        message,
        btnOkText,
        btnCancelText
      }
    });

    return this.dialogRef.afterClosed().pipe(
      map(result => {
        return result || false;
      })
    );
  }
}
