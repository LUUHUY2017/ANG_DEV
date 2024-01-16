import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { AgeRoutingModule } from './age-routing.module';

import { GenderagePermissionGuard } from '../../shared/genderage_permission.guard';


@NgModule({
  imports: [
    AgeRoutingModule
  ],
  declarations: [
  ],
  providers: [
    GenderagePermissionGuard
  ]
})
export class AgeModule { }
