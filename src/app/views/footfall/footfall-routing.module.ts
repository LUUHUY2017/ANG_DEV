import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermissionGuard } from '../../shared/user_permission.guard';
import { FootfallPermissionGuard } from '../../shared/footfall_permission.guard';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Footfall'
      , module_title: 'footfall'
    },
    canActivateChild: [UserPermissionGuard], // nếu mà module_array có footfall
    children: [
      {
        canActivate: [FootfallPermissionGuard], // nếu có cả footfall và all
        path: 'setting',
        loadChildren: './footfallsetting/footfallsetting.module#FootFallSettingModule'
      },
      {
        // data: {
        //   page_id: environment.Pages.footfall.overview
        // },
        path: 'overview',
        loadChildren: './overview/overview.module#FootfallOverviewModule'
      },
      {
        // data: {
        //   page_id: environment.Pages.footfall.visits
        // },
        path: 'visits',
        loadChildren: './visits/visits.module#FootfallVisitsModule'
      },
      {
        // data: {
        //   page_id: environment.Pages.footfall.heatmap
        // },
        path: 'heatmap',
        loadChildren: './heatmap/heatmap.module#FootfallHeatMapModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.liveview
        // },
        path: 'liveview',
        loadChildren: './liveview/liveview.module#FootfallLiveviewModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.metrics_comparison
        // },
        path: 'metrics-comparison',
        loadChildren: './metrics-comparison/metrics-comparison.module#FootfallMetricsComparisonModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.store_comparison
        // },
        path: 'store-comparison',
        loadChildren: './store-comparison/store-comparison.module#FootfallStoreComparisonModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'time-comparison',
        loadChildren: './time-comparison/time-comparison.module#FootfallTimeComparisonModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'store-trend',
        loadChildren: './store-trend/store-trend.module#FootfallStoreTrendModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'time-trend',
        loadChildren: './time-trend/time-trend.module#FootfallTimeTrendModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'metrics-trend',
        loadChildren: './metrics-trend/metrics-trend.module#FootfallMetricsTrendModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'reporting-stores',
        loadChildren: './stores-reporting/stores-reporting.module#FootfallStoresReportingModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'customer-daily',
        loadChildren: './customer-daily/customer-daily.module#FootfallCustomerDailyModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'customer-monthly',
        loadChildren: './customer-monthly/customer-monthly.module#FootfallCustomerMonthlyModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'customer-yearly',
        loadChildren: './customer-yearly/customer-yearly.module#FootfallCustomerYearlyModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'customer-entrance',
        loadChildren: './customer-entrance/customer-entrance.module#FootfallCustomerEntranceModule'
      },
      {
        // canActivate: [UserPermissionGuard],
        // data: {
        //   page_id: environment.Pages.footfall.time_comparison
        // },
        path: 'report-daily',
        loadChildren: './report-daily/report-daily.module#ReportDailyModule'
      }
      // {
      //   // canActivate: [UserPermissionGuard],
      //   // data: {
      //   //   page_id: environment.Pages.footfall.time_comparison
      //   // },
      //   path: 'import_data_in_out',
      //   loadChildren: './import_data_in_out/import_data_in_out.module#ImportDataInOutModule'
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallRoutingModule { }
