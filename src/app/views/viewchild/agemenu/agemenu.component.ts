import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../../app.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
    selector: 'app-agemenu',
    templateUrl: './agemenu.component.html',
    styleUrls: ['./agemenu.component.css']
})

export class AgeMenuComponent implements OnInit {
    language: any;
    constructor(
        private route: ActivatedRoute
        , private router: Router
        , private appservice: AppService) {
        this.language = this.appservice.getLanguage();
    }
    ngOnInit() { }
}
