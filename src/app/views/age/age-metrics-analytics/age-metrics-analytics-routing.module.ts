import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgeMetricsAnalyticsComponent } from './age-metrics-analytics.component';

const routes: Routes = [
  {
    path: '',
    component: AgeMetricsAnalyticsComponent,
    data: {
      title: 'Age Metrics AS=nalytics'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgeMetricsAnalyticsRoutingModule {}
