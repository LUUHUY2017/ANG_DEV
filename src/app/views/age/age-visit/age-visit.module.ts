import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

// Routing
import { AgeVisitRoutingModule } from './age-visit-routing.module';
import { AgeVisitComponent } from './age-visit.component';

// Ng2-select
// import { SelectModule } from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';  // group
import { DataTableModule } from 'angular2-datatable';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';
// thêm để hiển thị ra dialog
import { Dialog, DialogModule } from 'primeng/dialog';

// import clickout side
import { ClickOutsideModule } from 'ng-click-outside';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StoreReportingFFScheduleModule } from '../../useremailmodule/footfall/storereporting/storereporting.module';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: { position: 'right', distance: 12 },
        vertical: { position: 'top', distance: 12, gap: 10 }
    },
    theme: 'material',
    behaviour: {
        autoHide: 6000, onClick: 'hide', onMouseover: 'pauseAutoHide', showDismissButton: true, stacking: 4
    },
    animations: {
        enabled: true,
        show: { preset: 'slide', speed: 300, easing: 'ease' },
        hide: { preset: 'fade', speed: 300, easing: 'ease', offset: 50 },
        shift: { speed: 300, easing: 'ease' },
        overlap: 150
    }
};

@NgModule({
    imports: [
        AgeVisitRoutingModule,
        FormsModule,
        ButtonsModule,
        NgSelectModule,
        ClickOutsideModule,
        DialogModule,
        BsDropdownModule,
        DataTableModule,
        CommonModule,
        BlockUIModule.forRoot(),
        ModalModule,
        StoreReportingFFScheduleModule,
        NotifierModule.withConfig(customNotifierOptions)
    ],
    declarations: [
        AgeVisitComponent,
    ]
})
export class AgeVisitModule {
    constructor() { }
}
