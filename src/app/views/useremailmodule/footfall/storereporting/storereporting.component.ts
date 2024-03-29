import { IOption } from 'ng-select';   // select option <option>
import { Component, OnInit, TemplateRef, OnDestroy, ViewChild, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
import 'rxjs/add/operator/map';
// import notification
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject, Subscription } from 'rxjs';

import { FormGroup } from '@angular/forms';
import { AdminLanguage } from '../../../../languages';
@Component({
  selector: 'app-storereportingschedule',
  templateUrl: './storereporting.component.html',
  styleUrls: ['./storereporting.component.scss'],
})
export class StoreReportingFFScheduleComponent implements OnInit, OnDestroy, OnChanges {
  @BlockUI() blockUI: NgBlockUI;
  private notifier: NotifierService;
  private subcription: any;
  @ViewChild('scheduleTemplate') scheduleTemplate: TemplateRef<any>;
  @Input() pageId: any;
  @Output() childrenEvent = new EventEmitter<boolean>();
  webState: BehaviorSubject<any>;
  oldState: string;
  language: AdminLanguage;
  defaultModel = environment.API.userInfo;
  modalRef: BsModalRef;
  userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
  @Input() defaultModule: number;
  // mặc định
  orgArray: Array<any>;
  organizationId: string;
  pageNumber: number;
  data: Array<any>;
  dataFilter: Array<any>;
  dataUpdate: any;
  siteSelectionDisplay: boolean;
  siteArray: Array<any>;
  errorArray: Array<string>;
  siteSelected: any;
  siteSelectedCompare: any;
  isErrorDuringLoad: boolean;
  startHourArray: Array<any>;
  endHourArray: Array<any>;
  viewByArray: Array<any>;
  reportTypeArray: Array<any>;
  isSuperAdmin: boolean;
  dateTimeLabel: string;
  savedData: any;
  contentLabel: string;
  timeOut: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(private router: Router,
    private appservice: AppService,
    private modalService: BsModalService
    , notifierService: NotifierService) {
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
    this.watchStateChange();
  }
  // done
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageId.isFirstChange()) {
      console.log(this.pageId);
      this.getData();
    }
  }
  // done
  getData(): Subscription {
    const data = {
      page_id: '\'' + this.pageId + '\''
    };
    const url = this.defaultModel.getSpecificPageSchedule;
    return this.appservice.post(data, url).subscribe(res => {
      console.log(res);
      if (res.status !== 1) {
        this.errorArray.push(this.language.co_loi_xay_ra);
        this.isErrorDuringLoad = true;
      } else {
        if (this.orgArray.length === 0) {
          this.errorArray.push(this.language.du_lieu_khong_phu_hop);
          this.isErrorDuringLoad = true;
        }
        this.isErrorDuringLoad = false;
        const retrieveData = res.retrieveData;
        if (retrieveData.length === 0) {
          this.setTimeOutToPopupRegister();
        } else {
          // for (let i = 0; i < retrieveData.length; i++) {
          //   // if (retrieveData[i].site_name === null) {
          //   //   retrieveData[i].site_name = retrieveData[i].organization_name;
          //   // }
          //   const jsonParsed = JSON.parse(retrieveData[i].params);
          //   retrieveData[i].start_time = jsonParsed.start_time;
          //   retrieveData[i].end_time = jsonParsed.end_time;
          // }
        }
        // this.isSuperAdmin = res.isSuperAdmin;
        // this.updateState(environment.STATE.retrieve, retrieveData);
        // this.recusiveMenu(res.siteArray);
        // this.orgArray = res.orgArray;
        // this.organizationId = this.orgArray[0].value;
        // this.startHourArray = res.startHourArray;
        // this.endHourArray = res.endHourArray;
        this.userInfo = res.userInfo;
      }
    },
      (error) => {
        this.isErrorDuringLoad = true;
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu);
        console.log(error);
      });
  }
  // done
  getDateTimeLabel(index: number): string {
    console.log(index);
    let returnStr = '';
    if (index === 1) {
      returnStr = 'Ngày';
    } else if (index === 2) {
      returnStr = 'Tuần';
    } else if (index === 4) {
      returnStr = 'Tháng';
    }
    return returnStr;
  }
  // done
  setTimeOutToPopupRegister() {
    this.callParentToGetParametter();
    // this.timeOut = setTimeout(() => {
    //   this.callParentToGetParametter();
    // }, 20000);
  }
  // done
  openPopupRegister() {
    if (!this.modalRef) {
      this.errorArray = [];
      this.pageNumber = 3;
      this.modalRef = this.modalService.show(this.scheduleTemplate, {
        backdrop: true,
        ignoreBackdropClick: true
      });
    } else {
      console.log('Đã mở popup');
    }
  }

  openPopupRegisterAgain() {
    this.errorArray = [];
    this.pageNumber = 3;
    this.modalRef = this.modalService.show(this.scheduleTemplate, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  // method lấy dữ liệu từ parent gửi về để thêm mới nhanh.
  getParametter(dataFromParent: any, index: number) {
    console.log('data from parent', dataFromParent);
    this.dateTimeLabel = this.getDateTimeLabel(index);
    if (this.dateTimeLabel !== '') {
      const reportType = this.getReportTypeFromIndex(index);
      const paramJson = JSON.stringify(dataFromParent);
      const data = {
        page_id: this.pageId
        , params: paramJson
        , report_type: reportType
        , module_id: this.defaultModule
        , user_id: this.userInfo.id
        , organization_id: this.userInfo.organization_id
        , actived: '1'
      };
      this.savedData = data;
      console.log('data', data);
      // this.openPopupRegister();
    }
  }

  getReportTypeFromIndex(index: number): number {
    let returnNumber = 0;
    if (index === 1) {
      returnNumber = 1;
      this.contentLabel = this.language.oh_ngay_tiep_theo;
    } else if (index === 2) {
      returnNumber = 2;
      this.contentLabel = this.language.oh_thu_hai_dau_tuan;
    } else if (index === 4) {
      returnNumber = 3;
      this.contentLabel = this.language.oh_ngay_dau_tien_trong_thang;
    } else if (index === 5) {
      returnNumber = 4;
      this.contentLabel = this.language.oh_ngay_dau_tien_trong_nam;
    }
    return returnNumber;
  }

  saveDataFromParent() {
    const data = this.savedData;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.mailReportSchedule.insert;
    this.appservice.post(data, url).subscribe(
      res => {
        if (res.status === 1) {
          this.notifier.notify('success', this.language.Dang_ky_thanh_cong);
          // const insertedData = res.insertedData;
          // const jsonParsed = JSON.parse(insertedData.params);
          // insertedData.start_time = jsonParsed.start_time;
          // insertedData.end_time = jsonParsed.end_time;
          // this.updateState(environment.STATE.insert, insertedData);
          this.modalRef.hide();
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
  callParentToGetParametter() {
    this.childrenEvent.next(true);
  }
  checkExistParam(dataFromParent: any, index: number) {
    // if (this.timeOut) {
    //   // console.log('đã xóa timeout');
    //   clearTimeout(this.timeOut);
    // }
    console.log('data from parent', dataFromParent);
    this.dateTimeLabel = this.getDateTimeLabel(index);
    if (this.dateTimeLabel !== '') {
      const reportType = this.getReportTypeFromIndex(index);
      const paramJson = JSON.stringify(dataFromParent);
      const data = {
        page_id: this.pageId
        , params: paramJson
        , report_type: reportType
        , module_id: this.defaultModule
        , user_id: this.userInfo.id
        , organization_id: this.userInfo.organization_id
        , actived: '1'
      };
      const url = environment.API.mailReportSchedule.checkExistParam;
      this.appservice.post(data, url).subscribe(
        res => {
          console.log(res);
          if (res.status === 1) {
            const retriveData = res.retrieveData;
            if (retriveData) {
              console.log('Đã tồn tại');
            } else {
              this.modalRef = null;
              this.savedData = data;

              // this.timeOut = setTimeout(() => {
              //   this.openPopupRegister();
              // }, 800000);
            }
          } else {
            // this.notifier.notify('error', this.language.co_loi_xay_ra);
          }
        },
        (error) => {
          console.log(error);
          // this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu_vui_long);
        });
    }
  }

  hiddenForm() {
    // tslint:disable-next-line: no-unused-expression
    this.modalRef && this.modalRef.hide();
  }



  // tạm thời bỏ qua
  setDefaultValue() {
    this.orgArray = [];
    this.organizationId = null;
    this.data = [];
    this.dataFilter = [];
    this.dataUpdate = null;
    this.siteSelectionDisplay = false;
    this.siteArray = [];
    this.errorArray = [];
    this.siteSelected = null;
    this.isErrorDuringLoad = false;
    this.startHourArray = [];
    this.endHourArray = [];
    this.reportTypeArray = [
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
    this.isSuperAdmin = false;
    this.siteSelectedCompare = null;
    this.userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
  }

  changeReportType(value) {
    this.viewByArray = this.changeViewBy(value);
  }

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
  openPopupGetData(templates: TemplateRef<any>) {
    this.errorArray = [];
    this.pageNumber = 0;
    // Nếu vẫn lỗi thì bấm vào là load lại lần nữa
    if (this.isErrorDuringLoad) {
      this.blockUI.start(this.language.dang_tai_du_lieu);
      this.getData().add(() => {
        this.blockUI.stop();
        // Nếu thử lại mà vẫn lỗi
        if (this.isErrorDuringLoad) {
          const errMsg = this.errorArray[0];
          this.notifier.notify('error', errMsg);
        } else {
          this.modalRef = this.modalService.show(templates, {
            backdrop: true,
            ignoreBackdropClick: true
          });
        }
      });
    } else { // Nếu không lỗi thì hiện form
      this.modalRef = this.modalService.show(templates, {
        backdrop: true,
        ignoreBackdropClick: true
      });
    }
  }
  changeToAddItemPage() {
    this.viewByArray = this.changeViewBy('1');
    this.errorArray = [];
    this.siteSelected = null;
    this.siteSelectionDisplay = false;
    const data = {
      organization_id: this.organizationId
      , user_id: this.userInfo.id
    };
    const url = environment.API.userGetSite;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    return this.appservice.post(data, url).subscribe(res => {
      console.log(res);
      if (res.status !== 1) {
        this.errorArray.push(this.language.co_loi_xay_ra);
      } else {
        this.recusiveMenu(res.siteArray);
        this.pageNumber = 1;
      }
    },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu);
        console.log(error);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  changeToUpdateItemPage(item) {
    let organization_id_param = null;
    // Parse data lỗi thì báo lỗi luôn
    try {
      const parsedParams = JSON.parse(item.params);
      this.dataUpdate = item;
      this.dataUpdate.start_time = parsedParams.start_time;
      this.dataUpdate.end_time = parsedParams.end_time;
      this.dataUpdate.site_id = parsedParams.site_id;
      this.dataUpdate.organization_id_compare = parsedParams.organization_id_compare;
      this.dataUpdate.site_id_compare = parsedParams.site_id_compare;
      this.dataUpdate.view_by = parsedParams.view_by;
      this.dataUpdate.dimesion = parsedParams.dimesion;
      this.dataUpdate.start_time_compare = parsedParams.start_time_compare;
      this.dataUpdate.end_time_compare = parsedParams.end_time_compare;
      this.dataUpdate.question_id = parsedParams.question_id;
      this.dataUpdate.category_id = parsedParams.category_id;
      this.dataUpdate.index_source = parsedParams.index_source;
      this.dataUpdate.index_source_compare = parsedParams.index_source_compare;
      this.dataUpdate.operation = parsedParams.operation;
      //
      organization_id_param = parsedParams.organization_id;
    } catch (error) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    // Parse data thành công
    this.organizationId = organization_id_param;
    this.viewByArray = this.changeViewBy(item.report_type);
    this.errorArray = [];
    this.siteSelectionDisplay = false;
    this.siteSelected = null;
    this.siteArray = [];
    const data = {
      organization_id: this.organizationId
      , user_id: this.userInfo.id
    };
    const url = environment.API.userGetSite;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.post(data, url).subscribe(res => {
      console.log(res);
      if (res.status !== 1) {
        this.notifier.notify('error', this.language.co_loi_xay_ra);
      } else {
        if (res.siteArray.length === 0) {
          this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
          return;
        }
        this.recusiveMenu(res.siteArray);
        this.siteSelected = this.siteArray.find(e => e.id === item.site_id);
        if (!this.siteSelected) {
          this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
          return;
        }
        this.pageNumber = 2;
      }
    },
      (error) => {
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu_vui_long);
        // this.errorArray.push(this.language.khong_the_ket_noi_may_chu);
        console.log(error);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  changeToListPage() {
    this.pageNumber = 0;
    this.dataUpdate = null;
  }
  recusiveMenu(array: Array<any>, id = null, space = 0) {
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
        this.recusiveMenu(array, a_id, scope);
      }
    });
  }
  changeSite(item: any) {
    console.log('id', item.id);
    if (item.enables === '1') {
      this.siteSelected = item;
    } else {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
    }
    this.siteSelectionDisplay = false; // tắt đi
  }
  changeOrg(item: any) {
    this.organizationId = item.value;
    this.siteSelected = null;
    this.errorArray = [];
    this.siteArray = [];
    const data = {
      organization_id: this.organizationId
      , user_id: this.userInfo.id
    };
    const url = environment.API.userGetSite;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.post(data, url).subscribe(
      res => {
        if (res.status === 1) {
          if (res.siteArray.length > 0) {
            this.recusiveMenu(res.siteArray);
          }
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
  addNewItem(item) {
    if (item.invalid || !this.siteSelected) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const param = {
      start_time: item.value.start_time // required
      , end_time: item.value.end_time // required
      , organization_id: item.value.organization_id // required
      , site_id: this.siteSelected.id // required
      , organization_id_compare: item.value.hasOwnProperty('organization_id_compare') ? item.value.organization_id_compare : null
      //
      , site_id_compare: this.siteSelectedCompare
        && item.value.hasOwnProperty('organization_id_compare') ? this.siteSelectedCompare.id : null
      //
      , view_by: item.value.view_by // required
      , dimesion: 'SITE' // required
      , question_id: item.value.hasOwnProperty('question_id') ? item.value.question_id : 1
      , category_id: item.value.hasOwnProperty('category_id') ? item.value.category_id : 1
      , index_source: item.value.hasOwnProperty('index_source') ? item.value.index_source : null
      , index_source_compare: item.value.hasOwnProperty('index_source_compare') ? item.value.index_source_compare : null
      , operation: item.value.hasOwnProperty('operation') ? item.value.operation : 'SUM'
      , start_time_compare: item.value.hasOwnProperty('start_time_compare') ? item.value.start_time_compare : null
      , end_time_compare: item.value.hasOwnProperty('end_time_compare') ? item.value.end_time_compare : null
    };
    const paramJson = JSON.stringify(param);
    const data = {
      page_id: this.pageId
      , params: paramJson
      , report_type: '1'
      , module_id: this.defaultModule
      , user_id: this.userInfo.id // userInfo
      , organization_id: this.userInfo.organization_id // userInfo
      , actived: item.value.actived
    };
    console.log('data', data);
    // xét error về rỗng.
    this.errorArray = [];
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.mailReportSchedule.insert;
    this.appservice.post(data, url).subscribe(
      res => {
        if (res.status === 1) {
          const insertedData = res.insertedData;
          insertedData.site_name = this.siteSelected.site_name;
          const jsonParsed = JSON.parse(insertedData.params);
          insertedData.start_time = jsonParsed.start_time;
          insertedData.end_time = jsonParsed.end_time;
          this.updateState(environment.STATE.insert, insertedData);
          this.changeToListPage();
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
  updateCurrentItem(item) {
    if (item.invalid || !this.siteSelected) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const param = {
      start_time: item.value.start_time // required
      , end_time: item.value.end_time // required
      , organization_id: item.value.organization_id // required
      , site_id: this.siteSelected.id // required
      , organization_id_compare: item.value.hasOwnProperty('organization_id_compare') ? item.value.organization_id_compare : null
      //
      , site_id_compare: this.siteSelectedCompare
        && item.value.hasOwnProperty('organization_id_compare') ? this.siteSelectedCompare.id : null
      //
      , view_by: item.value.view_by // required
      , dimesion: 'SITE' // required
      , question_id: item.value.hasOwnProperty('question_id') ? item.value.question_id : 1
      , category_id: item.value.hasOwnProperty('category_id') ? item.value.category_id : 1
      , index_source: item.value.hasOwnProperty('index_source') ? item.value.index_source : null
      , index_source_compare: item.value.hasOwnProperty('index_source_compare') ? item.value.index_source_compare : null
      , operation: item.value.hasOwnProperty('operation') ? item.value.operation : null
      , start_time_compare: item.value.hasOwnProperty('start_time_compare') ? item.value.start_time_compare : null
      , end_time_compare: item.value.hasOwnProperty('end_time_compare') ? item.value.end_time_compare : null
    };
    const paramJson = JSON.stringify(param);
    const data = {
      id: this.dataUpdate.id
      , page_id: this.pageId
      , params: paramJson
      , report_type: '1'
      , module_id: this.defaultModule
      // , user_id: this.userInfo.id
      // , organization_id: this.userInfo.organization_id
      , actived: item.value.actived
    };
    this.errorArray = [];
    console.log('data', data);
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.mailReportSchedule.update;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          const updatedData = res.updatedData;
          // cập nhật site name
          updatedData.site_name = this.siteSelected.site_name;
          const jsonParsed = JSON.parse(updatedData.params);
          updatedData.start_time = jsonParsed.start_time;
          updatedData.end_time = jsonParsed.end_time;
          //
          this.updateState(environment.STATE.update, updatedData);
          this.changeToListPage();
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
  preventChange() {
    this.modalRef.hide();
    this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
  }
  deleteCurrentItem(item) {
    this.dataUpdate = item;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.mailReportSchedule.delete;
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
        this.blockUI.stop();
      });
  }
  ngOnDestroy() {
    this.webState.complete();
  }
  // end
}
