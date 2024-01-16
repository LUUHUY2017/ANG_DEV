import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpDetailComponent } from './help-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HelpDetailComponent,
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
