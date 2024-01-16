import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallMetricsTrendingComponent } from './metrics-trending.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallMetricsTrendingComponent,
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
export class FootfallMetricsTrendingRoutingModule {}
