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
declare var $;
declare function intDateRangePicker_viewchild(start_date, end_date): any;


@Component({
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
  // chỉnh css angular
})
export class FbaDetailCustomerInfoComponent implements OnInit {
  @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
  defaultModule = 2;
  indexViewBy: number;
  currentPageId = environment.Pages.fba.detail_fbacustomer_info;
  page_id = environment.Pages.fba.detail_fbacustomer_info;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('content') public helloTemplate: ElementRef;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  time_generate_report = new Date();

  // public navItems = navItems;
  public sidebarMinimized = true;
  public element: HTMLElement = document.body;
  name_of_excel: any;
  public modalRef: BsModalRef;

  // **** kết thúc phần hiển thị popup ******
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(private router: Router, private appservice: AppService, private modalService: BsModalService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
  }

  // Khai báo
  organization_id: number;
  siteSelectionDisplay = false;
  siteSelectionDisplay2 = false;
  locationSelectionDisplay = false;
  start_date: any;
  end_date: any;
  site_id: number;
  style_start_date: any;
  style_end_date: any;
  style_start_date_number: any;
  style_end_date_number: any;

  startTimeOption: Array<IOption>;
  endTimeOption: Array<IOption>;
  startTime: string;
  endTime: string;
  time_period: string;
  question_name: string;
  title_question_name: string;
  question_id: number;
  data = [];
  questions_ongoing: any;
  questions_upcoming: any;
  questions_ended: any;
  fba_time_period_metrics: any;
  organization_arr: any;
  menu_tree: any;
  image_very_negative_img: string; // ảnh tức giận
  image_negative_img: string;      // ảnh bình thường
  image_very_positive_img: string; // ảnh rất hài lòng
  image_positive_img: string;      // ảnh ảnh hài lòng
  time_now: string;
  snap_menu_tree: any;
  data_filter = [];
  hidden_menu_location = false;
  indexOption: Array<IOption>;
  organization_arr_option: Array<IOption>;
  organization_arr_optionSelected: string;  // thay đổi theo kích
  indexOptionSelected: string;              // thay đổi theo kích
  location: string;
  title_location: string;
  time_value: string;
  /*----------  Giá trị mặc định  ----------*/
  viewDataBy = 'Hour';
  Viewhienthi = 'Số lượng';
  total_total_response = 0;
  total_very_positive = 0;
  total_positive = 0;
  total_negative = 0;
  total_very_negative = 0;
  avg_very_positive_percent = 0;
  avg_positive_percent = 0;
  avg_negative_percent = 0;
  avg_very_negative_percent = 0;
  // phân trang bảng
  rowsOnPage = 15;
  filterQuery = '';
  url_api = environment.apiUrl + 'exports/';
  has_site: number; language: any; show_error = false;

