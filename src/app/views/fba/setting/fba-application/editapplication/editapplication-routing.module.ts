import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FbaEditApplicationComponent } from './editapplication.component';

const routes: Routes = [
  {
    path: '',
    component: FbaEditApplicationComponent,
    data: {
      title: 'Add Question'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FbaEditApplicationRoutingModule {}
