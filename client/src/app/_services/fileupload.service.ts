// file-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  upload(url: string, formData: FormData, headers: HttpHeaders): Observable<any> {
    return this.http.post(url, formData, { headers });
  }
}
