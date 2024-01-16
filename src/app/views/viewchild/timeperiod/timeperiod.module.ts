import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeperiodComponent } from './timeperiod.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [
    TimeperiodComponent
  ],
  imports: [
    CommonModule
    , FormsModule
    , ClickOutsideModule
    , BlockUIModule
  ],
  exports: [
    TimeperiodComponent
  ],
  providers: [],
})
export class TimeperiodModule {}
