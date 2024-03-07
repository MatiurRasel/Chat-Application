import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private snackBar: MatSnackBar, private router: Router) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', userName => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: userNames => this.onlineUsersSource.next([...userNames, userName])
      });
    });

    this.hubConnection.on('UserIsOffline', userName => {
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: userNames => this.onlineUsersSource.next(userNames.filter(x => x !== userName))
      });
    });

    this.hubConnection.on('GetOnlineUsers', userNames => {
      this.onlineUsersSource.next(userNames);
    });

    this.hubConnection.on('NewMessageReceived', ({ userName, knownAs }) => {
      const message = knownAs + ' has sent you a new message!';
      const action = 'See Message';
      const snackBarRef = this.snackBar.open(message, action, { duration: 5000 });

      snackBarRef.onAction().pipe(take(1)).subscribe({
        next: () => this.router.navigateByUrl('/members/' + userName + '?tab=Messages')
      });
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }
}
