import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientAdminComponent } from './clients.component';

const routes: Routes = [
  {
    path: '',
    component: ClientAdminComponent,
    data: {
      title: 'Admin Clients'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientAdminRoutingModule {}
