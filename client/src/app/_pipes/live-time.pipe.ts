import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Pipe({
  name: 'liveTime',
  pure: false // Make the pipe impure to trigger change detection
})
export class LiveTimePipe implements PipeTransform {
  constructor(private cdr: ChangeDetectorRef) {}

  transform(value: any): Observable<string> {
    return interval(1000).pipe( // Emit a new value every second
      startWith(0), // Emit the initial value immediately
      map(() => this.calculateTimeAgo(value)) // Calculate time ago
    );
  }

  calculateTimeAgo(value: any): string {
    if (!value) return '';
    const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
    if (seconds < 29) return 'Just now';

    const intervals: { [key: string]: number } = {
      'year': 31536000,
      'month': 2592000,
      'week': 604800,
      'day': 86400,
      'hour': 3600,
      'minute': 60,
      'second': 1
    };

    for (const i in intervals) {
      const counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        return counter + ' ' + i + (counter === 1 ? ' ago' : 's ago');
      }
    }
    return '';
  }
}
