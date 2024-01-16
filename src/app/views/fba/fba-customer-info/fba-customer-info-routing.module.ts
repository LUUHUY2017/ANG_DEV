import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FbaCustomerInfoComponent } from './fba-customer-info.component';

const routes: Routes = [
  {
    path: '',
    component: FbaCustomerInfoComponent,
    data: {
      title: 'Fba overview'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FbaCustomerInfoRoutingModule {}
