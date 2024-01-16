import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallStoresReportingComponent } from './stores-reporting.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallStoresReportingComponent,
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
export class FootfallStoresReportingRoutingModule {}
