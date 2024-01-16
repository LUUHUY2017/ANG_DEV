import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallEffectTimeComponent } from './effect-time.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallEffectTimeComponent,
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
export class FootfallEffectTimeRoutingModule {}
