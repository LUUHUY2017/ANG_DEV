import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallStoreTrendComponent } from './store-trend.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallStoreTrendComponent,
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
export class FootfallStoreTrendRoutingModule {}
