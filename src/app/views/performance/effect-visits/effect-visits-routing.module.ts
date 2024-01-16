import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallEffectVisitsComponent } from './effect-visits.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallEffectVisitsComponent,
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
export class FootfallEffectVisitsRoutingModule {}
