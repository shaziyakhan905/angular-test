import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './component/home/home.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { HttpErrorInterceptor } from './core/interceptor/http-error.interceptor';
import { LaaderInterceptor } from './core/interceptor/laader.interceptor';
import { LoaderComponent } from './component/loader/loader.component';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HomeComponent,
    LoaderComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), NgbModule,
    LoaderComponent
],
  providers: [
     { provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor,
       multi: true },
       { provide: HTTP_INTERCEPTORS, 
      useClass: HttpErrorInterceptor,
       multi: true },
       { provide: HTTP_INTERCEPTORS, 
      useClass: LaaderInterceptor,
       multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
