import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  @ViewChild('memberTabs', { static: true }) memberTabs?: MatTabGroup;
  member: Member = {} as Member;
  activeTab: MatTab | undefined = undefined;
  messages: Message[] = [];
  user: User | undefined;

  galleryImages: { small: string, medium: string, big: string }[] = [];

  private routeDataSubscription: Subscription | undefined;
  private routeQueryParamsSubscription: Subscription | undefined;

  constructor(private accountService: AccountService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public presenceService: PresenceService,
    private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.routeDataSubscription = this.route.data.subscribe({
      next: data => this.member = data['member']
    });

    this.routeQueryParamsSubscription = this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab']);
      }
    });
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();

    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe();
    }

    if (this.routeQueryParamsSubscription) {
      this.routeQueryParamsSubscription.unsubscribe();
    }
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      const tabs = this.memberTabs._tabs.toArray();
      const selectedTab = tabs.find(tab => tab.textLabel === heading);
      if (selectedTab) {
        selectedTab.isActive = true;
      }
    }
  }

  OnTabActivated(data: MatTabChangeEvent) {
    this.activeTab = data.tab;
    if (this.activeTab.textLabel === 'Messages' && this.user) {
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName)
        .subscribe({
          next: messages => this.messages = messages
        });
    }
  }
}
