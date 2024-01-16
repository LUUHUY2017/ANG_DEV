import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Gender Age Setting'
        },
        children: [
            {
                path: '',
                redirectTo: 'user-mail'
            },
            {
                path: 'user-mail',
                loadChildren: './usermailage/usermailage.module#UserMailAgeModule'
            },
            // {
            //     path: 'webhookage',
            //     loadChildren: './webhookage/webhookage.module#WebhookageModule'
            // }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class  AgeSettingRoutingModule { }
