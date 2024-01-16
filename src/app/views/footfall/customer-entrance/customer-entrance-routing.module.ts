import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallCustomerEntranceComponent } from './customer-entrance.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallCustomerEntranceComponent,
    // canActivate: [AuthGuard],
    data: {
      title: 'Footfall Customer Entrance'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallCustomerEntranceRoutingModule {}
