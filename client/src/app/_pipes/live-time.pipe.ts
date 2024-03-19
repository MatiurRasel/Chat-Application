import { Pipe, PipeTransform } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'liveTime'
})
export class LiveTimePipe implements PipeTransform {

  transform(value: Date | string): Observable<string> {
    const dateValue = typeof value === 'string' ? new Date(value) : value;
debugger
    return interval(1000).pipe(
      map(() => {
        if (typeof dateValue === 'string') {
          // Convert string to date
          const date = new Date(dateValue);
          return this.calculateTimeDifference(date).toString(); // Convert to string
        } else {
          // Value is already a Date object
          return this.calculateTimeDifference(dateValue);
        }
      })
    );
  }

  calculateTimeDifference(value: Date): string {
    debugger
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
}
