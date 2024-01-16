import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { UserPermissionGuard } from '../../shared/user_permission.guard';

const routes: Routes = [
    {
        path: '',
        data: {
            title: ''
            , module_title: 'terminal',
        },
        // canActivateChild: [UserPermissionGuard], // nếu mà có genderage
        children: [
            {
                path: '',
                redirectTo: 'monitor'
            },
            {
                path: 'monitor',
                loadChildren: './monitor/terminalmonitor.module#TerminalMonitorModule'
            },
            {
                path: 'usermail',
                loadChildren: './terminalusermail/terminalusermail.module#TerminalUserMailModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TerminalRoutingModule { }
