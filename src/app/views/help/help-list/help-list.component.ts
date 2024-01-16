import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DomSanitizer } from '@angular/platform-browser';
import { language } from '../../../language';
import { language_en } from '../../../language_en';

@Component({
    templateUrl: 'help-list.component.html',
    styleUrls: ['help-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HelpListComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
    type_language = JSON.parse(localStorage.getItem(environment.language));
    help_array: any;
    url_img = environment.apiUrl + 'images/helps/';
    search_key = '';
    snap_help_array: any;
    language: any;
    constructor(private router: Router, private appservice: AppService, private sanitizer: DomSanitizer) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
    }
    ngOnInit() {
        this.get_data();
    }
    // safe_url(url) {
    //     return this.sanitizer.bypassSecurityTrustHtml(url);
    // }
    // Hàm tìm kiếm menu
    search_help() {
        // chuyển giá trị truyền vào về chữ thường để so sánh
        const string = this.search_key !== undefined ? this.search_key.toLowerCase() : '';
        if (string === '') {
            this.help_array = this.snap_help_array;
        } else {
            this.help_array = this.snap_help_array.filter(
                x => x.title_content.toLowerCase().indexOf(string) !== -1
            );
        }
    }
    get_data() {
        this.help_array = [];
        this.blockUI.start('Đang xử lý dữ liệu');
        const url = environment.API.sp_get_help_list;
        this.appservice.get(url).subscribe(res => {
            if (res.message) {
                console.log('đã có sự cố');
            } else {
                console.log(res);
                this.help_array = res.data;
                this.snap_help_array = res.data;
            }
            this.blockUI.stop();
        }, (error) => {
            console.log(error);
            this.blockUI.stop();
        }, () => {
            this.blockUI.stop();
        });
    }
    toggle_data(event) {
        event.parentNode.classList.toggle('active');
    }
}

