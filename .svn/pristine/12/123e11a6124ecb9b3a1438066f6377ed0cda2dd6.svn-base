import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Footfall Setting'
        },
        children: [
            {
                path: '',
                redirectTo: 'user-mail'
            },
            {
                path: 'user-mail',
                loadChildren: './footfallusermail/footfallusermail.module#FootfallUserMailModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class  FootFallSettingRoutingModule { }
