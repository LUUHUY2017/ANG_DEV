import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenutreeComponent } from './menutree.component';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [
    MenutreeComponent
  ],
  imports: [
    CommonModule
    , FormsModule
    , SelectModule
    , ClickOutsideModule
    , BlockUIModule
  ],
  exports: [
    MenutreeComponent
  ],
  providers: [],
})
export class MenutreeModule {}
