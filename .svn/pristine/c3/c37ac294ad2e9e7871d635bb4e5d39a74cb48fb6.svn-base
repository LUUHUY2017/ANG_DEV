import { IOption } from 'ng-select';   // select option <option>

import {
  Component, OnInit,
  ViewChild, TemplateRef, OnDestroy, Renderer2, Input, OnChanges, SimpleChanges, ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { AppService } from '../../../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { GeneralMenuComponent } from '../../../../viewchild/generalmenu/generalmenu.component';
// import notification
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { AdminLanguage } from '../../../../../languages';
import { FormGroup } from '@angular/forms';

@ViewChild(GeneralMenuComponent)
@Component({
  selector: 'app-oaevent',
  templateUrl: './oaevent.component.html',
  //   styleUrls: ['./zalosender.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})
export class OAZaloEventComponent implements OnInit, OnDestroy, OnChanges {
  @Input() organizationId: string;
  @ViewChild('searchForm') searchForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  private subcription: any;
  defaultModel = environment.API.oaZalo.event;
  modalRef: BsModalRef;
  rowsOnPage = 15;
  webState: BehaviorSubject<any>;
  language: AdminLanguage;
  oldState: string;
  // Khai báo kiểu dữ kiệu
  canAdd: boolean;
  data: Array<any>;
  dataFilter: Array<any>;
  dataUpdate: any;
  errorArray: Array<string>;
  optionDelete: number;
  eventArray: Array<any>;
  unFollowerArray: Array<any>;
  followerArray: Array<any>;
  isOnload: boolean;
  isSuperAdmin: boolean;
  errorMess: string;
  accountInfo: any;
  selectedItem: Array<any>;
  status: number;
  constructor(private router: Router,
    private route: ActivatedRoute,
    notifierService: NotifierService,
    private appservice: AppService,
    private modalService: BsModalService,
    private renderer: Renderer2) {
    this.language = this.appservice.getLanguage();
    this.notifier = notifierService;
  }
  ngOnInit(): void {
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    this.setDefaultValue();
    this.watchStateChange();
    this.setDefaultPermission(false);
    if (this.organizationId) {
      this.getData();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.organizationId.firstChange) {
      this.getData();
    }
  }
  setDefaultValue() {
    this.canAdd = false;
    this.data = [];
    this.dataFilter = [];
    this.dataUpdate = null;
    this.errorArray = [];
    this.optionDelete = 0;
    this.eventArray = [];
    this.followerArray = [];
    this.unFollowerArray = [];
    this.isOnload = true;
    this.isSuperAdmin = false;
    this.errorMess = null;
    this.accountInfo = null;
    this.selectedItem = [];
  }
  changeEvent(item) {
    const eventSelected = item.value;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      event_id: eventSelected
      , account_id: this.accountInfo.id
      , organization_id: this.organizationId
    };
    const url = this.defaultModel.eventGetFollower;
    // console.log('data gửi đi', data);
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          this.status = null;
          this.unFollowerArray = res.zaloFollowerArray.map(function(e) {
            return {
              ...e
              , type: 1
              , selected: false
            };
          });
          this.followerArray = res.followedArray.map(function(e) {
            return {
              ...e
              , type: 2
              , selected: false
            };
          });
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
  getData() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organizationId
      , deleted: this.optionDelete
    };
    const url = this.defaultModel.getData;
    // console.log('data gửi đi', data);
    this.appservice.post(data, url).subscribe(res => {
      console.log(res);
      if (res.status !== 1) {
        this.errorMess = this.language.co_loi_xay_ra;
        return;
      }
      this.setDefaultPermission(true);
      this.updateState(environment.STATE.retrieve, res.retrieveData);
      this.eventArray = res.eventArray.map(function (e) {
        return {
          value: e.id
          , label: e.event_name
          , event_code: e.event_code
        };
      });
      this.accountInfo = res.accountInfo;
      console.log('this.eventArray', this.eventArray);
    },
      (error) => {
        // console.log(error);
        this.errorMess = this.language.khong_the_ket_noi_may_chu;
      }).add(() => {
        this.isOnload = false;
        this.blockUI.stop();
      });
  }
  submitToSearch(form: any) {
    const inputData = form.value; // Where
    console.log(inputData);
    this.updateState(environment.STATE.search, inputData);
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
  // done
  openPopupUpdateEvent(templates: TemplateRef<any>) {
    this.errorArray = [];
    this.followerArray = [];
    this.unFollowerArray = [];
    this.selectedItem = [];
    this.openBigModal(templates);
  }
  setDefaultPermission(bool: boolean) {
    this.canAdd = bool;
  }
  // thêm vị trí cho thiết bị
  updateEvent(item) {
    if (item.invalid) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const data = {
      event_id: item.value.event_id
      , follower_array: this.followerArray
      , oa_id: this.accountInfo.id
    };
    // xét error về rỗng.
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = this.defaultModel.updateEventAndFollower;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          this.modalRef.hide();
          this.notifier.notify('success', this.language.cap_nhat_du_lieu_thanh_cong);
          this.getData();
        } else {
          this.errorArray = this.appservice.validate_error(res);
          // console.log(this.error_array);
        }
      },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  preventChange() {
    this.modalRef.hide();
    this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
  }
  ngOnDestroy() {
    this.webState.complete();
  }
  openModal(temple: TemplateRef<any>) {
    this.modalRef = this.modalService.show(temple, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  openBigModal(temple: TemplateRef<any>) {
    this.modalRef = this.modalService.show(temple, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-lg'
    });
  }
  checkedItem(item: any, selected: number, event: ElementRef) {
    console.log('selected', selected);
    if (this.selectedItem.length > 0) {
      const current = this.selectedItem.find(i => i.id === item.id);
      if (current) {
        item.selected = false;
        // this.renderer.removeClass(event, 'actived');
        this.selectedItem.splice(this.selectedItem.findIndex(e => e.id === item.id), 1);
      } else {
        if (this.status && selected !== this.status) {
          console.log('đã vào đây');
          this.selectedItem = [];
          const type = item.type;
          console.log('type', type);
          if (type === 2) {
            this.unFollowerArray = this.unFollowerArray.map(function(e) {
              return {
                ...e
                , selected: false
              };
            });
          } else if (type === 1) {
            this.followerArray = this.followerArray.map(function(e) {
              return {
                ...e
                , selected: false
              };
            });
          }
        }
        item.selected = true;
        // this.renderer.addClass(event, 'actived');
        this.selectedItem.push(item);
      }
    } else {
      item.selected = true;
      // this.renderer.addClass(event, 'actived');
      this.selectedItem.push(item);
    }
    this.status = selected;
  }
  to_selected_array() {
    if (this.selectedItem.length === 0 || this.status === 0) {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
      return;
    }
    const newItem = this.selectedItem.slice(0);
    newItem.forEach(element => {
      const newElement = {...element};
      newElement.selected = false;
      newElement.type = 2;
      this.followerArray.unshift(newElement);
      this.unFollowerArray.splice(this.unFollowerArray.findIndex(e => e.id === element.id), 1);
    });
    this.selectedItem = [];
  }
  to_unselected_array() {
    if (this.selectedItem.length === 0 || this.status === 1) {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
      return;
    }
    const newItem = this.selectedItem.slice(0);
    newItem.forEach(element => {
      const newElement = {...element};
      newElement.selected = false;
      newElement.type = 1;
      this.unFollowerArray.unshift(newElement);
      this.followerArray.splice(this.followerArray.findIndex(e => e.id === element.id), 1);
    });
    this.selectedItem = [];
  }
  // done
  openPopupDeleteItem(item: any, dialog: TemplateRef<any>) {
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
    const url = this.defaultModel.eventAccFollowerDelete;
    const data = {
      eaf_id: this.dataUpdate.eaf_id
    };
    this.appservice.post(data, url).subscribe(
      param => {
        if (param.status === 1) {
          this.notifier.notify('success', this.language.xoa_thanh_cong);
          this.getData();
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
}
