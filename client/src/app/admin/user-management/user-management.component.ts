import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'], // Update to use .scss for Tailwind integration
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['userName', 'roles', 'actions']; // Adjust columns based on your needs
  availableRoles = ['Admin', 'Moderator', 'Member'];
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private adminService: AdminService, private dialog: MatDialog) {}
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users) => (this.dataSource.data = users),
    });
  }

  openRolesModal(user: User) {
    const dialogConfig: MatDialogConfig = {
      width: '400px',
      data: {
        userName: user.userName,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles],
      },
    };

    const dialogRef = this.dialog.open(RolesModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe({
      next: (selectedRoles: string[]) => {
        if (!this.arrayEqual(selectedRoles, user.roles)) {
          this.adminService.updateUserRoles(user.userName, selectedRoles).subscribe({
            next: (roles) => (user.roles = roles),
          });
        }
      },
    });
  }

  private arrayEqual(arr1: any[], arr2: any[]) {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}
