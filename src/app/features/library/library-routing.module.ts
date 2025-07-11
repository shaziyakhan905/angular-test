import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryComponent } from './library.component';
import { CourseHomeComponent } from './components/course-home/course-home.component';

const routes: Routes = [
  { 
    path: '', 
    component: LibraryComponent,
  },
  { 
    path: 'course/:categoryId', 
    component: CourseHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }
