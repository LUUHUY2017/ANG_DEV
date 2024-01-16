import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailConfigComponent } from './emailconfig.component';

const routes: Routes = [
  {
    path: '',
    component: EmailConfigComponent,
    data: {
      title: ' '
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailConfigRoutingModule {}
