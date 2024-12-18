import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralMenuComponent } from '../../../viewchild/generalmenu/generalmenu.component';
import { NgForm, NgModel } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { language } from '../../admin_language';
import { language_en } from '../../admin_language_en';
@Component({
  templateUrl: './blacklistmanager.component.html',
  styleUrls: ['./blacklistmanager.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})
@ViewChild(GeneralMenuComponent)
export class BlacklistManagerComponent implements OnInit {
  @ViewChild('update_staff_avatar') update_staff_avatar: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  public modalRef: BsModalRef;
  userInfo: Object; // thông tin người dùng
  // biến dành cho phần thêm ảnh thư viện
  library: Array<any>;
  activeRecord: Object;
  imageSource: string | Blob;
  // biến dùng cho load dữ liệu, thêm sửa xóa
  organizationArray: Array<any>;
  organizationId: number;
  urlImage: string; // đường dẫn lấy ảnh đại diện
  ImageUrll1: string | ArrayBuffer; // ảnh khi thêm mới, hoặc sửa
  dataUpdate: any;
  searchKey: string;
  siteSelectionDisplay: boolean; // trạng thái bật tắt của nút lọc site
  siteFilterDisplay: boolean; // trạng thái bật tắt của nút lọc site trong phần thêm nhân viên, sửa nhân viên  //= false
  canAdd: boolean; // trạng thái nút thêm mới
  data: Array<any>;
  dataFilter: Array<any>;
  webState: BehaviorSubject<any>;
  subcription: any;
  oldState: string;
  siteFilterModel: any;
  optionDelete: number;
  errorArray: Array<any>;
  recordDate: string;
  sourceUrl: string;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  language: any;
  constructor(private router: Router
    , notifierService: NotifierService
    , private appservice: AppService
    , private modalService: BsModalService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.notifier = notifierService;
  }
  ngOnInit(): void {
    this.set_default_value();
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    this.watchStateChange();
    this.get_organization();
  }
  watchStateChange() {
    this.subcription = this.webState.asObservable();
    this.subcription.subscribe(res => {
      const currentState = res.state;
      const item = res.data;
      // Đây là sự kiện khi vừa load trang get data về CRUD
      if (currentState === environment.STATE.retrieve) {
        // Sự kiện nhận dữ liệu về thì bỏ hành động tìm kiếm trước đó
        this.searchKey = null;
        this.data = item;
        this.dataFilter = this.data;
        // Nếu là sự kiện thêm mới
      } else if (currentState === environment.STATE.insert) {
        this.data.unshift(item);
        // Nếu trạng thái trước đó là search
        if (this.oldState === environment.STATE.search) {
          this.updateState(environment.STATE.search);
        }
        this.notifier.notify('success', this.language.them_moi_thanh_cong);
        // nếu là sự kiện sửa
      } else if (currentState === environment.STATE.update) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].id === item.id) {
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
        const string = this.searchKey ? this.searchKey.toLowerCase() : '';
        // console.log(string);
        if (string === '') {
          this.dataFilter = this.data;
        } else {
          this.dataFilter = this.data.filter(x => x.blacklist_name.toLowerCase().indexOf(string) !== -1
            || x.phone.toLowerCase().indexOf(string) !== -1);
        }
      }
    });
  }
  preventChange() {
    this.modalRef.hide();
    this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
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
  set_default_value() {
    this.userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
    this.siteSelectionDisplay = false;
    this.siteFilterDisplay = false;
    this.organizationArray = [];
    this.data = [];
    this.dataFilter = [];
    this.dataUpdate = null;
    this.canAdd = false;
    this.searchKey = null;
    this.urlImage = environment.apiUrl + 'images/blacklist/';
    this.optionDelete = 0;
    this.recordDate = null;
    this.sourceUrl = environment.API.black_list;
  }
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
        this.organizationArray = org;
        this.organizationId = param.organization_arr[0].value;
        this.get_data();
      },
      (error) => {
        if (!environment.production) {
          // console.log(error);
        }
        this.notifier.notify('error', this.language.co_loi_xay_ra);
        this.blockUI.stop();
      });
  }
  get_data() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organizationId
      , deleted: this.optionDelete
    };
    if (!environment.production) {
      // console.log('data gửi đi', data);
    }
    this.appservice.post(data, this.sourceUrl).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }
      this.canAdd = true;
      this.recordDate = res.recordDate;
      this.updateState('retrieve', res.retrieveData);
    },
      (error) => {
        if (!environment.production) {
          // console.log(error);
        }
        this.notifier.notify('error', this.language.co_loi_xay_ra);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  show_insert(template: TemplateRef<any>) {
    this.openModal(template);
    this.ImageUrll1 = null;
    console.log(this.ImageUrll1);
    this.errorArray = [];
    this.imageSource = null;
  }
  show_update(item: any, template: TemplateRef<any>) {
    this.dataUpdate = item;
    this.openModal(template);
    this.errorArray = [];
    this.imageSource = null;
  }
  // Hàm đệ quy menu
  // click hiện modal
  openModal(templates: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  InsertUpload(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.imageSource = file;
      reader.onload = (target) => {
        this.ImageUrll1 = reader.result;
      };
      event.target.value = '';
    }
  }
  UpdateUpload(event, update_staff_avatar) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.imageSource = file;
      reader.onload = (target) => {
        update_staff_avatar.src = reader.result;
      };
      event.target.value = '';
    }
  }
  insertform(form: NgForm) {
    if (form.invalid) {
      this.notifier.notify('error', this.language.co_loi_xay_ra);
      return;
    }
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const formData = new FormData();
    formData.append('organization_id', form.value.organization_id);
    formData.append('blacklist_name', form.value.blacklist_name);
    if (this.imageSource) {
      formData.append('avatar', this.imageSource);
    }
    const url = this.sourceUrl + '_insert';
    this.appservice.post(formData, url).subscribe(
      res => {
        if (!environment.production) {
          // console.log('dữ liệu gửi về', res);
        }
        if (res.message === 1) {
          delete res.insertedData.id;
          const transData = { ...res.insertedData, id: res.insertedData.gid };
          this.updateState(environment.STATE.insert, transData);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
          // console.log(this.error_array);
        }
      },
      (error) => {
        this.errorArray = [this.language.khong_the_ket_noi_may_chu];
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // truyền dữ liệu popup
  getLibraryData(item: any, template: TemplateRef<any>) {
    // set default when open popup
    this.library = [];
    this.activeRecord = null;
    this.errorArray = [];
    // end set default
    this.dataUpdate = item;
    const data = {
      organization_id: this.organizationId
      , site_id: item.site_id
      , id: this.dataUpdate.id
      , type: 'blacklist_img'
    };
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    this.appservice._netPost(data, environment._netAPI.admin_staff_vip_blacklist_get_image).subscribe(res => {
      this.library = res.images;
      this.library.forEach((element: any, k: number) => {
        const stats = k + 1;
        element.image_name = this.language.anh_so + stats;
      });
      this.activeRecord = this.library[0];
      this.openModal(template);
    }, (error) => {
      this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu);
    }).add(() => {
      this.blockUI.stop();
    });
  }
  updateform(form: NgForm) {
    if (form.invalid) {
      this.notifier.notify('error', this.language.co_loi_xay_ra);
      return;
    }
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const formData = new FormData();
    formData.append('id', form.value.id);
    formData.append('blacklist_name', form.value.blacklist_name);
    formData.append('actived', form.value.actived);
    if (this.imageSource) {
      formData.append('avatar', this.imageSource);
    }
    const url = this.sourceUrl + '_update';
    this.appservice.post(formData, url).subscribe(
      res => {
        if (!environment.production) {
          // console.log('dữ liệu gửi về', res);
        }
        if (res.message === 1) {
          delete res.updatedData.id;
          const transData = { ...res.updatedData, id: res.updatedData.gid };
          // console.log(transData);
          this.updateState(environment.STATE.update, transData);
          this.modalRef.hide();
        } else {
          this.errorArray = this.appservice.validate_error(res);
          // console.log(this.error_array);
        }
      },
      (error) => {
        this.errorArray = [this.language.khong_the_ket_noi_may_chu];
      }).add(() => {
        this.blockUI.stop();
      });
  }
  change_site(item: any) {
    if (item.enables !== '1') {
      this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
      return;
    }
    // Nếu chọn site là cửa hàng thì được phép thêm mới
    if (item.store === '1') {
      this.canAdd = true;
    } else {
      this.canAdd = false;
    }
    this.siteFilterModel = item;
    this.siteFilterDisplay = false;
    this.get_data();
  }
  search_item(searchString: string) {
    this.searchKey = searchString;
    this.updateState(environment.STATE.search);
  }
  show_delete(item: any, template: TemplateRef<any>) {
    this.dataUpdate = item;
    this.openModal(template);
  }
  soft_delete_object() {
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const data = {
      id: this.dataUpdate.id
      , type: 'blacklist'
    };
    const url = environment._netAPI.admin_staff_vip_blacklist_soft_delete;
    this.appservice._netPost(data, url).subscribe(
      param => {
        if (param.status) {
          this.updateState('delete', this.dataUpdate);
        } else {
          this.notifier.notify('error', this.language.loi_xu_ly_server);
        }
      },
      (error) => {
        this.notifier.notify('error', this.language.co_loi_xay_ra);
      }).add(() => {
        this.modalRef.hide();
        this.blockUI.stop();
      });
  }
  delete_object() {
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const data = {
      id: this.dataUpdate.id
      , type: 'blacklist'
    };
    const url = environment._netAPI.admin_staff_vip_blacklist_delete;
    this.appservice._netPost(data, url).subscribe(
      param => {
        if (param.status) {
          this.updateState('delete', this.dataUpdate);
        } else {
          this.notifier.notify('error', this.language.loi_xu_ly_server);
        }
      },
      (error) => {
        this.notifier.notify('error', this.language.co_loi_xay_ra);
      }).add(() => {
        this.modalRef.hide();
        this.blockUI.stop();
      });
  }
  trigger_click(upload) {
    const event: Event = new Event('click');
    upload.click();
  }
  getUploadData(event) {
    if (event.target.files && event.target.files[0]) {
      // xét biến lỗi về mặc định
      this.errorArray = [];
      //
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (target) => {
        this.blockUI.start(this.language.dang_xu_ly_du_lieu);
        const data = {
          organization_id: this.organizationId
          , id: this.dataUpdate.id
          , type: 'blacklist_img'
          , list_image_face: [{
            id: '00000000-0000-0000-0000-000000000000'
            , image_base64: String(reader.result).replace('data:image/jpeg;base64,', '')
          }]
        };
        const _netUrl = environment._netAPI.admin_staff_vip_blacklist_add_image;
        this.appservice._netPost(data, _netUrl).subscribe(
          para => {
            if (!environment.production) {
              console.log('dữ liệu gửi về', para);
            }
            if (para.status) {
              const requestData = {
                organization_id: this.organizationId
                , site_id: this.dataUpdate.site_id
                , id: this.dataUpdate.id
                , type: 'blacklist_img'
              };
              this.blockUI.start(this.language.dang_xu_ly_du_lieu);
              this.appservice._netPost(requestData, environment._netAPI.admin_staff_vip_blacklist_get_image).subscribe(res => {
                this.library = res.images;
                this.library.forEach((element: any, k: number) => {
                  element.image_name = this.language.anh_so + k;
                });
                this.activeRecord = this.library[0];
              }, (error) => {
                this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu);
              }).add(() => {
                this.blockUI.stop();
              });
            } else {
              this.errorArray = [this.language.anh_khong_du_tieu_chuan];
            }
          },
          (error) => {
            if (!environment.production) {
              console.log(error);
            }
          }).add(() => {
            this.blockUI.stop();
          });
      };
      event.target.value = '';
    }
  }
  delete_from_library(active_record: any, uploadform) {
    const c = confirm(this.language.ban_dong_y_xoa);
    if (c) {
      // Xét biến lỗi về mặc định
      this.errorArray = [];
      //
      const data = {
        id: active_record.id
        , staff_id: this.dataUpdate.id
        , type: 'blacklist_img'
      };
      this.appservice._netPost(data, environment._netAPI.admin_staff_vip_blacklist_delete_image).subscribe(para => {
        if (para.status) {
          const requestData = {
            organization_id: this.organizationId
            , id: this.dataUpdate.id
            , type: 'blacklist_img'
          };
          this.appservice._netPost(requestData, environment._netAPI.admin_staff_vip_blacklist_get_image).subscribe(res => {
            this.library = res.images;
            this.library.forEach((element: any, k: number) => {
              const stats = k + 1;
              element.image_name = this.language.anh_so + stats;
            });
            this.activeRecord = this.library[0];
          }, (error) => {
            this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu);
          }).add(() => {
            this.blockUI.stop();
          });
        } else {
          this.errorArray = [this.language.qua_trinh_xu_ly_anh_khong_thanh_cong];
        }
      }, (error) => {
        this.errorArray = [this.language.khong_the_ket_noi_may_chu];
      }).add(() => {
        this.blockUI.stop();
      });
    }
  }

}



