import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallCustomerDailyComponent } from './customer-daily.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallCustomerDailyComponent,
    // canActivate: [AuthGuard],
    data: {
      title: 'Footfall Customer Daily'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallCustomerDailyRoutingModule {}
