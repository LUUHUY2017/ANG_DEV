import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTreeReportingStoreComponent } from './menureportingstore.component';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [
    MenuTreeReportingStoreComponent
  ],
  imports: [
    CommonModule
    , FormsModule
    , SelectModule
    , ClickOutsideModule
    , BlockUIModule
  ],
  exports: [
    MenuTreeReportingStoreComponent
  ],
  providers: [],
})
export class MenuTreeReportingStoreModule {}
