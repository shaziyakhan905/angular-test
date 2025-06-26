import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineTestRoutingModule } from './online-test-routing.module';
import { OnlineTestComponent } from './online-test.component';
import { TestListComponent } from './component/test-list/test-list.component';
import { TestPageComponent } from './component/test-page/test-page.component';
import { FormsModule } from '@angular/forms';
import { TestResultComponent } from './component/test-result/test-result.component';
import { PracticeTestsComponent } from './component/practice-tests/practice-tests.component';


@NgModule({
  declarations: [
    OnlineTestComponent,
    TestListComponent,
    TestPageComponent,
    TestResultComponent,
    PracticeTestsComponent
  ],
  imports: [
    CommonModule,
    OnlineTestRoutingModule,
    FormsModule
  ]
})
export class OnlineTestModule { }
