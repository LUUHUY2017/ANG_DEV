import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';

// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import validate form
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { PasswordValidation } from './user-form.validator';
// import viewchild
import { TerminalMenuComponent } from '../../viewchild/terminalmenu/terminalmenu.component';
import { NotifierService } from 'angular-notifier';
import { AdminLanguage } from '../../../languages';
import { BehaviorSubject } from 'rxjs';

@ViewChild(TerminalMenuComponent)

@Component({
  templateUrl: './terminalusermail.component.html',
  styleUrls: ['./terminalusermail.component.scss'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class TerminalUserMailComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('searchForm') searchForm: FormGroup;
  private readonly notifier: NotifierService;
  // Khai báo kiểu dữ kiệu
  modalRef: BsModalRef;
  language: AdminLanguage;
  webState: BehaviorSubject<any>;
  defaultModel = environment.API.mailReportSchedule;
  oldState: string;
  rowsOnPage = 15;
  organization_arr: Array<any>;
  organization_id: string;
  isSuperAdmin: boolean;
  defaultModule = '1';
  defaultPageId = environment.Pages.terminal.monitor;
  errorMess: string;
  isOnload: boolean;
  data: Array<any>;
  dataFilter: Array<any>;
  userArray: Array<any>;
  dataUpdate: any;
  canAdd: boolean;
  errorArray: Array<any>;
  siteArray: Array<any>;
  siteSelected: any;
  subcription: any;
  siteSelectionDisplay: boolean;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private appservice: AppService,
    private modalService: BsModalService,
    notifierService: NotifierService) {
    this.notifier = notifierService;
    this.language = this.appservice.getLanguage();
  }
  ngOnInit(): void {
    const firstState = {
      data: null
      , state: null
    };
    this.setPermission(false);
    this.setDefaultValue();
    this.webState = new BehaviorSubject(firstState);
    this.watchStateChange();
    this.getConfig();
  }
  // done
  setDefaultValue() {
    this.isSuperAdmin = false;
    this.data = [];
    this.dataFilter = [];
    this.userArray = [];
    this.dataUpdate = null;
    this.errorArray = [];
    this.siteArray = [];
    this.siteSelected = null;
    this.siteSelectionDisplay = false;
    this.isOnload = true;
    this.errorMess = null;
  }
  // Lấy thông tin tổ chức lên ng-select
  getConfig() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.userGetOrg;
    this.appservice.get(url).subscribe(
      param => {
        console.log('get_user_page_parametter', param);
        if (param.status !== 1) {
          this.errorMess = this.language.da_co_loi_xay_ra;
          this.isOnload = false;
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
        this.errorMess = this.language.khong_the_ket_noi_may_chu;
      });
  }
  // done
  getData() {
    const data = {
      organization_id: this.organization_id
      , page_id: '\'' + this.defaultPageId + '\''
    };
    console.log(data);
    const url = environment.API.terminal.usermail.getData;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.post(data, url).subscribe(
      param => {
        console.log(param);
        if (param.status !== 1) {
          this.errorMess = this.language.da_co_loi_xay_ra;
          return;
        }
        this.setPermission(true);
        this.userArray = param.userData.map(function(e) {
          return {
            value: e.id
            , label: e.name + ' - ' + e.email
            , name: e.name
            , email: e.email
            , organization_id: e.organization_id
          };
        });
        console.log(this.userArray);
        const retrieveData = param.retrieveData;
        for (let i = 0; i < retrieveData.length; i++) {
          if (retrieveData[i].site_name === null) {
            retrieveData[i].site_name = retrieveData[i].organization_name;
          }
        }
        console.log('retrieveData', retrieveData);
        this.updateState(environment.STATE.retrieve, retrieveData);
      },
      (error) => {
        console.log(error);
        this.errorMess = this.language.khong_the_ket_noi_may_chu;
      }).add(() => {
        this.isOnload = false;
        this.blockUI.stop();
      });
  }
  // done
  watchStateChange() {
    this.subcription = this.webState.asObservable();
    this.subcription.subscribe(res => {
      // const oldState = this.webState.getValue();
      const currentState = res.state;
      const item = res.data;
      console.log('trạng thái trước', this.oldState);
      console.log('trạng thái hiện tại', currentState);
      // Đây là sự kiện khi vừa load trang get data về
      if (currentState === environment.STATE.retrieve) {
        // Sự kiện nhận dữ liệu về thì bỏ hành động tìm kiếm trước đó
        this.data = item;
        this.dataFilter = this.data;
        // Nếu là sự kiện thêm mới
      } else if (currentState === environment.STATE.insert) {
        this.data.unshift(item);
        // Nếu trạng thái trước đó là search
        this.notifier.notify('success', this.language.them_moi_thanh_cong);
        if (this.oldState === environment.STATE.search) {
          this.updateState(environment.STATE.search);
        }
        // nếu là sự kiện sửa
      } else if (currentState === environment.STATE.update) {
        for (let i = 0; i < this.data.length; i++) {
          if (Number(this.data[i].id) === Number(item.id)) {
            this.data[i] = item;
            break;
          }
        }
        this.notifier.notify('success', this.language.cap_nhat_thanh_cong);
        // Nếu trạng thái trước đó là search
        if (this.oldState === environment.STATE.search) {
          this.updateState(environment.STATE.search);
        }
        // Nếu là sự kiện xóa
      } else if (currentState === environment.STATE.delete) {
        this.data.splice(this.data.findIndex(e => e.id === item.id), 1);
        // Nếu trạng thái trước đó là search
        // if (oldState === environment.STATE.search) {
        this.updateState(environment.STATE.search);
        // }
        this.notifier.notify('success', this.language.xoa_thanh_cong);
        if (this.oldState === environment.STATE.search) {
          this.updateState(environment.STATE.search);
        }
        // Nếu có sự kiện tìm kiếm
      } else if (currentState === environment.STATE.search) {
        let oldData = this.data;
        const inputData = this.searchForm.value;
        // tslint:disable-next-line: forin
        for (const key in inputData) {
          if (inputData[key]) {
            const lowerStr = inputData[key] !== null ? inputData[key].toLowerCase() : null;
            oldData = oldData.filter((e: any) => e.hasOwnProperty(key) && (inputData[key] === ''
              || e[key].toLowerCase().indexOf(lowerStr) !== -1));
          }
        }
        // console.log('oldData', oldData);
        this.dataFilter = oldData;
      }
    });
  }
  // done
  openPopupUpdateCurrentItem(item: any, template: TemplateRef<any>) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.dataUpdate = item;
    const params = JSON.parse(this.dataUpdate.params);
    const siteId = params.site_id;
    console.log('siteId', siteId);
    this.siteSelectionDisplay = false;
    this.errorArray.length = 0;
    this.siteArray.length = 0;
    this.siteSelected = null;
    console.log(this.dataUpdate);
    const data = {
      organization_id: this.organization_id
      , user_id: item.user_id
    };
    const url = environment.API.userGetSite;
    this.appservice.post(data, url).subscribe(
      param => {
        console.log('get_user_page_parametter', param);
        if (param.status !== 1) {
          this.notifier.notify('error', this.language.co_loi_xay_ra);
          this.blockUI.stop();
          return;
        }
        if (param.siteArray.length > 0) {
          this.recusive_menu(param.siteArray);
          this.siteSelected = this.siteArray.find(e => e.id === siteId);
        }
        this.modalRef = this.modalService.show(template, {
          backdrop: true,
          ignoreBackdropClick: true
        });
      },
      (error) => {
        console.log(error);
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  updateCurrentItem(item: FormGroup) {
    console.log(item);
    if (item.invalid || !this.siteSelected) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const userInfo = this.userArray.find(e => e.value === item.value.user_id);
    const paramJson = {
      site_id: this.siteSelected.id
      , organization_id: this.organization_id
    };
    const data = {
      id: this.dataUpdate.id
      , module_id: this.defaultModule
      , page_id: this.defaultPageId
      , user_id: userInfo.value
      , params: JSON.stringify(paramJson)
      , report_type: 0
      , actived: item.value.actived
    };
    console.log(data);
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = this.defaultModel.update;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const updatedData = res.updatedData;
          updatedData.site_name = this.siteSelected.site_name;
          //
          updatedData.email = userInfo.email;
          this.updateState(environment.STATE.update, res.updatedData);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  getSiteTreeFromUser(item: any) {
    const user_id = item.value;
    this.siteArray = [];
    this.siteSelected = null;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.userGetSite;
    const data = {
      organization_id: this.organization_id
      , user_id: user_id
    };
    this.appservice.post(data, url).subscribe(
      param => {
        console.log('get_user_page_parametter', param);
        if (param.status !== 1) {
          this.notifier.notify('error', this.language.co_loi_xay_ra);
          this.blockUI.stop();
          return;
        }
        const siteArray = param.siteArray || [];
        this.recusive_menu(siteArray);
      },
      (error) => {
        console.log(error);
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  addNewItem(item: FormGroup) {
    if (item.invalid || !this.siteSelected) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const userInfo = this.userArray.find(e => e.value === item.value.user_id);
    const paramJson = {
      site_id: this.siteSelected.id
      , organization_id: this.organization_id
    };
    const data = {
      module_id: this.defaultModule
      , user_id: userInfo.value
      , page_id: this.defaultPageId
      , params: JSON.stringify(paramJson)
      , report_type: 0
      , actived: item.value.actived
      , organization_id: userInfo.organization_id
    };
    const url = this.defaultModel.insert;
    // xét error về rỗng.
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const insertedData = res.insertedData;
          insertedData.site_name = this.siteSelected.site_name;
          //
          insertedData.email = userInfo.email;
          this.updateState(environment.STATE.insert, insertedData);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  recusive_menu(array: any[], id = null, space = 0) {
    array.forEach(element => {
      if (element.parent_id === id) {
        const a_id = element.id;
        this.siteArray.push({
          id: element.id
          , site_name: element.site_name
          , parent_id: element.parent_id
          , alevel: space
          , enables: element.enables
          , store: element.store
        });
        const scope = space + 1;
        this.recusive_menu(array, a_id, scope);
      }
    });
  }
  // done
  deleteCurrentItem() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = this.defaultModel.delete;
    const data = {
      id: this.dataUpdate.id
    };
    this.appservice.post(data, url).subscribe(
      param => {
        if (param.status === 1) {
          this.updateState(environment.STATE.delete, this.dataUpdate);
        } else {
          this.notifier.notify('error', this.language.da_co_loi_xay_ra);
        }
      },
      (error) => {
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.modalRef.hide();
        this.blockUI.stop();
      });
  }
  // done
  updateState(stateString: string, data = null) {
    const stateWithData = {
      state: stateString
      , data: data
    };
    const oldStateObj = this.webState.getValue();
    this.oldState = oldStateObj.state;
    this.webState.next(stateWithData);
  }
  // done
  openPopupAddItem(templates: TemplateRef<any>) {
    if (!this.canAdd) {
      return;
    }
    this.errorArray.length = 0;
    this.siteSelectionDisplay = false;
    this.siteSelected = null;
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  // done
  openPopupDeleteItem(item, dialog: TemplateRef<any>) {
    this.modalRef = this.modalService.show(dialog, {
      backdrop: true,
      ignoreBackdropClick: true
    });
    this.dataUpdate = item;
  }
  // done
  submitToSearch(form: any) {
    const inputData = form.value; // Where
    console.log(this.data);
    this.updateState(environment.STATE.search, inputData);
  }
  // done
  changeSiteSelected(item: any) {
    this.siteSelected = item;
    this.siteSelectionDisplay = false;
  }
  // done
  setPermission(bool: boolean) {
    this.canAdd = bool;
  }
}
