import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPermissionGuard } from '../../shared/user_permission.guard';
import { FootfallPermissionGuard } from '../../shared/footfall_permission.guard';


// Routing
import { FootfallRoutingModule } from './footfall-routing.module';

@NgModule({
  imports: [
    FootfallRoutingModule
  ],
  providers: [
    UserPermissionGuard
    , FootfallPermissionGuard
  ],
  declarations: [
  ]
})
export class FootfallModule { }
