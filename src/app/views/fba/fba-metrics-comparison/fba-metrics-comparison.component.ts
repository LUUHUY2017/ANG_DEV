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
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StoreReportingFFScheduleComponent } from '../../useremailmodule/footfall/storereporting/storereporting.component';
import { NotifierService } from 'angular-notifier';
// chỉnh css angular
// import { ViewEncapsulation } from '@angular/core';
More(Highcharts);
declare var $;
declare function intDateRangePicker_viewchild(start_date, end_date): any;

@Component({
  selector: 'app-fba-metrics-comparison',
  templateUrl: './fba-metrics-comparison.component.html',
  styleUrls: [
    './fba-metrics-comparison.component.scss',
    './fba-metrics-comparison.component.css'
  ],
  // chỉnh css angular
  // encapsulation: ViewEncapsulation.None
})
export class FbaMetricsComparisonComponent implements OnInit {
  @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
  defaultModule = 2;
  indexViewBy: number;
  currentPageId = environment.Pages.fba.metrics_comparison;
  page_id = environment.Pages.fba.metrics_comparison;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  @ViewChild('content') public helloTemplate: ElementRef;
  time_generate_report = new Date();
  indexes: any;
  // Decorator wires up blockUI instance

  // public navItems = navItems;
  public sidebarMinimized = true;
  public modalRef: BsModalRef;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  name_of_excel: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  // **** kết thúc phần hiển thị popup ******

  constructor(private router: Router, private appservice: AppService, private modalService: BsModalService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.indexes = indexes;
  }

  // Khai báo
  organization_id: string;
  // chọn organization khi load hộp thoại
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
  question_name: string;
  question_id: number;
  data: any;
  datafilter: any;
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
  Indexstart: any;  // ngModel ngày bắt đầu
  IndexEnd: any;    // ngModel ngày kế thúc
  hidden_menu_location = false;
  indexOption: Array<IOption>;
  organization_arr_option: Array<IOption>;
  organization_arr_optionSelected: string;  // thay đổi theo kích
  indexOptionSelected: string;              // thay đổi theo kích
  location: string;
  viewby: any;
  title_time_period: string;
  title_question_name: string;
  title_location: string;
  very_negative_name: string;
  negative_name: string;
  very_positive_name: string;
  positive_name: string;

  // Nghĩa thêm biến 18/12
  showblock = true;
  url_api = environment.apiUrl + 'exports/';

  /*----------  Giá trị mặc định  ----------*/
  total_total_response = 0;
  total_very_positive = 0;
  total_positive = 0;
  total_negative = 0;
  total_very_negative = 0;
  avg_very_positive_percent = 0;
  avg_positive_percent = 0;
  avg_negative_percent = 0;
  avg_very_negative_percent = 0;
  category_id = 0;
  cxindex = 0;
  npsindex = 0;
  Viewbyfollow: string;
  time_value: string;
  has_site: number;
  time_period2: string;
  title_index: string;
  starttime: string;
  endtime: string;
  view: string; language: any; show_error = false;

  /*----------  ngOnInit  ----------*/
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
      , category_id: this.category_id
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
      , category_id: this.category_id
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

          let para = null;
          if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
            para = param.user_page_parametter;
            this.organization_id = para.organization_id;
            this.startTime = para.start_hour;
            this.endTime = para.end_hour;
            this.question_id = para.question_id;
            this.Viewbyfollow = para.Viewbyfollow;
            this.site_id = para.site_id;
            this.category_id = para.category_id;
            this.indexOptionSelected = para.indexOptionSelected;
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
            const time_on_now = new Date();
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
            this.time_period = param.fba_time_period_metrics[0].label;
            this.time_value = param.fba_time_period_metrics[0].value;
            this.Viewbyfollow = this.language._tat_ca;
            this.category_id = 0;
            this.startTime = this.startTimeOption[0].value.toString();
            this.endTime = this.endTimeOption[23].value.toString();
            this.indexOptionSelected = this.indexOption[0].value;
          }
        } catch (error) {
          this.blockUI.stop();
          this.show_error = true;
        }

      }, (error) => {
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
        this.changeitem(this.organization_id, this.site_id, this.location);
        this.title_location = this.location;
        this.blockUI.stop();
        this.get_question();
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
          this.question_name = this.language.fba_dang_cap_nhat;

          this.image_positive_img = this.image_very_positive_img = this.image_negative_img = this.image_very_negative_img = 'none';
          this.positive_name = this.very_positive_name = this.negative_name = this.very_negative_name = ' ';

          if (this.has_site === 1) {
            this.questions_ongoing.forEach(e => {
              if (!environment.production) {
                console.log('ongoing', this.question_id);
              }
              if (e.question_id === this.question_id) {
                this.question_id = e.question_id;
                this.question_name = e.question_name;

                this.image_very_negative_img = e.very_negative_img;
                this.image_negative_img = e.negative_img;
                this.image_very_positive_img = e.very_positive_img;
                this.image_positive_img = e.positive_img;

                this.very_negative_name = e.very_negative;
                this.negative_name = e.negative;
                this.very_positive_name = e.very_positive;
                this.positive_name = e.positive;
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

                this.image_very_negative_img = e.very_negative_img;
                this.image_negative_img = e.negative_img;
                this.image_very_positive_img = e.very_positive_img;
                this.image_positive_img = e.positive_img;

                this.very_negative_name = e.very_negative;
                this.negative_name = e.negative;
                this.very_positive_name = e.very_positive;
                this.positive_name = e.positive;
              }
            });
            this.questions_upcoming.forEach(e => {
              if (!environment.production) {
                console.log('questions_upcoming', this.question_id);
              }
              if (e.question_id === this.question_id) {
                this.question_id = e.question_id;
                this.question_name = e.question_name;

                this.image_very_negative_img = e.very_negative_img;
                this.image_negative_img = e.negative_img;
                this.image_very_positive_img = e.very_positive_img;
                this.image_positive_img = e.positive_img;

                this.very_negative_name = e.very_negative;
                this.negative_name = e.negative;
                this.very_positive_name = e.very_positive;
                this.positive_name = e.positive;
              }
            });
          } else {
            if (param.questions_ongoing.length > 0) {
              this.question_name = this.questions_ongoing[0].question_name;
              this.question_id = this.questions_ongoing[0].question_id;
              this.image_very_negative_img = this.questions_ongoing[0].very_negative_img;
              this.image_negative_img = this.questions_ongoing[0].negative_img;
              this.image_very_positive_img = this.questions_ongoing[0].very_positive_img;
              this.image_positive_img = this.questions_ongoing[0].positive_img;

              this.very_negative_name = this.questions_ongoing[0].very_negative;
              this.negative_name = this.questions_ongoing[0].negative;
              this.very_positive_name = this.questions_ongoing[0].very_positive;
              this.positive_name = this.questions_ongoing[0].positive;
            } else if (param.questions_ended.length > 0) {
              this.question_name = this.questions_ended[0].question_name;
              this.question_id = this.questions_ended[0].question_id;
              this.image_very_negative_img = this.questions_ended[0].very_negative_img;
              this.image_negative_img = this.questions_ended[0].negative_img;
              this.image_very_positive_img = this.questions_ended[0].very_positive_img;
              this.image_positive_img = this.questions_ended[0].positive_img;

              this.very_negative_name = this.questions_ended[0].very_negative;
              this.negative_name = this.questions_ended[0].negative;
              this.very_positive_name = this.questions_ended[0].very_positive;
              this.positive_name = this.questions_ended[0].positive;
            } else if (param.questions_upcoming.length > 0) {
              this.question_name = this.questions_upcoming[0].question_name;
              this.question_id = this.questions_upcoming[0].question_id;
              this.image_very_negative_img = this.questions_upcoming[0].very_negative_img;
              this.image_negative_img = this.questions_upcoming[0].negative_img;
              this.image_very_positive_img = this.questions_upcoming[0].very_positive_img;
              this.image_positive_img = this.questions_upcoming[0].positive_img;

              this.very_negative_name = this.questions_upcoming[0].very_negative;
              this.negative_name = this.questions_upcoming[0].negative;
              this.very_positive_name = this.questions_upcoming[0].very_positive;
              this.positive_name = this.questions_upcoming[0].positive;
            } else {
              this.question_name = this.language.fba_dang_cap_nhat;
              this.question_id = 0;
              this.image_positive_img = this.image_very_positive_img = this.image_negative_img = this.image_very_negative_img = 'none';
              this.positive_name = this.very_positive_name = this.negative_name = this.very_negative_name = ' ';
            }
            this.title_question_name = this.question_name;
            if (!environment.production) {
              console.log(' this.question_id', this.question_id);
            }
          }
        } catch (error) {
          this.blockUI.stop();
        }

      },
      (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
        this.get_data();
      }
    );

  }

  /*----------  Kích sự kiện thay đổi  ----------*/
  // Nghĩa bắt đầu code từ ngày 18/12
  load_more_chart() {
    this.showblock = !this.showblock;
  }

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
    this.category_id = 0;
    this.Viewbyfollow = this.language._tat_ca;
    this.organization_id = event.value;
    this.locationSelectionDisplay = false;
    this.get_sitetree();
  }

  // thay đổi chart khi chọn Index
  thaydoichart(event) {
    this.indexOptionSelected = event.value;
    // this.get_data();
  }

  //  chọn địa điểm
  changeitem(organization_id, id, site_name) {
    this.site_id = id;
    this.location = site_name;
    this.siteSelectionDisplay = false;
    const data = {
      organization_id: this.organization_id,
      site_id: this.site_id
    };
    if (!environment.production) {
      console.log('id', data);
    }
    // this.blockUI.start(this.'Đang tải thông tin...');
    this.appservice.post(data, environment.FBA.API.get_category).subscribe(
      respo => {
        if (!environment.production) {
          console.log('data_category', respo);
        }
        this.viewby = respo.categories_fba;
        this.viewby.push({
          actived: '1',
          category_name: this.language._tat_ca,
          created_at: '2018-11-15 10:47:23.697',
          created_by: '0',
          deleted: '0',
          id: '0',
          organization_id: '6',
          recerviced_time: '2018-11-15 10:47:23.697',
          status: '0',
          updated_at: '2018-11-15 10:47:23.697',
          updated_by: '0'
        });
        if (!environment.production) {
          console.log('thêm 1 phần tử vào categorry', this.viewby);
        }
      },
      (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
        // this.blockUI.start(this.'Lỗi, không kết nối được máy chủ');
      },
      () => {
        // this.blockUI.stop();
      });
  }

  // thay đổi câu hỏi
  question_change(question_id, question_name, very_positive_img, positive_img, negative_img, very_negative_img) { // thay đổi câu hỏi
    this.question_id = question_id;
    this.question_name = question_name;
    this.image_very_negative_img = very_negative_img;
    this.image_negative_img = negative_img;
    this.image_very_positive_img = very_positive_img;
    this.image_positive_img = positive_img;
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

  // thay quận, huyện, cửa hàng
  change_view(id: number, view: string) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    if (!environment.production) {
      console.log('category_id', id);
    }
    this.category_id = id;
    if (view) {
      this.Viewbyfollow = view;
    } else {
      this.Viewbyfollow = this.language._tat_ca;
    }
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
      , category_id: this.category_id
      // ,start_date: '\'2018-11-01\''
      // ,end_date:  '\'2018-11-30\''
    };
    if (!environment.production) {
      console.log('DATA', data);
    }
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.time_generate_report = new Date();
    this.title_index = this.indexOptionSelected === indexes.cx_index ? indexes.cx_index : indexes.nps_index;
    this.view = this.Viewbyfollow;

    this.appservice.post(data, environment.FBA.API.fba_report_get_metrics_comparison).subscribe(
      respo => {
        try {
          const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          const start_time_number = Number(start_d);
          const end_time_number = Number(end_d);
          intDateRangePicker_viewchild(start_time_number, end_time_number);
          this.style_start_date = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
          this.style_end_date = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
          this.title_location = this.location;
          this.title_question_name = this.question_name;
          this.show_error = false;
          if (respo.hasOwnProperty('status') && respo.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.blockUI.stop();
          }
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
          this.starttime = this.startTimeOption.find(item => item.value === this.startTime).label;
          this.endtime = this.endTimeOption.find(item => item.value === this.endTime).label;
          if (!environment.production) {
            console.log('data gửi về compa', respo);
          }
          this.data = respo.parent;
          this.datafilter = respo.child;

          this.total_total_response = 0;
          this.total_very_positive = 0;
          this.total_positive = 0;
          this.total_negative = 0;
          this.total_very_negative = 0;
          this.avg_very_positive_percent = 0;
          this.avg_positive_percent = 0;
          this.avg_negative_percent = 0;
          this.avg_very_negative_percent = 0;
          this.cxindex = 0;
          this.npsindex = 0;

          for (let i = 0; i < this.datafilter.length; i++) {
            if (this.datafilter[i].id === '0') {
              this.datafilter.splice(i, 1);
            }
          }
          // Tính tổng đánh giá từng đánh giá
          this.datafilter.forEach(element => {
            this.total_total_response += Number(element.total_response);
            this.total_very_positive += Number(element.very_positive);
            this.total_positive += Number(element.positive);
            this.total_negative += Number(element.negative);
            this.total_very_negative += Number(element.very_negative);
          });
          // Tính trung bình phần trăm các đánh giá
          this.avg_very_positive_percent = Number(((this.total_very_positive / this.total_total_response) * 100).toFixed(2));
          this.avg_positive_percent = Number(((this.total_positive / this.total_total_response) * 100).toFixed(2));
          this.avg_negative_percent = Number(((this.total_negative / this.total_total_response) * 100).toFixed(2));
          this.avg_very_negative_percent = Number(((this.total_very_negative / this.total_total_response) * 100).toFixed(2));
          // Tính CX Index
          // tslint:disable-next-line:max-line-length
          this.cxindex = Number((((this.total_very_positive * 100) + (this.total_positive * 66.66) + (this.total_negative * 33.33)) / (this.total_total_response)).toFixed(2));
          // tslint:disable-next-line:max-line-length
          this.npsindex = Number((this.avg_very_positive_percent - this.avg_negative_percent - this.avg_very_negative_percent).toFixed(2));

          if (this.indexOptionSelected === indexes.cx_index) {
            this.showchart1();
          } else {
            this.showchart2();
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
            , category_id: this.category_id
            , Viewbyfollow: this.Viewbyfollow
            , indexOptionSelected: this.indexOptionSelected
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
      }
    );
  } // Kết thúc get data

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
      , category_id: this.category_id
    };
    this.blockUI.start(this.language.dang_xuat_bao_cao);
    this.appservice.post(data, environment.FBA.API.export_metrics_comparison).subscribe(fileData => {
      // const b: any = new Blob([fileData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"  });
      // const url = window.URL.createObjectURL(b);
      window.open(this.url_api + fileData);
      this.name_of_excel = fileData;
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
      const url = environment.FBA.API.export_metrics_comparison + '_delete_excel';
      this.appservice.post(data2, url).subscribe(res => {
        if (!environment.production) {
          console.log('Deleted');
        }
      });
    }
    );
  }

  // Biểu đồ của CX Index
  showchart1() {
    const very_negative_name = this.very_negative_name[0].toUpperCase() + this.very_negative_name.substr(1).toLowerCase();
    const negative_name = this.negative_name[0].toUpperCase() + this.negative_name.substr(1).toLowerCase();
    const very_positive_name = this.very_positive_name[0].toUpperCase() + this.very_positive_name.substr(1).toLowerCase();
    const positive_name = this.positive_name[0].toUpperCase() + this.positive_name.substr(1).toLowerCase();

    let i = 0;
    const chart_xAxis = [];
    const nps_index = [];
    const cx_index = [];
    this.data.forEach(element => {
      chart_xAxis[i] = element.site_name;
      nps_index[i] = Number(element.nps_index);
      cx_index[i] = Number(element.cx_index);
      i++;
    });
    if (!environment.production) {
      console.log('Nps_index +Cx_index:', nps_index, cx_index);
      console.log('VIEW follow CX / NPS Index:', this.indexOptionSelected);
    }

    /*----------Lượt đánh giá ----------*/
    i = 0;
    const very_positive_repon = [];
    const positive_repon = [];
    const negative_repon = [];
    const very_negative_repon = [];
    this.data.forEach(element => {
      very_positive_repon[i] = Number(element.very_positive);
      positive_repon[i] = Number(element.positive);
      negative_repon[i] = Number(element.negative);
      very_negative_repon[i] = Number(element.very_negative);

      i++;
    });
    if (!environment.production) {
      console.log('REPONSE/Very_Pos + Po + Ne + Very_Ne:', very_positive_repon, positive_repon, negative_repon, very_negative_repon);
    }

    Highcharts.chart(this.container.nativeElement, {
      chart: {
        type: 'bar',
        style: {
          fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif !important;',
        }
      }, exporting: { enabled: false },
      title: {
        text: ''
      },
      xAxis: {
        type: 'category',
        scrollbar: {
          enabled: true
        },
        categories: chart_xAxis,
        // mầu trục
        lineColor: '#9a9a9a',
        lineWidth: 1.5,
      },
      // trục oy
      yAxis: [{
        labels: {
          format: '{value}  ',
          style: {
            // color: environment.POC.colors.showcolumn  // labels
            color: '#079d30',
          }
        },
        maxPadding: 0.5,
        // khoảng cách giữa các điểm
        // tickInterval: 2,
        className: '',
        // kẻ gióng ngang dọc hover
        // crosshair: true,
        title: {
          text: 'Response (lượt)',
          style: { color: '#079d30', fontWeight: 'bold' },  // stackLabels
          enabled: this.indexOptionSelected === indexes.cx_index,
        },
        // hiện tổng cột
        stackLabels: {
          style: { color: environment.POC.colors.showcolumn, fontSize: '11px', fontWeight: '400' },
          // y: -15,
          enabled: this.indexOptionSelected === indexes.cx_index,
        },
        // đường gióng ngang
        gridLineWidth: 1,
        // không cho phép lẻ
        allowDecimals: false,
      },
      {
        labels: { // thanh oy
          format: '{value}',
          style: {
            color: environment.POC.colors.labels,
          }
        },
        className: '',
        // kẻ gióng ngang dọc hover
        // crosshair: true,
        title: {
          text: 'CX Index (%)',
          style: { color: environment.POC.colors.stackLabels, fontWeight: 'bold' },
        },
        // hiện tổng cột
        stackLabels: {
          style: { color: environment.POC.colors.showcolumnline, fontSize: '11px', fontWeight: '400', },
          // y: -10,
          enabled: this.indexOptionSelected === indexes.cx_index,
        },
        // đường gióng ngang
        gridLineWidth: 1,
        min: 0,
        maxPadding: 0,
        opposite: true,
      }],
      legend: {
        reversed: true,
        enabled: false,
      },
      plotOptions: {
        series: {
          // bo viền cột 0 là đẹp
          borderWidth: 0,
          stacking: 'normal',
          // màu đường line
          color: environment.POC.colors.fillColor,
          // color: 'transparent',
          // đường line
          lineWidth: 1.5,
          // độ rộng cột
          pointWidth: 25,
          // hover line
          states: {
            hover: {
              enabled: false
            }
          },
          marker: {
            radius: 4 // điểm line
          }
        }
      },
      series: [
        /*----------    CX Index  ----------*/
        {
          name: very_positive_name,
          showInLegend: false,
          color: environment.POC.colors.very_positive,
          data: very_positive_repon,
          tooltip: {
            valuePrefix: '',
            valueSuffix: ' ',
          },
        }, {
          name: positive_name,
          showInLegend: false,
          color: environment.POC.colors.positive,
          data: positive_repon,
          tooltip: {
            valuePrefix: '',
            valueSuffix: ' ',
          },
        }, {
          name: negative_name,
          showInLegend: false,
          color: environment.POC.colors.negative,
          data: negative_repon,
          tooltip: {
            valuePrefix: '',
            valueSuffix: ' ',
          },
        }, {
          name: very_negative_name,
          // none legend
          showInLegend: false,
          color: environment.POC.colors.very_negative,
          data: very_negative_repon,
          tooltip: {
            valuePrefix: '',
            valueSuffix: '  ',
          },
        }, {
          type: 'spline',
          name: indexes.cx_index,
          showInLegend: false,
          data: cx_index,
          marker: {
            // lineWidth: 1,
            // màu các điểm
            fillColor: environment.POC.colors.fillColor,
          }
          , yAxis: 1,
          tooltip: {
            valueDecimals: 0,
            valuePrefix: '', // trước
            valueSuffix: ' %',
          },
        }],
      tooltip: {
        backgroundColor: environment.POC.colors.backgroundColor,
        shared: true,
        padding: 10, // cac cac diem
        distance: 120,  // khoảng cách đến các tooltip
      }
    });
  }
  showchart2() {
    // Kí tự đầu chữ hoa : tên các đánh giá: Kém
    const very_negative_name = this.very_negative_name[0].toUpperCase() + this.very_negative_name.substr(1).toLowerCase();
    const negative_name = this.negative_name[0].toUpperCase() + this.negative_name.substr(1).toLowerCase();
    const very_positive_name = this.very_positive_name[0].toUpperCase() + this.very_positive_name.substr(1).toLowerCase();
    const positive_name = this.positive_name[0].toUpperCase() + this.positive_name.substr(1).toLowerCase();
    const tongtatca = Number(this.total_total_response);
    let i = 0;
    const chart_xAxis = [];
    const nps_index = [];
    const cx_index = [];
    this.data.forEach(element => {
      chart_xAxis[i] = element.site_name;
      nps_index[i] = Number(element.nps_index);
      cx_index[i] = Number(element.cx_index);
      i++;
    });
    if (!environment.production) {
      console.log('Nps_index +Cx_index:', nps_index, cx_index);
      console.log('VIEW follow CX / NPS Index:', this.indexOptionSelected);
    }
    /*----------  Phần trăm  ----------*/
    i = 0;
    const very_positive = [];
    const positive = [];
    const negative = [];
    const very_negative = [];
    // Tính phần trăm thheo từng địa điểm
    // this.data.forEach(element => {
    //   very_positive[i] = Number(element.very_positive_percen);
    //   positive[i] = Number(element.positive_percen);
    //   negative[i] = Number(element.negative_percen) * -1;
    //   very_negative[i] = Number(element.very_negative_percen) * -1;
    //   i++;
    // });
    // Tính phần trăm theo tổng tất cả
    this.data.forEach(element => {
      very_positive[i] = Number(((element.very_positive / tongtatca) * 100).toFixed(2));
      positive[i] = Number(((element.positive / tongtatca) * 100).toFixed(2));
      negative[i] = Number(((element.negative / tongtatca) * -100).toFixed(2));
      very_negative[i] = Number(((element.very_negative / tongtatca) * -100).toFixed(2));
      i++;
    });
    if (!environment.production) {
      console.log('PERCENT/Very_Po+ Po+ Ne+ Very_Ne:', very_positive, positive, negative, very_negative);
    }
    Highcharts.chart(this.container.nativeElement, {
      chart: {
        type: 'bar',
        alignThresholds: true,
        style: {
          fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif !important;',
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: chart_xAxis,
        // crosshair: true,
        // mầu trục
        lineColor: '#9a9a9a',
        lineWidth: 1.5,
        maxPadding: 0.5,
      },
      plotOptions: {
        series: {
          // bo viền cột 0 là đẹp
          borderWidth: 0,
          // độ rộng cột
          pointWidth: 25,
          // cách các cột
          pointPadding: 0.2,
          groupPadding: 0,
          // không bóng
          shadow: false,
          stacking: 'normal',
          // đường line
          lineWidth: 1.5,
          // màu đường line
          color: environment.POC.colors.fillColor,
          // color: 'transparent',
          // hover line
          states: {
            hover: { enabled: false, }
          },
          // điểm line
          marker: { radius: 3, }
        },
      },
      yAxis: [{
        // trục oy
        labels: {
          format: '{value}',
          style: {
            // color: environment.POC.colors.labels,
            color: '#079d30',
          }
        },
        className: '',
        // kẻ gióng ngang dọc hover
        // crosshair: true,
        title: {
          text: 'Response (%)',
          style: { color: '#079d30', fontWeight: 'bold' },   // color: environment.POC.colors.stackLabels
          enabled: this.indexOptionSelected === indexes.nps_index,
        },
        stackLabels: {
          // useHTML: true,
          // hiện tổng cột
          style: { fontWeight: '400', },
          // y: -15,
          enabled: this.indexOptionSelected === indexes.nps_index,
        },
        // đường gióng ngang
        gridLineWidth: 1,
        maxPadding: 0,
        minPadding: 0,
        // không cho phép lẻ
        allowDecimals: false,
      },
      {
        labels: { // thanh oy
          format: '{value}',
          style: {
            color: environment.POC.colors.labels,
          }
        },
        // 2 cột tương ứng
        linkedTo: 0,
        className: '',
        opposite: true,
        min: -100,
        max: 100,
        title: {
          text: 'NPS Index (%)',
          style: { color: environment.POC.colors.stackLabels, fontWeight: 'bold' },
        },
        // cột tới điểm max
        maxPadding: 0,
        stackLabels: {
          // useHTML: true,
          // hiện tổng cột
          style: { fontWeight: '400', },
          // y: -10,
          enabled: this.indexOptionSelected === indexes.nps_index,
        },
      }
      ],
      series: [{
        name: very_positive_name,
        showInLegend: false,
        color: environment.POC.colors.very_positive,
        data: very_positive,
        tooltip: {
          valuePrefix: '',
          valueSuffix: ' % ',
        },
      }, {
        name: positive_name,
        showInLegend: false,
        color: environment.POC.colors.positive,
        data: positive,
        tooltip: {
          valuePrefix: '',
          valueSuffix: ' %',
        },
      }, {
        name: negative_name,
        showInLegend: false,
        color: environment.POC.colors.negative,
        data: negative,
        tooltip: {
          valuePrefix: '',
          valueSuffix: ' %',
        },
      }, {
        name: very_negative_name,
        // none legend
        showInLegend: false,
        color: environment.POC.colors.very_negative,
        data: very_negative,
        tooltip: {
          valuePrefix: '',
          valueSuffix: ' %',
        },
      }, {
        type: 'spline',
        name: indexes.nps_index,
        showInLegend: false,
        data: nps_index,
        marker: {
          // lineWidth: 1,
          // màu các điểm
          fillColor: environment.POC.colors.fillColor,
        },
        yAxis: 0,
        tooltip: {
          valueDecimals: 0,
          valuePrefix: '', // trước
          valueSuffix: ' %'
        },
      }
      ],

      tooltip: {
        backgroundColor: environment.POC.colors.backgroundColor,
        shared: true,
        // khoảng cách đến các tooltip
        distance: 120,
        padding: 10,
      }
    });
  } // End hightchart
  reset_session() {
    const data = [];
    this.site_id = null;
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
      this.ngOnInit();
    });
    // this.modalRef.hide();
  }
}
