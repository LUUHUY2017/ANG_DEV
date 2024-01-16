import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AppService } from '../../../app.service';


@Component({
    selector: 'app-generalmenu',
    templateUrl: './generalmenu.component.html',
    styleUrls: ['./generalmenu.component.css']
})

export class GeneralMenuComponent implements OnInit {
    user_info = JSON.parse(localStorage.getItem(environment.UserLoged));
    module_info = JSON.parse(localStorage.getItem('module_array'));
    showMenu = this.user_info.lever === '0' && this.user_info.organization_id === '0';
    language: any;
    constructor(
        private route: ActivatedRoute
        , private router: Router
        , private appservice: AppService) {
        this.language = this.appservice.getLanguage();
        this.module_info.forEach(element => {
            if (element.page_module === 'genderage') {
                this.showMenu = true;
            }
        });
    }
    ngOnInit() { }
}
