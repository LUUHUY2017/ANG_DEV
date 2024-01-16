import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpListComponent } from './help-list.component';

const routes: Routes = [
  {
    path: '',
    component: HelpListComponent,
    data: {
      title: 'Introduce'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpListRoutingModule { }
