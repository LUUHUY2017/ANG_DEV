import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FootfallHeatMapComponent } from './heatmap.component';

const routes: Routes = [
  {
    path: '',
    component: FootfallHeatMapComponent,
    data: {
      title: 'Code Editors'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallHeatMapRoutingModule {}
