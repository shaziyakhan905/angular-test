import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NotifiedService } from '../service/notified.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private notify: NotifiedService,
    private autService:AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        // Token Expired or Unauthorized
        if (error.status === 401 || error.status === 403) {
          this.notify.showError(error.error?.message);
          this.autService.logout()
        }
        // Not Found
        else if (error.status === 404) {
          this.notify.showError(error.error?.message);
        }
        // Server Errors
        else if (error.status >= 500) {
          this.notify.showError(error.error?.message);
        }
        // Other Errors
        else {
          this.notify.showError(error.error?.message || 'An unexpected error occurred.');
        }

        return throwError(() => error);
      })
    );
  }
}
