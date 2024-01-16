import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {AgeOverviewComponent } from './age-overview.component';

describe('FbaMetricsAnalyticsComponent', () => {
  let component: AgeOverviewComponent;
  let fixture: ComponentFixture<AgeOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
