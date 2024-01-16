import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
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
import { BehaviorSubject } from 'rxjs';

import { FormGroup } from '@angular/forms';
import { AdminLanguage } from '../../../../languages';

@ViewChild(GeneralMenuComponent)
@Component({
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @ViewChild('searchForm') searchForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  private subcription: any;
  organizationId: string;
  rowsOnPage = 15;
  webState: BehaviorSubject<any>;
  oldState: string;
  language: AdminLanguage;
  defaultModel = environment.API.categories;
  modalRef: BsModalRef;
  // mặc định
  canAdd: boolean;
  data: Array<any>;
  dataFilter: Array<any>;
  dataUpdate: any;
  orgArray: Array<IOption>;
  errorArray: Array<string>;
  optionDelete: any;
  isSuperAdmin: boolean;
  errorMess: string;
  isOnload: boolean;
  constructor(private router: Router,
    private route: ActivatedRoute,
    notifierService: NotifierService,
    private appservice: AppService,
    private modalService: BsModalService) {
    this.notifier = notifierService;
  }
  ngOnInit(): void {
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    this.language = this.appservice.getLanguage();
    // console.log(this.language);
    this.setDefaultValue();
    this.watchStateChange();
    this.setDefaultPermission(false);
    this.getConfig();
  }
  // done
  setDefaultValue() {
    this.canAdd = false;
    this.data = [];
    this.dataFilter = [];
    this.dataUpdate = null;
    this.orgArray = [];
    this.errorArray = [];
    this.optionDelete = 0;
    this.isSuperAdmin = false;
    this.errorMess = null;
    this.isOnload = true;
  }
  // done
  getConfig() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.userGetOrg;
    this.appservice.get(url).subscribe(
      param => {
        // console.log('get_user_page_parametter', param);
        if (param.status !== 1) {
          this.errorMess = this.language.co_loi_xay_ra;
          this.blockUI.stop();
          this.isOnload = false;
          return;
        }
        this.orgArray = param.organization_arr;
        this.isSuperAdmin = param.isSuperAdmin;
        this.organizationId = this.orgArray[0].value;
        this.getData();
      },
      (error) => {
        // console.log(error);
        this.errorMess = this.language.khong_the_ket_noi_may_chu;
        this.blockUI.stop();
        this.isOnload = false;
      });
  }
  // lấy data thông thường
  getData() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organizationId
      , deleted: this.optionDelete
    };
    const url = this.defaultModel.getData;
    this.appservice.post(data, url).subscribe(res => {
      if (res.status !== 1) {
        this.errorMess = this.language.co_loi_xay_ra;
        return;
      }
      this.setDefaultPermission(true);
      this.updateState(environment.STATE.retrieve, res.retrieveData);
    },
      (error) => {
        // console.log(error);
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
  changeOrg(event) {
    // console.log('new Org Id', event);
    this.organizationId = event.value;
    this.getData();
  }
  // done
  openPopupAddItem(templates: TemplateRef<any>) {
    if (this.canAdd) {
      this.modalRef = this.modalService.show(templates, {
        backdrop: true,
        ignoreBackdropClick: true
      });
      this.errorArray = [];
    }
  }
  // done
  openPopupUpdateCurrentItem(item: any, template: TemplateRef<any>) {
    // console.log('data_item', item);
    this.dataUpdate = Object.assign({}, item);
    this.errorArray = []; // reset Error
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  // done
  setDefaultPermission(bool: boolean) {
    this.canAdd = bool;
  }
  // done
  addNewItem(item) {
    if (item.invalid) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const data = {
      ...item.value
      , organization_id: this.organizationId
    };
    // xét error về rỗng.
    this.errorArray = [];
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = this.defaultModel.insert;
    this.appservice.post(data, url).subscribe(
      res => {
        if (res.status === 1) {
          const insertedData = res.insertedData;
          this.updateState(environment.STATE.insert, insertedData);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
          // console.log(this.errorArray);
        }
      },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // cập nhật thiết bị
  updateCurrentItem(item) {
    if (item.invalid) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    this.errorArray = [];
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = { ...item.value, id: this.dataUpdate.id };
    const url = this.defaultModel.update;
    this.appservice.post(data, url).subscribe(
      res => {
        // console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const updatedData = res.updatedData;
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
  preventChange() {
    this.modalRef.hide();
    this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
  }
  // done
  openPopupDeleteItem(item: Object, dialog: TemplateRef<any>) {
    // console.log('data_item', item);
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
    this.appservice.post(this.dataUpdate, url).subscribe(
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
  submitToSearch(form: any) {
    const inputData = form.value; // Where
    // console.log(inputData);
    this.updateState(environment.STATE.search, inputData);
  }
  // done
  ngOnDestroy() {
    this.webState.complete();
  }
}
