import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './features/test-home/components/home/home.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { HttpErrorInterceptor } from './core/interceptor/http-error.interceptor';
import { LaaderInterceptor } from './core/interceptor/laader.interceptor';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from './component/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LaaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
