import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonsModule } from 'ngx-bootstrap/buttons';



// buttondropdown
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// chartmodule
import { ChartsModule } from 'ng2-charts/ng2-charts';

// thêm để hiển thị ra dialog
import { Dialog, DialogModule } from 'primeng/dialog';

import { DropdownModule } from 'primeng/dropdown';

import { TreeTableModule } from 'primeng/treetable';
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';


// import { SelectModule } from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';  // group
import { ExpandMode, NgxTreeSelectModule } from '../../../../../lib/ngx-tree-select/src';
// Routing
import { FootfallOverviewRoutingModule } from './overview-routing.module';

import { FootfallOverviewComponent } from './overview.component';
import { MenutreeModule } from '../../viewchild/menutree/menutree.module';
import { CommonModule } from '../../../../../node_modules/@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [
    FormsModule,
    BlockUIModule,
    CommonModule,
    FootfallOverviewRoutingModule,
    NgSelectModule,
    FormsModule,
    ButtonsModule,
    BsDropdownModule.forRoot(),
    ChartsModule,
    NgxTreeSelectModule.forRoot(
      {
        idField: 'id',
        textField: 'name',
        expandMode: ExpandMode.Selection
      }),
    // dialog
    DialogModule,
    DropdownModule,
    TreeTableModule,
    MenutreeModule,
    ModalModule,
    ClickOutsideModule
  ],
  declarations: [
    FootfallOverviewComponent,
    // timelocationcomponent
  ]
})
export class FootfallOverviewModule { }
