import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallTimeComparisonComponent } from './time-comparison.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallTimeComparisonComponent,
    // canActivate: [AuthGuard],
    data: {
      title: 'Footfal Time comparison'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallTimeComparisonRoutingModule {}
