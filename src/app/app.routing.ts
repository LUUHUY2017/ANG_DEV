import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { environment } from '../environments/environment';
// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { ActivemailComponent } from './views/activemail/activemail.component';
import { UnsubcribeMailComponent } from './views/unsubcribemailschedule/unsubcribemailschedule.component';
// import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './shared/auth.guard';
import { UserPermissionGuard } from './shared/user_permission.guard';

import { UnsubcribeNotificationComponent } from './views/unsubcribenotification/unsubcribenotification.component';
import { DescriptionMailComponent } from './views/descriptionmail/descriptionmail.component';
// import { FbaPermissionGuard } from './shared/fba_permission.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'footfall/overview',
    pathMatch: 'full',
  },
  {
    path: 'active-mail/:email/:token',
    component: ActivemailComponent,
    data: {
      title: 'Active Email Page'
    }
  },
  {
    path: 'descriptionReportNotification/:id/:secret_key',
    component: DescriptionMailComponent,
    data: {
      title: 'description report page'
    }
  },
  {
    path: 'unsubcribeNotification/:secret_key',
    component: UnsubcribeNotificationComponent,
    data: {
      title: 'unsubcribe notifcation page'
    }
  },
  {
    path: 'email-unsubcribe/:secret_key',
    component: UnsubcribeMailComponent,
    data: {
      title: 'Unsubcribe Email Schedule'
    }
  },
  // {
  //   path: '500',
  //   component: P500Component,
  //   data: {
  //     title: 'Page 500'
  //   }
  // },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivateChild: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'about',
        loadChildren: './views/about/about.module#AboutModule',
      },
      {
        path: 'guides/report',
        loadChildren: './views/manual/reports/report.module#ReportModule',
      },
      {
        path: 'userconfig',
        loadChildren: './views/userconfig/userconfig.module#UserConfigModule',
      },
      {
        path: 'help',
        loadChildren: './views/help/help.module#HelpModule',
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'terminal',
        loadChildren: './views/terminal/terminal.module#TerminalModule'
      },
      {
        path: 'footfall',
        loadChildren: './views/footfall/footfall.module#FootfallModule'
      },
      {
        path: 'performance',
        loadChildren: './views/performance/performance.module#PerformanceModule'
      },
      {
        path: 'fba',
        loadChildren: './views/fba/fba.module#FbaModule'
      },
      {
        canActivate: [UserPermissionGuard], // nếu có all
        path: 'general',
        loadChildren: './views/admin/general/general.module#GeneralModule'
      },
      {
        path: 'gender-age',
        loadChildren: './views/age/age.module#AgeModule'
      },
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
