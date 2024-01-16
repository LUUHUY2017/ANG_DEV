import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

// Routing
import { FootfallTimeTrendingRoutingModule } from './time-trending-rounting.module';

import { FootfallTimeTrendingComponent } from './time-trending.component';

// Ng2-select
import { SelectModule } from 'ng-select';

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

import { TreeTableModule } from 'primeng/treetable';
// Viewchild
import { MenutreeModule } from '../../viewchild/menutree/menutree.module';
import { TimeperiodModule } from '../../viewchild/timeperiod/timeperiod.module';

// import {pickuplocationcomponent} from 'd:/BIUInew/src/app/containers/pickuplocation/pickuplocation.component';
@NgModule({
  imports: [
    FormsModule,
    ButtonsModule,
    FootfallTimeTrendingRoutingModule,
   // FootfallTimecompeModule,
    SelectModule,
    DialogModule,
    DropdownModule,
    TreeTableModule,
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
    TimeperiodModule
  ],
  declarations: [
    FootfallTimeTrendingComponent,
    // pickuplocationcomponent
   // DataFilterPipe,
  ]
})
export class FootfallTimeTrendingModule { }
