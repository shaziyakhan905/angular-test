import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Injectable()
export class LaaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    this.loaderService.showLoader();

    return next.handle(req).pipe(
      finalize(() => {
        this.loaderService.hideLoader();
      })
    );
  }
}
