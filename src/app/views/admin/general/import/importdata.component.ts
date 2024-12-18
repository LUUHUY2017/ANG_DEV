import { IOption } from 'ng-select';   // select option <option>
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { language } from '../../../../language';
import { language_en } from '../../../../language_en';
// import viewchild
import { GeneralMenuComponent } from '../../../viewchild/generalmenu/generalmenu.component';
declare function intDateRangePicker_viewchild(start_date, end_date): any;
@Component({
  templateUrl: './importdata.component.html',
  styleUrls: ['./importdata.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
@ViewChild(GeneralMenuComponent)
export class GeneralImportDataComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('myInput') myInputVariable: ElementRef;
  public modalRef: BsModalRef;
  userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
  page_id = environment.Pages.general.location;
  private readonly notifier: NotifierService;
  file_upload: File;
  url = environment.apiUrl + 'import/';
  organization_id: any;
  organization_arr: any;
  counter_fail: number; counter: number;
  num_to_enter = false; num_to_exit = false; avg_time = false; passer_by = false; staff = false; staff_traffic = false; kids_visits = false;
  transactions = false; sales = false; items = false; loyal_visits = false; loyal_purchased = false; cx_index = false; nps_index = false;
  menu_tree: any[];
  snap_menu_tree: any[];
  location: any;
  site_id: any;
  site_code: string;
  siteSelectionDisplay: boolean;
  loading: boolean;
  button = false;
  btnApplyValid = false;
  start_date: any;
  end_date: any;
  style_start_date: any;
  style_end_date: any;
  url_api = environment.apiUrl + 'exports/';
  name_of_excel: any;
  time_generate_report = new Date();
  status = 1;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  destinationSelectedItems = [];
  destinationIndexOptionSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: false
  };
  store: number;
  constructor(private router: Router
    , private route: ActivatedRoute
    , private appservice: AppService
    , private modalService: BsModalService
    , notifierService: NotifierService) {
    this.notifier = notifierService;
  }
  dropdownList = [];
  IndexOptionList = [
    { label: 'Passer_by', value: 'Passer_by' },
    { label: 'Enter', value: 'Enter' },
    { label: 'Exits', value: 'Exits' },
    { label: 'Time_spent', value: 'Time_spent' },
    { label: 'Staff_traffic', value: 'Staff_traffic' },
    { label: 'Kids_visits', value: 'Kids_visits' },
    { label: 'Staff', value: 'Staff' },
    { label: 'Transactions', value: 'Transactions' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Items', value: 'Items' },
    { label: 'Loyal_visits', value: 'Loyal_visits' },
    { label: 'Loyal_purchased', value: 'Loyal_purchased' },
  ];
  language: any;
  ngOnInit(): void {
    const type_language = JSON.parse(localStorage.getItem(environment.language));
    type_language === 'vn' ? this.language = language : this.language = language_en;
    this.get_page_param();
    intDateRangePicker_viewchild(Number(new Date()), Number(new Date()));
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
    const url = environment.API.userGetOrg;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.get(url).subscribe(
      param => {
        if (!environment.production) {
          console.log('get_page_param', param);
        }
        this.organization_arr = param.organization_arr;
        this.organization_id = param.organization_arr[0].value;
        this.changeorganization(this.organization_id);
        const time_on_now = new Date();
        this.start_date = this.appservice.convert_date_tostringdate_by_nghia(time_on_now);
        this.end_date = this.appservice.convert_date_tostringdate_by_nghia(time_on_now);
        (document.getElementById('startDateReportTemp') as HTMLInputElement).value = this.start_date;
        (document.getElementById('endDateReportTemp') as HTMLInputElement).value = this.end_date;
        try {
          this.dropdownList = [];
          this.IndexOptionList.forEach((element, index) => {
            this.dropdownList.push({
              item_id: index
              , item_text: element.value
              , visible: true
            });
          });
          this.destinationSelectedItems = this.dropdownList.filter((item) => {
            let boolean: boolean;
            [0, 1, 2].forEach((element, index, array) => {
              if (item.item_id === element) {
                boolean = true;
              }
              if (index === (array.length - 1) && boolean === undefined) {
                boolean = false;
              }
            });
            return boolean;
          });
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
      }, () => {
        this.blockUI.stop();
      }
    );
  }

  //  chọn địa điểm
  changeitem(item) {
    if (!environment.production) {
      console.log('id', item.id);
    }
    if (item.id !== 0) {
      this.site_id = item.id;
      this.site_code = item.site_code;
      this.location = item.site_name;
      this.store = item.store;
      this.siteSelectionDisplay = false;
    }
  }

  // thay đổi tổ chức trong modal thêm mới để lấy menu tree
  changeorganization(organization_id) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.sites + '_get_site_for_report';
    const data = {
      organization_id: organization_id
    };
    this.appservice.post(data, url).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }
      try {
        this.menu_tree = [];
        this.recusive_menu(res.site_array);
        this.menu_tree.shift();
        this.snap_menu_tree = this.menu_tree.slice(0);
        const sites = this.menu_tree.find(item => Number(item.enables) === 1 && item.parent_id !== null);
        this.location = sites.site_name;
        this.site_id = sites.id;
        this.site_code = sites.site_code;
        this.store = sites.store;
      } catch (error) {
        this.blockUI.stop();
      }
    }, (error) => {
      this.blockUI.stop();
      if (!environment.production) {
        this.blockUI.stop();
      }
    }, () => {
      this.blockUI.stop();
    }
    );
  }

  recusive_menu(array: any[], id = null, space = 0) {
    try {
      array.forEach(element => {
        if (element.parent_id === id) {
          const a_id = element.id;
          this.menu_tree.push({
            id: element.id
            , site_name: element.site_name
            , site_code: element.site_code
            , parent_id: element.parent_id
            , store: element.store
            , alevel: space
            , enables: element.enables
          });
          const scope = space + 1;
          this.recusive_menu(array, a_id, scope);
        }
      });
    } catch (error) {
      this.blockUI.stop();
    }

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
  download_file_example() {
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const indexOption = [];
    this.destinationSelectedItems.forEach(element => {
      indexOption.push(element.item_text);
    });
    this.start_date = ((document.getElementById('startDateReportTemp') as HTMLInputElement).value).replace(/[']/g, '');
    this.end_date = ((document.getElementById('endDateReportTemp') as HTMLInputElement).value).replace(/[']/g, '');
    const data = {
      organization_id: this.organization_id
      , site_code: this.site_code
      , site_id: this.site_id
      , start_date: this.start_date
      , end_date: this.end_date
      , indexOption: indexOption
    };
    if (!environment.production) {
      console.log('data', data);
    }
    this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_download_file_import').subscribe(fileData => {
      try {
        window.open(this.url_api + fileData);
        this.name_of_excel = fileData;
      } catch (error) {
        this.blockUI.stop();
        this.notifier.notify('error', this.language.qua_trinh_export);
      }
      if (!environment.production) {
        console.log('Successed');
      }
    }, (error) => {
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      const data2 = {
        name_of_excel: this.name_of_excel
      };
      const url = environment.FBA.API.export_metrics_analytic + '_delete_excel';
      this.appservice.post(data2, url).subscribe(res => {
        if (!environment.production) {
          console.log('Deleted');
        }
      });
    }
    );
  }
  // show modal mật khẩu
  show_dialog_(password: TemplateRef<any>) {
    this.modalRef = this.modalService.show(password, this.config);
  }
  import_data(item) {
    if (this.file_upload === undefined || this.file_upload === null || this.myInputVariable.nativeElement.value === '') {
      alert(this.language.vui_long_chon_file);
    } else {
      const answer = confirm(this.language.qua_trinh_nhap_du_lieu);
      if (answer) {
        const data: FormData = new FormData();
        data.append('data', JSON.stringify(item.value));
        data.append('organization_id', this.organization_id);
        if (this.file_upload) { data.append('file', this.file_upload, this.file_upload.name); }
        if (!environment.production) {
          console.log(JSON.stringify(item.value), this.organization_id);
        }
        this.button = this.loading = true;
        this.counter_fail = this.counter = 0;
        this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_insert_data').subscribe(
          para => {
            if (!environment.production) {
              console.log(para);
            }
            this.counter = para.counter;
            this.counter_fail = para.counter_fail;
            this.time_generate_report = new Date();
            if (para.status === 1) {
              this.notifier.notify('success', this.language.nhap_du_lieu_thanh_cong);
            } else if (para.status === 0) {
              this.notifier.notify('error', this.language.co_loi_xay_ra);
            } else if (para.status === -1) {
              this.notifier.notify('error', this.language.file_khong_dung_dinh_dang);
            }
          }, (error) => {
          }).add(() => {
            this.loading = this.button = false;
            this.myInputVariable.nativeElement.value = '';
          });
      }
    }
  }

  upload_file(file: FileList) {
    const fileload = file[0];
    const reader = new FileReader();
    this.file_upload = file.item(0);
    if (!environment.production) {
      console.log(this.file_upload);
    }
  }

  destinationOnSelect(item: any) {
    this.validate_source_destination_index();
  }
  destinationOnDeSelect(items: any) {
    this.validate_source_destination_index();
  }
  destinationOnSelectAll(items: any) {
    // this.validate_source_destination_index();
    this.btnApplyValid = false;
  }
  destinationOnDeSelectAll(items: any) {
    // this.validate_source_destination_index();
    this.btnApplyValid = true;
  }
  validate_source_destination_index() {
    this.btnApplyValid = !(this.destinationSelectedItems.length > 0);
  }

  // đổi số status cho tep by tep
  changetab(e) {
    this.status = e;
  }

  push_alert() {
    alert(this.language.vui_long_chon_cua_hang);
  }
}



