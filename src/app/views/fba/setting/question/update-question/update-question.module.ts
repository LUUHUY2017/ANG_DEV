import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';     // ng For
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
// Routing
import { UpdateQuestionRoutingModule } from './update-question-routing.module';
import { UpdateQuestionComponent } from './update-question.component';
// Ng2-select
import { SelectModule } from 'ng-select';
import { DataTableModule } from 'angular2-datatable';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';

// import { MultiSelectModule } from 'primeng/multiselect';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// thêm để hiển thị ra dialog
import { Dialog, DialogModule } from 'primeng/dialog';
// import clickout side
import { ClickOutsideModule } from 'ng-click-outside';
// import notification
import { NotifierModule, NotifierOptions } from 'angular-notifier';

const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: { position: 'right', distance: 12 },
        vertical: { position: 'top', distance: 12, gap: 10 }
    },
    theme: 'material',
    behaviour: {
        autoHide: 2000, onClick: 'hide', onMouseover: 'pauseAutoHide', showDismissButton: true, stacking: 4},
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
        UpdateQuestionRoutingModule,
        FormsModule,
        ButtonsModule,
        SelectModule,
        ClickOutsideModule,
        NotifierModule.withConfig(customNotifierOptions),
        DialogModule,
        DataTableModule,
        CommonModule,
        BlockUIModule.forRoot(),
        // MultiSelectModule,
        NgMultiSelectDropDownModule.forRoot(),
        BsDropdownModule.forRoot(),
    ],
    declarations: [
        UpdateQuestionComponent,
    ]
})
export class UpdateQuestionModule {
    constructor() { }
}
