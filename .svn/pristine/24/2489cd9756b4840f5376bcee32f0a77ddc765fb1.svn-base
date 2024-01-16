import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

// Routing
import { FootfallTimeComparisonRoutingModule } from './time-comparison-rounting.module';

import { FootfallTimeComparisonComponent } from './time-comparison.component';

// Ng2-select
// import { SelectModule } from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';  // group
// import { ExpandMode, NgxTreeSelectModule } from '../../../../../lib/ngx-tree-select/src';


import { DataTableModule } from 'angular2-datatable';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';


// import { MultiSelectModule } from 'primeng/multiselect';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// thêm để hiển thị ra dialog
import { Dialog, DialogModule } from 'primeng/dialog';

import { DropdownModule } from 'primeng/dropdown';

// Viewchild
import { MenutreeModule } from '../../viewchild/menutree/menutree.module';
import { TimeperiodModule } from '../../viewchild/timeperiod/timeperiod.module';
import { Timeperiod2Module } from '../../viewchild/timeperiod2/timeperiod2.module';

import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    FormsModule,
    ButtonsModule,
    FootfallTimeComparisonRoutingModule,
    NgSelectModule,
    DialogModule,
    DropdownModule,

    DataTableModule,
    CommonModule,
    BlockUIModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    BsDropdownModule.forRoot(),
    MenutreeModule,
    TimeperiodModule,
    Timeperiod2Module,
    ModalModule
  ],
  declarations: [
    FootfallTimeComparisonComponent,
    // pickuplocationcomponent
    // DataFilterPipe,
  ]
})
export class FootfallTimeComparisonModule { }
