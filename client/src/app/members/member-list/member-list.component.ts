import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { BusyService } from 'src/app/_services/busy.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  // members$: Observable<Member[]> | undefined;
  @ViewChild('spinner') spinner!: MatProgressSpinner;

  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams  | undefined;
  genderList = [
    {
      value: 'male',display:'Males'
    },
    {
      value:'female',display:'Females'
    }
  ]

  constructor(private memberService: MembersService,private busyService: BusyService) {
      this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    
    this.loadMembers();
  }

  loadMembers(orderBy: string = 'lastActive') {
    if (!this.userParams) {
      this.userParams = this.memberService.getUserParams();
    }
  
    if (this.userParams) {
      this.userParams.orderBy = orderBy;
  
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      });
    }
    //console.log('Exiting loadMembers.');
  }
  

  

  resetFilters(){
      this.userParams = this.memberService.resetUserParams(); 
      this.loadMembers();
  }

  // pageChanged(event: any){
  //   debugger
  //   if(this.userParams && this.userParams?.pageNumber !== event.page){
  //     this.userParams.pageNumber = event.page;
  //     this.memberService.setUserParams(this.userParams);
  //     this.loadMembers();
  //   }

  // }

  // pageChanged(event: any): void {
  //   debugger;
  //   if (this.userParams && this.userParams.pageNumber !== event.pageIndex) {
  //     this.userParams.pageNumber = event.pageIndex;
  //     this.memberService.setUserParams(this.userParams);
  //     this.loadMembers();
  //   }
  // }

  pageChanged(event: any): void {
    debugger;
    if (this.userParams) {
      if (this.userParams.pageSize !== event.pageSize) {
        // Only update pageSize if it has changed
        this.userParams.pageSize = event.pageSize;
      }
  
      // Always update pageNumber based on pageIndex
      this.userParams.pageNumber = event.pageIndex + 1; // Adjust for 1-based index
  
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
  
  
  
  

}
