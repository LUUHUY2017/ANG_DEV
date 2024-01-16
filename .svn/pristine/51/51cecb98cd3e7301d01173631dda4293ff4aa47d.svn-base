import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
    templateUrl: 'report.component.html',
    styleUrls: ['report.component.scss']
})
export class ReportComponent implements OnInit {
    page_id = environment.Pages.footfall.liveview;
    @BlockUI() blockUI: NgBlockUI;
    status = 1;
    public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
    constructor(private router: Router, private appservice: AppService) {
    }
    language: any;
    ngOnInit() {
        this.get_page_param();
    }
    get_page_param() {
    }
}

