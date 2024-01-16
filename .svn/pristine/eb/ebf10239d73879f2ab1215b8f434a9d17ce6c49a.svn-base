import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallTimeTrendingComponent } from './time-trending.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallTimeTrendingComponent,
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
export class FootfallTimeTrendingRoutingModule {}