  ngOnInit() {
    this.get_location_time();
    this.show_menu_location();
    intDateRangePicker_viewchild(Number(new Date()), Number(new Date()));
    const self = this;
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
      , question_id: this.question_id
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
      , question_id: this.question_id
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
          this.fba_time_period_metrics = param.fba_time_period_metrics;
          this.startTimeOption = param.start_time_list;
          this.endTimeOption = param.end_time_list;
          this.indexOption = param.fba_index;
          this.indexOptionSelected = this.indexOption[1].value;

          let para = null;
          if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
            para = param.user_page_parametter;
            this.organization_id = para.organization_id;
            this.startTime = para.start_hour;
            this.endTime = para.end_hour;
            this.question_id = para.question_id;
            this.site_id = para.site_id;
            this.viewDataBy = para.view_by;
            if (!environment.production) {
              console.log('question_iddau', this.question_id);
            }
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
            this.time_period = param.fba_time_period_metrics[0].label;
            this.time_value = param.fba_time_period_metrics[0].value;
            this.startTime = this.startTimeOption[0].value.toString();
            this.endTime = this.endTimeOption[23].value.toString();
          }
        } catch (error) {
          this.blockUI.stop();
          this.show_error = true;
        }
      }, (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
      }, () => {
        this.blockUI.stop();
        this.get_sitetree();
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
        this.get_question();
      } catch (error) {
        this.blockUI.stop();
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

  get_question() {
    this.blockUI.start(this.language.dang_tai_cau_hoi);
    const organization = {
      organization_id: this.organization_id
    };
    this.appservice.post(organization, environment.FBA.API.get_question_for_report).subscribe(
      param => {
        try {
          if (!environment.production) {
            console.log('get_question', param);
            console.log('ID organization tổ chức in get_question', organization);
          }
          this.questions_ongoing = param.questions_ongoing;
          this.questions_upcoming = param.questions_upcoming;
          this.questions_ended = param.questions_ended;
          if (this.has_site === 1) {
            this.questions_ongoing.forEach(e => {
              if (!environment.production) {
                console.log('ongoing', this.question_id);
              }
              if (e.question_id === this.question_id) {
                this.question_id = e.question_id;
                this.question_name = e.question_name;
                this.title_question_name = this.question_name;
                this.image_very_negative_img = e.very_negative_img;
                this.image_negative_img = e.negative_img;
                this.image_very_positive_img = e.very_positive_img;
                this.image_positive_img = e.positive_img;
                if (!environment.production) {
                  console.log(' this.question_id', this.question_id);
                }
              }
            });
            this.questions_ended.forEach(e => {
              if (!environment.production) {
                console.log('questions_ended', this.question_id);
              }
              if (e.question_id === this.question_id) {
                this.question_id = e.question_id;
                this.question_name = e.question_name;
                this.title_question_name = this.question_name;
                this.image_very_negative_img = e.very_negative_img;
                this.image_negative_img = e.negative_img;
                this.image_very_positive_img = e.very_positive_img;
                this.image_positive_img = e.positive_img;
              }
            });
            this.questions_upcoming.forEach(e => {
              if (!environment.production) {
                console.log('questions_upcoming', this.question_id);
              }
              if (e.question_id === this.question_id) {
                this.question_id = e.question_id;
                this.question_name = e.question_name;
                this.title_question_name = this.question_name;
                this.image_very_negative_img = e.very_negative_img;
                this.image_negative_img = e.negative_img;
                this.image_very_positive_img = e.very_positive_img;
                this.image_positive_img = e.positive_img;
              }
            });
          } else {
            if (param.questions_ongoing.length > 0) {
              this.question_name = this.questions_ongoing[0].question_name;               // hiện trên giao diện
              this.title_question_name = this.question_name;
              this.question_id = this.questions_ongoing[0].question_id;                   // gắn question_id mặc định khi load đầu tiên
              this.image_very_negative_img = this.questions_ongoing[0].very_negative_img; // lấy ảnh mặc định
              this.image_negative_img = this.questions_ongoing[0].negative_img;
              this.image_very_positive_img = this.questions_ongoing[0].very_positive_img;
              this.image_positive_img = this.questions_ongoing[0].positive_img;
            } else if (param.questions_ended.length > 0) {
              this.question_name = this.questions_ended[0].question_name;
              this.title_question_name = this.question_name;
              this.question_id = this.questions_ended[0].question_id;
              this.image_very_negative_img = this.questions_ended[0].very_negative_img;
              this.image_negative_img = this.questions_ended[0].negative_img;
              this.image_very_positive_img = this.questions_ended[0].very_positive_img;
              this.image_positive_img = this.questions_ended[0].positive_img;
            } else if (param.questions_upcoming.length > 0) {
              this.question_name = this.questions_upcoming[0].question_name;
              this.title_question_name = this.question_name;
              this.question_id = this.questions_upcoming[0].question_id;
              this.image_very_negative_img = this.questions_upcoming[0].very_negative_img;
              this.image_negative_img = this.questions_upcoming[0].negative_img;
              this.image_very_positive_img = this.questions_upcoming[0].very_positive_img;
              this.image_positive_img = this.questions_upcoming[0].positive_img;
            } else {
              this.question_name = this.language.fba_dang_cap_nhat;
              this.title_question_name = this.question_name;
              this.question_id = null;
              // tslint:disable-next-line:max-line-length
              this.image_positive_img = this.image_very_positive_img = this.image_negative_img = this.image_very_negative_img = 'none';
            }
            if (!environment.production) {
              console.log(' this.question_id', this.question_id);
            }
          }
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
        // this.blockUI.start(this.'Lỗi, không kết nối được máy chủ');
      }, () => {
        this.blockUI.stop();
        this.get_data();
      }
    ); // get_user_page_parametter
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

  // thay đổi chart khi chọn Index
  thaydoichart(event) {
    this.indexOptionSelected = event.value;
    this.get_data();
  }

  //  chọn địa điểm
  changeitem(organization_id, id, site_name) {
    // this.organization_id = organization_id;
    this.site_id = id;
    this.location = site_name;
    this.siteSelectionDisplay = false;
    // this.get_data();
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

  // search table
  search_table(value: string) {
    // chuyển giá trị truyền vào về chữ thường để so sánh
    const string = value.toLowerCase();
    if (string === '') {
      this.data = this.data_filter;
    } else {
      // tslint:disable-next-line:max-line-length
      this.data = this.data_filter.filter(x => x.customer_name.toLowerCase().indexOf(string) !== -1
        || x.customer_phone.toLowerCase().indexOf(string) !== -1
        || x.customer_email.toLowerCase().indexOf(string) !== -1
        || x.answer.toLowerCase().indexOf(string) !== -1
        || x.reason_name.toLowerCase().indexOf(string) !== -1);
    }
  }

  question_change(question_id, question_name, very_positive_img, positive_img, negative_img, very_negative_img) { // thay đổi câu hỏi
    this.has_site = 2;
    this.question_id = question_id;
    this.question_name = question_name;
    this.image_very_negative_img = very_negative_img;
    this.image_negative_img = negative_img;
    this.image_very_positive_img = very_positive_img;
    this.image_positive_img = positive_img;
    // this.get_data();
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
      this.indexViewBy = 2;
    } else if (time_value === 'last_month') {
      const month_now = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 0);
      const yesterday = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()) - 1, 1);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(month_now) + '\'';
      this.siteSelectionDisplay2 = false;
      this.indexViewBy = 4;
    } else if (time_value === 'last_year') {
      const ngaybatdaun = new Date(Number(ngayhomnay.getFullYear()) - 1, 0, 1);
      const ngayketthucn = new Date(Number(ngayhomnay.getFullYear()) - 1, 11, 31);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn) + '\'';
      this.siteSelectionDisplay2 = false;
      this.indexViewBy = 5;
    } else if (time_value === 'today') {
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay) + '\'';
      this.siteSelectionDisplay2 = false;
      this.indexViewBy = 1;
    } else if (time_value === 'this_week') {
      const currentWeekDay = ngayhomnay.getDay();
      const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
      const wkStart = new Date(new Date(ngayhomnay).setDate(ngayhomnay.getDate() - lessDays));
      const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(wkStart) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(wkEnd) + '\'';
      this.siteSelectionDisplay2 = false;
      this.indexViewBy = 2;
    } else if (time_value === 'this_month') {
      const ngaydauthangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 1);
      const ngaycuoithangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth() + 1, 0);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaydauthangnay) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaycuoithangnay) + '\'';
      this.siteSelectionDisplay2 = false;
      this.indexViewBy = 4;
    } else if (time_value === 'last_fourteen_day') {
      const ngaybatdau = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 14);
      const ngayketthuc = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdau) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthuc) + '\'';
      this.siteSelectionDisplay2 = false;
      this.indexViewBy = 3;
    } else if (time_value === 'this_year') {
      const ngaybatdaun = new Date(ngayhomnay.getFullYear(), 0, 1);
      const ngayketthucn = new Date(ngayhomnay.getFullYear(), 11, 31);
      this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun) + '\'';
      this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn) + '\'';
      this.siteSelectionDisplay2 = false;
      this.indexViewBy = 5;
    }
    this.time_value = time_value;
    if (!environment.production) {
      console.log('a', this.start_date);
      console.log('b', this.end_date);
    }
  }

  // thay đổi nút áp dụng
  time_change() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.get_data();
  }

  /*----------  Data  ----------*/
  get_data() {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , question_id: this.question_id
      , start_hour: '\'' + this.startTime + '\''
      , end_hour: '\'' + this.endTime + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      // ,start_date: '\'2018-11-01\''
      // ,end_date:  '\'2018-11-30\''

    };
    if (!environment.production) {
      console.log('DATA', data);
    }
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.time_generate_report = new Date();
    this.appservice.post(data, environment.FBA.API.fba_customer_info + '_response').subscribe(
      respo => {
        try {
          const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          const start_time_number = Number(start_d);
          const end_time_number = Number(end_d);
          intDateRangePicker_viewchild(start_time_number, end_time_number);
          this.data = []; // data cho bảng
          this.show_error = false;
          if (respo.hasOwnProperty('status') && respo.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.blockUI.stop();
          }
          this.data_filter = []; // data cho bảng tìm kiếm
          let k = 0;
          const data_temp = respo.customer_info;
          while (data_temp.length > 0) {
            const item = respo.customer_info[0];
            data_temp.splice(0, 1);
            for (let i = 0; i < respo.customer_info.length;) {
              if (item.id === respo.customer_info[i].id) {
                item.reason_name = item.reason_name + ', ' + respo.customer_info[i].reason_name;
                data_temp.splice(i, 1);
              } else {
                i++;
              }
            }
            this.data[k] = item;
            this.data_filter[k] = item;
            k++;
          }
          let l = 1;
          for (let j = 0; j < this.data.length; j++) {
            this.data[j].stt = l + j;
          }

          if (!environment.production) {
            console.log('data: ', this.data);
          }

          const data_2 = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , question_id: this.question_id
            , start_hour: this.startTime
            , end_hour: this.endTime
            , start_date: this.start_date
            , end_date: this.end_date
            , time_period: this.time_period
            , time_value: this.time_value
          };
          this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(data_2));
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
        // this.blockUI.start(this.'Lỗi, không kết nối được máy chủ');
      }, () => {
        this.blockUI.stop();
      });
  }

  /*----------  xuất excel  ----------*/
  exportExcel(): void {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , question_id: this.question_id
      , start_hour: '\'' + this.startTime + '\''
      , end_hour: '\'' + this.endTime + '\''
      , start_date: this.start_date
      , end_date: this.end_date
    };
    this.blockUI.start(this.language.dang_xuat_bao_cao);
    this.appservice.post(data, environment.FBA.API.export_customer_info + '_response').subscribe(fileData => {
      // const b: any = new Blob([fileData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"  });
      // const url = window.URL.createObjectURL(b);
      this.name_of_excel = fileData;
      window.open(this.url_api + fileData);
      if (!environment.production) {
        console.log('Đã xuất file cả trong public export laravel');
      }
    }, (error) => {
      if (!environment.production) {
        console.log(error);
      }
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      const data2 = {
        name_of_excel: this.name_of_excel
      };
      this.appservice.post(data2, environment.FBA.API.export_customer_info + '_delete_excel').subscribe(res => {
        if (!environment.production) {
          console.log('Đã xóa file trong public export laravel');
        }
      });
    }
    );
  }

  reset_session() {
    const data = [];
    this.site_id = null;
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
      this.ngOnInit();
    });
    // this.modalRef.hide();
  }
}
