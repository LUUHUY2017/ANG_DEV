import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
// import { navItems } from '../../_nav';
import { AppService } from '../../app.service';
// import { Location } from '@angular/common';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { AdminLanguage } from '../../languages';

@Component({
  selector: 'app-descriptionmail',
  templateUrl: 'descriptionmail.component.html',
  styleUrls: ['./descriptionmail.component.css']
})
export class DescriptionMailComponent implements OnInit {
  messInstance: any;
  @BlockUI() blockUI: NgBlockUI;
  logo_source: any;
  language: AdminLanguage;
  language_bi = 'vn';
  data: any;
  dataUpdate: any;
  isOnload: boolean;
  subcription: Subscription;
  constructor(private router: ActivatedRoute, private appservice: AppService, private sanitizer: DomSanitizer) {
    this.isOnload = false;
    this.language = this.appservice.getLanguage();
    this.router.params.subscribe(res => {
      this.data = res;
      this.getDescription();
    });
  }
  getlink(url): SafeUrl {
      return this.sanitizer.bypassSecurityTrustHtml(url);
  }
  getDescription() {
    this.messInstance = null;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.mailReportSchedule.descriptionMail;
    this.subcription = this.appservice.post(this.data, url).subscribe(res => {
      console.log(res);
      if (res.status === 1) {
        // this.messInstance = {
        //   type: 'success'
        //   , content: [this.language.huy_dang_ky_thanh_cong]
        // };
        this.dataUpdate = res.retrieveData;
        console.log(this.dataUpdate);
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
