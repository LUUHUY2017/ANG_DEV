import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Routing
import { FootfallLiveviewRoutingModule } from './liveview-rounting.module';
// add
import {FootfallLiveviewComponent} from './liveview.component';

// import { SelectModule } from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';  // group
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//
import {BlockUIModule } from 'ng-block-ui';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

// addtooltip
import { TooltipModule } from 'ngx-bootstrap/tooltip';
//
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// thêm để hiển thị ra dialog
import { Dialog, DialogModule } from 'primeng/dialog';

import {DropdownModule} from 'primeng/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
// Viewchild
import { TimeperiodModule } from '../../viewchild/timeperiod/timeperiod.module';
import { MenutreeModule } from '../../viewchild/menutree/menutree.module';
import { DataTableModule } from 'angular2-datatable';
@NgModule({
    imports: [
        FormsModule,
        FootfallLiveviewRoutingModule,
        NgSelectModule,
        ButtonsModule,
        CommonModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        DropdownModule,
        DialogModule,
        BlockUIModule.forRoot(),
        MenutreeModule,
        TimeperiodModule,
        DataTableModule,
        ModalModule
    ],
    declarations: [
        FootfallLiveviewComponent,
    ]
})
export class FootfallLiveviewModule { }
