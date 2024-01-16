import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralImportDataComponent } from './importdata.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralImportDataComponent,
    data: {
      title: 'Import Pos Sale Routing Module'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralImportDataRoutingModule {}
