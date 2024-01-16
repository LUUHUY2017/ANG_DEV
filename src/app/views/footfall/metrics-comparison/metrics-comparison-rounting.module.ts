import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallMetricsComparisonComponent } from './metrics-comparison.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallMetricsComparisonComponent,
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
export class FootfallMetricsComparisonRoutingModule {}