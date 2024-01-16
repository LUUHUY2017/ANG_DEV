import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI, BlockUIModule } from 'ng-block-ui';
// import { MultiSelectModule } from 'primeng/multiselect';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import clickout side
import { ClickOutsideModule } from 'ng-click-outside';
// import Modal
import { ModalModule } from 'ngx-bootstrap/modal';
// Ng2-select
// import { SelectModule } from 'ng-select';
import { NgSelectModule } from '@ng-select/ng-select';  // group
// import notification
import { NotifierModule, NotifierOptions } from 'angular-notifier';

// import push_notisfication
import { PushNotificationsModule } from 'ng-push';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: { position: 'right', distance: 12 },
    vertical: { position: 'top', distance: 12, gap: 10 }
  },
  theme: 'material',
  behaviour: {
    autoHide: 4000, onClick: 'hide', onMouseover: 'pauseAutoHide', showDismissButton: true, stacking: 4
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
    FormsModule,
    DashboardRoutingModule,
    CommonModule,
    ChartsModule,
    NgSelectModule,
    BsDropdownModule,
    ModalModule,
    ClickOutsideModule,
    NotifierModule.withConfig(customNotifierOptions),
    BlockUIModule.forRoot(),
    ButtonsModule.forRoot(),
    // MultiSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
    PushNotificationsModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
