import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
    selector: 'app-footfallsettingmenu',
    templateUrl: './footfallsettingmenu.component.html',
    styleUrls: ['./footfallsettingmenu.component.css']
})

export class FootfallSettingMenuComponent implements OnInit {
    language: any;
    constructor(
        private route: ActivatedRoute
        , private router: Router
        , private appservice: AppService) {
        this.language = this.appservice.getLanguage();
    }
    ngOnInit() { }
}
