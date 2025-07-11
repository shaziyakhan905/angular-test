import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineTestComponent } from './online-test.component';
import { TestListComponent } from './component/test-list/test-list.component';
import { TestPageComponent } from './component/test-page/test-page.component';
import { TestResultComponent } from './component/test-result/test-result.component';
import { PracticeTestsComponent } from './component/practice-tests/practice-tests.component';
import { authGuard } from 'src/app/core/guard/auth.guard';
import { roleGuard } from 'src/app/core/guard/role.guard';
import { ViewSummaryComponent } from './component/view-summary/view-summary.component';

const routes: Routes = [
  { path: '', component: OnlineTestComponent },
  { path: "tests", component: TestListComponent },
  {
    path: 'test-page',
    canActivate: [authGuard],
    component: TestPageComponent
  },
  {
    path: 'test-result', canActivate: [authGuard], component: TestResultComponent,

  },
  { path: 'practice-tests', canActivate: [authGuard], component: PracticeTestsComponent },
  { path: 'view-summary', canActivate: [authGuard], component: ViewSummaryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineTestRoutingModule { }
