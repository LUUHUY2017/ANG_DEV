import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
// import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';
import * as io from 'socket.io-client';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralMenuComponent } from '../../../viewchild/generalmenu/generalmenu.component';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { language } from '../../admin_language';
import { language_en } from '../../admin_language_en';
import { FormGroup } from '@angular/forms';
import { IOption } from 'ng-select';
import { Router, ActivatedRoute } from '@angular/router';
// import { NG2DataTableModule } from "angular2-datatable-pagination";

@Component({
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})
@ViewChild(GeneralMenuComponent)
export class CompaniesComponent implements OnInit, OnDestroy {
  @ViewChild('dataTable') table: ElementRef;
  @ViewChild('searchForm') searchForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  private subcription: any;
  canAdd: boolean;
  canUpdate: boolean;
  // Khai báo kiểu dữ kiệu
  data: Array<any>;
  dataFilter: Array<any>;
  dataUpdate: any;
  orgArray: Array<IOption>;
  modalRef: BsModalRef;
  siteSelectionDisplay = false;
  rowsOnPage = 15;
  menuTree: Array<any>;
  webState: BehaviorSubject<any>;
  oldState: string;
  // userLogged = JSON.parse(localStorage.getItem(environment.UserLoged));
  errorArray: Array<string>;
  optionDelete: any;
  moduleArray: Array<any>;
  language: any;
  isSuperAdmin: boolean;
  errorMess: string;
  isOnload: boolean;
  defaultModel = environment.API.organization;
  indexArray: Array<any>;
  dropdownSettings: any;
  imageViewBase64: any;
  imageUpload: any;
  itemCurrentIndex: Array<any>;
  sourceUrl: string = window.location.origin;

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
    console.log(this.language);
    this.setDefaultValue();
    this.watchStateChange();
    this.setDefaultPermission(false);
    this.getData();
  }
  setDefaultPermission(bool: boolean) {
    this.canAdd = bool;
  }
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
  updateState(stateString: string, data = null) {
    const stateWithData = {
      state: stateString
      , data: data
    };
    const oldStateObj = this.webState.getValue();
    this.oldState = oldStateObj.state;
    this.webState.next(stateWithData);
  }
  setDefaultValue() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_label',
      selectAllText: this.language.chon_tat_ca,
      unSelectAllText: this.language.bo_chon_tat_ca,
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.imageViewBase64 = null;
    this.imageUpload = null;
    this.isSuperAdmin = false;
    this.canUpdate = false;
    this.dataFilter = [];
    this.data = [];
    this.dataUpdate = null;
    this.errorArray = [];
    this.optionDelete = 0;
    this.moduleArray = [];
    this.errorMess = null;
    this.isOnload = true;
    this.indexArray = [];
    this.itemCurrentIndex = [];
  }
  getData() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      deleted: this.optionDelete
    };
    this.menuTree = [];
    const url = this.defaultModel.getData;
    this.appservice.post(data, url).subscribe(res => {
      if (res.status !== 1) {
        this.errorMess = this.language.co_loi_xay_ra;
        return;
      }
      this.setDefaultPermission(true);
      this.isSuperAdmin = res.isSuperAdmin;
      this.updateState('retrieve', res.retrieveData);
      this.canUpdate = res.canUpdateData;
      // console.log('this.canUpdate', this.canUpdate);
      this.indexArray = res.indexArray;
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
  openPopupAddItem(templates: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true
    });
    this.errorArray = [];
    this.imageUpload = null;
    this.imageViewBase64 = null;
  }
  // done
  openPopupUpdateCurrentItem(item: any, template: TemplateRef<any>) {
    console.log('data_item', item);
    this.dataUpdate = Object.assign({}, item);
    this.errorArray = []; // reset Error
    this.imageViewBase64 = this.dataUpdate.company_logo;
    this.imageUpload = null;
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  openPopupUpdateRoleOrg(item: any, template: TemplateRef<any>) {
    console.log('data_item', item);
    this.dataUpdate = Object.assign({}, item);
    this.errorArray = []; // reset Error
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = this.defaultModel.getRole;
    const data = {
      id: this.dataUpdate.id
    };
    this.appservice.post(data, url).subscribe(
      res => {
        if (res.status === 1) {
          this.itemCurrentIndex = res.orgCurrentIndex.map(function (e) {
            return {
              item_id: e.id
              , item_label: e.index_name
              , expire_date: e.expire_date
            };
          });
          this.modalRef = this.modalService.show(template, {
            backdrop: true,
            ignoreBackdropClick: true
          });
        } else {
          this.notifier.notify('error', this.language.co_loi_xay_ra);
        }
      },
      (error) => {
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  openPopupShowInfo(item: any, template: TemplateRef<any>) {
    console.log('data_item', item);
    this.dataUpdate = Object.assign({}, item);
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  // done
  addNewItem(item) {
    if (item.invalid) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const data: FormData = new FormData();
    const currentData = { ...item.value };
    data.append('data', JSON.stringify(currentData));
    if (this.imageUpload !== null) {
      data.append('company_logo', this.imageUpload, this.imageUpload.name);
    }
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
        this.errorArray = [this.language.khong_the_ket_noi_may_chu_vui_long];
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  updateCurrentItem(item: FormGroup) {
    if (item.invalid) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      this.modalRef.hide();
      return;
    }
    if (item.value.organization_code === this.dataUpdate.organization_code) {
      delete item.value.organization_code;
    }
    this.errorArray = [];
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const currentData = { ...item.value, id: this.dataUpdate.id, token: localStorage.getItem(environment.access_token) };
    const data: FormData = new FormData();
    data.append('data', JSON.stringify(currentData));
    if (this.imageUpload !== null) {
      data.append('company_logo', this.imageUpload, this.imageUpload.name);
    }
    const url = this.defaultModel.update;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const updatedData = res.updatedData;
          this.updateState(environment.STATE.update, updatedData);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.errorArray = [this.language.khong_the_ket_noi_may_chu_vui_long];
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  updateRoleCurrentItem(item) {
    if (item.invalid) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      this.modalRef.hide();
      return;
    }
    this.errorArray = [];
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = { ...item.value, id: this.dataUpdate.id };
    const url = this.defaultModel.updateRole;
    console.log('data', data);
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          this.notifier.notify('success', this.language.cap_nhat_thanh_cong);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.errorArray = [this.language.khong_the_ket_noi_may_chu_vui_long];
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
  submitToSearch(form: any) {
    const inputData = form.value; // Where
    console.log(inputData);
    this.updateState(environment.STATE.search, inputData);
  }
  // done
  uploadimagequality(target: any) {
    this.errorArray = [];
    const file = target.files;
    const fileload = file[0];
    const reader = new FileReader();
    const newImage = new Image();
    // hiện ảnh
    console.log(newImage);
    newImage.onload = e => {
      if (newImage.height <= this.appservice.uploadImageHeight && newImage.width <= this.appservice.uploadImageWidth) {
        reader.readAsDataURL(fileload);
      } else {
        this.errorArray = [this.language.kich_thuoc_anh_khong_hop_le];
        this.imageUpload = null;
        this.imageViewBase64 = null;
        target.value = '';
      }
    };
    newImage.src = window.URL.createObjectURL(fileload);
    // hiện ảnh
    reader.onload = e => {
      this.imageUpload = file.item(0);
      this.imageViewBase64 = reader.result;
      console.log('this.imageUpload', this.imageUpload);
      console.log('this.imageViewBase64', this.imageViewBase64);
    };
  }
  ngOnDestroy() {
    this.webState.complete();
  }
}
