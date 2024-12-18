import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

// Routing
import {AgeOverviewRoutingModule } from './age-overview-routing.module';
import {AgeOverviewComponent } from './age-overview.component';

// Ng2-select
// import { SelectModule } from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';  // group
import { DataTableModule } from 'angular2-datatable';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';

// thêm để hiển thị ra dialog
import { Dialog, DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
// import clickout side
import { ClickOutsideModule } from 'ng-click-outside';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    imports: [
       AgeOverviewRoutingModule,
        FormsModule,
        ButtonsModule,
        NgSelectModule,
        ClickOutsideModule,
        DropdownModule,
        DialogModule,
        DataTableModule,
        CommonModule,
        BlockUIModule.forRoot(),
        ModalModule
    ],
    declarations: [
       AgeOverviewComponent,
    ]
})

export class AgeOverviewModule {
    constructor() { }
}
