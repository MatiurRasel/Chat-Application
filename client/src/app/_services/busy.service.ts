import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  private busyRequestCount = 0;
  public busy: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  setBusy() {
    this.busyRequestCount++;
    this.busy.next(true);
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.busy.next(false);
    }
  }
}
