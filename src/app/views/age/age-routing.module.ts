import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenderagePermissionGuard } from '../../shared/genderage_permission.guard';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Gender Age'
            , module_title: 'genderage',
        },
        children: [
            {
                path: '',
                redirectTo: 'overview'
            },
            {
                path: 'overview',
                loadChildren: './age-overview/age-overview.module#AgeOverviewModule'
            },
            {
                path: 'metrics-age',
                loadChildren: './age-metrics-analytics/age-metrics-analytics.module#AgeMetricsAnalyticsModule'
            },
            {
                path: 'metrics-gender',
                loadChildren: './age-metrics-comparison/age-metrics-comparison.module#AgeMetricsComparisonModule'
            },
            {
                path: 'visit',
                loadChildren: './age-visit/age-visit.module#AgeVisitModule'
            },
            {
                canActivate: [GenderagePermissionGuard], // nếu mà có cả genderage và all
                path: 'setting',
                loadChildren: './setting/agesetting.module#AgeSettingModule'
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgeRoutingModule { }
