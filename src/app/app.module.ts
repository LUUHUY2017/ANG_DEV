import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { RegisterComponent } from './views/register/register.component';

// Quyet Them moi 3/9/2018
import { LoginModule } from './views/login/login.module';
import { ActivemailModule } from './views/activemail/activemail.module';
import { UnsubcribeMailModule } from './views/unsubcribemailschedule/unsubcribemailschedule.module';
import { UnsubcribeNotificationModule } from './views/unsubcribenotification/unsubcribenotification.module';
import { DescriptionMailModule } from './views/descriptionmail/descriptionmail.module';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
// Kiem soat quyen truy cap
import { AuthGuard } from './shared/auth.guard';
import { UserPermissionGuard } from './shared/user_permission.guard';
import { FbaPermissionGuard } from './shared/fba_permission.guard';


// Quyet Them moi 3/9/2018
import { TreeviewModule } from 'ngx-treeview';

// Datepicker
import { BsDatepickerModule } from 'ngx-bootstrap';

// Dropdown tree
// import { ExpandMode, NgxTreeSelectModule } from '../../lib/ngx-tree-select/src';

// Coreui
import { ModalModule } from 'ngx-bootstrap/modal';

import { TreeTableModule } from 'primeng/treetable';

// prime ng
import { DialogModule } from 'primeng/dialog';

import { DropdownModule } from 'primeng/dropdown';

import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,


    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),

    // Quyet Them moi 3/9/2018
    // tslint:disable-next-line: deprecation
    HttpModule,

    FormsModule,
    ReactiveFormsModule,

    // Quyet Them moi 3/9/2018
    LoginModule,
    ActivemailModule,
    UnsubcribeMailModule,
    UnsubcribeNotificationModule,
    DescriptionMailModule,

    // Quyet 4/9/2018 them moi Treeview va drop treeview
    TreeviewModule.forRoot(),

    BsDatepickerModule.forRoot(),

    // NgxTreeSelectModule.forRoot(
    //   {
    //     idField: 'id',
    //     textField: 'name',
    //     expandMode: ExpandMode.Selection
    //   }),

    ModalModule.forRoot(),

    TreeTableModule,
    DialogModule,
    DropdownModule,
    BlockUIModule,

  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,

    // Quyet bo so voi mac dinh do da them vao module
    // LoginComponent,
    RegisterComponent,

  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
    AuthGuard,
    UserPermissionGuard,
    FbaPermissionGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
