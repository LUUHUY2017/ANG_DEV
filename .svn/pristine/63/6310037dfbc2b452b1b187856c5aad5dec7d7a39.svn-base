import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallEffectStoreComponent } from './effect-store.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallEffectStoreComponent,
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
export class FootfallEffectStoreRoutingModule {}
