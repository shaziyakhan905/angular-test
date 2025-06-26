import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryManagementRoutingModule } from './category-management-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryManagementComponent } from './category-management.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
   CategoryManagementComponent
  ],
  imports: [
    CommonModule,
    CategoryManagementRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class CategoryManagementModule { }
