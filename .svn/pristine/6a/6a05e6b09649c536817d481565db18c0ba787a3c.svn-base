import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Help'
      // , module_title: 'help'
    },
    children: [
      {
        path: '',
        loadChildren: './help-list/help-list.module#HelpListModule'
      },
      {
        path: 'help-detail/:id',
        loadChildren: './help-detail/help-detail.module#HelpDetailModule'
      },
      {
        path: 'add-help',
        loadChildren: './help-add/help-add.module#HelpAddModule'
      },
      {
        path: 'edit-help/:id',
        loadChildren: './help-edit/help-edit.module#HelpEditModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootfallRoutingModule { }
