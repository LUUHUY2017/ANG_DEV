import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppService } from '../../../app.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
    selector: 'app-terminalmenu',
    templateUrl: './terminalmenu.component.html',
    styleUrls: ['./terminalmenu.component.css']
})

export class TerminalMenuComponent implements OnInit {
    language: any;
    constructor(
        private route: ActivatedRoute
        , private router: Router
        , private appservice: AppService) {
        this.language = this.appservice.getLanguage();
    }
    ngOnInit() { }
}
