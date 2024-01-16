import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallTimeTrendComponent } from './time-trend.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallTimeTrendComponent,
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
export class FootfallTimeTrendRoutingModule {}
