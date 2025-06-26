import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { roleGuard } from './core/guard/role.guard';
import { authGuard } from './core/guard/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  {
    path: 'online-test',
    loadChildren: () => import('./features/online-test/online-test.module').then(m => m.OnlineTestModule),

  },

  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'test-management', loadChildren: () => import('./features/test-management/test-management.module').then(m => m.TestManagementModule),
    canActivate: [authGuard, roleGuard]
  },
  { path: 'manage-users', loadChildren: () => import('./features/manage-users/manage-users.module').then(m => m.ManageUsersModule),
     canActivate: [authGuard, roleGuard]
   },
  { path: 'category-management', loadChildren: () => import('./features/category-management/category-management.module').then(m => m.CategoryManagementModule),
     canActivate: [authGuard, roleGuard]
   },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
