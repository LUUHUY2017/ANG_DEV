import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';

// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { language } from '../../../../language';
import { language_en } from '../../../../language_en';
// import viewchild
import { GeneralMenuComponent } from '../../../viewchild/generalmenu/generalmenu.component';
import { BehaviorSubject } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { FormGroup, NgModel } from '@angular/forms';
@ViewChild(GeneralMenuComponent)

@Component({
  templateUrl: './emailconfig.component.html',
  styleUrls: ['./emailconfig.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class EmailConfigComponent implements OnInit {
  @ViewChild('dataTable') table: ElementRef;
  @ViewChild('updateForm') updateForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  language: any;
  private readonly notifier: NotifierService;
  isSuperAdmin: boolean;
  // Khai báo kiểu dữ kiệu
  organization_arr: Array<IOption>;
  organization_id: string;
  dataFilter: any;
  modalRef: BsModalRef;
  isOnload: boolean;
  errorMess: string;
  webState: BehaviorSubject<any>;
  dataUpdate: Array<any>;
  private subcription: any;
  oldState: string;
  userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
  errorArray: Array<any>;
  showPassword: boolean;
  errorArrayPopup: Array<any>;
  constructor(private router: Router,
    private route: ActivatedRoute,
    notifierService: NotifierService,
    private appservice: AppService,
    private modalService: BsModalService) {
    this.notifier = notifierService;
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
  }

  ngOnInit(): void {
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    const type_language = JSON.parse(localStorage.getItem(environment.language));
    type_language === 'vn' ? this.language = language : this.language = language_en;
    this.getConfig();
    this.setDefaultValue();
    this.watchStateChange();
  }
  updateState(stateString: string, data = null) {
    const stateWithData = {
      state: stateString
      , data: data
    };
    const oldStateObj = this.webState.getValue();
    this.oldState = oldStateObj.state;
    this.webState.next(stateWithData);
  }
  // Lấy thông tin tổ chức lên ng-select
  getConfig() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.userGetOrg;
    this.appservice.get(url).subscribe(
      param => {
        console.log('get_user_page_parametter', param);
        if (param.status !== 1) {
          this.isOnload = false;
          this.errorMess = this.language.Da_co_loi_xay_ra;
          this.blockUI.stop();
          return;
        }
        const org = param.organization_arr.slice(0);
        this.organization_arr = org;
        this.isSuperAdmin = param.isSuperAdmin;
        this.organization_id = this.organization_arr[0].value;
        this.getData();
      },
      (error) => {
        console.log(error);
        this.errorMess = this.language.Khong_the_ket_noi_may_chu;
        this.isOnload = false;
        this.blockUI.stop();
      });
  }
  watchStateChange() {
    this.subcription = this.webState.asObservable();
    this.subcription.subscribe(res => {
      const currentState = res.state;
      const item = res.data;
      if (currentState === environment.STATE.retrieve) {
        // Sự kiện nhận dữ liệu về thì bỏ hành động tìm kiếm trước đó
        this.dataFilter = item;
        if (item === null) {
          this.notifier.notify('warning', this.language.To_chuc_chua_duoc_cau_hinh_email_mac_dinh);
        }
      } else if (currentState === environment.STATE.update) {
        this.dataFilter = item;
        this.notifier.notify('success', this.language.Cap_nhat_thanh_cong);
      }
    });
  }
  setDefaultValue() {
    this.showPassword = false;
    this.errorArray = [];
    this.errorArrayPopup = [];
    this.isOnload = true;
    this.errorMess = null;
    this.isSuperAdmin = false;
  }
  // thay đổi tổ chức bảng
  changeOrg(event) {
    console.log('id_or', event);
    this.organization_id = event.value;
    this.getData();
  }

  // xem thông tin email từng user
  // openPopupTestMail(test_email: TemplateRef<any>) {
  //   if (this.updateForm.invalid) {
  //     this.notifier.notify('error', 'Đã có lỗi xảy ra');
  //     return;
  //   }
  //   this.errorArrayPopup = [];
  //   this.modalRef = this.modalService.show(test_email, {
  //     backdrop: true,
  //     ignoreBackdropClick: true
  //   });
  // }
  // lấy data thông thường
  getData() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organization_id
    };
    const url = environment.API.mail_configuration.getData;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('res', res);
        if (res.status !== 1) {
          this.errorMess = this.language.Da_co_loi_xay_ra;
          return;
        }
        this.updateState('retrieve', res.retrieveData);
      }, (error) => {
        this.errorMess = this.language.Khong_the_ket_noi_may_chu;
      }).add(() => {
        this.isOnload = false;
        this.blockUI.stop();
      });
  }
  changeType() {
    this.showPassword = !this.showPassword;
  }
  updateCurrentItem(item) {
    if (item.invalid) {
      this.notifier.notify('error', this.language.Du_lieu_khong_phu_hop);
      return;
    }
    if (!item.dirty) {
      this.notifier.notify('warning', this.language.Du_lieu_khong_thay_doi);
      return;
    }
    const data = { ...item.value, organization_id: this.organization_id };
    console.log('data', data);
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = environment.API.mail_configuration.update;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const updatedData = res.updatedData;
          this.updateState(environment.STATE.update, updatedData);
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.errorArray = [this.language.Khong_the_ket_noi_may_chu + this.language.Vui_long_thu_lai];
      }).add(() => {
        this.blockUI.stop();
      });
  }

  sendEmailTest(item) {
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    console.log('dữ liệu gửi đi', item.value);
    const data = item.value;
    const url = environment.API.COMMON.mail_configuration + '_send_email_test';
    this.appservice.post(data, url).subscribe(
      para => {
        console.log('dữ liệu gửi về', para);
      }, (error) => {
        this.notifier.notify('error', this.language.Khong_the_ket_noi_may_chu + this.language.Vui_long_thu_lai);
      }).add(() => {
        this.blockUI.stop();
      });
  }
}
