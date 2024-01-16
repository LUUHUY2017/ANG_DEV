import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './usermenu.component';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'ng-select';
// import { ClickOutsideModule } from 'ng-click-outside';
import { BlockUIModule } from 'ng-block-ui';
import { RouterModule } from '../../../../../node_modules/@angular/router';

@NgModule({
  declarations: [
    UserMenuComponent
  ],
  imports: [
    CommonModule
    , FormsModule
    , SelectModule
    // , ClickOutsideModule
    , BlockUIModule
    , RouterModule
  ],
  exports: [
    UserMenuComponent
  ],
  providers: [],
})
export class UserMenuModule {}
