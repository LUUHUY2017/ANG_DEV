import { IOption } from 'ng-select';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';

// highcharts
import Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import Tree from 'highcharts/modules/treemap';
import Heatmap from 'highcharts/modules/heatmap';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
// chỉnh css angular
// import { ViewEncapsulation } from '@angular/core';
import { StoreReportingFFScheduleComponent } from '../../useremailmodule/footfall/storereporting/storereporting.component';
import { NotifierService } from 'angular-notifier';
More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);
// thêm mới dateranger
declare var $;
declare function intDateRangePicker_viewchild(start_date, end_date): any;
@Component({
  selector: 'app-age-metrics-comparison',
  templateUrl: './age-metrics-comparison.component.html',
  styleUrls: [
    './age-metrics-comparison.component.scss',
    './age-metrics-comparison.component.css'
  ],
  // chỉnh css angular
  // encapsulation: ViewEncapsulation.None
})
export class AgeMetricsComparisonComponent implements OnInit {
  @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
  defaultModule = 3;
  indexViewBy: number;
  currentPageId = environment.Pages.age.metrics_gender;
  page_id = '\'' + environment.Pages.age.metrics_gender + '\'';
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
  show_label_table: string;
  // **** kết thúc phần hiển thị popup ******

  constructor(private router: Router, private appservice: AppService, private modalService: BsModalService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
  }

  // Khai báo
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
  time_value: string; index_viewby = 1;

  data: any;
  fba_time_period_overview: any;
  menu_tree: any;
  hidden_menu_location = false;
  indexOption: Array<IOption>;
  organization_arr_option: Array<IOption>;
  indexOptionSelected: string;
  has_site: number;
  /*----------  Giá trị mặc định  ----------*/
  viewDataBy: string;
  category_data = [];
  female = 0;
  male = 0;
  unknown = 0;
  total_age = 0;
  total_gender = 0;
  url_api = environment.apiUrl + 'exports/';
  startt: string;
  endt: string;
  view: string; language: any; show_error = false;

  /*----------  ngOnInit  ----------*/
  // Page metrics-gender
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

