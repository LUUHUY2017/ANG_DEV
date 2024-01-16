import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallMetricsTrendComponent } from './metrics-trend.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallMetricsTrendComponent,
    // canActivate: [AuthGuard],
    data: {
      title: 'Footfall Metrics comparison'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallMetricTrendRoutingModule {}
