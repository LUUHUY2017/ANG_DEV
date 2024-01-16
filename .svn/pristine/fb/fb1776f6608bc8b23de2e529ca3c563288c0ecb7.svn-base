import { IOption } from 'ng-select';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';

// highcharts
import Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import Tree from 'highcharts/modules/treemap';
import Heatmap from 'highcharts/modules/heatmap';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StoreReportingFFScheduleComponent } from '../../useremailmodule/footfall/storereporting/storereporting.component';
import { NotifierService } from 'angular-notifier';
// chỉnh css angular
// import { ViewEncapsulation } from '@angular/core';
More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);
// thêm mới dateranger
declare var $;
declare function intDateRangePicker_viewchild(start_date, end_date): any;
@Component({
  selector: 'app-age-visit',
  templateUrl: './age-visit.component.html',
  styleUrls: [
    './age-visit.component.scss',
    './age-visit.component.css'
  ],
  // chỉnh css angular
  // encapsulation: ViewEncapsulation.None
})
export class AgeVisitComponent implements OnInit {
  @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
  defaultModule = 3;
  indexViewBy: number;
  currentPageId = environment.Pages.age.visit;
  page_id = '\'' + environment.Pages.age.visit + '\'';
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('content') public helloTemplate: ElementRef;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  time_generate_report = new Date();

  // public navItems = navItems;
  public sidebarMinimized = true;
  public modalRef: BsModalRef;
  public element: HTMLElement = document.body;
  name_of_excel: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(private router: Router, private appservice: AppService, private modalService: BsModalService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
  }
  organization_id: number;
  snap_menu_tree: any;

  siteSelectionDisplay = false;
  siteSelectionDisplay2 = false;
  locationSelectionDisplay = false;
  start_date: any;
  end_date: any;
  site_id: number;
  style_start_date: any;
  style_end_date: any;

  startTimeOption: Array<IOption>;
  endTimeOption: Array<IOption>;
  startTime: string;
  endTime: string;

  time_period: string;
  title_time_period: string;
  time_period2: string;
  location: string;
  title_location: string;

  data: any;
  time_value: string;
  fba_time_period_overview: any;
  menu_tree: any;
  hidden_menu_location = false;
  indexOption: Array<IOption>;
  organization_arr_option: Array<IOption>;
  indexOptionSelected: string;
  has_site: number;
  /*----------  Giá trị mặc định  ----------*/
  age18 = 0; age18_female = 0; age18_male = 0; age18_unknown = 0;
  age18_24 = 0; age18_24_female = 0; age18_24_male = 0; age18_24_unknown = 0;
  age25_34 = 0; age25_34_female = 0; age25_34_male = 0; age25_34_unknown = 0;
  age35_44 = 0; age35_44_female = 0; age35_44_male = 0; age35_44_unknown = 0;
  age45_54 = 0; age45_54_female = 0; age45_54_male = 0; age45_54_unknown = 0;
  age55_64 = 0; age55_64_female = 0; age55_64_male = 0; age55_64_unknown = 0;
  age65 = 0; age65_female = 0; age65_male = 0; age65_unknown = 0;
  unknown = 0; unknown_female = 0; unknown_male = 0; unknown_unknown = 0;
  total_age = 0; total_female = 0; total_male = 0; total_unknown = 0; total_noun = 0;
  viewDataBy = 'Week';
  url_api = environment.apiUrl + 'exports/';
  startt: string;
  endt: string; language: any; show_error = false;

  /*----------  ngOnInit  ----------*/
  // Page visits
  ngOnInit() {
    const self = this;
    this.get_location_time();
    this.show_menu_location();
    intDateRangePicker_viewchild(Number(new Date()), Number(new Date()));
    $(function () {
      $('#endDateReportTemp').change(function () {
        self.date_ranger_event();
      });
      $('#reportrangefba').on('apply.daterangepicker').click(function () {
        self.date_ranger_event();
      });
    });
  }


