import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { ManageUsersComponent } from './manage-users.component';
import { ViewUserComponent } from './component/view-user/view-user.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ManageUsersComponent,
    ViewUserComponent
  ],
  imports: [
    CommonModule,
    ManageUsersRoutingModule,
    NgxPaginationModule 
  ]
})
export class ManageUsersModule { }
