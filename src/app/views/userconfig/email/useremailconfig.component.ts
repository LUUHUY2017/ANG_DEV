import { IOption } from 'ng-select';   // select option <option>
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
// import { Router } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';
// import viewchild
import { UserMenuComponent } from '../../viewchild/usermenu/usermenu.component';
// import notification
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminLanguage } from '../../../languages';
@ViewChild(UserMenuComponent)

@Component({
  templateUrl: './useremailconfig.component.html',
  styleUrls: ['./useremailconfig.component.scss'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class UserEmailConfigComponent implements OnInit, OnDestroy {
  defaultModel = environment.API.userInfo;
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  canAdd: boolean;
  @ViewChild('searchForm') searchForm: FormGroup;
  // Khai báo kiểu dữ kiệu
  public data: any;
  dataFilter: any;
  dataUpdate: any;
  organizationId: string;
  moduleArray: Array<IOption>; // note
  modalRef: BsModalRef;
  siteSelectionDisplay: boolean;
  webState: BehaviorSubject<any>;
  subcription: any;
  oldState: string;
  errorArray: Array<any>;
  language: AdminLanguage;
  recordDate: string;
  pageArray: Array<any>;
  siteArray: Array<any>;
  viewBy: Array<any>;
  startTimeArray: Array<any>;
  endTimeArray: Array<any>;
  siteSelected: any;
  pageSelectedArray: Array<any>;
  userInfo: any;
  isOnload: boolean;
  errorMess: string;
  // phân trang bảng
  rowsOnPage = 15;
  reportType: Array<any>;
  constructor(
    public router: Router,
    notifierService: NotifierService,
    private appservice: AppService,
    private modalService: BsModalService) {
    this.notifier = notifierService;
    this.language = this.appservice.getLanguage();
  }
  ngOnInit(): void {
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    this.setDefaultValue();
    this.setDefaultCrud(false);
    this.watchStateChange();
    this.getConfig();
  }
  watchStateChange() {
    this.subcription = this.webState.asObservable();
    this.subcription.subscribe(res => {
      const currentState = res.state;
      const item = this.cloneArray(res.data);
      const oldState = this.oldState;
      // console.log('trạng thái trước', this.oldState);
      // console.log('trạng thái hiện tại', currentState);
      // Đây là sự kiện khi vừa load trang get data về
      if (currentState === environment.STATE.retrieve) {
        // Sự kiện nhận dữ liệu về thì bỏ hành động tìm kiếm trước đó
        this.data = item;
        this.dataFilter = this.data;
        // Nếu là sự kiện thêm mới
      } else if (currentState === environment.STATE.insert) {
        this.data.push(item);
        // Nếu trạng thái trước đó là search
        this.notifier.notify('success', this.language.them_moi_thanh_cong);
        if (oldState === environment.STATE.search) {
          this.updateState(environment.STATE.search);
        }
        // nếu là sự kiện sửa
      } else if (currentState === environment.STATE.update) {
        console.log(this.data);
        for (let i = 0; i < this.data.length; i++) {
          if (Number(this.data[i].id) === Number(item.id)) {
            this.data[i] = item;
            break;
          }
        }
        this.notifier.notify('success', this.language.cap_nhat_thanh_cong);
        if (oldState === environment.STATE.search) {
          this.updateState(environment.STATE.search);
        }
        // Nếu là sự kiện xóa
      } else if (currentState === environment.STATE.delete) {
        this.data.splice(this.data.findIndex(e => e.id === item.id), 1);
        this.notifier.notify('success', this.language.xoa_thanh_cong);
        if (oldState === environment.STATE.search) {
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
  cloneArray(item: Array<any>) {
    const newJSONString = JSON.stringify(item);
    return JSON.parse(newJSONString);
  }
  // done
  setDefaultCrud(bool: boolean) {
    this.canAdd = bool;
  }
  // done
  changeReportType(value) {
    this.viewBy = this.changeViewBy(value);
  }
  // done
  changeViewBy(value) {
    // const value = item.value;
    console.log(value);
    if (value === '1') {
      return [{
        value: 'Hour'
        , label: this.language.gio
      }, {
        value: 'Day'
        , label: this.language.ngay
      }
      ];
    } else if (value === '2') {
      return [{
        value: 'Hour'
        , label: this.language.gio
      }, {
        value: 'Day'
        , label: this.language.ngay
      }
      ];
    } else if (value === '3') {
      return [{
        value: 'Hour'
        , label: this.language.gio
      }, {
        value: 'Day'
        , label: this.language.ngay
      }, {
        value: 'Week'
        , label: this.language.tuan
      }
      ];
    }
  }
  // done
  setDefaultValue() {
    this.reportType = [
      {
        value: '1'
        , label: this.language.ngay
      },
      {
        value: '2'
        , label: this.language.tuan
      },
      {
        value: '3'
        , label: this.language.thang
      }
    ];
    this.viewBy = [];
    this.moduleArray = [];
    this.startTimeArray = [];
    this.endTimeArray = [];
    this.siteArray = [];
    this.dataFilter = [];
    this.data = [];
    this.errorArray = [];
    this.pageArray = [];
    this.pageSelectedArray = [];
    this.dataUpdate = null;
    this.siteSelectionDisplay = false;
    this.isOnload = true;
    this.errorMess = null;
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
  changeModule(item) {
    const module_id = item.value;
    this.pageSelectedArray = this.pageArray.filter(e => e.module_id === module_id);
    // console.log('module_id', module_id);
    // console.log(this.pageSelectedArray);
    // console.log(this.pageArray);
  }
  // done
  submitToSearch(form: any) {
    const inputData = form.value; // Where
    this.updateState(environment.STATE.search, inputData);
  }
  // done
  getConfig() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = this.defaultModel.getMailScheduleInfo;
    this.appservice.get(url).subscribe(
      param => {
        console.log('param', param);
        if (param.status === 0) {
          this.errorMess = this.language.co_loi_xay_ra;
          return;
        }
        if (param.moduleData.length === 0) {
          this.errorMess = this.language.khong_ton_tai_module;
          return;
        }
        this.setDefaultCrud(true);
        this.startTimeArray = param.startTime;
        this.endTimeArray = param.endTime;
        this.userInfo = param.userData;
        const retrieveData = param.retrieveData;
        for (let i = 0; i < retrieveData.length; i++) {
          // if (retrieveData[i].site_name === null) {
          //   retrieveData[i].site_name = retrieveData[i].organization_name;
          // }
          retrieveData[i].view_by = '';
          retrieveData[i].start_time = null;
          retrieveData[i].end_time = null;
          retrieveData[i].start_time_label = null;
          retrieveData[i].end_time_label = null;
          try {
            const jsonParam = JSON.parse(retrieveData[i].params);
            if (jsonParam.hasOwnProperty('view_by')) {
              retrieveData[i].view_by = jsonParam.view_by;
            }
            retrieveData[i].start_time = jsonParam.start_time;
            retrieveData[i].end_time = jsonParam.end_time;
            retrieveData[i].start_time_label = this.startTimeArray.find(e => e.value === jsonParam.start_time).label;
            retrieveData[i].end_time_label = this.endTimeArray.find(e => e.value === jsonParam.end_time).label;
          } catch (error) {
            console.log(error);
          }
        }
        console.log(retrieveData);
        this.updateState(environment.STATE.retrieve, retrieveData);
        const siteData = param.siteData || [];
        this.recusive_menu(siteData);
        console.log('siteData', siteData);
        this.moduleArray = param.moduleData.map(function (e) {
          return {
            value: e.id
            , label: e.module_name
          };
        });
        this.pageArray = param.pageData.map(function (e) {
          return {
            value: e.id
            , label: e.page_name
            , module_id: e.page_module
            , end_point: e.end_point
          };
        });
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
    if (!this.canAdd) {
      return;
    }
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true
    });
    this.errorArray.length = 0;
    this.siteSelectionDisplay = false;
    this.viewBy.length = 0;
    this.siteSelected = null;
    this.pageSelectedArray.length = 0;
  }
  // Open modal update từng thiết bị
  openPopupUpdateItem(item, template: TemplateRef<any>) {
    console.log('dữ liệu từng bản ghi', item);
    this.siteSelectionDisplay = false;
    this.dataUpdate = Object.assign({}, item);
    const site_id = item.site_id;
    this.siteSelected = this.siteArray.find(e => e.id === site_id);
    this.pageSelectedArray = this.pageArray.filter(e => e.module_id === item.module_id);
    this.viewBy = this.changeViewBy(item.report_type);
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  // done
  addNewItem(item: FormGroup) {
    if (item.invalid || !this.siteSelected) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const currentPageSelected = this.pageArray.find(e => e.value === item.value.page_id);
    const paramJson = {
      page_id: item.value.page_id
      , report_type: item.value.report_type
      , view_by: item.value.view_by
      , start_time: item.value.start_time
      , end_time: item.value.end_time
      , site_id: this.siteSelected.id
      , end_point: currentPageSelected ? currentPageSelected.end_point : null
      , user_id: this.userInfo.id
      , organization_id: this.userInfo.organization_id
    };
    const data = {
      module_id: item.value.module_id
      , user_id: this.userInfo.id
      , site_id: this.siteSelected.id
      , page_id: item.value.page_id
      , params: JSON.stringify(paramJson)
      , report_type: item.value.report_type
      , actived: item.value.actived
      , organization_id: this.userInfo.organization_id
    };
    console.log(data);
    const url = environment.API.mailReportSchedule.insert;
    // xét error về rỗng.
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const insertedData = res.insertedData;
          insertedData.start_time = paramJson.start_time;
          insertedData.end_time = paramJson.end_time;
          insertedData.view_by = paramJson.view_by;
          insertedData.start_time_label = this.startTimeArray.find(e => e.value === insertedData.start_time).label;
          insertedData.end_time_label = this.endTimeArray.find(e => e.value === insertedData.end_time).label;
          insertedData.site_name = this.siteSelected.site_name;
          insertedData.page_name = this.pageArray.find(e => e.value === insertedData.page_id).label;
          insertedData.module_name = this.moduleArray.find(e => e.value === insertedData.module_id).label;
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
  updateCurrentItem(item: FormGroup) {
    console.log(item);
    if (item.invalid || !this.siteSelected) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const currentPageSelected = this.pageArray.find(e => e.value === item.value.page_id);
    const paramJson = {
      page_id: item.value.page_id
      , report_type: item.value.report_type
      , view_by: item.value.view_by
      , start_time: item.value.start_time
      , end_time: item.value.end_time
      , site_id: this.siteSelected.id
      , end_point: currentPageSelected ? currentPageSelected.end_point : null
      , user_id: this.userInfo.id
      , organization_id: this.userInfo.organization_id
    };
    const data = {
      id: this.dataUpdate.id
      , module_id: item.value.module_id
      , site_id: this.siteSelected.id
      , page_id: item.value.page_id
      , params: JSON.stringify(paramJson)
      , report_type: item.value.report_type
      , actived: item.value.actived
    };
    console.log(data);
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = environment.API.mailReportSchedule.update;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const updatedData = res.updatedData;
          updatedData.start_time = paramJson.start_time;
          updatedData.end_time = paramJson.end_time;
          updatedData.view_by = paramJson.view_by;
          updatedData.start_time_label = this.startTimeArray.find(e => e.value === updatedData.start_time).label;
          updatedData.end_time_label = this.endTimeArray.find(e => e.value === updatedData.end_time).label;
          updatedData.site_name = this.siteSelected.site_name;
          updatedData.page_name = this.pageArray.find(e => e.value === updatedData.page_id).label;
          updatedData.module_name = this.moduleArray.find(e => e.value === updatedData.module_id).label;
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
  openPopupDeleteItem(item, dialog: TemplateRef<any>) {
    this.modalRef = this.modalService.show(dialog, {
      backdrop: true,
      ignoreBackdropClick: true
    });
    this.dataUpdate = item;
  }
  // done
  preventChange() {
    this.modalRef.hide();
    this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
  }
  // done
  changeSiteSelected(item: any) {
    console.log('id', item);
    this.siteSelectionDisplay = false;
    if (item.enables === '0') {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.co_loi_xay_ra);
      return;
    }
    this.siteSelected = item;
  }
  // done
  deleteCurrentItem() {
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = environment.API.mailReportSchedule.delete;
    const data = {
      id: this.dataUpdate.id
    };
    this.appservice.post(data, url).subscribe(
      param => {
        if (param.status === 1) {
          this.updateState('delete', this.dataUpdate);
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
  ngOnDestroy() {
    this.webState.complete();
  }
}
