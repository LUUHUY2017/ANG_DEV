import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPermissionGuard } from '../../shared/user_permission.guard';

// Routing
import { FbaRoutingModule } from './fba-routing.module';

@NgModule({
  imports: [
    FbaRoutingModule
  ],
  declarations: [
  ],
  providers: [
    UserPermissionGuard
  ]
})
export class FbaModule { }
