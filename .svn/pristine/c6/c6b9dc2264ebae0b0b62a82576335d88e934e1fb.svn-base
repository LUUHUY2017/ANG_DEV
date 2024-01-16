import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallBostonComponent } from './metrics-boston.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallBostonComponent,
    // canActivate: [AuthGuard],
    data: {
      title: 'Footfall Visits'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallBostonRoutingModule {}
