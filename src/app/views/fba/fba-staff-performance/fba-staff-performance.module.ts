import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

// Routing
import { FbaStaffPerformanceRoutingModule } from './fba-staff-performance-routing.module';
import { FbaStaffPerformanceComponent } from './fba-staff-performance.component';

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
// import clickout side
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
    imports: [
        FbaStaffPerformanceRoutingModule,
        FormsModule,
        ButtonsModule,
        ClickOutsideModule,
        SelectModule,
        DropdownModule,
        DialogModule,
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
    ],
    declarations: [
        FbaStaffPerformanceComponent,
    ]
})
export class FbaStaffPerformanceModule {
    constructor() { }
}
