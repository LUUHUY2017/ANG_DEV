import { IOption } from 'ng-select';   // select option <option>
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
// import viewchild
import { FootfallSettingMenuComponent } from '../../viewchild/footfallsettingmenu/footfallsettingmenu.component';
@ViewChild(FootfallSettingMenuComponent)

@Component({
  templateUrl: './import_data_in_out.component.html',
  styleUrls: ['./import_data_in_out.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ImportDataInOutComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('myInput') myInputVariable: ElementRef;
  public modalRef: BsModalRef;
  userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
  page_id = environment.Pages.general.location;
  private readonly notifier: NotifierService;
  file_upload: File;
  url = environment.apiUrl + 'exports/';
  organization_id: any;
  organization_arr: any;
  menu_tree: any[];
  snap_menu_tree: any[];
  location: any;
  site_id: any;
  siteSelectionDisplay: boolean;
  counter: number;
  counter_fail: number;
  loading: boolean;
  button = false;
  constructor(private router: Router
    , private route: ActivatedRoute
    , private appservice: AppService
    , private modalService: BsModalService
    , notifierService: NotifierService) {
    this.notifier = notifierService;
  }
  ngOnInit(): void {
    this.get_page_param();
  }
  // thay đổi tổ chức bảng
  changeorganization_table(event) {
    if (!environment.production) {
      console.log('id_or', event);
    }
    this.organization_id = event;
    this.changeorganization(event);
  }
  // Lấy thông tin tổ chức
  get_page_param() {
    this.blockUI.start('Đang tải dữ liệu...');
    this.appservice.get_user_page_parametter(this.page_id).subscribe(
      param => {
        if (!environment.production) {
          console.log('get_page_param', param);
        }
        this.organization_arr = param.organization_arr;
        this.organization_id = param.organization_arr[0].value;
        this.changeorganization(this.organization_id);
      },
      (error) => {
        this.blockUI.stop();
      },
      () => {
      }
    );
  }
  //  chọn địa điểm
  changeitem(id, site_name) {
    if (!environment.production) {
      console.log('id', id);
    }
    if (id !== 0) {
      this.site_id = id;
      this.location = site_name;
      this.siteSelectionDisplay = false;
    }
  }
  // thay đổi tổ chức trong modal thêm mới để lấy menu tree
  changeorganization(organization_id) {
    this.blockUI.start('Đang tải dữ liệu...');
    const url = environment.API.sites + '_get_site_for_report';
    const data = {
      organization_id: organization_id
    };
    this.appservice.post(data, url).subscribe(res => {
      this.menu_tree = [];
      this.recusive_menu(res.site_array);
      this.snap_menu_tree = this.menu_tree.slice(0);
      const sites = this.menu_tree.find(item => Number(item.enables) === 1 && item.parent_id !== null);
      this.location = sites.site_name;
      this.site_id = sites.id;
    },
      (error) => {
        this.blockUI.stop();
        if (!environment.production) {
          console.log(error);
        }
      },
      () => {
        this.blockUI.stop();
      }
    );
  }
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
        });
        const scope = space + 1;
        this.recusive_menu(array, a_id, scope);
      }
    });
  }
  // search menu
  search_menu(value: string) {
    // chuyển giá trị truyền vào về chữ thường để so sánh
    const string = value.toLowerCase();
    if (string === '') {
      this.menu_tree = this.snap_menu_tree;
    } else {
      this.menu_tree = this.snap_menu_tree.filter(x => x.site_name.toLowerCase().indexOf(string) !== -1);
    }
  }
  import_data(item) {
    this.blockUI.start('Đang nhập dữ liệu...');
    const data: FormData = new FormData();
    data.append('data', JSON.stringify(item.value));
    data.append('organization_id', this.organization_id);
    data.append('site_id', this.site_id);
    if (this.file_upload) { data.append('file', this.file_upload, this.file_upload.name); }
    if (!environment.production) {
      // console.log(data);
    }
    this.loading = true;
    this.button = true;
    this.counter_fail = this.counter = 0;
    this.appservice.post(data, environment.API.sp_poc_data_in_out_sum_by_site + '_import_data').subscribe(
      para => {
        if (!environment.production) {
          console.log(para);
        }
        this.loading = false;
        this.button = false;
        this.reset();
        this.counter = para.counter;
        this.counter_fail = para.counter_fail;
        if (para.status === 1) {
          this.notifier.notify('success', 'Nhập dữ liệu thành công');
        } else if (para.status === 0) {
          this.notifier.notify('error', 'Nhập dữ liệu xảy ra lỗi');
        } else if (para.status === -1) {
          this.notifier.notify('error', 'File không đúng định dạng');
        }
      },
      (error) => {
      },
      () => {
        this.blockUI.stop();
      });
  }
  upload_file(file: FileList) {
    const fileload = file[0];
    const reader = new FileReader();
    // hiện ảnh
    // reader.onload = e => this['ImageUrll' + number] = reader.result;
    // reader.readAsDataURL(fileload);
    // lên server
    this.file_upload = file.item(0);
    if (!environment.production) {
      console.log(this.file_upload);
    }
  }
  reset() {
    // console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = '';
    // console.log(this.myInputVariable.nativeElement.files);
  }
}



