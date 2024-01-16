import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallUserMailComponent } from './footfallusermail.component';

const routes: Routes = [
  {
    path: '',
    component: FootfallUserMailComponent,
    data: {
      title: 'Admin Tablets'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallUserMailRoutingModule {}
