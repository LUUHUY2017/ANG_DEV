import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgeVisitComponent } from './age-visit.component';

const routes: Routes = [
  {
    path: '',
    component: AgeVisitComponent,
    data: {
      title: 'Age Metrics Comparison'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgeVisitRoutingModule {}
