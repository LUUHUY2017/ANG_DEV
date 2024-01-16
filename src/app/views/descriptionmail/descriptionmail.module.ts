import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DescriptionMailComponent } from './descriptionmail.component';
// import {BlockUIModule} from 'primeng/blockui';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { AppService } from '../../app.service';
// import { AlertsModule } from 'angular-alert-module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BlockUIModule.forRoot(),
        RouterModule
        // Specify your library as an import
        // AlertsModule.forRoot()
    ],
    declarations: [DescriptionMailComponent],
    providers: [AppService]
})

export class DescriptionMailModule {
    // Decorator wires up blockUI instance
    @BlockUI() blockUI: NgBlockUI;
}