  push_notification() {
    if (this.modalRef == null || this.modalRef === undefined) {
      this.modalRef = this.modalService.show(this.helloTemplate, {
        // backdrop: true,
        // ignoreBackdropClick: true
        keyboard: true,
      });
    }
  }

  // Children
  submitChange() {
    this.reCheckExistParams();
    this.time_change();
  }
  sendParamToChildren(event) {
    console.log('site_id 1111', this.site_id);
    const dataFromParent = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: this.startTime
      , end_time: this.endTime
      , view_by: this.viewDataBy
    };
    const indexViewBy = this.indexViewBy ? this.indexViewBy : 1;
    this.scheduleComponent.getParametter(dataFromParent, indexViewBy);
  }
  reCheckExistParams() {
    const dataFromParent = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: this.startTime
      , end_time: this.endTime
      , view_by: this.viewDataBy
    };
    const indexViewBy = this.indexViewBy ? this.indexViewBy : 1;
    this.scheduleComponent.checkExistParam(dataFromParent, indexViewBy);
  }
  // end chilren

  date_ranger_event() {
    this.time_value = null;
    this.start_date = (document.getElementById('startDateReportTemp') as HTMLInputElement).value
      ? (document.getElementById('startDateReportTemp') as HTMLInputElement).value : this.start_date;
    this.end_date = (document.getElementById('endDateReportTemp') as HTMLInputElement).value
      ? (document.getElementById('endDateReportTemp') as HTMLInputElement).value :
      this.end_date;
    const start_d = new Date(this.start_date.replace(/[']/g, ''));
    const end_d = new Date(this.end_date.replace(/[']/g, ''));
    this.time_period = this.appservice.convert_date_tostringdatemonth(start_d)
      + ' - ' + this.appservice.convert_date_tostringdatemonth(end_d);
    this.indexViewBy = 3;
    // console.log(this.start_date);
    // console.log(this.end_date);
  }

  get_location_time() {
    this.blockUI.start(this.language.dang_tai_cau_hinh);
    this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
      param => {
        try {
          this.organization_arr_option = param.organization_arr;
          this.fba_time_period_overview = param.fba_time_period_metrics;
          this.startTimeOption = param.start_time_list;
          this.endTimeOption = param.end_time_list;
          this.indexOption = param.fba_index;
          // this.indexOptionSelected = this.indexOption[1].value;

          let para = null;
          if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
            para = param.user_page_parametter;
            this.organization_id = para.organization_id;
            this.startTime = para.start_time;
            this.endTime = para.end_time;
            this.site_id = para.site_id;
            if (para.time_value == null || para.time_value === '') {
              this.start_date = para.start_date;
              this.end_date = para.end_date;
              this.time_period = para.time_period;
              this.indexViewBy = 3;
              console.log(this.indexViewBy);
            } else {
              this.get_time(para.time_value);
              this.time_period = param.fba_time_period_metrics.find(e => e.value === para.time_value).label;
            }
            this.has_site = 1;
            // console.log('time_value', para.time_value);
          } else {
            //
            this.indexViewBy = 1;
            /*----------  Xử lí thời gian   ----------*/
            this.organization_id = param.organization_arr[0].value;

            const time_on_now = new Date();
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
            // this.time_period = 'Hôm nay';
            // this.time_value = 'today';
            this.time_period = this.fba_time_period_overview[0].label;
            this.time_value = this.fba_time_period_overview[0].value;
            this.startTime = this.startTimeOption[8].value.toString();
            this.endTime = this.endTimeOption[23].value.toString();
          }
          this.get_sitetree();
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
      }, () => {
        // this.blockUI.stop();
      }
    );
  }

  get_sitetree() {
    this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
    const url = environment.API.sites + '_get_site_for_report';
    const data = { organization_id: this.organization_id };
    this.appservice.post(data, url).subscribe(res => {
      try {
        if (!environment.production) {
          console.log('get_sitetree', res);
        }
        this.menu_tree = [];
        this.recusive_menu(res.site_array);
        this.snap_menu_tree = this.menu_tree.slice(0);
        if (this.has_site === 2 || this.has_site !== 1) {
          const first_array = this.menu_tree.find(item => Number(item.enables) === 1);
          this.site_id = first_array.id;
          this.location = first_array.site_name;
        } else {
          this.location = this.menu_tree.filter(x => x.id === this.site_id)[0].site_name;
        }
        this.title_location = this.location;
        this.blockUI.stop();
        this.get_data();
      } catch (error) {
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
      }
    }, (error) => {
      this.blockUI.stop();
      this.show_error = true;
    });
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
        });
        const scope = space + 1;
        this.recusive_menu(array, a_id, scope);
      }
    });
  }

  /*----------  Kích sự kiện thay đổi  ----------*/
  // hiện menu tổ chức theo user
  show_menu_location() {
    const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
    if (!environment.production) {
      console.log('userInfo', userInfo);
    }
    if (userInfo.lever === '0') {
      this.hidden_menu_location = false;
    } else {
      this.hidden_menu_location = true;
    }
  }

  // thay đổi tổ chức
  changeorganization(event) {
    this.has_site = 2;
    this.organization_id = event.value;
    this.locationSelectionDisplay = false;
    this.get_sitetree();
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

  // thay đổi tuần tháng năm thời kỳ
  chonthoigian(item) {
    this.time_period = item.label;
    const time = item.value;
    this.get_time(time);
  }

  get_time(time_value) {
    const ngayhomnay = new Date();
    if (time_value === 'yesterday') {
      const yesterday = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
      this.siteSelectionDisplay2 = false;
      //
      this.indexViewBy = 1;
    } else if (time_value === 'last_week') {
      const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
      const beforeOneWeek2 = new Date(beforeOneWeek);
      const day = beforeOneWeek.getDay();
      const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
      const lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
      const lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(lastMonday) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(lastSunday) + '\'';
      this.siteSelectionDisplay2 = false;
      //
      this.indexViewBy = 2;
    } else if (time_value === 'last_month') {
      const month_now = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 0);
      const yesterday = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()) - 1, 1);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(month_now) + '\'';
      this.siteSelectionDisplay2 = false;
      //
      this.indexViewBy = 4;
    } else if (time_value === 'last_year') {
      const ngaybatdaun = new Date(Number(ngayhomnay.getFullYear()) - 1, 0, 1);
      const ngayketthucn = new Date(Number(ngayhomnay.getFullYear()) - 1, 11, 31);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn) + '\'';
      this.siteSelectionDisplay2 = false;
      //
      this.indexViewBy = 5;
    } else if (time_value === 'today') {
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay) + '\'';
      this.siteSelectionDisplay2 = false;
      //
      this.indexViewBy = 1;
    } else if (time_value === 'this_week') {
      const currentWeekDay = ngayhomnay.getDay();
      const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
      const wkStart = new Date(new Date(ngayhomnay).setDate(ngayhomnay.getDate() - lessDays));
      const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(wkStart) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(wkEnd) + '\'';
      this.siteSelectionDisplay2 = false;
      //
      this.indexViewBy = 2;
    } else if (time_value === 'this_month') {
      const ngaydauthangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 1);
      const ngaycuoithangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth() + 1, 0);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaydauthangnay) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaycuoithangnay) + '\'';
      this.siteSelectionDisplay2 = false;
      //
      this.indexViewBy = 4;
    } else if (time_value === 'last_fourteen_day') {
      const ngaybatdau = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 14);
      const ngayketthuc = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdau) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthuc) + '\'';
      this.siteSelectionDisplay2 = false;
      //
      this.indexViewBy = 3;
    } else if (time_value === 'this_year') {
      const ngaybatdaun = new Date(ngayhomnay.getFullYear(), 0, 1);
      const ngayketthucn = new Date(ngayhomnay.getFullYear(), 11, 31);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn) + '\'';
      this.siteSelectionDisplay2 = false;
      //
      this.indexViewBy = 5;
    }
    this.time_value = time_value;
    if (!environment.production) {
      console.log('a', this.start_date);
      console.log('b', this.end_date);
    }
  }

  //  chọn địa điểm
  changeitem(organization_id, id, site_name) {
    this.site_id = id;
    this.location = site_name;
    this.siteSelectionDisplay = false;
  }

  // thay đổi nút áp dụng
  time_change() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.get_data();
  }

  go_total_row_age(a1: number, a2: number, a3: number) {
    let tong = 0;
    tong = (Number(a1) + Number(a2) + Number(a3));
    return tong;
  }

  go_number(number, total) {
    let tong = 0;
    if (total !== 0) {
      tong = ((Number(number) / total) * 100);
      return tong.toFixed(2);
    }
    return tong;
  }

  reset_to_zero(...array) {
    array.forEach(element => {
      this[element] = 0;
    });
  }

  exportExcel(): void {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_hour: '\'' + this.startTime + '\''
      , end_hour: '\'' + this.endTime + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , view_by: this.viewDataBy
      // , data: this.data[0]  // gửi data sang để xuất excel
    };
    this.blockUI.start(this.language.dang_xuat_bao_cao);
    this.appservice.post(data, environment.GENDERAGE.API.sp_poc_gender_age_by_day + '_export_excel').subscribe(fileData => {
      window.open(this.url_api + fileData);
      this.name_of_excel = fileData;
      if (!environment.production) {
        console.log('Đã xuất file cả trong export laravel');
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
          console.log('Đã xóa file trong public export laravel');
        }
      });
    }
    );
  }

  get_data() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_hour: '\'' + this.startTime + '\''
      , end_hour: '\'' + this.endTime + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , view_by: this.viewDataBy
    };
    if (!environment.production) {
      console.log('data2', data);
    }
    this.time_generate_report = new Date();
    this.title_location = this.location;

    this.appservice.post(data, environment.GENDERAGE.API.sp_poc_gender_age_by_day).subscribe(
      res => {
        try {
          if (!environment.production) {
            console.log('datafemale_male', res);
          }
          this.startt = this.startTimeOption.find(item => item.value === this.startTime).label;
          this.endt = this.endTimeOption.find(item => item.value === this.endTime).label;

          const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          const start_time_number = Number(start_d);
          const end_time_number = Number(end_d);
          intDateRangePicker_viewchild(start_time_number, end_time_number);

          this.style_start_date = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
          this.style_end_date = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
          if (this.time_value === null || this.time_value === '' || !this.time_value) {
            this.title_time_period = this.language.ngay;
            this.time_period2 = this.time_period;
          } else {
            this.title_time_period = this.time_period;
            if (this.start_date === this.end_date) {
              this.time_period2 = this.style_start_date;
            } else {
              this.time_period2 = this.style_start_date + ' - ' + this.style_end_date;
            }
          }

          this.data = res;
          this.show_error = false;
          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.data = null;
            this.blockUI.stop();
          }
          // tslint:disable-next-line:max-line-length
          this.reset_to_zero('age18', 'age18_female', 'age18_male', 'age18_unknown', 'age18_24', 'age18_24_female', 'age18_24_male', 'age18_24_unknown', 'age25_34', 'age25_34_female',
            // tslint:disable-next-line:max-line-length
            'age25_34_male', 'age25_34_unknown', 'age35_44', 'age35_44_female', 'age35_44_male', 'age35_44_unknown', 'age45_54', 'age45_54_female', 'age45_54_male', 'age45_54_unknown',
            // tslint:disable-next-line:max-line-length
            'age55_64', 'age55_64_female', 'age55_64_male', 'age55_64_unknown', 'age65', 'age65_female', 'age65_male', 'age65_unknown',
            'unknown_female', 'unknown_male', 'unknown_unknown',
            'total_age', 'total_female', 'total_male', 'total_unknown', 'total_noun');
          this.data.forEach(element => {
            this.age18_female += Number(element.age18_female);
            this.age18_male += Number(element.age18_male);
            this.age18_unknown += Number(element.age18_unknown);

            this.age18_24_female += Number(element.age18_24_female);
            this.age18_24_male += Number(element.age18_24_male);
            this.age18_24_unknown += Number(element.age18_24_unknown);

            this.age25_34_female += Number(element.age25_34_female);
            this.age25_34_male += Number(element.age25_34_male);
            this.age25_34_unknown += Number(element.age25_34_unknown);

            this.age35_44_female += Number(element.age35_44_female);
            this.age35_44_male += Number(element.age35_44_male);
            this.age35_44_unknown += Number(element.age35_44_unknown);

            this.age45_54_female += Number(element.age45_54_female);
            this.age45_54_male += Number(element.age45_54_male);
            this.age45_54_unknown += Number(element.age45_54_unknown);

            this.age55_64_female += Number(element.age55_64_female);
            this.age55_64_male += Number(element.age55_64_male);
            this.age55_64_unknown += Number(element.age55_64_unknown);

            this.age65_female += Number(element.age65_female);
            this.age65_male += Number(element.age65_male);
            this.age65_unknown += Number(element.age65_unknown);

            this.unknown_female += Number(element.unknown_female);
            this.unknown_male += Number(element.unknown_male);
            this.unknown_unknown += Number(element.unknown_unknown);
          });
          this.age18 = this.age18_female + this.age18_male + this.age18_unknown;
          this.age18_24 = this.age18_24_female + this.age18_24_male + this.age18_24_unknown;
          this.age25_34 = this.age25_34_female + this.age25_34_male + this.age25_34_unknown;
          this.age35_44 = this.age35_44_female + this.age35_44_male + this.age35_44_unknown;
          this.age45_54 = this.age45_54_female + this.age45_54_male + this.age45_54_unknown;
          this.age55_64 = this.age55_64_female + this.age55_64_male + this.age55_64_unknown;
          this.age65 = this.age65_female + this.age65_male + this.age65_unknown;
          this.unknown = this.unknown_female + this.unknown_male + this.unknown_unknown;

          this.total_female = this.age18_female + this.age18_24_female + this.age25_34_female + this.age35_44_female
            + this.age45_54_female + this.age55_64_female + this.age65_female + this.unknown_female;
          this.total_male = this.age18_male + this.age18_24_male + this.age25_34_male + this.age35_44_male
            + this.age45_54_male + this.age55_64_male + this.age65_male + this.unknown_male;
          this.total_unknown = this.age18_unknown + this.age18_24_unknown + this.age25_34_unknown + this.age35_44_unknown
            + this.age45_54_unknown + this.age55_64_unknown + this.age65_unknown + this.unknown_unknown;

          this.total_age = this.total_female + this.total_male + this.total_unknown;
          this.total_noun = this.total_age - this.total_unknown;

          (function (H) {
            H.wrap(H.Legend.prototype, 'positionCheckboxes', function (p, scrollOffset) {
              // tslint:disable-next-line:prefer-const
              let alignAttr = this.group.alignAttr,
                translateY,
                // tslint:disable-next-line:prefer-const
                clipHeight = this.clipHeight || this.legendHeight;

              if (alignAttr) {
                translateY = alignAttr.translateY;
                H.each(this.allItems, function (item) {
                  // tslint:disable-next-line:prefer-const
                  let checkbox = item.checkbox,
                    // tslint:disable-next-line:prefer-const
                    bBox = item.legendItem.getBBox(true),
                    top;

                  if (checkbox) {
                    top = (translateY + checkbox.y + (scrollOffset || 0) + 3);
                    H.css(checkbox, {
                      left: (alignAttr.translateX + item.checkboxOffset + checkbox.x - 75 - bBox.width) + 'px',
                      top: top + 1 + 'px',
                      display: top > translateY - 6 && top < translateY + clipHeight - 6 ? '' : 'none'
                    });
                  }
                });
              }
            });
          })(Highcharts);
          const self = this;
          Highcharts.chart(this.container.nativeElement, {
            // tslint:disable-next-line:max-line-length
            chart: { type: 'column', height: 500, style: { fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif !important;', } },
            title: { text: ' ' },
            subtitle: { text: ' ' },
            xAxis: { categories: ['18-', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'], crosshair: true },
            yAxis: {
              min: 0, max: 100, allowDecimals: false, title: {
                text: self.language.phan_tram + ' %',
                style: { color: environment.POC.colors.stackLabels, fontWeight: 'bold' },
              }
              // không cho phép lẻ
            },
            tooltip: { backgroundColor: environment.POC.colors.backgroundColor, shared: true, distance: 80, padding: 10, },
            plotOptions: {
              bar: { dataLabels: { enabled: true } },
              series: {
                showCheckbox: true,
                events: {
                  checkboxClick: function (event) {
                    const type_chart = this.chart.series[event.item.index].type;
                    if (event.checked) {
                      if (type_chart === 'column') {
                        this.chart.series[event.item.index].update({ type: 'spline', });
                        return true;
                      } else {
                        this.chart.series[event.item.index].update({ type: 'column', });
                        return false;
                      }
                    } else {
                      if (type_chart === 'column') {
                        this.chart.series[event.item.index].update({ type: 'spline', selected: true });
                        return true;
                      } else {
                        this.chart.series[event.item.index].update({ type: 'column', selected: false });
                        return false;
                      }
                    }
                  }
                }
              },
              column: {
                borderRadius: 2.5, minPointLength: 0,
              }
            },
            legend: {
              itemStyle: { width: 350 },
              // borderWidth: 0.5,
              // shadow: true,
              padding: 17,
              align: 'center',
            },
            series: [
              {
                name: this.language.nu_bieu_do,
                // tslint:disable-next-line:max-line-length
                data: [
                  Number(self.go_number(self.age18_female, self.total_noun)),
                  Number(self.go_number(self.age18_24_female, self.total_noun)),
                  Number(self.go_number(self.age25_34_female, self.total_noun)),
                  Number(self.go_number(self.age35_44_female, self.total_noun)),
                  Number(self.go_number(self.age45_54_female, self.total_noun)),
                  Number(self.go_number(self.age55_64_female, self.total_noun)),
                  Number(self.go_number(self.age65_female, self.total_noun)),
                ],
                color: environment.POC.colors.female,
                tooltip: { valueDecimals: 2, valuePrefix: '', valueSuffix: ' %' },
              }, {
                name: this.language.nam_bieu_do,
                // tslint:disable-next-line:max-line-length
                data: [
                  Number(self.go_number(self.age18_male, self.total_noun)),
                  Number(self.go_number(self.age18_24_male, self.total_noun)),
                  Number(self.go_number(self.age25_34_male, self.total_noun)),
                  Number(self.go_number(self.age35_44_male, self.total_noun)),
                  Number(self.go_number(self.age45_54_male, self.total_noun)),
                  Number(self.go_number(self.age55_64_male, self.total_noun)),
                  Number(self.go_number(self.age65_male, self.total_noun)),
                ],
                color: environment.POC.colors.male,
                tooltip: { valueDecimals: 2, valuePrefix: '', valueSuffix: ' %' },
              },
              //  {
              //   name: this.language.khong_xac_dinh,
              //   // tslint:disable-next-line:max-line-length
              // tslint:disable-next-line: max-line-length
              //   data: [this.age18_unknown, this.age18_24_unknown, this.age25_34_unknown, this.age35_44_unknown, this.age45_54_unknown, this.age55_64_unknown, this.age65_unknown, this.unknown_unknown],
              //   color: environment.POC.colors.unknown,
              //   tooltip: { valueDecimals: 0, valuePrefix: '', valueSuffix: ' ' },
              // }
            ]
          });
          const data_2 = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , start_time: this.startTime
            , end_time: this.endTime
            , start_date: this.start_date
            , end_date: this.end_date
            , time_period: this.time_period
            , time_value: this.time_value
            , view_by: this.viewDataBy
          };
          this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(data_2));
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
      }, () => {
        this.blockUI.stop();
      }
    );
  }

  reset_session() {
    const data = [];
    this.site_id = null;
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
      this.get_location_time();
    });
  }
}
