import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { language } from '../about/_language';
import { language_en } from '../about/_language_en';

@Component({
    templateUrl: 'about.component.html',
    styleUrls: ['about.component.scss']
})
export class AboutComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    status = 1;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
    constructor(private router: Router, private appservice: AppService) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
    }
    language: any;
    ngOnInit() {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
    }
}

