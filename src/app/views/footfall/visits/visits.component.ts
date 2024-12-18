import { IOption } from 'ng-select';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
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
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';
import { language_index_vn } from '../../../list_index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { StoreReportingFFScheduleComponent } from '../../useremailmodule/footfall/storereporting/storereporting.component';
import { NotifierService } from 'angular-notifier';
More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);
@Component({
  templateUrl: 'visits.component.html',
  styleUrls: ['visits.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class FootfallVisitsComponent implements OnInit {
  @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
  defaultModule = 1;
  @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
  @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
  @ViewChild('content') public helloTemplate: ElementRef;
  private notifier: NotifierService;
  page_id = environment.Pages.footfall.visits;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  organization_array: Array<IOption>;
  organization_id: string;
  siteSelectionDisplay = false;
  site_id: any;
  // * Site tree by organizations */
  start_date: any;
  end_date: any;
  // thoi gian start-end
  start_time: any;
  end_time: any;
  startTimeOption: Array<IOption>;
  endTimeOption: Array<IOption>;
  total_num_to_enter = 0;
  total_num_to_exit = 0;
  total_traffic = 0;
  total_avg_time = 0;
  total_passer_by = 0;
  total_shopper_visits = 0;
  viewDataBy: any;
  sidebarMinimized = true;
  element: HTMLElement = document.body;
  time_period_array: any;
  menu_tree: any;
  chart_data: any;
  show_label_table: string;
  btnApplyValid = false;
  indexOption: Array<IOption>;
  indexOptionSelected: string;
  operation: string;
  time_value: any = '';
  time_generate_report = new Date();
  userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
  site_name: string;
  title_start_date: string;
  title_end_date: string;
  time_period: string;
  title_time_period: string;
  title_index: string;
  starttime: string;
  endtime: string;
  view: string;
  total_kids = 0;
  total_turn_rate = 0; total_seconds = 0;
  type: string;
  checked: boolean; language_index_vn: any;
  indexes: any; indexess: any; index_viewby = 1; show_error = false;
  public modalRef: BsModalRef;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(private router: Router,
    private appservice: AppService,
    private modalService: BsModalService
    , notifierService: NotifierService) {
    this.notifier = notifierService;
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.indexes = this.indexess = indexes;
    this.language_index_vn = language_index_vn;
  }
  url_api = environment.apiUrl + 'exports/';
  name_of_excel: any; language: any;

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
      , view_by: this.viewDataBy
      , operation: this.operation
      , indexOptionSelected: this.indexOptionSelected
      , export: 'sosanh'
      , start_time: this.start_time
      , end_time: this.end_time
      // , dimesion: 'SITE'
      // , question_id: 1
      // , start_time_compare: null
      // , end_time_compare: null
      // , organization_id_compare: null
      // , site_id_compare: null
      // , category_id: 1
      // , index_source: null
      // , operation: 'SUM'
    };
    this.scheduleComponent.getParametter(dataFromParent, this.TimeInput.indexViewby);
  }
  reCheckExistParams() {
    const dataFromParent = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , view_by: this.viewDataBy
      , operation: this.operation
      , indexOptionSelected: this.indexOptionSelected
      , export: 'sosanh'
      , start_time: this.start_time
      , end_time: this.end_time
      // , dimesion: 'SITE'
      // , question_id: 1
      // , start_time_compare: null
      // , end_time_compare: null
      // , organization_id_compare: null
      // , site_id_compare: null
      // , category_id: 1
      // , index_source: null
      // , operation: 'SUM'
    };
    this.scheduleComponent.checkExistParam(dataFromParent, this.TimeInput.indexViewby);
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
          this.indexOption = param.traffic_index;
          this.indexes = param.list_index;
          this.indexess = param.list_index_value;
          this.language_index_vn = param.language_index === '\'vn\'' ? language_index_vn : indexes;
          if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
            para = param.user_page_parametter;
          } else {
            const defaultOrgId = param.organization_arr.length > 0 ? param.organization_arr[0].value : 6;
            para = this.set_default(defaultOrgId);
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
          if (para.time_value) {
            this.get_date(para.time_value);
          } else if (para.start_date && para.end_date) {
            this.start_date = para.start_date;
            this.end_date = para.end_date;
          }
          this.operation = para.operation;
          this.viewDataBy = para.view_by;
          this.indexOptionSelected = para.indexOptionSelected;
          this.TimeInput.get_data(para, this.time_period_array);
          this.get_sitetree();
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        // this.push_notification();
        this.show_error = true;
        this.blockUI.stop();
      }, () => {
        // this.blockUI.stop();
      }
    );
  }

  set_default(defaultOrgId: any) {
    const organization_id = this.userinfo.organization_id === '0' ? defaultOrgId : Number(this.userinfo.organization_id);
    // const organization_id = this.userinfo.organization_id === '0' ? 6 : Number(this.userinfo.organization_id);
    // const value_index = this.indexOption.find(item => item.value === indexes.shoppers).value;
    const value_index = this.indexOption[0].value;
    return {
      organization_id: organization_id
      // , site_id: 0
      , start_time: '00:00'
      , end_time: '23:59'
      , time_value: 'today'
      , operation: 'sum'
      , view_by: 'Hour'
      , indexOptionSelected: value_index

    };
  }

  Go_number(number, total) {
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

  get_data() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organization_id
      , site_id: Number(this.site_id)
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , view_by: this.viewDataBy
      , operation: this.operation
      , indexOptionSelected: this.indexOptionSelected
    };
    if (!environment.production) {
      console.log('data', data);
    }
    this.time_generate_report = new Date();
    this.title_index = this.indexOptionSelected;
    // tslint:disable-next-line:max-line-length
    this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.language.gio;
    this.appservice.post(data, environment.API.sp_poc_data_in_out_sum_by_site).subscribe(
      res => {
        try {
          if (!environment.production) {
            console.log('res', res);
          }
          this.starttime = this.startTimeOption.find(item => item.value === this.start_time).label;
          this.endtime = this.endTimeOption.find(item => item.value === this.end_time).label;
          this.site_name = this.MenuInput.menu_tree.find(item => Number(item.id) === Number(this.site_id)).site_name;
          const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          this.title_start_date = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
          this.title_end_date = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
          if (this.start_date !== this.end_date) {
            this.time_period = this.title_start_date + ' - ' + this.title_end_date;
          } else { this.time_period = this.title_start_date; }

          this.title_time_period = this.language.ngay;
          this.chart_data = res;
          this.show_error = false;
          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.chart_data = null;
            this.blockUI.stop();

          }
          // tslint:disable-next-line:max-line-length
          this.reset_to_zero('total_num_to_enter', 'total_num_to_exit', 'total_traffic', 'total_avg_time', 'total_passer_by', 'total_turn_rate', 'total_kids', 'total_shopper_visits', 'total_seconds');
          let si = 0;
          res.forEach(element => {
            this.total_num_to_enter += Number(element.num_to_enter);
            this.total_num_to_exit += Number(element.num_to_exit);
            this.total_kids += Number(element.kids_visits);
            this.total_turn_rate += Number(element.turn_in_rate);
            this.total_traffic += Number(element.traffic);
            this.total_avg_time += Number(element.avg_time);
            this.total_passer_by += Number(element.passer_by);
            this.total_seconds += Number(element.total_seconds);
            this.total_shopper_visits += Number(element.shopper_visits);
            if (Number(element.avg_time) > 0) {
              si++;
            }
          });
          this.total_avg_time = Number(si) > 0 ? Number((this.total_avg_time * 60 / si).toFixed(0)) : 0;
          // tslint:disable-next-line: max-line-length
          this.total_turn_rate = Number(this.total_passer_by) > 0 ? Number(((Number(this.total_num_to_enter) / Number(this.total_passer_by)) * 100).toFixed(2)) : 0;
          this.loadHightChart();
          let save_data;
          if (this.time_value !== '') {
            // console.log(this.time_value);
            const data_2 = {
              organization_id: this.organization_id
              , site_id: this.site_id
              , start_time: this.start_time
              , end_time: this.end_time
              , time_value: this.time_value
              , view_by: this.viewDataBy
              , operation: this.operation
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
        this.blockUI.stop();
        this.sendParamToChildren();
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
      , site_id: Number(this.site_id)
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , view_by: this.viewDataBy
      , operation: this.operation
      , indexOptionSelected: this.indexOptionSelected
      , export: 'sosanh'
      // , traffic_index: this.indexOption
    };
    this.blockUI.start(this.language.dang_xuat_bao_cao);
    this.appservice.post(data, environment.API.sp_poc_data_in_out_sum_by_site + '_export_excel').subscribe(fileData => {
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

  reset_session() {
    const data = [];
    this.site_id = null;
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
      this.time_generate_report = new Date();
      this.get_page_param();
    });
  }

  change_view() {
    this.get_data();
  }

  // Nghĩa thêm function ngày 28/12
  get_date(time_value) {
    const time_array = this.TimeInput.get_time(time_value);
    this.start_date = this.appservice.convert_date_tostring(time_array.ngaybatdau);
    this.end_date = this.appservice.convert_date_tostring(time_array.ngayketthuc);
    this.index_viewby = time_array.order;
    this.time_value = time_value;
  }

  get_sitetree() {
    this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
    const url = environment.API.sites + '_get_site_for_report';
    const data = { organization_id: this.organization_id };
    this.appservice.post(data, url).subscribe(res => {
      try {
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
  get_date_from_emit(event) {
    console.log('event', event);
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

  type_chart() {
    if (this.indexOptionSelected === indexes.turn_in_rate || this.indexOptionSelected === indexes.conversion_rate
      || this.indexOptionSelected === indexes.avg_time || this.indexOptionSelected === indexes.transactions
      || this.indexOptionSelected === indexes.avg_items || this.indexOptionSelected === indexes.member_transactions
      || this.indexOptionSelected === indexes.member_conversion_rate || this.indexOptionSelected === indexes.member_conversion_rate
      || this.indexOptionSelected === indexes.cx_index || this.indexOptionSelected === indexes.nps_index) {
      this.type = 'spline';
    } else {
      this.type = 'column';
    }
    return this.type;
  }

  selectd() {
    if (this.indexOptionSelected === indexes.turn_in_rate || this.indexOptionSelected === indexes.conversion_rate
      || this.indexOptionSelected === indexes.avg_time || this.indexOptionSelected === indexes.transactions
      || this.indexOptionSelected === indexes.avg_items || this.indexOptionSelected === indexes.member_transactions
      || this.indexOptionSelected === indexes.member_conversion_rate || this.indexOptionSelected === indexes.member_conversion_rate
      || this.indexOptionSelected === indexes.cx_index || this.indexOptionSelected === indexes.nps_index) {
      this.checked = true;
    } else {
      this.checked = false;
    }
    return this.checked;
  }

  loadHightChart() {
    let i = 0;
    const chart_xAxis = [];
    const num_to_enter = [];
    const num_to_exit = [];
    const turn_in_rate = [];
    const kids_visits = [];
    const traffic = [];
    const avg_time = [];
    const passer_by = [];
    const shopper_visits = [];
    this.chart_data.forEach(element => {
      chart_xAxis[i] = element.time_period;
      kids_visits[i] = Number(element.kids_visits);
      turn_in_rate[i] = Number(element.turn_in_rate);
      num_to_enter[i] = Number(element.num_to_enter);
      num_to_exit[i] = Number(element.num_to_exit);
      traffic[i] = Number(element.traffic);
      avg_time[i] = (Number(element.avg_time));
      passer_by[i] = (Number(element.passer_by));
      shopper_visits[i] = (Number(element.shopper_visits));
      i++;
    });
    if (chart_xAxis.length > 0) {
      this.show_label_table = chart_xAxis[0] + ' - ' + chart_xAxis[chart_xAxis.length - 1];
    }
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
    })(Highcharts);
    Highcharts.chart(this.container.nativeElement, {
      chart: { height: 500, style: { fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif !important;', } },
      title: { text: '' },
      subtitle: {
        useHTML: true, align: 'left', y: 0,
        // tslint:disable-next-line:max-line-length
        text: '  '
      },
      xAxis: [{
        labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
        categories: chart_xAxis,
        crosshair: true
      }],
      tooltip: { shared: true, distance: 80, padding: 10, useHTML: true, },
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
      yAxis: [
        {
          // formatter() { return this.axis.defaultLabelFormatter.call(this); }
          labels: { format: '{value}', style: { color: color.passer_by } },
          // tslint:disable-next-line:max-line-length
          allowDecimals: false, title: { text: this.indexes.passerby, style: { color: color.passer_by, fontWeight: 'bold' } }, visible: select === indexes.passerby, min: 0, maxPadding: 0, minPadding: 0,
        },
        {
          labels: { format: '{value}', style: { color: color.kids_visits } },
          allowDecimals: false, title: {
            text: this.indexes.kids_visitors,
            style: { color: color.kids_visits, fontWeight: 'bold' }
          },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.kids_visitors,
        },
        {
          labels: { format: '{value}', style: { color: color.turn_in_rate } },
          title: { text: this.indexes.turn_in_rate, style: { color: color.turn_in_rate, fontWeight: 'bold' } },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.turn_in_rate, allowDecimals: false,
        },
        {
          labels: { format: '{value}', style: { color: color.visits } },
          allowDecimals: false, title: { text: this.indexes.visitors, style: { color: color.visits, fontWeight: 'bold' } },
          visible: select === this.indexess.visitors,
        },
        {
          labels: { format: '{value}', style: { color: color.exits } },
          allowDecimals: false, title: { text: this.indexes.exits, style: { color: color.exits, fontWeight: 'bold' } },
          visible: select === this.indexess.exits,
        },
        {
          labels: { format: '{value}', style: { color: color.traffic_flow } },
          allowDecimals: false, title: {
            text: this.indexes.traffic_flow,
            style: { color: color.traffic_flow, fontWeight: 'bold' }
          },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.traffic_flow,
        },
        {
          labels: { format: '{value}', style: { color: color.shopper_visits } },
          allowDecimals: false, title: {
            text: this.indexes.shoppers,
            style: { color: color.shopper_visits, fontWeight: 'bold' }
          },
          min: 0, maxPadding: 0, minPadding: 0, visible: select === this.indexess.shoppers,
        },
        {
          title: {
            text: this.indexes.avg_time + this.language.min,
            style: { color: color.avg_time, fontWeight: 'bold' }
          },
          // tslint:disable-next-line:max-line-length
          maxPadding: 0, minPadding: 0, labels: { format: '{value} ', style: { color: color.avg_time, } }, visible: select === indexes.avg_time, allowDecimals: false, min: 0,
        }
      ],

      series: [
        {
          name: this.indexes.passerby, color: color.passer_by,
          selected: selft.selectd(), showInLegend: select === this.indexess.passerby,
          type: selft.type_chart(), yAxis: 0, data: passer_by, visible: select === this.indexess.passerby,
        },
        {
          name: this.indexes.visitors, color: color.visits, selected: selft.selectd(),
          showInLegend: select === this.indexess.visitors,
          type: selft.type_chart(), yAxis: 3, data: num_to_enter, visible: select === this.indexess.visitors,
        },
        {
          name: this.indexes.exits, color: color.exits, selected: selft.selectd(),
          showInLegend: select === this.indexess.exits,
          type: selft.type_chart(), yAxis: 3, data: num_to_exit, visible: select === this.indexess.exits,
        },
        {
          name: this.indexes.kids_visitors, color: color.kids_visits,
          showInLegend: select === this.indexess.kids_visitors, yAxis: 1,
          type: selft.type_chart(), data: kids_visits, visible: select === this.indexess.kids_visitors, selected: selft.selectd(),
        }, {
          name: this.indexes.turn_in_rate, color: color.turn_in_rate, showInLegend: select === this.indexess.turn_in_rate,
          type: 'spline', yAxis: 2, data: turn_in_rate, visible: select === this.indexess.turn_in_rate, selected: selft.selectd(),
        }, {
          name: this.indexes.traffic_flow, color: color.traffic_flow, showInLegend: select === this.indexess.traffic_flow,
          yAxis: 4,
          type: selft.type_chart(), data: traffic, visible: select === this.indexess.traffic_flow, selected: selft.selectd(),
        }, {
          name: this.indexes.shoppers, color: color.shopper_visits,
          selected: selft.selectd(), type: selft.type_chart(),
          showInLegend: select === this.indexess.shoppers, yAxis: 5,
          data: shopper_visits, visible: select === this.indexess.shoppers,
        }, {
          name: this.indexes.avg_time + this.language.min, color: color.avg_time,
          showInLegend: select === this.indexess.avg_time, yAxis: 6,
          type: selft.type_chart(), visible: this.indexOptionSelected === this.indexess.avg_time, selected: selft.selectd(),
          data: avg_time,
          // tslint:disable-next-line:max-line-length
          tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + selft.toHHMMSS(point.y * 60) + '</b><br/>'; } },
        }
      ]

    });
  }

  showPopupRegister() {
    this.scheduleComponent.openPopupRegisterAgain();
  }
}
