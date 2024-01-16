import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FbaOverviewComponent } from './fba-overview.component';

const routes: Routes = [
  {
    path: '',
    component: FbaOverviewComponent,
    data: {
      title: 'Fba overview'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FbaOverviewRoutingModule {}
