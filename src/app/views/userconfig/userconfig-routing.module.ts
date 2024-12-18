import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { SuperAdminGuard } from '../../../shared/superadmin.guard';
// import { GenderagePermissionGuard } from '../../../shared/genderage_permission.guard';

const routes: Routes = [
    {
        path: '',
        // redirectTo: '/general/companies',
        // loadChildren: './companies/companies.module#GeneralCompaniesModule',
        data: {
            title: 'Feedback Any Where'
        },
        children: [
            {
                path: '',
                redirectTo: 'editinfo'
            },
            {
                // canActivate: [GenderagePermissionGuard],
                path: 'email',
                loadChildren: './email/useremailconfig.module#UserEmailConfigModule'
            },
            {
                // canActivate: [GenderagePermissionGuard],
                path: 'editinfo',
                loadChildren: './editinfo/editinfo.module#UserEditInfoModule'
            },
            {
                // canActivate: [GenderagePermissionGuard],
                path: 'info',
                loadChildren: './userinfo/userinfo.module#UserInfoModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class  UserConfigRoutingModule { }
