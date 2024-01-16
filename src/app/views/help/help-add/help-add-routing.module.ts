import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpAddComponent } from './help-add.component';

const routes: Routes = [
  {
    path: '',
    component: HelpAddComponent,
    data: {
      title: 'Introduce'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpAddRoutingModule { }
