import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallCustomerMonthlyComponent } from './customer-monthly.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallCustomerMonthlyComponent,
    // canActivate: [AuthGuard],
    data: {
      title: 'Footfall Customer Monthly'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallCustomerMonthlyRoutingModule {}
