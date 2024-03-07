import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const snackBar = inject(MatSnackBar);

  return accountService.currentUser$.pipe(
    map((user) => {
      if (!user) {
        return false;
      }

      if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
        return true;
      } else {
        snackBar.open('You cannot enter this area', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return false;
      }
    })
  );
};
