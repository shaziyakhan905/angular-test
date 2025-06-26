import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestManagementComponent } from './test-management.component';
import { CreateTestComponent } from './component/create-test/create-test.component';
import { ViewTestComponent } from './component/view-test/view-test.component';

const routes: Routes = [
  { path: '', component: TestManagementComponent },
  {path:"create-test",component:CreateTestComponent},
  {path:"view-test/:id",component:ViewTestComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestManagementRoutingModule { }
