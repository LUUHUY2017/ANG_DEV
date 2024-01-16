import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPermissionGuard } from '../../shared/user_permission.guard';
import { PerformancePermissionGuard } from '../../shared/performance_permission.guard';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'fba'
      , module_title: 'fba'
    },
    children: [
      {
        path: 'metrics-boston',
        loadChildren: './metrics-boston/metrics-boston.module#FootfallBostonModule'
      },
      {
        path: 'visits',
        loadChildren: './effect-visits/effect-visits.module#FootfallEffectVisitsModule'
      },
      {
        path: 'store-comparisons',
        loadChildren: './effect-store/effect-store.module#FootfallEffectStoreModule'
      },
      {
        path: 'time-comparisons',
        loadChildren: './effect-time/effect-time.module#FootfallEffectTimeModule'
      },
      {
        path: 'metrics-comparisons',
        loadChildren: './effect-metrics/effect-metrics.module#FootfallEffectMetricsModule'
      },
      {
        path: 'store-trending',
        loadChildren: './store-trending/store-trending.module#FootfallStoreStrendingModule'
      },
      {
        path: 'time-trending',
        loadChildren: './time-trending/time-trending.module#FootfallTimeTrendingModule'
      },
      {
        path: 'metrics-trending',
        loadChildren: './metrics-trending/metrics-trending.module#FootfallMetricsTrendingModule'
      },
      {
        path: 'reporting-stores',
        loadChildren: './reporting-stores/reporting-stores.module#FootfallReportingStoresModule'
      },
      {
        canActivate: [PerformancePermissionGuard],
        path: 'setting',
        loadChildren: './setting/performancesetting.module#PerformanceSettingModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule { }
