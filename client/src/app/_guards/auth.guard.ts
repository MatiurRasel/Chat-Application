import { CanActivateFn } from '@angular/router';
import {  inject } from '@angular/core';
import {  map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountservice = inject(AccountService);
  const toastr = inject(ToastrService);
  return accountservice.currentUser$.pipe(
    map(user=>{
      if(user) return true;
      else{
        toastr.error('You shall not pass!');
        return false;
      }
    })
  );

  
};

