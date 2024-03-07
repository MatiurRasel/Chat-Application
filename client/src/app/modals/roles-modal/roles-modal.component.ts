import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  userName = '';
  availableRoles: any[] = [];
  selectedRoles: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<RolesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.userName = this.data.userName;
    this.availableRoles = this.data.availableRoles;
    this.selectedRoles = [...this.data.selectedRoles];
  }

  updateChecked(checkedValue: string): void {
    const index = this.selectedRoles.indexOf(checkedValue);

    index !== -1
      ? this.selectedRoles.splice(index, 1)
      : this.selectedRoles.push(checkedValue);
  }

  submit(): void {
    this.dialogRef.close(this.selectedRoles);
  }
}