  push_notification() {
    if (this.modalRef == null || this.modalRef === undefined) {
      this.modalRef = this.modalService.show(this.helloTemplate, {
        // backdrop: true,
        // ignoreBackdropClick: true
        keyboard: true,
      });
    }
  }

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
    this.index_viewby = 2;
    this.indexViewBy = 3;
    this.viewDataBy = 'Hour';
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
            this.time_period = para.time_period;
            this.site_id = para.site_id;
            this.viewDataBy = para.view_by;
            if (para.time_value == null || para.time_value === '') {
              this.start_date = para.start_date;
              this.end_date = para.end_date;
              this.time_period = para.time_period;
              this.indexViewBy = 3;
            } else {
              this.get_time(para.time_value);
              this.time_period = param.fba_time_period_metrics.find(e => e.value === para.time_value).label;
            }
            this.has_site = 1;
            // console.log('time_value', para.time_value);
          } else {
            this.indexViewBy = 1;
            /*----------  Xử lí thời gian   ----------*/
            this.organization_id = param.organization_arr[0].value;

            this.viewDataBy = 'Day';
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
          this.show_error = true;
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
        this.get_data();
      } catch (error) {
        this.blockUI.stop();
        this.show_error = true;
      }
    }, (error) => {
      this.blockUI.stop();
      // this.push_notification();
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

  //  chọn địa điểm
  changeitem(organization_id, id, site_name) {
    this.site_id = id;
    this.location = site_name;
    this.siteSelectionDisplay = false;
  }

  // thay đổi tuần tháng năm thời kỳ
  chonthoigian(item) {
    this.time_period = item.label;
    const time = item.value;
    this.get_time(time);
    this.viewDataBy = 'Hour';
  }

  get_time(time_value) {
    const ngayhomnay = new Date();
    if (time_value === 'yesterday') {
      const yesterday = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
      this.siteSelectionDisplay2 = false;
      this.index_viewby = 1;
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
      this.index_viewby = 2;
      this.indexViewBy = 2;
    } else if (time_value === 'last_month') {
      const month_now = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 0);
      const yesterday = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()) - 1, 1);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(month_now) + '\'';
      this.siteSelectionDisplay2 = false;
      this.index_viewby = 4;
      this.indexViewBy = 4;
    } else if (time_value === 'last_year') {
      const ngaybatdaun = new Date(Number(ngayhomnay.getFullYear()) - 1, 0, 1);
      const ngayketthucn = new Date(Number(ngayhomnay.getFullYear()) - 1, 11, 31);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn) + '\'';
      this.siteSelectionDisplay2 = false;
      this.index_viewby = 5;
      this.indexViewBy = 5;
    } else if (time_value === 'today') {
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay) + '\'';
      this.siteSelectionDisplay2 = false;
      this.index_viewby = 1;
      this.indexViewBy = 1;
    } else if (time_value === 'this_week') {
      const currentWeekDay = ngayhomnay.getDay();
      const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
      const wkStart = new Date(new Date(ngayhomnay).setDate(ngayhomnay.getDate() - lessDays));
      const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(wkStart) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(wkEnd) + '\'';
      this.siteSelectionDisplay2 = false;
      this.index_viewby = 2;
      this.indexViewBy = 2;
    } else if (time_value === 'this_month') {
      const ngaydauthangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 1);
      const ngaycuoithangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth() + 1, 0);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaydauthangnay) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaycuoithangnay) + '\'';
      this.siteSelectionDisplay2 = false;
      this.index_viewby = 4;
      this.indexViewBy = 4;
    } else if (time_value === 'last_fourteen_day') {
      const ngaybatdau = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 14);
      const ngayketthuc = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdau) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthuc) + '\'';
      this.siteSelectionDisplay2 = false;
      this.index_viewby = 3;
      this.indexViewBy = 3;
    } else if (time_value === 'this_year') {
      const ngaybatdaun = new Date(ngayhomnay.getFullYear(), 0, 1);
      const ngayketthucn = new Date(ngayhomnay.getFullYear(), 11, 31);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn) + '\'';
      this.siteSelectionDisplay2 = false;
      this.index_viewby = 5;
      this.indexViewBy = 5;
    }
    this.time_value = time_value;
    if (!environment.production) {
      console.log('a', this.start_date);
      console.log('b', this.end_date);
    }
  }

  // thay đổi giờ, ngày, tuần  tháng năm trên thanh  block
  change_view() {
    // this.blockUI.start(this.'Đang tải dữ liệu...');
    this.get_data();
  }

  // thay đổi nút áp dụng
  time_change() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.get_data();
  }

  go_total_row_age(a1: number, a2: number) {
    let tong = 0;
    tong = (Number(a1) + Number(a2));
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
      console.log('data', data);
    }
    this.time_generate_report = new Date();
    // tslint:disable-next-line:max-line-length
    this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.language.gio;
    this.title_location = this.location;

    this.appservice.post(data, environment.GENDERAGE.API.sp_poc_gender_metrics_comparison).subscribe(
      res => {
        try {
          if (!environment.production) {
            console.log('res', res);
          }
          this.data = res;
          this.show_error = false;
          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.data = null;
            this.blockUI.stop();
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
          this.female = 0;
          this.male = 0;
          this.unknown = 0;
          this.total_gender = 0;
          res.forEach(element => {
            this.female += Number(element.female);
            this.male += Number(element.male);
            this.unknown += Number(element.unknown);
          });
          this.total_gender = Number(this.female + this.male + this.unknown);
          this.showchart();
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

  exportExcel(): void {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_hour: '\'' + this.startTime + '\''
      , end_hour: '\'' + this.endTime + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , view_by: this.viewDataBy
    };
    this.blockUI.start(this.language.dang_xuat_bao_cao);
    this.appservice.post(data, environment.GENDERAGE.API.sp_poc_gender_metrics_comparison + '_export_excel').subscribe(fileData => {
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

  showchart() {
    let i = 0;
    const chart_xAxis = [];
    this.total_age = 0;
    this.data.forEach(element => {
      chart_xAxis[i] = element.time_period;
      this.total_age += Number(element.female) + Number(element.male);
      i++;
    });
    if (chart_xAxis.length > 0) {
      this.show_label_table = chart_xAxis[0] + ' - ' + chart_xAxis[chart_xAxis.length - 1];
    }
    /*----------  Phần trăm  ----------*/
    i = 0;
    const female = [];
    const male = [];
    this.data.forEach(element => {
      female[i] = this.total_age > 0 ? Number(((element.female / this.total_age) * 100).toFixed(2)) : 0;
      male[i] = this.total_age > 0 ? Number(((element.male / this.total_age) * 100).toFixed(2)) : 0;
      i++;
    });
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
    Highcharts.chart(this.container.nativeElement, {
      chart: { type: 'column', height: 500, style: { fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif !important;', } },
      title: { text: ' ' },
      subtitle: { text: ' ' },
      xAxis: {
        categories: chart_xAxis, crosshair: true,
        labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
      },
      yAxis: {
        min: 0, max: 100, allowDecimals: false, title: {
          text: this.language.phan_tram + ' %',
          style: { color: environment.POC.colors.stackLabels, fontWeight: 'bold' }
        }
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
        padding: 17,
        align: 'center',
      },
      series: [
        {
          name: this.language.nu_bieu_do,
          data: female,
          color: environment.POC.colors.female,
          tooltip: { valueDecimals: 2, valuePrefix: '', valueSuffix: ' %' },
        }, {
          name: this.language.nam_bieu_do,
          data: male,
          color: environment.POC.colors.male,
          tooltip: { valueDecimals: 2, valuePrefix: '', valueSuffix: ' %' },
        }]
    });
  }

  reset_session() {
    const data = [];
    this.site_id = null;
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
      this.get_location_time();
    });
  }
}
