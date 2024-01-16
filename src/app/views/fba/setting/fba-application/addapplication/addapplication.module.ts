import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FbaAddApplicationComponent } from './addapplication.component';
import { FbaAddApplicationRoutingModule } from './addapplication-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { SelectModule } from 'ng-select';
import { FbaMenuModule } from '../../../../viewchild/fbamenu/fbamenu.module';
import { AppService } from '../../../../../app.service';

@NgModule({
    declarations: [
        FbaAddApplicationComponent
    ],
    imports: [
        CommonModule,
        FbaAddApplicationRoutingModule,
        FormsModule,
        RouterModule,
        BlockUIModule,
        SelectModule,
        FbaMenuModule
    ],
    exports: [FbaAddApplicationComponent],
    providers: [AppService],
})
export class FbaAddApplicationModule {
    constructor() { }
}
