import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[]=[];
  dialogRef: any; // Adjust the type based on the actual MatDialogRef type
  availableRoles = [
    'Admin','Moderator','Member'
  ]
  constructor(private adminService:AdminService,
    private dialog: MatDialog) {}
  ngOnInit(): void {
   this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => this.users = users
    })
  }

  openRolesModal(user: User) {
    const dialogConfig: MatDialogConfig = {
      width: '400px',
      data: {
        userName: user.userName,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    };

    this.dialogRef = this.dialog.open(RolesModalComponent, dialogConfig);

    this.dialogRef.afterClosed().subscribe({
      next: (selectedRoles: string[]) => {
        if (!this.arrayEqual(selectedRoles, user.roles)) {
          this.adminService.updateUserRoles(user.userName, selectedRoles).subscribe({
            next: (roles) => (user.roles = roles)
          });
        }
      }
    });
  }
  private arrayEqual(arr1: any[],arr2:any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

}
