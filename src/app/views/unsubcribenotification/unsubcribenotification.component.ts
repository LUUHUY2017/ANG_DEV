import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
// import { navItems } from '../../_nav';
import { AppService } from '../../app.service';
// import { Location } from '@angular/common';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { AdminLanguage } from '../../languages';

@Component({
  selector: 'app-unsubcribenotification',
  templateUrl: 'unsubcribenotification.component.html',
  styleUrls: ['./unsubcribenotification.component.css']
})
export class UnsubcribeNotificationComponent implements OnInit {
  messInstance: any;
  @BlockUI() blockUI: NgBlockUI;
  logo_source: any;
  language: AdminLanguage;
  language_bi = 'vn';
  data: any;
  isOnload: boolean;
  subcription: Subscription;
  constructor(private router: ActivatedRoute, private appservice: AppService) {
    this.isOnload = false;
    this.language = this.appservice.getLanguage();
    this.router.params.subscribe(res => {
      this.data = res;
      this.unsubcribeLink();
    });
  }
  unsubcribeLink() {
    this.messInstance = null;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.mailReportSchedule.unsubcribeNotification;
    this.subcription = this.appservice.post(this.data, url).subscribe(res => {
      console.log(res);
      if (res.status === 1) {
        this.messInstance = {
          type: 'success'
          , content: [this.language.huy_dang_ky_thanh_cong]
        };
      } else {
        this.messInstance = {
          type: 'error'
          , content: this.appservice.validate_error(res)
        };
      }
    }, (error) => {
      this.messInstance = {
        type: 'error'
        , content: [this.language.khong_the_ket_noi_may_chu_vui_long]
      };
      console.log(error + '');
      // nothing to do
    }).add(() => {
      this.isOnload = false;
      this.blockUI.stop();
    });
  }
  ngOnInit() {
  }
}
