import { IOption } from 'ng-select';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Hightcharts from 'highcharts';
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';
import { Timeperiod2Component } from '../../viewchild/timeperiod2/timeperiod2.component';
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  templateUrl: 'time-comparison.component.html',
  styleUrls: ['time-comparison.component.scss'],
  // encapsulation: ViewEncapsulation.None
})

export class FootfallTimeComparisonComponent implements OnInit {
  @ViewChild('TimeInput') TimeInput: TimeperiodComponent;
  @ViewChild('TimeInput_2') TimeInput_2: Timeperiod2Component;

  @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
  page_id = environment.Pages.footfall.time_comparison;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('container1', { read: ElementRef }) container1: ElementRef;
  @ViewChild('content') public helloTemplate: ElementRef;
  organizations = [];
  organization_id: string;
  organization_selected = '';
  siteSelectionDisplay = false;
  site_id: any;
  public modalRef: BsModalRef;
  start_time: string;
  end_time: string;
  start_date: any;
  end_date: any;
  start_date_compare: any;
  end_date_compare: any;
  public startTimeOption: Array<IOption>;
  public endTimeOption: Array<IOption>;
  viewDataBy: string;
  num_to_enter = 0;
  num_to_enter_compare = 0;
  total_num_to_enter = 0;
  total_num_to_enter_compare = 0;

  total_num_to_traffic = 0;
  total_num_to_traffic_compare = 0;

  num_to_exit = 0;
  num_to_exit_compare = 0;
  total_num_to_exit = 0;
  total_num_to_exit_compare = 0;

  total_seconds = 0;
  total_seconds_compare = 0;
  total_avgtime = 0;
  total_avgtime_compare = 0;
  indexOption: Array<IOption>;
  btnApplyValid = false;
  // Index compare
  indexOptionSelected: string;
  // public navItems = navItems;
  public sidebarMinimized = true;
  public chart_data: any;
  public chart_data2: any;
  time_value = '';
  time_value_compare = '';
  public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
  time_period_array: any;
  organization_array: any;
  menu_tree: any[];
  url_api = environment.apiUrl + 'exports/';
  name_of_excel: any;
  time_generate_report = new Date();
  site_name: string;
  title_start_date: string;
  title_end_date: string;
  time_period: string;
  title_time_period: string;
  title_start_date_compare: string;
  title_end_date_compare: string;
  time_period_compare: string;
  title_time_period_compare: string;
  starttime: string;
  title_index: string;
  endtime: string;
  operator = 'SUM';
  up_or_down: string;
  number_chenh_lech: number;
  total_passer_by = 0;
  total_shopper_visits = 0;
  total_passer_by_compare = 0;
  total_shopper_visits_compare = 0;
  total_turn_rate_compare = 0;
  total_kids_compare = 0;
  total_kids = 0;
  total_turn_rate = 0;
  type: string;
  view: string;
  checked: boolean; language: any;
  indexes: any; indexess: any; index_viewby = 1;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  show_label_table: string; show_error = false;

  constructor(private router: Router,
    private modalService: BsModalService,
    private appservice: AppService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.indexes = this.indexess = indexes;
  }
  ngOnInit() {
    this.get_page_param();
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
  get_page_param() {
    this.blockUI.start(this.language.dang_tai_cau_hinh);
    this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
      param => {
        if (!environment.production) {
          console.log('get_user_page_parametter', param);
        }
        // try {
        let para = null;
        this.indexOption = param.traffic_index;
        this.indexes = param.list_index;
        this.indexess = param.list_index_value;
        if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
          para = param.user_page_parametter;
        } else {
          const defaultOrgId = param.organization_arr.length > 0 ? param.organization_arr[0].value : 6;
          para = this.set_default(defaultOrgId);
          // para = this.set_default();
        }
        this.time_period_array = param.fba_time_period_metrics;
        this.organization_array = param.organization_arr;
        this.startTimeOption = param.start_time_list;
        this.endTimeOption = param.end_time_list;
        this.organization_id = para.organization_id;
        if ('site_id' in para) {
          this.site_id = para.site_id;
        }
        this.start_time = para.start_time.replace(/[']/g, '');
        this.end_time = para.end_time.replace(/[']/g, '');
        if (para.time_value && para.time_value_compare) {
          this.get_date(para.time_value, 1);
          this.get_date(para.time_value_compare, 2);
        } else if (para.start_date && para.end_date && para.start_date_compare && para.end_date_compare) {
          this.start_date = para.start_date;
          this.end_date = para.end_date;
          this.start_date_compare = para.start_date_compare;
          this.end_date_compare = para.end_date_compare;
        }
        this.viewDataBy = para.view_by;
        this.indexOptionSelected = para.indexOptionSelected;

        this.time_period_array = this.time_period_array.filter(item => item.value != 'last_fourteen_day');
        if (!environment.production) {
          console.warn('this.time_period_array', this.time_period_array);
        }

        this.TimeInput.get_data(para, this.time_period_array);
        this.TimeInput_2.get_data_compare(para, this.time_period_array);
        this.get_sitetree();
        // } catch (error) {
        //     this.blockUI.stop();
        // }
      }, (error) => {
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
      }, () => {
        // this.blockUI.stop();
      }
    );
  }

  get_date(time, id) {
    const time_array = this.TimeInput.get_time(time);
    const time_array2 = this.TimeInput_2.get_time(time);
    switch (id) {
      case 1: {
        this.start_date = this.appservice.convert_date_tostring(time_array.ngaybatdau);
        this.end_date = this.appservice.convert_date_tostring(time_array.ngayketthuc);
        this.time_value = time;
        this.index_viewby = time_array.order;
        break;
      }
      case 2: {
        this.start_date_compare = this.appservice.convert_date_tostring(time_array2.ngaybatdau);
        this.end_date_compare = this.appservice.convert_date_tostring(time_array2.ngayketthuc);
        this.time_value_compare = time;
        break;
      }
    }
  }

  set_default(defaultOrgId: any) {
    const organization_id = this.userinfo.organization_id === '0' ? defaultOrgId : Number(this.userinfo.organization_id);
    // const organization_id = this.userinfo.organization_id === '0' ? 6 : Number(this.userinfo.organization_id);
    // const value_index = this.indexOption.find(item => item.value === this.indexess.shoppers).value;
    const value_index = this.indexOption[0].value;
    return {
      organization_id: organization_id
      // , site_id: 0
      , start_time: '00:00'
      , end_time: '23:59'
      , time_value: 'today'
      , time_value_compare: 'yesterday'
      , view_by: 'Hour'
      , indexOptionSelected: value_index
    };
  }

  reset_session() {
    const data = [];
    this.site_id = null;
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
      this.get_page_param();
    });
    // this.modalRef.hide();
  }

  get_sitetree() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.sites + '_get_site_for_report';
    const data = { organization_id: this.organization_id };
    this.appservice.post(data, url).subscribe(res => {
      try {
        // console.log(res);
        this.menu_tree = res.site_array.slice(0);
        if (!this.site_id) {
          this.site_id = this.menu_tree.find(item => Number(item.enables) === 1).id;
        }
        this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
        this.get_data();
      } catch (error) {
        this.blockUI.stop();
      }
    }, (error) => {
      this.blockUI.stop();
      // this.push_notification();
      this.show_error = true;
    }, () => {
      // this.blockUI.stop();
    });
  }

  // Nghĩa thêm function get emit data
  get_date_from_emit(event, id) {
    switch (id) {
      case 1: {
        if (event[0].start_date && event[0].end_date) {
          this.start_date = event[0].start_date;
          this.end_date = event[0].end_date;
          this.time_value = '';
          this.index_viewby = 2;
        } else if (event[0].time_value) {
          this.time_value = event[0].time_value;
          this.get_date(this.time_value, 1);
          this.index_viewby = event[0].index_viewby;
        }
        break;
      }
      case 2: {
        if (event[0].start_date && event[0].end_date) {
          this.start_date_compare = event[0].start_date;
          this.end_date_compare = event[0].end_date;
          this.time_value_compare = '';
        } else if (event[0].time_value) {
          this.time_value_compare = event[0].time_value;
          this.get_date(this.time_value_compare, 2);
        }
        break;
      }
    }
    this.viewDataBy = 'Hour';
  }

  get_emit_menu(event) {
    if (event.organization_id) {
      this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
      const data = { organization_id: event.organization_id };
      const url = environment.API.sites + '_get_site_for_report';
      this.appservice.post(data, url).subscribe(res => {
        try {
          // console.log(res);
          this.menu_tree = res.site_array.slice(0);
          this.organization_id = event.organization_id;
          this.site_id = this.menu_tree[0].id;
          this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
          this.get_data();
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
      }, () => {
        // this.blockUI.stop();
      });
    } else if (event.site_id || event.site_id === 0) {
      this.site_id = event.site_id;
    }
  }

  // Huy thêm hàm lấy số dương
  get_number_int(number_comared: number, number2: number) {
    const chenhlech = Number(number2 - number_comared);
    this.up_or_down = chenhlech > 0 ? 'caret-up' : chenhlech === 0 ? 'sort' : 'caret-down';
    this.number_chenh_lech = Math.abs(chenhlech);
    return Math.abs(chenhlech);
  }

  get_compar_per(number1: number, number2: number) {
    let per = 0;
    // if (Number(number1) >= Number(number2)) {
    //     per = (Number(number2) / Number(number1) * 100);
    // } else {
    per = (Number(number1) / Number(number2) * 100);
    // }
    return per;
  }

  Go_number(number, total) {
    let tong = 0;
    if (total !== 0) { tong = ((Number(number) / total) * 100); return tong.toFixed(2); }
    return tong;
  }

  reset_to_zero(...array) {
    array.forEach(element => { this[element] = 0; });
  }

  get_data() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , view_by: this.viewDataBy
      , start_date_compare: this.start_date_compare
      , end_date_compare: this.end_date_compare
      , indexOptionSelected: this.indexOptionSelected
      , operator: this.operator
    };
    if (!environment.production) {
      // console.log('data', data);
    }
    // this.title_index = this.indexOptionSelected;
    this.title_index = this.indexOption.find(item => item.value === this.indexOptionSelected).label;
    const chart_xAxis = [];
    this.time_generate_report = new Date();
    // tslint:disable-next-line:max-line-length
    this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.language.gio;
    this.appservice.post(data, environment.API.sp_footfall_time_comparison).subscribe(
      res => {
        try {
          if (!environment.production) {
            console.log('res', res);
          }
          this.show_error = false;
          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.chart_data = null;
            this.blockUI.stop();

          }
          this.site_name = this.MenuInput.menu_tree.find(item => item.id === this.site_id).site_name;
          this.starttime = this.startTimeOption.find(item => item.value === this.start_time).label;
          this.endtime = this.endTimeOption.find(item => item.value === this.end_time).label;
          const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          this.title_start_date = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
          this.title_end_date = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
          if (this.start_date !== this.end_date) {
            this.time_period = this.title_start_date + ' - ' + this.title_end_date;
          } else { this.time_period = this.title_start_date; }

          const start_d_compare = new Date(this.start_date_compare.replace(/[']/g, '').replace(/[-]/g, '/'));
          const end_d_compare = new Date(this.end_date_compare.replace(/[']/g, '').replace(/[-]/g, '/'));
          this.title_start_date_compare = this.appservice.convert_date_tostringdate_by_nghia(start_d_compare, false);
          this.title_end_date_compare = this.appservice.convert_date_tostringdate_by_nghia(end_d_compare, false);
          if (this.title_start_date_compare !== this.title_end_date_compare) {
            this.time_period_compare = this.title_start_date_compare + ' - ' + this.title_end_date_compare;
          } else { this.time_period_compare = this.title_start_date_compare; }


          this.title_time_period_compare = this.title_time_period = this.language.ngay;
          this.chart_data = [];
          // hiển thị giá trị vao biểu đồ bảng theo dữ liệu trả về của data
          let i = 0;
          if (res.data_compare.length >= res.data.length) {
            this.get_data_for_table_data(res.data_compare, res.data);
            res.data_compare.forEach(element => { chart_xAxis[i] = element.time_period; i++; });
          } else {
            this.get_data_for_table_data_compare(res.data, res.data_compare);
            i = 0;
            res.data.forEach(element => { chart_xAxis[i] = element.time_period; i++; });
          }
          this.chart_data2 = res.data_compare;
          const num_to_enter = [];
          const num_to_exit = [];
          const num_to_enter_compare = [];
          const num_to_exit_compare = [];
          const traffic = [];
          const traffic_compare = [];
          const passer_by = [];
          const passer_by_compare = [];
          const shopper_visits = [];
          const shopper_visits_compare = [];
          const turn_rate = [];
          const turn_rate_compare = [];
          const kids = [];
          const kids_compare = [];
          const avg_time = [];
          const avg_time_compare = [];

          // biểu đồ theo  lịch 1
          i = 0;
          let si = 0;
          this.reset_to_zero(
            'total_num_to_enter', 'total_num_to_enter_compare',
            'total_num_to_exit', 'total_num_to_exit_compare',
            'total_num_to_traffic', 'total_num_to_traffic_compare',
            'total_avgtime', 'total_avgtime_compare',
            'total_passer_by', 'total_passer_by_compare',
            'total_kids', 'total_kids_compare',
            'total_turn_rate', 'total_turn_rate_compare',
            'total_seconds', 'total_seconds_compare',
            'total_shopper_visits', 'total_shopper_visits_compare');

          res.data.forEach(element => {
            num_to_enter[i] = Number(element.num_to_enter);
            this.total_num_to_enter += Number(num_to_enter[i]);

            num_to_exit[i] = Number(element.num_to_exit);
            this.total_num_to_exit += Number(num_to_exit[i]);

            traffic[i] = Number(element.traffic);
            this.total_num_to_traffic += Number(traffic[i]);

            passer_by[i] = Number(element.passer_by);
            this.total_passer_by += Number(passer_by[i]);

            shopper_visits[i] = Number(element.shopper_visits);
            this.total_shopper_visits += Number(shopper_visits[i]);

            turn_rate[i] = Number(element.turn_in_rate);
            this.total_turn_rate += Number(turn_rate[i]);

            kids[i] = Number(element.kids_visits);
            this.total_kids += Number(kids[i]);
            this.total_seconds += Number(element.total_seconds);

            avg_time[i] = Number(element.avg_time);
            this.total_avgtime += Number(avg_time[i]);
            i++;
            if (Number(element.avg_time) > 0) {
              si++;
            }
          });
          // tslint:disable-next-line: max-line-length
          this.total_turn_rate = Number(this.total_passer_by) > 0 ? Number(((Number(this.total_num_to_enter) / Number(this.total_passer_by)) * 100).toFixed(2)) : 0;
          // // biểu đồ theo  lịch 2
          i = 0;
          let si_compare = 0;
          res.data_compare.forEach(element => {
            num_to_enter_compare[i] = Number(element.num_to_enter);
            this.total_num_to_enter_compare += Number(num_to_enter_compare[i]);

            num_to_exit_compare[i] = Number(element.num_to_exit);
            this.total_num_to_exit_compare += Number(num_to_exit_compare[i]);

            traffic_compare[i] = Number(element.traffic);
            this.total_num_to_traffic_compare += Number(traffic_compare[i]);

            passer_by_compare[i] = Number(element.passer_by);
            this.total_passer_by_compare += Number(passer_by_compare[i]);

            shopper_visits_compare[i] = Number(element.shopper_visits);
            this.total_shopper_visits_compare += Number(shopper_visits_compare[i]);

            turn_rate_compare[i] = Number(element.turn_in_rate);
            this.total_turn_rate_compare += Number(turn_rate_compare[i]);

            kids_compare[i] = Number(element.kids_visits);
            this.total_kids_compare += Number(kids_compare[i]);
            this.total_seconds_compare += Number(element.total_seconds);
            avg_time_compare[i] = Number(element.avg_time);
            this.total_avgtime_compare += Number(avg_time_compare[i]);
            if (Number(element.avg_time) > 0) {
              si_compare++;
            }
            i++;
          });

          this.total_avgtime = Number(si) > 0 ? Number((this.total_avgtime * 60 / si).toFixed(0)) : 0;
          // tslint:disable-next-line: max-line-length
          this.total_avgtime_compare = Number(si_compare) > 0 ? Number((this.total_avgtime_compare * 60 / si_compare).toFixed(0)) : 0;

          // tslint:disable-next-line: max-line-length
          this.total_turn_rate_compare = Number(this.total_passer_by_compare) > 0 ? Number(((Number(this.total_num_to_enter_compare) / Number(this.total_passer_by_compare)) * 100).toFixed(2)) : 0;

          if (chart_xAxis.length > 0) {
            this.show_label_table = chart_xAxis[0] + ' - ' + chart_xAxis[chart_xAxis.length - 1];
          }
          this.chart1(chart_xAxis, num_to_enter, num_to_enter_compare, num_to_exit, num_to_exit_compare, avg_time, avg_time_compare,
            // tslint:disable-next-line:max-line-length
            traffic, traffic_compare, passer_by, passer_by_compare, kids, kids_compare, turn_rate, turn_rate_compare, shopper_visits, shopper_visits_compare);
          let save_data;
          if (this.time_value !== '' && this.time_value_compare !== '') {
            const data_2 = {
              organization_id: this.organization_id
              , site_id: this.site_id
              , start_time: this.start_time
              , end_time: this.end_time
              , time_value: this.time_value
              , view_by: this.viewDataBy
              , time_value_compare: this.time_value_compare
              , indexOptionSelected: this.indexOptionSelected
            };
            save_data = data_2;
          } else {
            save_data = data;
          }
          this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(save_data));
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
        this.reset_session();
      }, () => {
        this.blockUI.stop();
      }
    );
  }

  get_data_for_table_data(data1, data2) {
    let chart_data: { [k: string]: any } = {};
    data1.forEach((element, index) => {
      if (data2[index]) {
        chart_data = data2[index];
        // console.log('chart_data' + index, chart_data['time_period']);
        if (this.viewDataBy !== 'Hour') {
          const time_old = chart_data['time_period'];
          delete chart_data['time_period'];
          chart_data['time_period'] = time_old + ' / ' + element.time_period;
        }
      } else {
        chart_data = {
          adult_trafic: null,
          avg_time: null,
          avg_time_seconds: null,
          avg_time_string: null,
          child_trafic: null,
          id: null,
          num_adult_to_enter: null,
          num_adult_to_exit: null,
          num_child_to_enter: null,
          num_child_to_exit: null,
          num_to_enter: null,
          num_to_exit: null,
          traffic: null,
          passer_by: null,
          shopper_visits: null,
          turn_in_rate: null,
          kids_visits: null,
          time_period: element.time_period
        };
      }
      chart_data.num_to_enter_compare = element.num_to_enter;
      chart_data.num_to_exit_compare = element.num_to_exit;
      chart_data.traffic_compare = element.traffic;
      chart_data.avg_time_compare = element.avg_time;
      chart_data.passer_by_compare = element.passer_by;
      chart_data.turn_in_rate_compare = element.turn_in_rate;
      chart_data.kids_visits_compare = element.kids_visits;
      chart_data.shopper_visits_compare = element.shopper_visits;
      this.chart_data.push(chart_data);
    });
  }

  get_data_for_table_data_compare(data1, data2) {
    let chart_data: { [k: string]: any } = {};
    data1.forEach((element, index) => {
      chart_data = data1[index];
      if (data2[index]) {
        if (this.viewDataBy !== 'Hour') {
          const time_data_compa = data2[index]['time_period'];
          const time_data = element.time_period;
          delete chart_data['time_period'];
          chart_data['time_period'] = time_data + ' / ' + time_data_compa;
          chart_data['num_to_enter_compare'] = data2[index].num_to_enter;
          chart_data['num_to_exit_compare'] = data2[index].num_to_exit;
          chart_data['traffic_compare'] = data2[index].traffic;
          chart_data['avg_time_compare'] = data2[index].avg_time;
          chart_data['passer_by_compare'] = data2[index].passer_by;
          chart_data['turn_in_rate_compare'] = data2[index].turn_in_rate;
          chart_data['kids_visits_compare'] = data2[index].kids_visits;
          chart_data['shopper_visits_compare'] = data2[index].shopper_visits;
        }
      } else {
        chart_data['num_to_enter_compare'] = null;
        chart_data['num_to_exit_compare'] = null;
        chart_data['traffic_compare'] = null;
        chart_data['avg_time'] = null;
        chart_data['passer_by'] = null;
        chart_data['kids_visits'] = null;
        chart_data['turn_in_rate'] = null;
        chart_data['shopper_visits'] = null;
      }
      this.chart_data.push(chart_data);
    });
  }

  toHHMMSS(totalSeconds) {
    const hh = Math.floor(totalSeconds / 3600).toFixed(0);
    totalSeconds %= 3600;
    const mm = Math.floor(totalSeconds / 60).toFixed(0);
    const sc = (totalSeconds % 60).toFixed(0);
    const m = String(mm).padStart(2, '00');
    const h = String(hh).padStart(2, '00');
    const s = String(sc).padStart(2, '00');
    return h + ':' + m + ':' + s;
  }

  toMM = (secs) => {
    const minutes = Math.floor(secs / 60); return minutes;
  }

  exportExcel(): void {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , view_by: this.viewDataBy
      , start_date_compare: this.start_date_compare
      , end_date_compare: this.end_date_compare
      , indexOptionSelected: this.indexOptionSelected
    };
    this.blockUI.start(this.language.dang_xuat_bao_cao);
    this.appservice.post(data, environment.API.sp_footfall_time_comparison + '_export_excel').subscribe(fileData => {
      window.open(this.url_api + fileData);
      this.name_of_excel = fileData;
      if (!environment.production) { console.log('Successed'); }
    }, (error) => {
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
      const data2 = { name_of_excel: this.name_of_excel };
      const url = environment.FBA.API.export_metrics_analytic + '_delete_excel';
      this.appservice.post(data2, url).subscribe(res => {
        if (!environment.production) { console.log('Deleted'); }
      });
    }
    );
  }

  selectd() {
    if (this.indexOptionSelected === this.indexess.turn_in_rate || this.indexOptionSelected === this.indexess.conversion_rate
      || this.indexOptionSelected === this.indexess.avg_time || this.indexOptionSelected === this.indexess.transactions
      || this.indexOptionSelected === this.indexess.avg_items || this.indexOptionSelected === this.indexess.member_transactions
      || this.indexOptionSelected === this.indexess.member_conversion_rate
      || this.indexOptionSelected === this.indexess.member_conversion_rate
      || this.indexOptionSelected === this.indexess.cx_index || this.indexOptionSelected === this.indexess.nps_index) {
      this.checked = true;
    } else {
      this.checked = false;
    }
    return this.checked;
  }

  chart1(chart_xAxis, num_to_enter, num_to_enter_compare, num_to_exit, num_to_exit_compare, avg_time, avg_time_compare, traffic, traffic_compare,
    // tslint:disable-next-line:max-line-length
    passer_by, passer_by_compare, kids_visits, kids_visits_compare, turn_in_rate, turn_in_rate_compare, shopper_visits, shopper_visits_compare) {
    const selft = this;
    const select = this.indexOptionSelected;
    const color = environment.POC.colors;
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
    })(Hightcharts);
    Hightcharts.chart(this.container1.nativeElement, {
      chart: { height: 500, style: { fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif !important;', } },
      title: { text: '' },
      subtitle: {
        useHTML: true, align: 'left', y: 0,
        text: ' '
      },
      tooltip: { shared: true, distance: 80, padding: 10, },
      plotOptions: {
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
      navigation: { buttonOptions: { align: 'right', verticalAlign: 'bottom', y: -8 } },
      xAxis: [{
        labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
        categories: chart_xAxis,
      }],
      yAxis: [
        {
          // formatter() { return this.axis.defaultLabelFormatter.call(this); }
          labels: { format: '{value}', style: { color: color.visits } },
          allowDecimals: false, title: { text: this.indexes.visitors, style: { color: color.visits, fontWeight: 'bold' } },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.visitors,
        }, {
          labels: { format: '{value}', style: { color: color.traffic_flow } },
          allowDecimals: false, title: {
            text: this.indexes.traffic_flow,
            style: { color: color.traffic_flow, fontWeight: 'bold' }
          },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.traffic_flow,
        }, {
          labels: { format: '{value}', style: { color: color.passer_by } },
          allowDecimals: false, title: { text: this.indexes.passerby, style: { color: color.passer_by, fontWeight: 'bold' } },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.passerby,
        }, {
          labels: { format: '{value}', style: { color: color.shopper_visits } },
          allowDecimals: false, title: {
            text: this.indexes.shoppers,
            style: { color: color.shopper_visits, fontWeight: 'bold' }
          },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.shoppers,
        }, {
          labels: { format: '{value}', style: { color: color.kids_visits } },
          allowDecimals: false, title: {
            text: this.indexes.kids_visitors,
            style: { color: color.kids_visits, fontWeight: 'bold' }
          },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.kids_visitors,
        }, {
          labels: { format: '{value}', style: { color: color.turn_in_rate } },
          title: { text: this.indexes.turn_in_rate, style: { color: color.turn_in_rate, fontWeight: 'bold' } },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.turn_in_rate, allowDecimals: false,
        }, {
          labels: { format: '{value}', style: { color: color.avg_time } },
          title: { text: this.indexes.avg_time + this.language.min, style: { color: color.avg_time, fontWeight: 'bold' } },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.avg_time, allowDecimals: false,
        }],
      series: [
        {
          name: this.indexes.visitors, color: color.visits, type: selft.type_chart(), yAxis: 0, data: num_to_enter,
          showInLegend: select === this.indexess.visitors, visible: select === this.indexess.visitors, selected: selft.selectd(),
        },
        {
          name: this.indexes.visitors + this.language.Compared, color: color.compare, type: selft.type_chart(),
          data: num_to_enter_compare,
          showInLegend: select === this.indexess.visitors, visible: select === this.indexess.visitors,
          selected: selft.selectd(), yAxis: 0,
        },

        {
          name: this.indexes.exits, color: color.exits, type: selft.type_chart(), yAxis: 0, data: num_to_exit,
          showInLegend: select === this.indexess.exits, visible: select === this.indexess.exits, selected: selft.selectd(),
        },
        {
          name: this.indexes.exits + this.language.Compared, color: color.compare, type: selft.type_chart(),
          data: num_to_exit_compare,
          showInLegend: select === this.indexess.exits, visible: select === this.indexess.exits,
          selected: selft.selectd(), yAxis: 0,
        },
        {
          name: this.indexes.passerby, color: color.passer_by, type: selft.type_chart(), yAxis: 2, data: passer_by,
          showInLegend: select === this.indexess.passerby, visible: select === this.indexess.passerby,
          selected: selft.selectd(),
        }, {
          name: this.indexes.passerby + this.language.Compared, color: color.compare, type: selft.type_chart(),
          yAxis: 2, data: passer_by_compare,
          showInLegend: select === this.indexess.passerby, visible: select === this.indexess.passerby,
          selected: selft.selectd(),
        }, {
          name: this.indexes.shoppers, color: color.shopper_visits, type: selft.type_chart(), yAxis: 3, data: shopper_visits,
          showInLegend: select === this.indexess.shoppers, visible: select === this.indexess.shoppers,
          selected: selft.selectd(),
        }, {
          name: this.indexes.shoppers + this.language.Compared, color: color.compare, type: selft.type_chart(),
          data: shopper_visits_compare,
          showInLegend: select === this.indexess.shoppers, visible: select === this.indexess.shoppers,
          selected: selft.selectd(), yAxis: 3,
        }, {
          name: this.indexes.traffic_flow, color: color.traffic_flow, type: selft.type_chart(),
          yAxis: 1, data: traffic,
          showInLegend: select === this.indexess.traffic_flow, visible: select === this.indexess.traffic_flow,
          selected: selft.selectd(),
        }, {
          name: this.indexes.traffic_flow + this.language.Compared, color: color.compare, type: selft.type_chart(),
          data: traffic_compare,
          showInLegend: select === this.indexess.traffic_flow, visible: select === this.indexess.traffic_flow,
          selected: selft.selectd(),
          yAxis: 1,
        }, {
          name: this.indexes.kids_visitors, color: color.kids_visits, type: selft.type_chart(), yAxis: 4,
          data: kids_visits,
          showInLegend: select === this.indexess.kids_visitors, visible: select === this.indexess.kids_visitors,
          selected: selft.selectd(),
        }, {
          name: this.indexes.kids_visitors + this.language.Compared, color: color.compare, type: selft.type_chart(), yAxis: 4,
          data: kids_visits_compare,
          showInLegend: select === this.indexess.kids_visitors, visible: select === this.indexess.kids_visitors,
          selected: selft.selectd(),
        }, {
          name: this.indexes.turn_in_rate, color: color.turn_in_rate, type: selft.type_chart(), yAxis: 5, data: turn_in_rate,
          showInLegend: select === this.indexess.turn_in_rate, visible: select === this.indexess.turn_in_rate,
          selected: selft.selectd(),
        }, {
          name: this.indexes.turn_in_rate + this.language.Compared, color: color.compare, type: selft.type_chart(), yAxis: 5,
          data: turn_in_rate_compare,
          showInLegend: select === this.indexess.turn_in_rate, visible: select === this.indexess.turn_in_rate,
          selected: selft.selectd(),
        }, {
          name: this.indexes.avg_time + this.language.min, color: color.avg_time,
          type: selft.type_chart(), yAxis: 6, data: avg_time,
          // tslint:disable-next-line:max-line-length
          tooltip: { pointFormatter: function () { const point1 = this; return '<span style="color:' + point1.color + '">\u25CF</span> ' + point1.series.name + ': <b>' + selft.toHHMMSS(point1.y * 60) + '</b><br/>'; } },
          showInLegend: select === this.indexess.avg_time, visible: select === this.indexess.avg_time,
          selected: selft.selectd(),
        }, {
          name: this.indexes.avg_time + this.language.Compared + ' (min)',
          color: color.compare, type: selft.type_chart(), data: avg_time_compare,
          // tslint:disable-next-line:max-line-length
          tooltip: { pointFormatter: function () { const point2 = this; return '<span style="color:' + point2.color + '">\u25CF</span> ' + point2.series.name + ': <b>' + selft.toHHMMSS(point2.y * 60) + '</b><br/>'; } },
          showInLegend: select === this.indexess.avg_time, visible: select === this.indexess.avg_time,
          selected: selft.selectd(), yAxis: 6,
        },
      ]
    });
  }

  type_chart() {
    if (this.indexOptionSelected === this.indexess.turn_in_rate || this.indexOptionSelected === this.indexess.conversion_rate
      || this.indexOptionSelected === this.indexess.avg_time || this.indexOptionSelected === this.indexess.transactions
      || this.indexOptionSelected === this.indexess.avg_items || this.indexOptionSelected === this.indexess.member_transactions
      || this.indexOptionSelected === this.indexess.member_conversion_rate
      || this.indexOptionSelected === this.indexess.member_conversion_rate
      || this.indexOptionSelected === this.indexess.cx_index || this.indexOptionSelected === this.indexess.nps_index) {
      this.type = 'spline';
    } else {
      this.type = 'column';
    }
    return this.type;
  }

  remove_percent(index_name) {
    return index_name.replace('(%)', '');
  }

  change_view() {
    this.get_data();
  }
}
