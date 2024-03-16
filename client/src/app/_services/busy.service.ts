import { Injectable } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount = 0;
  private spinnerRef!: MatProgressSpinner; // Using ! to indicate it will be initialized in constructor

  constructor() { }

  // Method to set MatProgressSpinner reference
  setSpinnerRef(spinner: MatProgressSpinner) {
    debugger
    this.spinnerRef = spinner;
  }

  busy() {
    debugger
    this.busyRequestCount++;
    if (this.spinnerRef) {
      this.spinnerRef._elementRef.nativeElement.style.display = 'block'; // Show the spinner
    }
  }

  idle() {
    debugger
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0 && this.spinnerRef) {
      this.spinnerRef._elementRef.nativeElement.style.display = 'none'; // Hide the spinner
      this.busyRequestCount = 0;
    }
  }
}
