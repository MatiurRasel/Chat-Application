import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { BusyService } from './_services/busy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Chat Application';
  currentUserSet = false;
  
  constructor(
    private accountService: AccountService, 
    public busyService: BusyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.setCUrrentUser();
  }

  setCUrrentUser(): void {
    const userString = localStorage.getItem('user');
    if (userString && !this.currentUserSet) {
      const user: User = JSON.parse(userString);
      this.accountService.setCurrentUser(user);
      this.currentUserSet = true;
      // Trigger change detection manually
      this.cdr.detectChanges();
    }
  }
}
