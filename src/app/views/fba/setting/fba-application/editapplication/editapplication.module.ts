import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FbaEditApplicationComponent } from './editapplication.component';
import { FbaEditApplicationRoutingModule } from './editapplication-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { FbaMenuModule } from '../../../../viewchild/fbamenu/fbamenu.module';

@NgModule({
    declarations: [
        FbaEditApplicationComponent
    ],
    imports: [
        CommonModule,
        FbaEditApplicationRoutingModule,
        FormsModule,
        RouterModule,
        BlockUIModule,
        FbaMenuModule
    ],
    exports: [],
    // providers: [],
    providers: [],
})
export class FbaEditApplicationModule {
    constructor() {}
 }
