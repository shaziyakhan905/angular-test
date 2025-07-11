import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardHomeComponent,
    children: [
      { path: '', redirectTo: 'test', pathMatch: 'full' },
      { path: 'test', loadChildren: () => import('../../features/test-home/test-home.module').then(m => m.TestHomeModule) },
      {
        path: 'library',
        loadChildren: () => import('../../features/library/library.module').then(m => m.LibraryModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardHomeRoutingModule { }
