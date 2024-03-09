import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'liveTime'
})
export class LiveTimePipe implements PipeTransform, OnDestroy {
  private timerSubscription: Subscription | undefined;

  transform(value: Date | string): Observable<string> {
    // Convert string to Date if it's not already
    const dateValue = typeof value === 'string' ? new Date(value) : value;

    // Update every second
    this.timerSubscription = interval(1000).pipe(
      map(() => this.calculateTimeDifference(dateValue))
    ).subscribe();

    return new Observable<string>();
  }

  calculateTimeDifference(value: Date): string {
    //debugger
    const now = new Date();
    const seconds = Math.floor((now.getTime() - value.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return value.toLocaleDateString();
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
