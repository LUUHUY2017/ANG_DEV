import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbaStaffPerformanceComponent } from './staff-performance.component';

describe('FbaStaffPerformanceComponent', () => {
  let component: FbaStaffPerformanceComponent;
  let fixture: ComponentFixture<FbaStaffPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbaStaffPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbaStaffPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
