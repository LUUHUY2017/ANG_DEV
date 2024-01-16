import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermissionGuard } from '../../shared/user_permission.guard';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Feedback Any Where'
            , module_title: 'fba'
        },
        canActivateChild: [UserPermissionGuard] // nếu mà có fba
        , children: [
            {
                path: 'setting',
                loadChildren: './setting/fba-setting.module#FbaSettingModule',
            },
            {
                path: 'overview',
                loadChildren: './fba-overview/fba-overview.module#FbaOverviewModule'
            },
            {
                path: 'metrics-analytics',
                loadChildren: './fba-metrics-analytics/fba-metrics-analytics.module#FbaMetricsAnalyticsModule'
            },
            {
                path: 'metrics-analytics/:id',
                loadChildren: './fba-metrics-analytics/fba-metrics-analytics.module#FbaMetricsAnalyticsModule'
            },
            {
                path: 'metrics-comparison',
                loadChildren: './fba-metrics-comparison/fba-metrics-comparison.module#FbaMetricsComparisonModule'
            },
            {
                path: 'reason',
                loadChildren: './fba-reason/fba-reason.module#FbaReasonModule'
            },
            {
                path: 'customer-info',
                loadChildren: './fba-customer-info/fba-customer-info.module#FbaCustomerInfoModule'
            },
            {
                path: 'response-info',
                loadChildren: './customer-info/customer-info.module#FbaDetailCustomerInfoModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FbaRoutingModule { }
