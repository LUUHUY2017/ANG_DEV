import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ExpertGuard } from '../../../shared/expert.guard';


const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Feedback Any Where'
        },
        children: [
            {
                path: '',
                redirectTo: 'list-question'
            },
            {
                path: 'list-question',
                loadChildren: './list-question/list-question.module#ListQuestionModule'
            },
            {
                // canActivate: [ExpertGuard],
                path: 'add-question',
                loadChildren: './add-question/add-question.module#AddQuestionModule'
            },
            {
                path: 'update-question/:id',
                loadChildren: './update-question/update-question.module#UpdateQuestionModule'
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionRoutingModule { }
