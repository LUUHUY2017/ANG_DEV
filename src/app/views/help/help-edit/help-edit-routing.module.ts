import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpEditComponent } from './help-edit.component';

const routes: Routes = [
  {
    path: '',
    component: HelpEditComponent,
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
