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
                redirectTo: 'organization'
            },
            {
                path: 'organization',
                loadChildren: './companies/companies.module#GeneralCompaniesModule'
            },
            {
                path: 'site',
                loadChildren: './site/site.module#GeneralSiteModule'
            },
            {
                path: 'users',
                loadChildren: './users/users.module#GeneralUserModule'
            },
            {
                path: 'locations',
                loadChildren: './location/location.module#GeneralLocationModule'
            },
            {
                path: 'categories',
                loadChildren: './categories/categories.module#GeneralCategoriesModule'
            },
            {
                path: 'zalosender',
                loadChildren: './zalosender/zalosender.module#GeneralZaloSenderModule'
            },
            {
                path: 'zalofollower',
                loadChildren: './zalofollower/zalofollower.module#GeneralZaloFollowerModule'
            },
            {
                path: 'clients',
                loadChildren: './clients/clients.module#GeneralClientAdminModule'
            },
            {
                path: 'emailconfig',
                loadChildren: './emailconfig/emailconfig.module#EmailConfigModule'
            },
            {
                path: 'importdata',
                loadChildren: './import/importdata.module#GeneralImportDataModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class  GeneralRoutingModule { }
