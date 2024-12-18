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
// import viewchild
import { AgeMenuComponent } from '../../../viewchild/agemenu/agemenu.component';
// import notification
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { language } from '../../../admin/admin_language';
import { language_en } from '../../../admin/admin_language_en';
@ViewChild(AgeMenuComponent)

@Component({
  templateUrl: './webhookage.component.html',
  styleUrls: ['./webhookage.component.scss'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class WebhookageComponent implements OnInit, OnDestroy {
  @ViewChild('dataTable') table: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  can_add: boolean;
  can_update: boolean;
  can_delete: boolean;
  // Khai báo kiểu dữ kiệu
  public data: any;
  data_filter: any;
  data_update: any;
  organization_id: string;
  organization_arr: Array<IOption>;
  modalRef: BsModalRef;
  // phân trang bảng
  rowsOnPage = 15;
  SelectionDisplay: boolean;
  menu_tree: any;
  siteSelectionDisplay: boolean;
  userlogged = JSON.parse(localStorage.getItem(environment.UserLoged));
  webState: BehaviorSubject<any>;
  showSelectCrud: boolean;
  subcription: any;
  tu_khoa: any;
  option_delete: number;
  oldState: string;
  siteSelected: any;
  error_array: any[];
  delete_object: any;
  language: any;
  siteFilterModel: any;
  siteFilterDisplay: boolean;
  module_id: number;
  codeText: string;
  codeOptions: any = {
    maxLines: 1000,
    printMargin: false,
    wrap: true
  };
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    notifierService: NotifierService,
    private appservice: AppService,
    private modalService: BsModalService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;

    this.notifier = notifierService;
  }
  ngOnInit(): void {
    this.codeText = 'event: "vip_info",\n\message: {\n\
      \tcustomer_name: "Nguyễn Công Quyết"\n\
      \t, phone_number: "0904 838 565"\n\}';
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    this.get_organization();
    this.setDefaultValue();
    this.watchStateChange();
    this.set_default_crud(false);
  }
  watchStateChange() {
    this.subcription = this.webState.asObservable();
    this.subcription.subscribe(res => {
      const currentState = res.state;
      const item = res.data;
      // console.log('trạng thái trước', this.oldState);
      // console.log('trạng thái hiện tại', currentState);
      // Đây là sự kiện khi vừa load trang get data về
      if (currentState === environment.STATE.retrieve) {
        // Sự kiện nhận dữ liệu về thì bỏ hành động tìm kiếm trước đó
        this.tu_khoa = null;
        this.data = item;
        this.data_filter = this.data;
        // Nếu là sự kiện thêm mới
      } else if (currentState === environment.STATE.insert) {
        this.data.push(item);
        // Nếu trạng thái trước đó là search
        if (this.oldState === environment.STATE.search) {
          this.updateState(environment.STATE.search);
        }
        this.notifier.notify('success', this.language.them_moi_thanh_cong);
        // nếu là sự kiện sửa
      } else if (currentState === environment.STATE.update) {
        for (let i = 0; i < this.data.length; i++) {
          if (Number(this.data[i].id) === Number(item.id)) {
            this.data[i] = item;
            break;
          }
        }
        // Nếu trạng thái trước đó là search
        if (this.oldState === environment.STATE.search) {
          this.updateState(environment.STATE.search);
        }
        this.notifier.notify('success', this.language.cap_nhat_thanh_cong);
        // Nếu là sự kiện xóa
      } else if (currentState === environment.STATE.delete) {
        this.data.splice(this.data.findIndex(e => e.id === item.id), 1);
        // Nếu trạng thái trước đó là search
        if (this.oldState === environment.STATE.search) {
          this.updateState(environment.STATE.search);
        }
        this.notifier.notify('success', this.language.xoa_thanh_cong);
        // Nếu có sự kiện tìm kiếm
      } else if (currentState === environment.STATE.search) {
        const string = this.tu_khoa ? this.tu_khoa.toLowerCase() : '';
        // console.log(string);
        if (string === '') {
          this.data_filter = this.data;
        } else {
          this.data_filter = this.data.filter(x => x.webhook_name.toLowerCase().indexOf(string) !== -1);
        }
      }
    });
  }
  showSelectFunc() {
    this.showSelectCrud = false;
    const lever = Number(this.userlogged.lever);
    const org_id = Number(this.userlogged.organization_id);
    if (lever === 0 && org_id === 0) {
      this.showSelectCrud = true;
    }
  }
  set_default_crud(bool: boolean) {
    this.can_add = bool;
    this.can_update = bool;
    this.can_delete = bool;
  }
  search_organization() {
    this.tu_khoa = null;
    this.get_site();
  }
  site_filter(item: any) {
    this.tu_khoa = null;
    this.siteFilterModel = item;
    this.siteFilterDisplay = true;
    this.get_data();
  }
  change_delete_option() {
    this.tu_khoa = null;
    this.get_data();
  }
  setDefaultValue() {
    this.data_filter = [];
    this.data = [];
    this.data_update = null;
    this.error_array = [];
    this.option_delete = 0;
    this.siteFilterDisplay = true;
    this.siteFilterModel = null;
    this.module_id = 3;
  }
  // Hàm đệ quy menu
  recusive_menu(array: any[], id = null, space = 0) {
    array.forEach(element => {
      if (element.parent_id === id) {
        const a_id = element.id;
        this.menu_tree.push({
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
  get_organization() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.userGetOrg;
    this.appservice.get(url).subscribe(
      param => {
        if (!environment.production) {
          // console.log('get_user_page_parametter', param);
        }
        if ('message' in param) {
          this.notifier.notify('error', this.language.co_loi_xay_ra);
          return;
        }
        const org = param.organization_arr.slice(0);
        this.organization_arr = org;
        this.organization_id = param.organization_arr[0].value;
        this.get_site();
      },
      (error) => {
        if (!environment.production) {
          // console.log(error);
        }
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu);
        this.blockUI.stop();
      });
  }
  // Thay đổi tổ chức header của bảng
  changeorganization_table(event) {
    if (!environment.production) {
      console.log('mã tổ chức', event);
    }
    this.organization_id = event;
    this.get_site();
  }
  // Modal hỏi xóa
  modal_question(item, dialog: TemplateRef<any>) {
    if (!environment.production) {
      console.log('dữ liệu từng bản ghi', item);
    }
    // this.delete_tablet_id = item;
    this.modalRef = this.modalService.show(dialog, {
      backdrop: true,
      ignoreBackdropClick: true
    });
    this.delete_object = item;
  }
  // Open Modal thêm mới
  open_modal_them_moi(templates: TemplateRef<any>) {
    this.siteSelected = null;
    this.error_array = [];
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  //  Hành động click chọn site ở menu tree thêm mới
  change_site_seleted(organization_id, item) {
    if (!environment.production) {
      console.log('id', item);
    }
    if (item.store === '0' || item.enables === '0') {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.co_loi_xay_ra);
      return;
    }
    this.siteSelected = item;
    this.siteSelectionDisplay = false;
  }
  open_modal_update(item, template: TemplateRef<any>) {
    if (!environment.production) {
      console.log('dữ liệu từng bản ghi', item);
    }
    this.error_array = [];
    this.data_update = Object.assign({}, item);
    const site_id = item.site_id;
    this.siteSelected = this.menu_tree.find(e => e.id === site_id);
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  open_modal_webhook(template: TemplateRef<any>) {
    this.error_array = [];
    // this.data_update = Object.assign({}, item);
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  get_site() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.menu_tree = [];
    const url = environment.API.sites + '_get_site_with_permission';
    const data = {
      organization_id: this.organization_id
      , deleted: 0
    };
    this.appservice.post(data, url).subscribe(
      param => {
        if (!environment.production) {
          console.log('get_site_tree', param);
        }
        if (param.site_in_role.length === 0) {
          this.notifier.notify('warning', this.language.co_loi_xay_ra);
          this.blockUI.stop();
          return;
        }
        this.recusive_menu(param.site_in_role);
        this.siteFilterModel = this.menu_tree.find(i => i.enables === '1');
        this.get_data();
      },
      (error) => {
        if (!environment.production) {
          // console.log(error);
        }
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu);
        this.blockUI.stop();
      });
  }
  get_data() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organization_id
      , deleted: this.option_delete
      , module_id: this.module_id
      , site_id: this.siteFilterModel.id
    };
    const url = environment.API.sp_get_web_hook;
    if (!environment.production) {
      // console.log('data gửi đi', data);
    }
    this.appservice.post(data, url).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }
      this.set_default_crud(true);
      this.updateState('retrieve', res.webhookArray);
    },
      (error) => {
        if (!environment.production) {
          // console.log(error);
        }
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // thêm thiết bị
  insert_object(item) {
    if (item.invalid) {
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    const url = environment.API.sp_get_web_hook + '_insert';
    const location_id = item.value.location_id;
    const data = {
      ...item.value
      , site_id: this.siteFilterModel.id
    };
    // xét error về rỗng.
    this.error_array = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    this.appservice.post(data, url).subscribe(
      res => {
        if (!environment.production) {
          console.log('dữ liệu gửi về', res);
        }
        if (res.message === 1) {
          delete res.insertedData.id;
          const transData = { ...res.insertedData, id: res.insertedData.gid };
          // console.log('transData', transData);
          this.updateState(environment.STATE.insert, transData);
          this.modalRef.hide();
        } else {
          this.error_array = this.appservice.validate_error(res);
          // console.log(this.error_array);
        }
      },
      (error) => {
        this.error_array = [this.language.khong_the_ket_noi_may_chu];
      }).add(() => {
        this.blockUI.stop();
      });
  }
  callWebhookApi() {
    const sendData = {
      organization_id: this.organization_id
      , data: {
        event: 'vip_info',
        message: {
          customer_name: 'Nguyễn Công Quyết'
          , phone_number: '0904 838 565'
        }
      }
    };
    this.error_array = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = 'api/web_hook';
    this.appservice.post(sendData, url).subscribe(
      res => {
        if (!environment.production) {
          console.log('dữ liệu gửi về', res);
        }
        if (res.status === 1) {
          this.notifier.notify('success', 'Success!');
        } else {
          this.notifier.notify('error', 'Error!');
        }
      },
      (error) => {
        this.notifier.notify('error', 'Error!');
      }).add(() => {
        this.blockUI.stop();
      });
  }
  preventChange() {
    this.modalRef.hide();
    this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
  }
  // cập nhật thiết bị
  update_object(item) {
    if (!environment.production) {
      console.log(item);
    }
    if (!item.dirty) {
      this.notifier.notify('warning', this.language.loi_du_lieu_khong_the_thay_doi);
      return;
    }
    this.error_array = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = environment.API.sp_get_web_hook + '_update';
    this.appservice.post(item.value, url).subscribe(
      res => {
        if (!environment.production) {
          console.log('dữ liệu gửi về', res);
        }
        if (res.message === 1) {
          this.updateState(environment.STATE.update, res.updatedData);
          // this.data_filter = res.updatedData;
          this.get_data();
          // this.notifier.notify('success', 'Cập nhật thành công');
          // this.modalRef.hide();
        } else {
          this.error_array = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.error_array = [this.language.khong_the_ket_noi_may_chu];
      }).add(() => {
        this.blockUI.stop();
      });
  }
  search_table(searchString: string) {
    this.tu_khoa = searchString;
    this.updateState(environment.STATE.search);
  }
  soft_delete_item() {
 this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = environment.API.sp_get_web_hook + '_soft_delete';
    const data = {
      id: this.delete_object.id
      , deleted: this.delete_object.deleted
    };
    this.appservice.post(data, url).subscribe(
      param => {
        if (param.message === 1) {
          this.updateState('delete', this.delete_object);
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
  clone_item(item: any) {
    console.log(item);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = item.access_token;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notifier.notify('success', 'Success!');
  }
  delete_item() {
 this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = environment.API.sp_get_web_hook + '_delete';
    const data = {
      id: this.delete_object.id
    };
    this.appservice.post(data, url).subscribe(
      param => {
        if (param.message === 1) {
          this.updateState('delete', this.delete_object);
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
  ngOnDestroy() {
    this.webState.complete();
  }
}
