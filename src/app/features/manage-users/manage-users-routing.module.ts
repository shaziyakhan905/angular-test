import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUsersComponent } from './manage-users.component';
import { ViewUserComponent } from './component/view-user/view-user.component';
import { authGuard } from 'src/app/core/guard/auth.guard';
import { roleGuard } from 'src/app/core/guard/role.guard';

const routes: Routes = [{ path: '', component: ManageUsersComponent },
{
  path: 'view-user/:userId', component: ViewUserComponent,
  canActivate: [authGuard, roleGuard]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageUsersRoutingModule { }
