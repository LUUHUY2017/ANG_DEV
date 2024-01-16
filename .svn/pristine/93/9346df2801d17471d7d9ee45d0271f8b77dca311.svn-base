import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy, Renderer2, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { GeneralMenuComponent } from '../../../viewchild/generalmenu/generalmenu.component';
// import notification
import { NotifierService } from 'angular-notifier';
import { OAZaloConfigComponent } from './oaconfig/oaconfig.component';
import { AdminLanguage } from '../../../../languages';
import { OAZaloEventComponent } from './oaevent/oaevent.component';

@ViewChild(GeneralMenuComponent)
@Component({
  templateUrl: './zalosender.component.html',
  styleUrls: ['./zalosender.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})
export class ZaloSenderComponent implements OnInit {
  @ViewChild('dataTable') table: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  organizationId: string;
  orgArray: Array<IOption>;
  modalRef: BsModalRef;
  errorArray: Array<string>;
  pageNumber: number;
  language: AdminLanguage;
  errorMess: string;
  isOnload: boolean;
  isSuperAdmin: boolean;
  showPageEvent: boolean;
  constructor(private router: Router,
    private route: ActivatedRoute,
    notifierService: NotifierService,
    private appservice: AppService,
    private modalService: BsModalService) {
    this.language = this.appservice.getLanguage();
    this.notifier = notifierService;
  }
  ngOnInit(): void {
    const firstState = {
      data: null
      , state: null
    };
    this.setDefaultValue();
    this.getConfig();
  }
  showPage(bool: boolean) {
    console.log('bool', bool);
    this.showPageEvent = bool;
  }
  setDefaultValue() {
    this.errorArray = [];
    this.pageNumber = 1;
    this.errorMess = null;
    this.isOnload = true;
    this.isSuperAdmin = false;
    this.showPageEvent = false;
  }
  changePageNumber(numb: number) {
    this.pageNumber = numb;
    console.log(this.pageNumber);
  }
  // Lấy thông tin tổ chức lên ng-select
  getConfig() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.userGetOrg;
    this.appservice.get(url).subscribe(
      param => {
        console.log('get_user_page_parametter', param);
        if (param.status !== 1) {
          this.errorMess = this.language.co_loi_xay_ra;
          return;
        }
        this.orgArray = param.organization_arr;
        this.isSuperAdmin = param.isSuperAdmin;
        this.organizationId = this.orgArray[0].value;
      },
      (error) => {
        console.log(error);
        this.errorMess = this.language.khong_the_ket_noi_may_chu;
      }).add(() => {
        this.blockUI.stop();
        this.isOnload = false;
      });
  }
  changeOrg(event) {
    this.organizationId = event.value;
  }
}
