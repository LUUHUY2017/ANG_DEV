import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FbaUserMailComponent } from './fbamainusermail.component';

const routes: Routes = [
  {
    path: '',
    component: FbaUserMailComponent,
    data: {
      title: 'Admin Tablets'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FbaUserMailRoutingModule {}
