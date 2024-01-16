import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperAdminGuard } from '../../../../shared/superadmin.guard';
import { FbaPermissionGuard } from '../../../../shared/fba_permission.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin Config'
    },
    // canActivateChild: [FbaPermissionGuard], // nếu mà có fba
    children: [
      {
        path: '',
        loadChildren: './listapplication/listapplication.module#FbaListApplicationModule'
      },
      // {
      //   path: 'application',
      //   loadChildren: './listapplication/listapplication.module#FbaListApplicationModule'
      // },
      // {
      //   path: 'setting',
      //   loadChildren: './setting/setting.module#AdminSettingModule'
      // },
      {
        // canActivate: [SuperAdminGuard],
        path: 'add',
        loadChildren: './addapplication/addapplication.module#FbaAddApplicationModule'
      },
      {
        // canActivate: [FbaPermissionGuard],
        path: 'edit/:id',
        loadChildren: './editapplication/editapplication.module#FbaEditApplicationModule'
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class FbaApplicationRoutingModule { }
