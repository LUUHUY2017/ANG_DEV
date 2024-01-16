import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppService } from '../../../app.service';
import { environment } from '../../../../environments/environment';
// import { ActivatedRoute } from '@angular/router';
// import { Router } from '@angular/router';


@Component({
    selector: 'app-usermenu',
    templateUrl: './usermenu.component.html',
    styleUrls: ['./usermenu.component.css']
})

export class UserMenuComponent implements OnInit {
    // private route: ActivatedRoute
    // , private router: Router
    constructor(private appservice: AppService) {}
    language: any;
    ngOnInit() {
        this.language = this.appservice.getLanguage();
    }
}
