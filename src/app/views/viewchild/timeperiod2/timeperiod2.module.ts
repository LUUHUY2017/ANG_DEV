import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timeperiod2Component } from './timeperiod2.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [
    Timeperiod2Component
  ],
  imports: [
    CommonModule
    , FormsModule
    , ClickOutsideModule
    , BlockUIModule
  ],
  exports: [
    Timeperiod2Component
  ],
  providers: [],
})
export class Timeperiod2Module {}
