import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'footfall'
      , module_title: 'footfall'
    },
    children: [
      {
        path: '',
        redirectTo: 'user-mail'
      },
      {
        path: 'user-mail',
        loadChildren: './performanceusermail/performanceusermail.module#PerformanceUserMailModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceSettingRoutingModule { }
