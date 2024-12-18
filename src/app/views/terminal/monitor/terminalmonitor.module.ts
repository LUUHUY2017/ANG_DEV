import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';     // ng For
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
// Routing
import { TerminalMonitorRoutingModule } from './terminalmonitor-routing.module';
import { TerminalMonitorComponent } from './terminalmonitor.component';
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
import { TreeTableModule } from 'primeng/treetable';
// import clickout side
import { ClickOutsideModule } from 'ng-click-outside';
import { AppService } from '../../../app.service';
// import table Prime NG
import { TableModule } from 'primeng/table';
// import Modal
import { ModalModule } from 'ngx-bootstrap/modal';

import { TerminalMenuModule } from '../../viewchild/terminalmenu/terminalmenu.module';
// import viewchild
// import notification
import { NotifierModule, NotifierOptions } from 'angular-notifier';
const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: { position: 'right', distance: 12 },
        vertical: { position: 'top', distance: 12, gap: 10 }
    },
    theme: 'material',
    behaviour: {
        autoHide: 3000, onClick: 'hide', onMouseover: 'pauseAutoHide', showDismissButton: true, stacking: 4
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
        TerminalMonitorRoutingModule,
        FormsModule,
        ButtonsModule,
        SelectModule,
        DropdownModule,
        ClickOutsideModule,
        DialogModule,
        TableModule,
        NotifierModule.withConfig(customNotifierOptions),
        ModalModule.forRoot(),
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
        TerminalMenuModule
    ],
    declarations: [
        TerminalMonitorComponent,
    ],
    providers: [AppService],
})
export class TerminalMonitorModule {
    constructor() { }
}
