import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FbaDetailCustomerInfoComponent } from './customer-info.component';

const routes: Routes = [
  {
    path: '',
    component: FbaDetailCustomerInfoComponent,
    data: {
      title: 'Fba overview'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FbaDetailCustomerInfoRoutingModule {}
