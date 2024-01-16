import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy, } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { FormGroup } from '@angular/forms';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import viewchild
import { UserMenuComponent } from '../../viewchild/usermenu/usermenu.component';
// import notification
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
// import * as io from 'socket.io-client';
@ViewChild(UserMenuComponent)

@Component({
  templateUrl: './editinfo.component.html',
  styleUrls: ['./editinfo.component.scss'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class UserEditInfoComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  data: any;
  dataFilter: Array<any>;
  modalRef: BsModalRef;
  // phân trang bảng
  webState: BehaviorSubject<any>;
  subcription: any;
  oldState: string;
  errorArray: any[];
  language: any;
  recordDate: string;
  canUpdate: boolean;
  constructor(
    notifierService: NotifierService,
    private appservice: AppService,
    private modalService: BsModalService) {
    this.notifier = notifierService;
    // this.socket = io(environment.UrlSocket);
    this.language = this.appservice.getLanguage();
  }
  ngOnInit(): void {
    console.log(this.data);
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    this.setDefaultValue();
    this.watchStateChange();
    this.setDefaultCrud(false);
  }
  watchStateChange() {
    this.subcription = this.webState.asObservable();
    this.subcription.subscribe(res => {
      const currentState = res.state;
      const item = this.cloneArray(res.data);
      // console.log('trạng thái trước', this.oldState);
      // console.log('trạng thái hiện tại', currentState);
      // Đây là sự kiện khi vừa load trang get data về
      if (currentState === environment.STATE.retrieve) {
        // Sự kiện nhận dữ liệu về thì bỏ hành động tìm kiếm trước đó
        this.data = item;
        this.dataFilter = this.data;
        // Nếu là sự kiện thêm mới
      } else if (currentState === environment.STATE.update) {
        this.data = item;
        this.notifier.notify('success', this.language.cap_nhat_thanh_cong);
        // Nếu là sự kiện xóa
      }
    });
  }
  cloneArray(item: Array<any>) {
    const newJSONString = JSON.stringify(item);
    return JSON.parse(newJSONString);
  }
  setDefaultCrud(bool: boolean) {
    this.canUpdate = bool;
  }
  setDefaultValue() {
    this.data = JSON.parse(localStorage.getItem(environment.UserLoged));
    this.errorArray = [];
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
  getData() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.user;
    this.appservice.get(url).subscribe(res => {
      console.log(res);
      this.recordDate = res.recordDate;
      this.updateState('retrieve', res.retrieveData);
    },
      (error) => {
        console.log(error);
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  preventChange() {
    this.modalRef.hide();
    this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
  }
  // cập nhật thiết bị
  changePasswordFunc(item: FormGroup) {
    console.log(item);
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const data = {
      ...item.value
    };
    const url = environment.API.users.changePassword;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          item.reset();
          this.notifier.notify('success', this.language.cap_nhat_thanh_cong);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
        console.log(this.errorArray);
      },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  ngOnDestroy() {
    this.webState.complete();
  }
}
