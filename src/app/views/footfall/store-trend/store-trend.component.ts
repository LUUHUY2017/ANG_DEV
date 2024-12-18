import { IOption } from 'ng-select';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Highcharts from 'highcharts';
import { navItems } from '../../../_nav';
// treenode
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StoreReportingFFScheduleComponent } from '../../useremailmodule/footfall/storereporting/storereporting.component';
import { NotifierService } from 'angular-notifier';
@Component({
  templateUrl: 'store-trend.component.html',
  styleUrls: ['store-trend.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class FootfallStoreTrendComponent implements OnInit {
  @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
  defaultModule = 1;
  indexViewBy: number;
  currentPageId = environment.Pages.footfall.store_trend;
  @ViewChild('MenuInput') MenuInput: MenutreeComponent;
  @ViewChild('MenuInput_1') MenuInput_1: MenutreeComponent;
  @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('content') public helloTemplate: ElementRef;
  page_id = environment.Pages.footfall.store_trend;
  public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
  public navItems = navItems;
  public sidebarMinimized = true;
  protected changes: MutationObserver;
  public modalRef: BsModalRef;
  public element: HTMLElement = document.body;
  organization_array = [];
  organization_id: any;
  organization_id_compare: any;
  siteSelectionDisplay = false;
  site_id: any;
  site_id_compare: any;
  start_time: string;
  end_time: string;
  start_date: any;
  end_date: any;
  startTimeOption: Array<IOption>;
  endTimeOption: Array<IOption>;
  indexOption: Array<IOption>;
  indexOptionSelected: string;
  viewDataBy: string;
  total_num_to_enter = 0;
  total_num_to_exit = 0;
  total_traffic = 0;
  total_avg_time: number;
  time_period_array: any;
  site_name: any;
  site_name_compare: any;
  btnApplyValid = false;
  organization_array_compare: any;
  time_value: any = '';
  menu_tree: any[];
  total_traffic_compare: number;
  total_num_to_enter_compare: number;
  total_num_to_exit_compare: number;
  total_avg_time_compare: number;
  all_data: any[];
  all_data_compare: any[];
  show_table: number;
  time_generate_report = new Date();
  title_start_date: string;
  title_end_date: string;
  time_period: string;
  title_time_period: string;
  title_index: string;
  starttime: string;
  endtime: string;
  view: string;
  operator = 'AVG';
  total_passer_by = 0;
  total_shopper_visits = 0;
  total_passer_by_compare = 0;
  total_shopper_visits_compare = 0;
  total_kids_compare = 0; total_seconds = 0; total_seconds_compare = 0;
  total_kids = 0;
  total_turn_rate = 0;
  total_turn_rate_compare = 0;
  valueSuffix: string;
  type: string;
  checked: boolean;
  indexes: any; indexess: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  show_label_table: string;
  constructor(protected router: Router,
    private modalService: BsModalService,
    protected appservice: AppService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.indexes = this.indexess = indexes;
  }
  url_api = environment.apiUrl + 'exports/';
  name_of_excel: any; language: any; index_viewby = 1; show_error = false;

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

  // Children
  submitChange() {
    this.reCheckExistParams();
    this.get_data();
  }
  sendParamToChildren() {
    console.log('site_id 1111', this.site_id);
    const dataFromParent = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: this.start_time
      , end_time: this.end_time
      , view_by: this.viewDataBy
      , organization_id_compare: this.organization_id_compare
      , site_id_compare: this.site_id_compare
      , indexOptionSelected: this.indexOptionSelected
      , operation: this.operator
      , export: 'xuhuong'
    };
    const indexViewBy = this.TimeInput.indexViewby;
    this.scheduleComponent.getParametter(dataFromParent, indexViewBy);
  }
  reCheckExistParams() {
    const dataFromParent = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: this.start_time
      , end_time: this.end_time
      , view_by: this.viewDataBy
      , organization_id_compare: this.organization_id_compare
      , site_id_compare: this.site_id_compare
      , indexOptionSelected: this.indexOptionSelected
      , operation: this.operator
      , export: 'xuhuong'
    };
    const indexViewBy = this.TimeInput.indexViewby;
    this.scheduleComponent.checkExistParam(dataFromParent, indexViewBy);
  }
  // end chilren

  get_page_param() {
    this.blockUI.start(this.language.dang_tai_cau_hinh);
    this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
      param => {
        if (!environment.production) {
          console.log('get_user_page_parametter', param);
        }
        try {
          let para = null;
          this.indexes = param.list_index;
          this.indexess = param.list_index_value;
          this.indexOption = param.traffic_index;
          if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
            // console.log('trong if');
            para = param.user_page_parametter;
          } else {
            // console.log('ngoai if');
            const defaultOrgId = param.organization_arr.length > 0 ? param.organization_arr[0].value : 6;
            para = this.set_default(defaultOrgId);
            // para = this.set_default();
          }
          if (!environment.production) {
            console.log(para);
          }
          this.time_period_array = param.fba_time_period_metrics;
          this.organization_array = param.organization_arr;
          this.organization_array_compare = param.organization_arr;
          this.startTimeOption = param.start_time_list;
          this.endTimeOption = param.end_time_list;
          this.organization_id = para.organization_id;
          this.organization_id_compare = para.organization_id_compare;
          if ('site_id' in para) {
            this.site_id = para.site_id;
          }
          if ('site_id_compare' in para) {
            this.site_id_compare = para.site_id_compare;
          }
          this.start_time = para.start_time.replace(/[']/g, '');
          this.end_time = para.end_time.replace(/[']/g, '');
          if (para.time_value) {
            this.get_date(para.time_value);
          } else if (para.start_date && para.end_date) {
            this.start_date = para.start_date;
            this.end_date = para.end_date;
          }
          this.viewDataBy = para.view_by;
          this.indexOptionSelected = para.indexOptionSelected;
          this.TimeInput.get_data(para, this.time_period_array);
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
      }, () => {
        this.get_sitetree().then(res => {
          return this.get_sitetree_compare();
        }).then(res => {
          this.get_data();
        });
      }
    );
  }

  get_date(time) {
    const time_array = this.TimeInput.get_time(time);
    this.start_date = this.appservice.convert_date_tostring(time_array.ngaybatdau);
    this.end_date = this.appservice.convert_date_tostring(time_array.ngayketthuc);
    this.time_value = time;
    this.index_viewby = time_array.order;
  }

  set_default(defaultOrgId: any) {
    const organization_id = this.userinfo.organization_id === '0' ? defaultOrgId : Number(this.userinfo.organization_id);
    // const organization_id = this.userinfo.organization_id === '0' ? 6 : Number(this.userinfo.organization_id);
    // const value_index = this.indexOption.find(item => item.value === indexes.shoppers).value;
    const value_index = this.indexOption[0].value;
    return {
      organization_id: organization_id
      , organization_id_compare: organization_id
      // , site_id: 0
      // , site_id_compare: 0
      , start_time: '00:00'
      , end_time: '23:59'
      , time_value: 'today'
      , view_by: 'Hour'
      , indexOptionSelected: value_index
    };
  }

  reset_session() {
    const data = [];
    this.site_id = null;
    this.site_id_compare = null;
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
      this.get_page_param();
    });
    // this.modalRef.hide();
  }

  get_emit_menu(event) {
    if (event.organization_id) {
      this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
      const agrument = { organization_id: event.organization_id };
      const url = environment.API.sites + '_get_site_for_report';
      this.appservice.post(agrument, url).subscribe(res => {
        try {
          // console.log(res);
          this.menu_tree = res.site_array.slice(0);
          this.organization_id = event.organization_id;
          this.site_id = this.menu_tree[0].id;
          this.site_name = this.menu_tree[0].name;
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

  get_emit_menu_compare(event) {
    if (event.organization_id) {
      this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
      const agrument = { organization_id: event.organization_id };
      const url = environment.API.sites + '_get_site_for_report';
      this.appservice.post(agrument, url).subscribe(res => {
        try {
          // console.log(res);
          this.menu_tree = res.site_array.slice(0);
          this.organization_id_compare = event.organization_id;
          this.site_id_compare = this.menu_tree[0].id;
          this.site_name_compare = this.menu_tree[0].name;
          this.MenuInput_1.get_data(this.menu_tree
            , this.site_id_compare
            , this.organization_array_compare
            , this.organization_id_compare);
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
      this.site_id_compare = event.site_id;
    }
  }

  // Huy thêm hàm lấy số dương
  get_number_int(number) {
    if (number !== 0) {
      return Math.abs(number);
    }
    return 0;
  }

  get_compar_per(number1: number, number2: number) {
    let per = 0;
    if (number2 !== 0) {
      per = (Number(number1) / Number(number2));
    }
    return per.toFixed(2);
  }

  // Nghĩa thêm function ngày 28/12
  Go_number(number, total) {
    let tong = 0;
    if (total !== 0) {
      tong = ((Number(number) / total) * 100);
      return tong.toFixed(2);
    }
    return tong;
  }

  get_sitetree() {
    this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
    const url = environment.API.sites + '_get_site_for_report';
    const agrument = {
      organization_id: this.organization_id
    };
    return new Promise(resolve => {
      this.appservice.post(agrument, url).subscribe(res => {
        if (!environment.production) {
          console.log(res);
        }
        try {
          this.menu_tree = res.site_array.slice(0);
          const element = this.menu_tree.find(item => Number(item.enables) === 1);
          if (!this.site_id) {
            this.site_id = element.id;
          }
          this.site_name = element.name;
          this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
      }, () => {
        this.blockUI.stop();
        resolve();
      });
    });
  }

  get_sitetree_compare() {
    this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
    const url = environment.API.sites + '_get_site_for_report';
    const agrument = {
      organization_id: this.organization_id_compare
    };
    return new Promise(resolve => {
      this.appservice.post(agrument, url).subscribe(res => {
        if (!environment.production) {
          console.log(res);
        }
        try {
          this.menu_tree = res.site_array.slice(0);
          const element = this.menu_tree.find(item => Number(item.enables) === 1);
          if (!this.site_id_compare) {
            this.site_id_compare = element.id;
          }
          this.site_name_compare = element.name;
          this.MenuInput_1.get_data(
            this.menu_tree
            , this.site_id_compare
            , this.organization_array_compare
            , this.organization_id_compare);
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
      }, () => {
        this.blockUI.stop();
        resolve();
      }
      );
    });
    // return this.appservice.fba_get_org_tree(this.organization_id_compare)
    //     .then((res: any[]) => {
    //         this.site_name_compare = res.find(item => item.id === this.site_id_compare).site_name;
    //         this.MenuInput_1.get_data(res, this.site_id_compare, this.organization_array_compare, this.organization_id_compare);
    //     })
    //     .catch(error => {
    //         this.blockUI.stop();
    //     });
  }

  get_date_from_emit(event) {
    if (event[0].start_date && event[0].end_date) {
      this.start_date = event[0].start_date;
      this.end_date = event[0].end_date;
      this.time_value = '';
      this.index_viewby = 2;
    } else if (event[0].time_value) {
      this.time_value = event[0].time_value;
      this.get_date(this.time_value);
      this.index_viewby = event[0].index_viewby;
    }
  }

  get_data() {
    this.set_to_zero(
      'total_num_to_enter'
      , 'total_num_to_exit'
      , 'total_num_to_enter_compare'
      , 'total_num_to_exit_compare'
      , 'total_traffic'
      , 'total_traffic_compare'
      , 'total_avg_time'
      , 'total_avg_time_compare');
    this.all_data = [];
    this.blockUI.start(this.language.dang_tai_du_lieu); // Start blocking
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , view_by: this.viewDataBy
      , organization_id_compare: this.organization_id_compare
      , site_id_compare: this.site_id_compare
      , indexOptionSelected: this.indexOptionSelected
      , operator: this.operator
    };
    if (!environment.production) {
      console.log('data', data);
    }
    // this.title_index = this.indexOptionSelected;
    this.title_index = this.indexOption.find(item => item.value === this.indexOptionSelected).label;
    this.time_generate_report = new Date();
    // tslint:disable-next-line:max-line-length
    this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.viewDataBy === 'Hour' ? this.language.gio : this.viewDataBy === 'DayWorkofWeek' ? this.language.ngay_lam_viec_cuoi_tuan : this.language.ngay_lam_viec;
    this.appservice.post(data, environment.API.sp_footfall_store_comparison).subscribe(
      res => {
        console.log('res', res);
        try {
          this.show_error = false;
          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.all_data = null;
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

          this.title_time_period = this.language.ngay;
          this.site_name_compare = this.MenuInput_1.menu_tree.find(item => item.id === this.site_id_compare).site_name;
          let color = environment.POC.colors.visits;
          const chart_xAxis = [];
          const chart_data = [];
          const chart_data_compare = [];
          this.set_to_zero(
            'total_num_to_enter', 'total_num_to_enter_compare'
            , 'total_num_to_exit', 'total_num_to_exit_compare'
            , 'total_traffic', 'total_traffic_compare'
            , 'total_shopper_visits', 'total_shopper_visits_compare'
            , 'total_passer_by', 'total_passer_by_compare'
            , 'total_kids', 'total_kids_compare'
            , 'total_turn_rate', 'total_turn_rate_compare'
            , 'total_seconds', 'total_seconds_compare'
            , 'total_avg_time', 'total_avg_time_compare');
          const row = Number(res.data.length);
          let si = 0;
          let si_compare = 0;
          res.data.forEach(element => {
            this.total_num_to_enter += Number(element.num_to_enter);
            this.total_num_to_exit += Number(element.num_to_exit);
            this.total_traffic += Number(element.traffic);
            this.total_avg_time += Number(element.avg_time);
            this.total_passer_by += Number(element.passer_by);
            this.total_shopper_visits += Number(element.shopper_visits);
            this.total_kids += Number(element.kids_visits);
            this.total_seconds += Number(element.total_seconds);
            this.total_turn_rate += Number(element.turn_in_rate);
            if (Number(element.avg_time) > 0) {
              si++;
            }
          });
          res.data_compare.forEach(element => {
            this.total_num_to_enter_compare += Number(element.num_to_enter);
            this.total_num_to_exit_compare += Number(element.num_to_exit);
            this.total_traffic_compare += Number(element.traffic);
            this.total_avg_time_compare += Number(element.avg_time);
            this.total_passer_by_compare += Number(element.passer_by);
            this.total_seconds_compare += Number(element.total_seconds);
            this.total_shopper_visits_compare += Number(element.shopper_visits);
            this.total_kids_compare += Number(element.kids_visits);
            this.total_turn_rate_compare += Number(element.turn_in_rate);
            if (Number(element.avg_time) > 0) {
              si_compare++;
            }
          });
          this.total_avg_time = Number(si) > 0 ? Number((this.total_avg_time * 60 / si).toFixed(0)) : 0;
          // tslint:disable-next-line: max-line-length
          this.total_avg_time_compare = Number(si_compare) > 0 ? Number((this.total_avg_time_compare * 60 / si_compare).toFixed(0)) : 0;

          // tslint:disable-next-line: max-line-length
          this.total_turn_rate = Number(this.total_passer_by) > 0 ? Number(((Number(this.total_num_to_enter) / Number(this.total_passer_by)) * 100).toFixed(2)) : 0;
          // tslint:disable-next-line: max-line-length
          this.total_turn_rate_compare = Number(this.total_passer_by_compare) > 0 ? Number(((Number(this.total_num_to_enter_compare) / Number(this.total_passer_by_compare)) * 100).toFixed(2)) : 0;


          this.total_num_to_enter = Number((this.total_num_to_enter / row).toFixed(0));
          this.total_num_to_exit = Number((this.total_num_to_exit / row).toFixed(0));
          this.total_traffic = Number((this.total_traffic / row).toFixed(0));

          this.total_passer_by = Number((this.total_passer_by / row).toFixed(0));
          this.total_shopper_visits = Number((this.total_shopper_visits / row).toFixed(0));

          this.total_kids = Number((this.total_kids / row).toFixed(0));
          this.total_kids_compare = Number((this.total_kids_compare / row).toFixed(0));

          this.total_num_to_enter_compare = Number((this.total_num_to_enter_compare / row).toFixed(0));
          this.total_num_to_exit_compare = Number((this.total_num_to_exit_compare / row).toFixed(0));
          this.total_traffic_compare = Number((this.total_traffic_compare / row).toFixed(0));
          // tslint:disable-next-line: max-line-length
          this.total_passer_by_compare = Number((this.total_passer_by_compare / row).toFixed(0));
          this.total_shopper_visits_compare = Number((this.total_shopper_visits_compare / row).toFixed(0));

          res.data.forEach(element => { chart_xAxis.push(element.time_period); });
          if (this.indexOptionSelected === this.indexess.passerby) {
            color = environment.POC.colors.passer_by;
            res.data.forEach(element => { chart_data.push(Number(element.passer_by)); });
            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.passer_by)); });
            // tslint:disable-next-line:max-line-length
            this.get_table_data(chart_data, chart_data_compare, chart_xAxis, this.total_passer_by, this.total_passer_by_compare);
          } else if (this.indexOptionSelected === this.indexess.shoppers) {
            color = environment.POC.colors.shopper_visits;
            res.data.forEach(element => { chart_data.push(Number(element.shopper_visits)); });
            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.shopper_visits)); });
            // tslint:disable-next-line:max-line-length
            this.get_table_data(chart_data, chart_data_compare, chart_xAxis, this.total_shopper_visits, this.total_shopper_visits_compare);
          } else if (this.indexOptionSelected === this.indexess.traffic_flow) {
            color = environment.POC.colors.traffic_flow;
            res.data.forEach(element => { chart_data.push(Number(element.traffic)); });
            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.traffic)); });
            this.get_table_data(chart_data, chart_data_compare, chart_xAxis, this.total_traffic, this.total_traffic_compare);
          } else if (this.indexOptionSelected === this.indexess.kids_visitors) {
            color = environment.POC.colors.kids_visits;
            res.data.forEach(element => { chart_data.push(Number(element.kids_visits)); });
            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.kids_visits)); });
            this.get_table_data(chart_data, chart_data_compare, chart_xAxis, this.total_kids, this.total_kids_compare);
          } else if (this.indexOptionSelected === this.indexess.turn_in_rate) {
            color = environment.POC.colors.turn_in_rate;
            res.data.forEach(element => { chart_data.push(Number(element.turn_in_rate)); });
            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.turn_in_rate)); });
            // tslint:disable-next-line:max-line-length
            this.get_table_data(chart_data, chart_data_compare, chart_xAxis, this.total_turn_rate, this.total_turn_rate_compare);
          } else if (this.indexOptionSelected === this.indexess.avg_time) {
            color = environment.POC.colors.avg_time;
            res.data.forEach(element => { chart_data.push((Number(element.avg_time))); });
            res.data_compare.forEach(element => { chart_data_compare.push((Number(element.avg_time))); });
            this.get_table_data(chart_data, chart_data_compare, chart_xAxis, this.total_avg_time, this.total_avg_time_compare);
          } else if (this.indexOptionSelected === this.indexess.visitors) {
            res.data.forEach(element => { chart_data.push(Number(element.num_to_enter)); });
            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.num_to_enter)); });
            // tslint:disable-next-line:max-line-length
            this.get_table_data(chart_data, chart_data_compare, chart_xAxis, this.total_num_to_enter, this.total_num_to_enter_compare);
          } else if (this.indexOptionSelected === this.indexess.exits) {
            res.data.forEach(element => { chart_data.push(Number(element.num_to_exit)); });
            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.num_to_exit)); });
            // tslint:disable-next-line:max-line-length
            this.get_table_data(chart_data, chart_data_compare, chart_xAxis, this.total_num_to_exit, this.total_num_to_exit_compare);
          }
          if (chart_xAxis.length > 0) {
            this.show_label_table = chart_xAxis[0] + ' - ' + chart_xAxis[chart_xAxis.length - 1];
          }
          this.load_highchart(chart_xAxis, color, chart_data, chart_data_compare);
          // lưu thông số vào DB
          let save_data;
          if (this.time_value !== '') {
            const data_2 = {
              organization_id: this.organization_id
              , site_id: this.site_id
              , start_time: this.start_time
              , end_time: this.end_time
              , time_value: this.time_value
              , view_by: this.viewDataBy
              , organization_id_compare: this.organization_id_compare
              , site_id_compare: this.site_id_compare
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
        // this.push_notification();
        this.show_error = true;
        this.blockUI.stop();
      }, () => {
        this.sendParamToChildren();
        this.blockUI.stop();
      }
    );
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
    const minutes = Math.floor(secs / 60);
    return minutes;
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
      , organization_id_compare: this.organization_id_compare
      , site_id_compare: this.site_id_compare
      , indexOptionSelected: this.indexOptionSelected
      , operation: this.operator
      , export: 'xuhuong'
    };
    this.blockUI.start(this.language.dang_xuat_bao_cao);
    this.appservice.post(data, environment.API.sp_footfall_store_comparison + '_export_excel').subscribe(fileData => {
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
      const url = environment.FBA.API.export_metrics_analytic + '_delete_excel';
      this.appservice.post(data2, url).subscribe(res => {
        if (!environment.production) {
          console.log('Deleted');
        }
      });
    }
    );
  }

  get_table_data(chart_data: any[], chart_data_compare: any[], chart_xAxis: any[], total: number, total_compare: number) {
    chart_data.forEach((element: number, index: number) => {
      this.all_data.push({
        time_period: chart_xAxis[index]
        , data: element
        , data_compare: 0
        , number_compare: 0
        , data_percent: 0
        , data_compare_percent: 0
      });
    });
    chart_data_compare.forEach((element: number, index: number) => {
      this.all_data[index].data_compare = element;
      this.all_data[index].number_compare = element - this.all_data[index].data;
      this.all_data[index].data_percent = this.Go_number(this.all_data[index].data, total);
      this.all_data[index].data_compare_percent = this.Go_number(this.all_data[index].data_compare, total_compare);
    });
  }

  set_to_zero(...property) {
    property.forEach((element, index) => {
      this[property[index]] = 0;
    });
  }

  value_Suffix() {
    if (this.indexOptionSelected === this.indexess.avg_time) {
      return this.valueSuffix = ' (min)';
    } else {
      return this.valueSuffix = '';
    }
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

  selectd() {
    if (this.indexOptionSelected === this.indexess.turn_in_rate || this.indexOptionSelected === this.indexess.conversion_rate
      || this.indexOptionSelected === this.indexess.avg_time || this.indexOptionSelected === this.indexess.transactions
      || this.indexOptionSelected === this.indexess.avg_items
      || this.indexOptionSelected === this.indexess.member_transactions
      || this.indexOptionSelected === this.indexess.member_conversion_rate
      || this.indexOptionSelected === this.indexess.member_conversion_rate
      || this.indexOptionSelected === this.indexess.cx_index || this.indexOptionSelected === this.indexess.nps_index) {
      this.checked = true;
    } else {
      this.checked = false;
    }
    return this.checked;
  }

  load_highchart(...data) {
    const selft = this;
    const select = this.indexOptionSelected;
    const color = environment.POC.colors;
    Highcharts.setOptions({
      lang: { decimalPoint: '.', thousandsSep: ' ' }
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
      chart: { height: 500, style: { fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif !important;', } },
      title: { text: '' },
      subtitle: {
        useHTML: true, align: 'left', y: 0,
        text: ' '
      },
      xAxis: [{
        labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
        categories: data[0], crosshair: true
      }],
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
      yAxis: [{
        // formatter() { return this.axis.defaultLabelFormatter.call(this); }
        labels: { format: '{value}', style: { color: data[1] } },
        maxPadding: 0, minPadding: 0, min: 0,
        allowDecimals: false, title: { text: selft.title_index, style: { color: data[1], fontWeight: 'bold' } },
      }],
      series: [
        {
          name: this.site_name, color: data[1], type: selft.type_chart(), yAxis: 0, data: data[2],
          // tslint:disable-next-line:max-line-length
          tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + point.y.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '</b><br/>'; } }, selected: selft.selectd(),
          visible: select !== this.indexess.avg_time, showInLegend: select !== this.indexess.avg_time,
        }, {
          name: this.site_name_compare, color: color.compare, type: selft.type_chart(), yAxis: 0, data: data[3],
          // tslint:disable-next-line:max-line-length
          tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + point.y.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '</b><br/>'; } }, selected: selft.selectd(),
          visible: select !== this.indexess.avg_time, showInLegend: select !== this.indexess.avg_time,
        }, {
          name: this.site_name, color: data[1], type: selft.type_chart(), yAxis: 0, data: data[2],
          // tslint:disable-next-line:max-line-length
          tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + selft.toHHMMSS(point.y * 60) + '</b><br/>'; } }, selected: selft.selectd(),
          visible: select === this.indexess.avg_time, showInLegend: select === this.indexess.avg_time,
        }, {
          name: this.site_name_compare, color: color.compare, type: selft.type_chart(), yAxis: 0, data: data[3],
          // tslint:disable-next-line:max-line-length
          tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + selft.toHHMMSS(point.y * 60) + '</b><br/>'; } }, selected: selft.selectd(),
          visible: select === this.indexess.avg_time, showInLegend: select === this.indexess.avg_time,
        }
      ]
    });
  }

  change_view() {
    this.get_data();
  }

  check_suffix(indexOptionSelected) {
    let suffix_text = this.language.luot_bieu_do;
    if (indexOptionSelected === this.indexess.avg_time) {
      suffix_text = this.language.phut_bieu_do;
    }
    return suffix_text;
  }

  showPopupRegister() {
    this.scheduleComponent.openPopupRegisterAgain();
  }
}
