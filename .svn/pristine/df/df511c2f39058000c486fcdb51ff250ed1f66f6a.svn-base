import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Routing
import { FootfallHeatMapRoutingModule } from './heatmap-routing.module';

import { FootfallHeatMapComponent } from './heatmap.component';
// add
// import { SelectModule } from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';  // group

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'angular2-datatable';
// button dropdown
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// thêm để hiển thị ra dialog
import { Dialog, DialogModule } from 'primeng/dialog';

import {DropdownModule} from 'primeng/dropdown';

import { MenutreeModule } from '../../viewchild/menutree/menutree.module';
import { TimeperiodModule } from '../../viewchild/timeperiod/timeperiod.module';
import { ModalModule } from 'ngx-bootstrap/modal';


import { NotifierModule, NotifierOptions } from 'angular-notifier';
const customNotifierOptions: NotifierOptions = {
  position: {
      horizontal: { position: 'right', distance: 12 },
      vertical: { position: 'top', distance: 12, gap: 10 }
  },
  theme: 'material',
  behaviour: {
      autoHide: 2000, onClick: 'hide', onMouseover: 'pauseAutoHide', showDismissButton: true, stacking: 4
  },
  animations: {
      enabled: true,
      show: { preset: 'slide', speed: 300, easing: 'ease' },
      hide: { preset: 'fade', speed: 300, easing: 'ease', offset: 50 },
      shift: { speed: 300, easing: 'ease' },
      overlap: 150
  }
};
@NgModule({
  imports: [
    FormsModule,
    FootfallHeatMapRoutingModule,
    NgSelectModule,
    ButtonsModule,
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    BlockUIModule.forRoot(),
    BsDropdownModule.forRoot(),
    DialogModule,
    DropdownModule,
    MenutreeModule,
    TimeperiodModule,
    DataTableModule,
    ModalModule
  ],
  declarations: [

    FootfallHeatMapComponent
  ]

})
export class FootfallHeatMapModule { }
