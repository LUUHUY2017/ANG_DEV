import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserMailAgeComponent } from './usermailage.component';

const routes: Routes = [
  {
    path: '',
    component: UserMailAgeComponent,
    data: {
      title: ' '
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMailAgeRoutingModule {}
