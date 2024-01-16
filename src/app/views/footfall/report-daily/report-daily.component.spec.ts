import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDailyComponent } from './report-daily.component';

describe('FbaMetricsAnalyticsComponent', () => {
  let component: ReportDailyComponent;
  let fixture: ComponentFixture<ReportDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
