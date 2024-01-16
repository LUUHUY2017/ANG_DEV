import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import viewchild
import { TerminalMenuComponent } from '../../viewchild/terminalmenu/terminalmenu.component';
// import notification
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/operators/map';
import { AdminLanguage } from '../../../languages';
import { FormGroup } from '@angular/forms';
// import * as io from 'socket.io-client';

@ViewChild(TerminalMenuComponent)

@Component({
  templateUrl: './terminalmonitor.component.html',
  styleUrls: ['./terminalmonitor.component.scss'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class TerminalMonitorComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('searchForm') searchForm: FormGroup;
  private readonly notifier: NotifierService;
  modalRef: BsModalRef;
  rowsOnPage = 15;
  webState: BehaviorSubject<any>;
  defaultModel = environment.API.terminal;
  optionDelete = 0;
  subcription: any;
  oldState: string;
  language: AdminLanguage;
  // mặc định
  siteSelectionDisplay: boolean;
  siteFilterModel: any;
  isSuperAdmin: boolean;
  canAdd: boolean;
  data: Array<any>;
  dataFilter: Array<any>;
  dataUpdate: any;
  organizationId: string;
  orgArray: Array<IOption>;
  locationArray: Array<any>;
  siteArray: any;
  siteSelected: any;
  siteTreeDisplay: boolean;
  errorArray: Array<any>;
  locationSelectedArray: Array<any>;
  recordDate: string;
  deleteSNstring: string;
  canDeleteItem: boolean;
  isOnload: boolean;
  errorMess: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    notifierService: NotifierService,
    private appservice: AppService,
    private modalService: BsModalService) {
    this.notifier = notifierService;
    // this.socket = io(environment.UrlSocket);
    this.language = this.appservice.getLanguage();
  }
  // done
  ngOnInit(): void {
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    this.setDefaultValue();
    this.watchStateChange();
    this.setDefaultCrud(false);
    this.getConfig();
  }
  // done
  open(url) {
    window.open(url, '_blank');
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
          if (this.data[i].id === item.id) {
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
            if (key === 'site_id') {
              const siteId = inputData[key];
              const sourceData = [siteId];
              if (siteId !== '0') {
                this.getParentId(sourceData, inputData[key]);
                // console.log('inputData[key]', inputData[key]);
                // console.log('sourceData', sourceData);
                oldData = oldData.filter((e: any) => sourceData.includes(e.site_id));
              }
            } else {
              const lowerStr = inputData[key] !== null ? inputData[key].toLowerCase() : null;
              oldData = oldData.filter((e: any) => e.hasOwnProperty(key) && (inputData[key] === ''
                || e[key].toLowerCase().indexOf(lowerStr) !== -1));
            }
          }
        }
        // console.log('oldData', oldData);
        this.dataFilter = oldData;
      }
    });
  }
  // done
  cloneArray(item: Array<any>) {
    const newJSONString = JSON.stringify(item);
    return JSON.parse(newJSONString);
  }
  // done
  setDefaultCrud(bool: boolean) {
    this.canAdd = bool;
  }
  // done
  checkSN() {
    if (this.deleteSNstring === this.dataUpdate.serial_number) {
      this.canDeleteItem = true;
    } else {
      this.canDeleteItem = false;
    }
  }
  getParentId(source: Array<any>, id: any) {
    this.siteArray.forEach(element => {
      if (element.parent_id === id) {
        const a_id = element.id;
        source.push(a_id);
        this.getParentId(source, a_id);
      }
    });
  }
  // done
  setDefaultValue() {
    this.siteFilterModel = null;
    this.siteSelectionDisplay = false;
    this.isSuperAdmin = false;
    this.data = [];
    this.dataFilter = [];
    this.dataUpdate = null;
    this.organizationId = null;
    this.orgArray = [];
    this.locationArray = [];
    this.siteArray = [];
    this.siteSelected = [];
    this.siteTreeDisplay = false;
    this.errorArray = [];
    this.locationSelectedArray = [];
    this.recordDate = null;
    this.deleteSNstring = null;
    this.canDeleteItem = false;
    this.isOnload = true;
    this.errorMess = null;
  }
  // done
  recusiveMenu(array: any[], id = null, space = 0) {
    array.forEach(element => {
      if (element.parent_id === id) {
        const a_id = element.id;
        this.siteArray.push({
          id: element.id
          , site_name: id ? element.site_name : this.language.tat_ca
          , parent_id: element.parent_id
          , alevel: space
          , enables: id ? element.enables : '1'
          , store: element.store
        });
        const scope = space + 1;
        this.recusiveMenu(array, a_id, scope);
      }
    });
  }
  // done
  submitToSearch(form: any) {
    const inputData = form.value; // Where
    if (this.siteFilterModel) {
      inputData.site_id = this.siteFilterModel.id;
    }
    console.log(inputData);
    this.updateState(environment.STATE.search, inputData);
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
  openPopupDeleteItem(item, dialog: TemplateRef<any>) {
    console.log('dữ liệu từng bản ghi', item);
    this.modalRef = this.modalService.show(dialog, {
      backdrop: true,
      ignoreBackdropClick: true
    });
    this.deleteSNstring = null;
    this.dataUpdate = Object.assign({}, item);
    this.canDeleteItem = false;
  }
  // done
  openPopupAddItem(templates: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true
    });
    this.siteSelected = null;
    this.siteTreeDisplay = false;
    this.errorArray = [];
    this.locationSelectedArray = [];
  }
  // done
  openPopupUpdateCurrentItem(item, template: TemplateRef<any>) {
    console.log('dữ liệu từng bản ghi', item);
    this.errorArray.length = 0;
    this.siteTreeDisplay = false;
    this.dataUpdate = Object.assign({}, item);
    const siteId = item.site_id;
    this.siteSelected = this.siteArray.find(e => e.id === siteId);
    this.locationSelectedArray = this.locationArray.filter(e => Number(e.site_id) === Number(siteId));
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  // done
  getData() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organizationId
      , deleted: this.optionDelete
    };
    const url = this.defaultModel.getData;
    this.siteArray = [];
    this.siteFilterModel = null;
    this.appservice.post(data, url).subscribe(res => {
      console.log(res);
      if (res.status !== 1) {
        this.errorMess = this.language.da_co_loi_xay_ra;
        return;
      }
      this.setDefaultCrud(true);
      this.recordDate = res.recordDate;
      this.locationArray = res.locationData.map(function (e: any) {
        const newItem = {
          value: e.id
          , label: e.location_name + ' - ' + e.module_name
          , site_id: e.site_id
        };
        return newItem;
      });
      this.recusiveMenu(res.siteData);
      const retrieveData = res.retrieveData;
      for (let i = 0; i < retrieveData.length; i++) {
        if (retrieveData[i].ip_address === null) {
          retrieveData[i].ip_address = this.language.chua_cap_nhat;
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
  addNewItem(item) {
    if (item.invalid || !this.siteSelected) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const url = this.defaultModel.insert;
    const location_id = item.value.location_id;
    const data = {
      ...item.value
      , organization_id: this.organizationId
      , site_id: this.siteSelected.id
    };
    const currentLocation = this.locationArray.find(e => e.value === item.value.location_id);
    // xét error về rỗng.
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const insertedData = res.insertedData;
          insertedData.id = insertedData.guid;
          delete insertedData.guid;
          insertedData.site_name = this.siteSelected.site_name;
          insertedData.location_name = currentLocation.label;
          insertedData.ip_address = this.language.chua_cap_nhat;
          insertedData.online = '0';
          insertedData.descriptions = null;
          insertedData.note = null;
          this.updateState(environment.STATE.insert, res.insertedData);
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
  updateCurrentItem(item) {
    console.log(item);
    if (item.invalid || !this.siteSelected) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    // Nếu như serial number không sửa
    if (item.value.serial_number === this.dataUpdate.serial_number) {
      delete item.value.serial_number;
    }
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const currentLocation = this.locationArray.find(e => e.value === item.value.location_id);
    const data = {
      ...item.value
      , id: this.dataUpdate.id
      , site_id: this.siteSelected.id
    };
    const url = this.defaultModel.update;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const updatedData = res.updatedData;
          updatedData.id = this.dataUpdate.id;
          updatedData.location_name = currentLocation.label;
          updatedData.site_name = this.siteSelected.site_name;
          updatedData.online = this.dataUpdate.online;
          console.log('updatedData', updatedData);
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
  deleteCurrentItem(reEnterSnInput: any) {
    if (reEnterSnInput.value !== this.dataUpdate.serial_number) {
      alert(this.language.khong_trung_khop);
      return;
    }
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
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
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu);
      }).add(() => {
        this.modalRef.hide();
        this.blockUI.stop();
      });
  }
  // done
  preventChange() {
    this.modalRef.hide();
    this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
  }
  // done
  changeSite(item: any) {
    console.log('id', item);
    this.siteTreeDisplay = false;
    if (item.store === '0' || item.enables === '0') {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.co_loi_xay_ra);
      return;
    }
    this.siteSelected = item;
    this.locationSelectedArray = this.locationArray.filter(e => Number(e.site_id) === Number(item.id));
    console.log(this.locationArray);
  }
  // done
  siteFilter(item: any) {
    console.log('id', item);
    this.siteSelectionDisplay = false;
    if (item.enables === '0') {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.co_loi_xay_ra);
      return;
    }
    this.siteFilterModel = item;
  }
  // done
  ngOnDestroy() {
    this.webState.complete();
  }
}
