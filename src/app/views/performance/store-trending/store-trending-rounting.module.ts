import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallStoreStrendingComponent } from './store-trending.component';
// import { AuthGuard } from '../../../shared/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: FootfallStoreStrendingComponent,
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
export class FootfallStoreStrendingRoutingModule {}
