import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FbaStaffPerformanceComponent } from './staff-performance.component';

const routes: Routes = [
  {
    path: '',
    component: FbaStaffPerformanceComponent,
    data: {
      title: 'Staff-Performance'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FbaStaffPerformanceRoutingModule {}
