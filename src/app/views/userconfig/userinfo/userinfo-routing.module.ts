import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserInfoComponent } from './userinfo.component';

const routes: Routes = [
  {
    path: '',
    component: UserInfoComponent,
    data: {
      title: ' '
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserInfoRoutingModule {}
