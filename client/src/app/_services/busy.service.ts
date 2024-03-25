import { Injectable } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  private busyRequestCount = 0;
  private spinnerVisibleSubject = new BehaviorSubject<boolean>(false);
  spinnerVisible$ = this.spinnerVisibleSubject.asObservable();

  constructor() { }

  busy() {
    this.busyRequestCount++;
    if (this.busyRequestCount === 1) {
      this.spinnerVisibleSubject.next(true); // Show spinner
    }
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerVisibleSubject.next(false); // Hide spinner
    }
  }
}
