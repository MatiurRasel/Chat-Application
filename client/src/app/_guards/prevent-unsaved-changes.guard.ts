import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { ConfirmService } from '../_services/confirm.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';

export const preventUnsavedChangesGuard
: CanDeactivateFn<MemberEditComponent> = (component, currentRoute, currentState, nextState) => {
  
  if(component.editForm?.dirty){
    const confirmService = inject(ConfirmService);
    return confirmService.confirm();
  }
  return of(true);
};
