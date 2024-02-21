import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallCustomerYearlyComponent } from './customer-yearly.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallCustomerYearlyComponent,
    // canActivate: [AuthGuard],
    data: {
      title: 'Footfall Customer Yearly'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallCustomerYearlyRoutingModule {}
