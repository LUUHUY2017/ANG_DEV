import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallStoreComparisonComponent } from './store-comparison.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallStoreComparisonComponent,
    // canActivate: [AuthGuard],
    data: {
      title: 'Footfall Store comparison'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallStoreComparisonRoutingModule {}
