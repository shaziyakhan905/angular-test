import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestHomeComponent } from './test-home.component';
import { HomeComponent } from 'src/app/features/test-home/components/home/home.component';
import { authGuard } from 'src/app/core/guard/auth.guard';
import { roleGuard } from 'src/app/core/guard/role.guard';
import { ProfileComponent } from '../dashboard-home/components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: TestHomeComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'auth',
        loadChildren: () => import('../../features/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'online-test',
        loadChildren: () => import('../../features/online-test/online-test.module').then(m => m.OnlineTestModule),

      },
      {
        path: 'test-management', loadChildren: () => import('../../features/test-management/test-management.module').then(m => m.TestManagementModule),
        canActivate: [authGuard, roleGuard]
      },
      {
        path: 'manage-users', loadChildren: () => import('../../features/manage-users/manage-users.module').then(m => m.ManageUsersModule),
        canActivate: [authGuard, roleGuard]
      },
      {
        path: 'category-management', loadChildren: () => import('../../features/category-management/category-management.module').then(m => m.CategoryManagementModule),
        canActivate: [authGuard, roleGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestHomeRoutingModule { }
