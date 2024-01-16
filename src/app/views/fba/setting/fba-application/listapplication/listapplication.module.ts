import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';     // ng For
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
// Routing
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
import { DropdownModule } from 'primeng/dropdown';
import { TreeTableModule } from 'primeng/treetable';
// import clickout side
import { ClickOutsideModule } from 'ng-click-outside';
import { AppService } from '../../../../../app.service';
// import Modal
import { ModalModule } from 'ngx-bootstrap/modal';
// import notification
import { FbaMenuModule } from '../../../../viewchild/fbamenu/fbamenu.module';
import { FbaListApplicationComponent } from './listapplication.component';
import { FbaListApplicationRoutingModule } from './listapplication-routing.module';

@NgModule({
    declarations: [
        FbaListApplicationComponent,
    ],
    imports: [
        FormsModule,
        ButtonsModule,
        SelectModule,
        DropdownModule,
        ClickOutsideModule,
        DialogModule,
        ModalModule.forRoot(),
        TreeTableModule,
        DataTableModule,
        BlockUIModule.forRoot(),
        // MultiSelectModule,
        NgMultiSelectDropDownModule.forRoot(),
        BsDropdownModule.forRoot(),
        CommonModule,
        FbaListApplicationRoutingModule,
        BlockUIModule,
        FbaMenuModule
    ],
    exports: [],
    providers: [AppService],
})
export class FbaListApplicationModule { }
