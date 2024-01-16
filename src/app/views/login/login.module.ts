import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
// import {BlockUIModule} from 'primeng/blockui';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';

// import { AlertsModule } from 'angular-alert-module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BlockUIModule.forRoot(),
        // Specify your library as an import
        // AlertsModule.forRoot()
    ],
    declarations: [LoginComponent],
})

export class LoginModule {
    // Decorator wires up blockUI instance
    @BlockUI() blockUI: NgBlockUI;
}
