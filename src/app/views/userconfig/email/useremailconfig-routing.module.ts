import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEmailConfigComponent } from './useremailconfig.component';

const routes: Routes = [
  {
    path: '',
    component: UserEmailConfigComponent,
    data: {
      title: ' '
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserEmailConfigRoutingModule {}
