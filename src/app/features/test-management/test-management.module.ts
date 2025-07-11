import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestManagementRoutingModule } from './test-management-routing.module';
import { TestManagementComponent } from './test-management.component';
import { CreateTestComponent } from './component/create-test/create-test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewTestComponent } from './component/view-test/view-test.component';


@NgModule({
  declarations: [
    TestManagementComponent,
    CreateTestComponent,
    ViewTestComponent,

  ],
  imports: [
    CommonModule,
    TestManagementRoutingModule,
    ReactiveFormsModule,
     NgxPaginationModule,
     FormsModule
  ]
})
export class TestManagementModule { }
