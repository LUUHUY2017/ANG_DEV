import { IOption } from 'ng-select';   // select option <option>
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
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
// import validate form
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { PasswordValidation } from './users-form.validator';
import { GeneralMenuComponent } from '../../../viewchild/generalmenu/generalmenu.component';
// import notification
import { NotifierService } from 'angular-notifier';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { AdminLanguage } from '../../../../languages';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})
@ViewChild(GeneralMenuComponent)
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild('searchForm') searchForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  public modalRef: BsModalRef;
  webState: BehaviorSubject<any>;
  subcription: any;
  canAdd: boolean;
  defaultModel = environment.API.users;
  oldState: string;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  sourceUrl: string = window.location.origin;
  rowsOnPage = 15;
  language: AdminLanguage;
  // mặc định này
  errorArray: Array<any>;
  dataUpdate: any;
  data: Array<any>;
  dataFilter: Array<any>;
  optionDelete: number;
  siteArray: Array<any>;
  snapSiteArray: Array<any>;
  siteUserArray: Array<any>;
  errorMess: string;
  orgArray: Array<any>;
  isSuperAdmin: boolean;
  organizationId: string;
  isOnload: boolean;
  isOrgAdmin: boolean;
  userInfo: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private appservice: AppService,
    notifierService: NotifierService,
    private modalService: BsModalService,
    private fb: FormBuilder) {
    this.language = this.appservice.getLanguage();
    this.notifier = notifierService;
  }
  // done
  updateRoleCurrentUser(item: any) {
    this.errorArray = [];
    if (item.invalid) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    this.snapSiteArray = this.siteArray.filter(e => e.enables === '1');
    this.removeEnableNull();
    if (this.snapSiteArray.length === 0) {
      this.errorArray.push(this.language.site_khong_duoc_de_trong);
      return;
    }
    const data = {
      role_id: this.dataUpdate.id
      , role_array: this.snapSiteArray.filter(e => e)
      , role_type: item.value.role_type
      , organization_id: this.dataUpdate.organization_id
      , user_id: this.dataUpdate.user_id
    };
    console.log(' role_array',  this.snapSiteArray);
    console.log(item);
    console.log(data);
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = this.defaultModel.updateCurrentRoleUser;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          // this.updateState(environment.STATE.update, res.updatedData);
          this.modalRef.hide();
          this.notifier.notify('success', this.language.cap_nhat_thanh_cong);
        } else {
          this.errorArray = this.appservice.validate_error(res);
          // console.log(this.error_array);
        }
      },
      (error) => {
        console.log(error);
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  openPopupUpdateRole(item: any, template: TemplateRef<any>) {
    const data = {
      user_compare_id: item.id
      , organization_id: item.organization_id
    };
    this.errorArray = [];
    this.siteArray = [];
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = this.defaultModel.getCurrentRoleUser;
    this.appservice.post(data, url).subscribe(
      res => {
        if (res.status !== 1) {
          this.notifier.notify('error', this.language.co_loi_xay_ra);
          return;
        }
        console.log('openPopupUpdateRole', res);
        const siteArray = res.siteArray;
        // if (res.siteArray.filter(i => i.parent_id).length === 0) {
        if (siteArray.length === 0) {
          this.notifier.notify('error', this.language.to_chuc_chua_co_dia_diem);
          return;
        }
        this.dataUpdate = res.currentRoleInfo[0];
        siteArray.forEach(element => {
          element.disabled = true;
          if (Number(element.permission_in_site) === 1) {
            element.disabled = false;
          }
        });
        console.log('siteArray', siteArray);
        this.recusive_menu(siteArray);
        console.log('this.siteArray', this.siteArray);
        this.openModal(template);
      },
      (error) => {
        console.log(error);
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  log(item: any) {
    if (item.disabled) {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.co_loi_xay_ra);
      return;
    }
    const toggleEnum = item.enables === '1' ? null : '1';
    item.enables = toggleEnum;
    if (toggleEnum === null) {
      this.recusive_unchecked_parent(item.parent_id);
    } else {
      this.parentToggleClick(item);
    }
    this.childToggleClick(item, toggleEnum);
  }
  childToggleClick(item: any, toggleEnum: string) {
    for (let i = 0; i < this.siteArray.length; i++) {
      if (this.siteArray[i].parent_id === item.id) {
        this.siteArray[i].enables = toggleEnum;
        this.childToggleClick(this.siteArray[i], toggleEnum);
      }
    }
  }
  recusive_unchecked_parent(id: number) {
    this.siteArray.forEach(element => {
      if (element.id === id) {
        element.enables = null;
        const a_id = element.parent_id;
        this.recusive_unchecked_parent(a_id);
      }
    });
  }
  parentToggleClick(parentNode: any) {
    let checker = true;
    const check_array = this.siteArray.filter(item2 => item2.parent_id === parentNode.parent_id);
    // Nếu tồn tại node cùng cấp cha
    if (check_array.length > 0) {
      check_array.forEach(element2 => {
        if (element2.enables === null) {
          checker = false;
        }
      });
      if (checker) {
        const data = this.siteArray.find(item3 => item3.id === parentNode.parent_id);
        if (data) {
          data.enables = '1';
          const a_index = {
            id: data.id,
            parent_id: data.parent_id
          };
          this.parentToggleClick(a_index);
        }
      }
    }
    // console.log(check_array);
  }
  ngOnInit(): void {
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    this.setDefaultPermission(false);
    this.setDefaultValue();
    this.watchStateChange();
    this.getConfig();
  }
  // done
  setDefaultValue() {
    this.errorArray = [];
    this.dataUpdate = null;
    this.data = [];
    this.dataFilter = [];
    this.optionDelete = 0;
    this.siteArray = [];
    this.snapSiteArray = [];
    this.siteUserArray = [];
    this.errorMess = null;
    this.orgArray = [];
    this.isSuperAdmin = false;
    this.organizationId = null;
    this.isOnload = true;
    this.isOrgAdmin = false;
    this.userInfo = null;
  }
  // done
  watchStateChange() {
    this.subcription = this.webState.asObservable();
    this.subcription.subscribe(res => {
      const currentState = res.state;
      const item = res.data;
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
  setDefaultPermission(bool: boolean) {
    this.canAdd = bool;
  }
  // done
  getConfig() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.userGetOrg;
    this.appservice.get(url).subscribe(
      param => {
        console.log('get_user_page_parametter', param);
        if (param.status !== 1) {
          this.errorMess = this.language.co_loi_xay_ra;
          this.blockUI.stop();
          this.isOnload = false;
          return;
        }
        this.orgArray = param.organization_arr;
        this.isSuperAdmin = param.isSuperAdmin;
        this.isOrgAdmin = param.isOrgAdmin;
        this.organizationId = this.orgArray[0].value;
        this.getData();
      },
      (error) => {
        console.log(error);
        this.errorMess = this.language.khong_the_ket_noi_may_chu;
        this.blockUI.stop();
        this.isOnload = false;
      });
  }
  // done
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }
  // done
  openPopupAddItem(template: TemplateRef<any>) {
    if (this.canAdd) {
      this.errorArray = [];
      this.openModal(template);
    }
  }
  // done
  clone_array(array: any[]) {
    return array.slice(0);
  }
  // done
  openPopupUpdateCurrentItem(item: any, updateTemplate: TemplateRef<any>) {
    console.log('data thay đổi', item);
    this.errorArray = [];
    this.dataUpdate = Object.assign({}, item);
    this.openModal(updateTemplate);
  }
  // done
  openPopupChangePassword(item, changePasswordTemplate: TemplateRef<any>) {
    // console.log('data thay đổi', item);
    this.errorArray = [];
    this.dataUpdate = Object.assign({}, item);
    this.openModal(changePasswordTemplate);
  }
  // done
  getData() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organizationId
      , deleted: this.optionDelete
    };

    const url = this.defaultModel.getData;
    this.appservice.post(data, url).subscribe(
      res => {
        if (res.status !== 1) {
          this.errorMess = this.language.co_loi_xay_ra;
          return;
        }
        console.log('data gửi về', res);
        this.userInfo = res.userInfo;
        this.setDefaultPermission(true);
        const retrieveData = res.retrieveData;
        for (let i = 0; i < retrieveData.length; i++) {
          retrieveData[i].email_verified = '0';
          if (retrieveData[i].token_email === null && retrieveData[i].token_email_expired_time === null) {
            retrieveData[i].email_verified = '1';
          }
        }
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
  addNewItem(item: any) {
    console.log(item);
    if (item.invalid) {
      this.notifier.notify('error', this.language.co_loi_xay_ra);
      return;
    }
    // xét error về rỗng.
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    // console.log('dữ liệu gửi đi', item);
    const data = {
      ...item.value
      , subdomain: this.sourceUrl
      , organization_id: this.organizationId
    };
    const url = this.defaultModel.insert;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const insertedData = res.insertedData;
          insertedData.email_verified = '0';
          this.updateState(environment.STATE.insert, insertedData);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  updateCurrentItem(item) {
    console.log('dữ liệu gửi đi', item.value);
    if (item.invalid) {
      this.notifier.notify('error', this.language.co_loi_xay_ra);
      return;
    }
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    if (item.value.email === this.dataUpdate.email) {
      delete item.value.email;
    }
    const data = { ...item.value, id: this.dataUpdate.id };
    const url = this.defaultModel.update;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const updatedData = res.updatedData;
          if (updatedData.token_email === null && updatedData.token_email_expired_time === null) {
            updatedData.email_verified = '1';
          } else {
            updatedData.email_verified = '0';
          }
          this.updateState(environment.STATE.update, updatedData);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  changeUserPassword(item) {
    if (!item.value.new_email) {
      delete item.value.new_email;
    }
    const data = {
      id: this.dataUpdate.id
      , ...item.value
    };
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    this.errorArray = [];
    const url = this.defaultModel.sendNewPassword;
    console.log('data', data);
    // return;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          this.modalRef.hide();
          this.notifier.notify('success', this.language.cap_nhat_du_lieu_thanh_cong);
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      }, (error) => {
        console.log(error);
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  changeOrg(event) {
    console.log('new Org Id', event);
    this.organizationId = event.value;
    this.getData();
  }
  // done
  submitToSearch(form: any) {
    const inputData = form.value; // Where
    console.log(inputData);
    this.updateState(environment.STATE.search, inputData);
  }
  // done
  openPopupDeleteItem(item: Object, dialog: TemplateRef<any>) {
    console.log('data_item', item);
    this.dataUpdate = item;
    this.modalRef = this.modalService.show(dialog, {
      backdrop: true,
      ignoreBackdropClick: true
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
          this.notifier.notify('error', this.language.co_loi_xay_ra);
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
  softDeleteCurrentItem() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      id: this.dataUpdate.id
      , deleted: this.optionDelete
    };
    const url = this.defaultModel.softDelete;
    this.appservice.post(data, url).subscribe(
      param => {
        if (param.status === 1) {
          this.updateState(environment.STATE.delete, this.dataUpdate);
        } else {
          this.notifier.notify('error', this.language.co_loi_xay_ra);
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
  preventChange() {
    this.notifier.notify('warning', this.language.du_lieu_khong_phu_hop);
    this.modalRef.hide();
  }
  // done
  recusive_menu(array: any[], id = '0', space = 0) {
    array.forEach(element => {
      if (element.parent_id === id) {
        const a_id = element.id;
        this.siteArray.push({
          id: element.id
          , site_name: element.site_name
          , parent_id: element.parent_id
          , alevel: space
          , enables: element.enables === '1' ? '1' : null
          , store: element.store
          , disabled: element.disabled
        });
        const scope = space + 1;
        this.recusive_menu(array, a_id, scope);
      }
    });
  }
  // done
  ngOnDestroy() {
    this.webState.complete();
    // console.log(this.webState);
  }
  // done
  removeEnableNull() {
    this.snapSiteArray.forEach(e => {
      if (e.enables !== null) {
        // console.log(e);
        this.recusiveRemoveChildrenNode(e.id);
      }
    });
  }
  // done
  recusiveRemoveChildrenNode(id: any) {
    this.snapSiteArray.forEach((e: any, key: number) => {
      if (e.parent_id === id) {
        const a_id = e.id;
        delete this.snapSiteArray[key];
        this.recusiveRemoveChildrenNode(a_id);
      }
    });
  }
}
