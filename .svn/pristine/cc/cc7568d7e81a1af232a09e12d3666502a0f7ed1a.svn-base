import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { GeneralRoutingModule } from './general-routing.module';
import { SuperAdminGuard } from '../../../shared/superadmin.guard';
import { GenderagePermissionGuard } from '../../../shared/genderage_permission.guard';

@NgModule({
  imports: [
    // Tablets
    GeneralRoutingModule,
    CommonModule
  ],
  declarations: [
  ],
  providers: [
    SuperAdminGuard
    , GenderagePermissionGuard
  ]
})
export class GeneralModule { }
