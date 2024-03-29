import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';     // ng For
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
// Routing
import { ListQuestionRoutingModule } from './list-question-routing.module';
import { ListQuestionComponent } from './list-question.component';
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
import { AppService } from '../../../../../app.service';
// import Modal
import { ModalModule } from 'ngx-bootstrap/modal';

import { FbaMenuModule } from '../../../../viewchild/fbamenu/fbamenu.module';

@NgModule({
    imports: [
        ListQuestionRoutingModule,
        FormsModule,
        ButtonsModule,
        SelectModule,
        ClickOutsideModule,
        DialogModule,
        ModalModule.forRoot(),
        DataTableModule,
        CommonModule,
        BlockUIModule.forRoot(),
        // MultiSelectModule,
        NgMultiSelectDropDownModule.forRoot(),
        BsDropdownModule.forRoot(),
        FbaMenuModule
    ],
    declarations: [
        ListQuestionComponent,
    ],
    providers: [AppService],
})
export class ListQuestionModule {
    constructor() { }
}
