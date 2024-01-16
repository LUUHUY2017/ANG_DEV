import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeMetricsAnalyticsComponent } from './age-metrics-analytics.component';

describe('FbaMetricsAnalyticsComponent', () => {
  let component: AgeMetricsAnalyticsComponent;
  let fixture: ComponentFixture<AgeMetricsAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeMetricsAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeMetricsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
