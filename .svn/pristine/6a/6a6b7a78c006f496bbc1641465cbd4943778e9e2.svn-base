import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// add

import { TagInputModule } from 'ngx-chips';
import { HelpEditComponent } from './help-edit.component';

import { SelectModule } from 'ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
// addtooltip
import { TooltipModule } from 'ngx-bootstrap/tooltip';
//
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { HelpAddRoutingModule } from './help-edit-routing.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
    imports: [
        HelpAddRoutingModule,
        FormsModule,
        SelectModule,
        ButtonsModule,
        CommonModule,
        TagInputModule,
        // BrowserAnimationsModule,
        NgMultiSelectDropDownModule.forRoot(),
        // tooltip
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        BlockUIModule.forRoot(),
        QuillModule
    ],
    declarations: [
        HelpEditComponent,
    ]
})
export class HelpEditModule { }
