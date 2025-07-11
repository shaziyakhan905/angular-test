import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSummaryComponent } from './view-summary.component';

describe('ViewSummaryComponent', () => {
  let component: ViewSummaryComponent;
  let fixture: ComponentFixture<ViewSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSummaryComponent]
    });
    fixture = TestBed.createComponent(ViewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
