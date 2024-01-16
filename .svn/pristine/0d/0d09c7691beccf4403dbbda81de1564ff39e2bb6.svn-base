import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AppService } from '../../../app.service';


@Component({
    selector: 'app-performancemenu',
    templateUrl: './performancemenu.component.html',
    styleUrls: ['./performancemenu.component.css']
})

export class PerformanceMenuComponent implements OnInit {
    language: any;
    constructor(
        private route: ActivatedRoute
        , private router: Router
        , private appservice: AppService) {
        this.language = this.appservice.getLanguage();
    }
    ngOnInit() { }
}
