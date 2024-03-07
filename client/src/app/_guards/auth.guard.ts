import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const snackBar = inject(MatSnackBar);

  return accountService.currentUser$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        snackBar.open('You shall not pass!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        return false;
      }
    })
  );
};
