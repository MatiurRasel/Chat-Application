import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar directly

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router : Router,private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler)
  : Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=> {
        if(error) {
          switch(error.status){
            case 400:
              if(error.error.errors) {
                const modalStateErrors = [];
                for(const key in error.error.errors){
                  if(error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key])
                  }
                }
                throw modalStateErrors.flat();
              }
              else {
                this.snackBar.open(error.error,error.status.toString())
              }
              break;
            case 401:
              this.snackBar.open('Unauthorized',error.status.toString());
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state:{error:error.error}};
              this.router.navigateByUrl('/server-error',navigationExtras);
              break;
            default:
              this.snackBar.open('Something unexpected went wrong', 'Error');
              console.log(error);
              break;

          }
        }
        throw error;
      })
    );
  }
}
