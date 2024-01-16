import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FbaPermissionGuard } from '../../../shared/fba_permission.guard';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Feedback Any Where'
            , module_title: 'fba'
        },
        canActivate: [FbaPermissionGuard] // nếu mà có fba
        , children: [
            {
                path: '',
                redirectTo: 'application'
            },
            {
                path: 'application',
                loadChildren: './fba-application/fba-application.module#FbaApplicationSettingModule',
            },
            {
                path: 'tablet-monitor',
                loadChildren: './tabletmonitor/tabletmonitor.module#TabletMonitorModule'
            },
            {
                path: 'tablet',
                loadChildren: './listtablet/listtablet.module#FbaTabletModule'
            },
            // {
            //     path: 'terminal',
            //     loadChildren: './terminaldevice/terminaldevice.module#FbaTerminalDeviceModule'
            // },
            {
                path: 'question',
                loadChildren: './question/question.module#QuestionModule'
            },
            {
                path: 'user-mail',
                loadChildren: './fbausermail/fbamainusermail/fbamainusermail.module#FbaMainUserMailModule'
            },
            // {
            //     path: 'metrics-analytics/:id',
            //     loadChildren: './fba-metrics-analytics/fba-metrics-analytics.module#FbaMetricsAnalyticsModule'
            // },
            // {
            //     path: 'metrics-comparison',
            //     loadChildren: './fba-metrics-comparison/fba-metrics-comparison.module#FbaMetricsComparisonModule'
            // },
            // {
            //     path: 'reason',
            //     loadChildren: './fba-reason/fba-reason.module#FbaReasonModule'
            // },
            // {
            //     path: 'customer-info',
            //     loadChildren: './fba-customer-info/fba-customer-info.module#FbaCustomerInfoModule'
            // }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FbaSettingRoutingModule { }
