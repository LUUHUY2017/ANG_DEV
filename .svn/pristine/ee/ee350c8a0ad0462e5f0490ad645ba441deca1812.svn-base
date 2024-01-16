import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FbaApplicationRoutingModule } from './fba-application-routing.module';
import { SuperAdminGuard } from '../../../../shared/superadmin.guard';
import { FbaPermissionGuard } from '../../../../shared/fba_permission.guard';



@NgModule({
  imports: [
    FbaApplicationRoutingModule,
    CommonModule
  ],
  declarations: [
   ],
   providers: [FbaPermissionGuard, SuperAdminGuard]
})
export class FbaApplicationSettingModule { }
