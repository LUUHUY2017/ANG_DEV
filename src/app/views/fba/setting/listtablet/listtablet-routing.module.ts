import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FbaTabletComponent } from './listtablet.component';

const routes: Routes = [
  {
    path: '',
    component: FbaTabletComponent,
    data: {
      title: 'Admin Users'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FbaTabletRoutingModule {}
