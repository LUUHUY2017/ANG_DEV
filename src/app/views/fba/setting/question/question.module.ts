import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpertGuard } from '../../../../shared/expert.guard';

// Routing
import { QuestionRoutingModule } from './question-routing.module';

@NgModule({
  imports: [
    // Question
    QuestionRoutingModule,
    CommonModule
  ],
  declarations: [
  ],
  providers: [
    ExpertGuard
  ]
})
export class QuestionModule { }
