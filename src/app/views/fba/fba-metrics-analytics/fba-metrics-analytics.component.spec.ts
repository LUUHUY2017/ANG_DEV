import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbaMetricsAnalyticsComponent } from './fba-metrics-analytics.component';

describe('FbaMetricsAnalyticsComponent', () => {
  let component: FbaMetricsAnalyticsComponent;
  let fixture: ComponentFixture<FbaMetricsAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbaMetricsAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbaMetricsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
