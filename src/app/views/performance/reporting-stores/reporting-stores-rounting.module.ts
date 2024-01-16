import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallReportingStoresComponent } from './reporting-stores.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallReportingStoresComponent,
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
export class FootfallReportingStoresRoutingModule {}
