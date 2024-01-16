import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbaMetricsComparisonComponent } from './metrics-comparison.component';

describe('FbaMetricsComparisonComponent', () => {
  let component: FbaMetricsComparisonComponent;
  let fixture: ComponentFixture<FbaMetricsComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbaMetricsComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbaMetricsComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
