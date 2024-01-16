import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { language } from '../../../language';
import { language_en } from '../../../language_en';


@Component({
    templateUrl: 'help-detail.component.html',
    styleUrls: ['help-detail.component.scss']
})
export class HelpDetailComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    id: number;
    public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
    type_language = JSON.parse(localStorage.getItem(environment.language));
    data: any;
    language: any;
    url_img = environment.apiUrl + 'images/helps/';
    constructor(private router: Router, private activerouter: ActivatedRoute, private appservice: AppService) {
        this.activerouter.params.subscribe(res => { this.id = res.id; });
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
    }
    ngOnInit() {
        this.get_data();
    }
    get_data() {
        this.blockUI.start('Đang tải thông tin...');
        const url = environment.API.sp_get_help_list + '_get_detail/' + this.id;
        this.appservice.get(url).subscribe(res => {
            console.log(res);
            this.data = res.data;
            this.blockUI.stop();
        }, (error) => {
            console.log(error);
            this.blockUI.stop();
        }, () => {
            this.blockUI.stop();
        });
    }
}

