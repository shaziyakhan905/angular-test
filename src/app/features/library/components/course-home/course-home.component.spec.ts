import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseHomeComponent } from './course-home.component';

describe('CourseHomeComponent', () => {
  let component: CourseHomeComponent;
  let fixture: ComponentFixture<CourseHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseHomeComponent]
    });
    fixture = TestBed.createComponent(CourseHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
