import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ActivemailService } from './activemail.service';
// import { navItems } from '../../_nav';
import { AppService } from '../../app.service';
// import { Location } from '@angular/common';
// import { language } from '../../language';
// import { language_en } from '../../language_en';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activemail',
  templateUrl: 'activemail.component.html',
  styleUrls: ['./activemail.component.css']
})
export class ActivemailComponent implements OnInit {
  isLoginError = false;
  errorArray = [];
  url = environment.apiUrl + 'images/';
  @BlockUI() blockUI: NgBlockUI;
  logo_source: any;
  language: any;
  language_bi = 'vn';
  data: any;
  isSuccess: boolean;
  subcription: Subscription;
  constructor(private router: ActivatedRoute, private service: ActivemailService, private appservice: AppService) {
    this.isSuccess = false;
    this.router.params.subscribe(res => {
      this.data = res;
      this.activeMail();
    });
  }
  activeMail() {
    this.errorArray.length = 0;
    this.blockUI.start('Đang tải dữ liệu');
    const url = 'api/userActiveEmail';
    this.subcription = this.appservice.post(this.data, url).subscribe(res => {
      console.log(res);
      if (res.status === 1) {
        this.isSuccess = true;
        // this.updateState(environment.STATE.insert, res.insertedData);
        // this.modalRef.hide();
        alert('Kích hoạt Email thành công');
      } else {
        this.errorArray = this.appservice.validate_error(res);
        // console.log(this.error_array);
      }
    }, (error) => {
      console.log(error + '');
      // nothing to do
    }).add(() => {
      this.blockUI.stop();
    });
  }
  ngOnInit() {
  }
}
