import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddQuestionComponent } from './add-question.component';

const routes: Routes = [
  {
    path: '',
    component: AddQuestionComponent,
    data: {
      title: 'Add Question'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddQuestionRoutingModule {}
