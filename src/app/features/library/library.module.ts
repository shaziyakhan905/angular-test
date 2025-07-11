import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryRoutingModule } from './library-routing.module';
import { LibraryComponent } from './library.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { CategoryChildrenComponent } from './components/category-children/category-children.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CourseHomeComponent } from './components/course-home/course-home.component';
import { CategorySidebarComponent } from './components/category-sidebar/category-sidebar.component';
import { RichTextEditorComponent } from 'src/app/shared/rich-text-editor/rich-text-editor.component';

@NgModule({
  declarations: [
    LibraryComponent,
    CourseHomeComponent,
    CategorySidebarComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    LibraryRoutingModule,
    CategoryChildrenComponent,
    RichTextEditorComponent,
    CourseListComponent,
    CourseDetailsComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports:[
    CategorySidebarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LibraryModule { }
