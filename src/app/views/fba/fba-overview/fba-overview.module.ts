import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

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

import { DropdownModule } from 'primeng/dropdown';

// angular dropdown
// import { AngularDropdownModule } from 'angular-dropdown';

// click outside
import { ClickOutsideModule } from 'ng-click-outside';

// Routing
import { FbaOverviewRoutingModule } from './fba-overview-routing.module';

import { FbaOverviewComponent } from './fba-overview.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    imports: [
        FbaOverviewRoutingModule,
        FormsModule,
        ButtonsModule,
        ClickOutsideModule,
        SelectModule,
        DropdownModule,
        DialogModule,
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
        ModalModule
    ],
    declarations: [
        FbaOverviewComponent,
    ]
})
export class FbaOverviewModule {
    constructor() { }
}
