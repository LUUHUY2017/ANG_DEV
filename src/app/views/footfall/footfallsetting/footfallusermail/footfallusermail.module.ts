import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';     // ng For
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
// Routing
import { FootfallUserMailComponent } from './footfallusermail.component';
import { FootfallUserMailRoutingModule } from './footfallusermail-routing.module';
// Ng2-select
import { SelectModule } from 'ng-select';
import { ExpandMode, NgxTreeSelectModule } from '../../../../../../lib/ngx-tree-select/src';
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
import { AppService } from '../../../../app.service';
// addtooltip
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import Modal
import { ModalModule } from 'ngx-bootstrap/modal';
// import viewchild
// import { FootfallSettingMenuModule } from '../../../viewchild/footfallsettingmenu/footfallsettingmenu.module';
import { GeneralMenuModule } from '../../../viewchild/generalmenu/generalmenu.module';
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
        FootfallUserMailRoutingModule,
        FormsModule,
        // import validator
        ReactiveFormsModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        ButtonsModule,
        SelectModule,
        DropdownModule,
        ClickOutsideModule,
        DialogModule,
        TooltipModule.forRoot(),
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
        NotifierModule.withConfig(customNotifierOptions),
        BlockUIModule.forRoot(),
        // MultiSelectModule,
        NgMultiSelectDropDownModule.forRoot(),
        BsDropdownModule.forRoot(),
        // FootfallSettingMenuModule,
        GeneralMenuModule
    ],
    declarations: [
        FootfallUserMailComponent
    ],
    providers: [AppService],
    exports: [ModalModule]
})
export class FootfallUserMailModule {
    constructor() { }
}
