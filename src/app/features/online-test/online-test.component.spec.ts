import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineTestComponent } from './online-test.component';

describe('OnlineTestComponent', () => {
  let component: OnlineTestComponent;
  let fixture: ComponentFixture<OnlineTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineTestComponent]
    });
    fixture = TestBed.createComponent(OnlineTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
