import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member | undefined;

  constructor(
    private memberService: MembersService,
    private snackBar: MatSnackBar,
    public presenceService: PresenceService
  ) {}

  ngOnInit(): void {}

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => {
        this.snackBar.open(`You have liked ${member.knownAs}`, 'Close'
        // , {
        //   duration: 5000, // Adjust the duration as needed
        //   horizontalPosition: 'right',
        //   verticalPosition: 'bottom'
        // }
        );
      }
    });
  }
}
