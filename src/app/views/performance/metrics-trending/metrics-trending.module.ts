import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

// Routing
import { FootfallMetricsTrendingRoutingModule } from './metrics-trending-rounting.module';
import { FootfallMetricsTrendingComponent } from './metrics-trending.component';


// Ng2-select
// import { SelectModule } from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';  // group

import { ExpandMode, NgxTreeSelectModule } from '../../../../../lib/ngx-tree-select/src';


import { DataTableModule } from 'angular2-datatable';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';


// import { MultiSelectModule } from 'primeng/multiselect';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// thêm để hiển thị ra dialog
import { Dialog, DialogModule } from 'primeng/dialog';

import {DropdownModule} from 'primeng/dropdown';

import { ModalModule } from 'ngx-bootstrap/modal';
// Viewchild
import { TimeperiodModule } from '../../viewchild/timeperiod/timeperiod.module';
import { MenutreeModule } from '../../viewchild/menutree/menutree.module';
import { StoreReportingFFScheduleModule } from '../../useremailmodule/footfall/storereporting/storereporting.module';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
const customNotifierOptions: NotifierOptions = {
  position: {
      horizontal: { position: 'right', distance: 12 },
      vertical: { position: 'top', distance: 12, gap: 10 }
  },
  theme: 'material',
  behaviour: {
      autoHide: 6000, onClick: 'hide', onMouseover: 'pauseAutoHide', showDismissButton: true, stacking: 4
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
    ButtonsModule,
    FootfallMetricsTrendingRoutingModule,
    NgSelectModule,
    DropdownModule,
    DialogModule,
    ModalModule,
      NgxTreeSelectModule.forRoot(
      {
        idField: 'id',
        textField: 'name',
        expandMode: ExpandMode.Selection
      }),
    DataTableModule,
    CommonModule,
    BlockUIModule.forRoot(),
    // MultiSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    BsDropdownModule.forRoot(),
    MenutreeModule,
    TimeperiodModule,
    StoreReportingFFScheduleModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  declarations: [
    // FootfallVisitsComponent,
    FootfallMetricsTrendingComponent,
    // pickuplocationcomponent
   // DataFilterPipe,
  ]
})
export class FootfallMetricsTrendingModule { }
