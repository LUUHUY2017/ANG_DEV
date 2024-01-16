import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// add

import { HelpDetailComponent } from './help-detail.component';

import { SelectModule } from 'ng-select';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

// addtooltip
import { TooltipModule } from 'ngx-bootstrap/tooltip';
//
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { HelpListRoutingModule } from './help-detail-routing.module';

@NgModule({
    imports: [
        HelpListRoutingModule,
        FormsModule,
        SelectModule,
        ButtonsModule,
        CommonModule,
        //  NgMultiSelectDropDownModule.forRoot()
        // tooltip
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        BlockUIModule.forRoot(),
    ],
    declarations: [
        HelpDetailComponent,
    ]
})
export class HelpDetailModule { }
