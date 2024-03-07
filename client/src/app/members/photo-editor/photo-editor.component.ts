import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})

export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User | undefined;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    });
  }

  ngOnInit(): void {}

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo): void {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          });
        }
      }
    });
  }

  deletePhoto(photoId: number): void {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(x => x.id !== photoId);
        }
      }
    });
  }

uploadFile(files: File[]): void {
  if (this.user) {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));

    this.memberService.uploadPhoto(formData).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          console.log('File upload success:', event.body);
        } else if (event.type === HttpEventType.UploadProgress && event.total) {
          const percentDone = Math.round((100 * event.loaded) / event.total);
          console.log(`File upload progress: ${percentDone}%`);
        }
      },
      (error) => {
        console.error('File upload error:', error);
      }
    );
  }
}


  onFileSelected(event: any): void {
    // Handle the file selection logic here
    console.log(event);
  }
}
