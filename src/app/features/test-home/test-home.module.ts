import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestHomeRoutingModule } from './test-home-routing.module';
import { TestHomeComponent } from './test-home.component';
import { SidebarComponent } from 'src/app/features/test-home/components/sidebar/sidebar.component';
import { ProfileComponent } from '../dashboard-home/components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TestHomeComponent,
    SidebarComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TestHomeRoutingModule
  ]
})
export class TestHomeModule { }
