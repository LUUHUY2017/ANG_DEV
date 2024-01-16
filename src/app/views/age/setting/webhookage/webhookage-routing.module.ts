import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebhookageComponent } from './webhookage.component';

const routes: Routes = [
  {
    path: '',
    component: WebhookageComponent,
    data: {
      title: 'web hook gender age'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebhookageRoutingModule {}
