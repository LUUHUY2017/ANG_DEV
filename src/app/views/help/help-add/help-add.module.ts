import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// add

import { TagInputModule } from 'ngx-chips';
import { HelpAddComponent } from './help-add.component';

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

import { HelpAddRoutingModule } from './help-add-routing.module';

import { EditorModule } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill';
@NgModule({
    imports: [
        HelpAddRoutingModule,
        FormsModule,
        SelectModule,
        ButtonsModule,
        CommonModule,
        TagInputModule,
        QuillModule,
        // BrowserAnimationsModule,
        NgMultiSelectDropDownModule.forRoot(),
        // tooltip
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        BlockUIModule.forRoot(),
        EditorModule
    ],
    declarations: [
        HelpAddComponent,
    ]
})
export class HelpAddModule { }
