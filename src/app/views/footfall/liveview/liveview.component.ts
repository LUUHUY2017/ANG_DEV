import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { Location } from '@angular/common';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { IOption } from 'ng-select';
// highcharts
import Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import Tree from 'highcharts/modules/treemap';
import Heatmap from 'highcharts/modules/heatmap';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { language_index_vn } from '../../../list_index';

import { indexes } from '../../../list_index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
// import { ViewEncapsulation } from '@angular/core';

More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);
// add barcharts with datatable
import data from 'highcharts/modules/data';
// import exporting from 'highcharts/modules/exporting';
// import export_data from 'highcharts/modules/export-data';

data(Highcharts);

import { TreeNode } from 'primeng/components/common/treenode';
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';

@Component({
  templateUrl: 'liveview.component.html',
  styleUrls: ['liveview.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class FootfallLiveviewComponent implements OnInit, OnDestroy {
  page_id = environment.Pages.footfall.liveview;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
  @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
  @ViewChild('chart_occupancy', { read: ElementRef }) chart_occupancy: ElementRef;
  @ViewChild('chart_enter', { read: ElementRef }) chart_enter: ElementRef;
  @ViewChild('chart_exits', { read: ElementRef }) chart_exits: ElementRef;
  @ViewChild('container_historyLineChart', { read: ElementRef }) container_historyLineChart: ElementRef;
  @ViewChild('container_historyColumnChart', { read: ElementRef }) container_historyColumnChart: ElementRef;
  @ViewChild('content') public helloTemplate: ElementRef;
  organization_id: string;
  siteSelectionDisplay = false; show_error = false;
  public modalRef: BsModalRef;
  site_id: any;
  start_date: any;
  end_date: any;
  start_time: any;
  end_time: any;
  open_time: any;
  indexes: any; indexess: any;
  public startTimeOption: Array<IOption>;
  public endTimeOption: Array<IOption>;
  total_visit = 0;
  total_exit = 0;
  total_traffic = 0;
  viewDataBy: string;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  showChart = 1; // Mặc định hiển thị line chart
  indexOption: any[];
  time_period_array: any[];
  organization_array: any[];
  public chart_data: any[];
  live_occupancy_data = 0;
  live_enters_data = 0;
  live_exits_data = 0;
  live_datetime: any;
  occupancy_updown = 'equalarrow.png';
  enters_updown = 'equalarrow.png';
  exits_updown = 'equalarrow.png';
  occupancy_str_compare = '';
  enters_str_compare = '';
  exits_str_compare = '';
  curent_day = '';
  curent_month = '';
  curent_year = '';
  curent_hour = '';
  curent_minute = '';
  seconds = '';
  interval;
  public timePriodOption: Array<IOption>;
  public timePriodSelected = 'Quarter Hour';
  data_history = [];
  time_value = '';
  public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
  level: string;
  openTimeOption: any;
  operation: string;
  level_traffic: string;
  dimension: string;
  status: boolean;
  url_api = environment.apiUrl + 'exports/';
  time_generate_report = new Date();
  name_of_excel: any;
  menu_tree: any[]; language: any; language_index_vn: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(private router: Router,
    private appservice: AppService,
    private location: Location,
    private modalService: BsModalService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.indexes = this.indexess = indexes;
    this.language_index_vn = language_index_vn;
  }

  ngOnInit() {
    this.get_page_param();
  }

  get_page_param() {
    this.blockUI.start(this.language.dang_tai_cau_hinh);
    this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
      param => {
        try {
          this.status = false;
          this.indexes = param.list_index;
          this.indexess = param.list_index_value;
          this.language_index_vn = param.language_index === '\'vn\'' ? language_index_vn : indexes;
          this.timePriodOption = [
            // { label: this.language.mot_phan_tu_gio, value: 'Quarter Hour' },
            { label: this.language.nua_gio, value: 'Half Hour' },
            { label: this.language.gio, value: 'Hour' },
            { label: this.language.ngay, value: 'Day' },
          ];
          if (!environment.production) {
            // console.log('get_user_page_parametter', param);
          }
          let para = null;
          if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
            console.log('trong if');
            para = param.user_page_parametter;
          } else {
            console.log('ngoai if');
            const defaultOrgId = param.organization_arr.length > 0 ? param.organization_arr[0].value : 6;
            para = this.set_default(defaultOrgId);
          }
          if (!environment.production) {
            console.log('para', param);
          }
          this.indexOption = param.traffic_index;
          this.time_period_array = param.fba_time_period_metrics;
          this.organization_array = param.organization_arr;
          this.startTimeOption = param.start_time_list;
          this.endTimeOption = param.end_time_list;
          this.openTimeOption = param.start_time_list;
          // para
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
          this.level = para.level;
          this.showChart = para.showChart;
          this.level_traffic = para.level_traffic;
          this.open_time = para.open_time;
          this.operation = para.operation;
          this.dimension = para.dimension;
          this.TimeInput.get_data(para, this.time_period_array);
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
        this.get_sitetree();
        // this.get_data();
      }
    );
  }

  push_notification() {
    if (this.modalRef != null || this.modalRef !== undefined) {
      this.modalRef = this.modalService.show(this.helloTemplate, {
        // backdrop: true,
        // ignoreBackdropClick: true
        keyboard: true,
      });
    }
  }

  ClickshowChart(i: number) {
    this.showChart = i;
    const save_data = this.set_data_to_save();
    this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(save_data));

  }

  set_default(defaultOrgId: any) {
    const organization_id = this.userinfo.organization_id === '0' ? defaultOrgId : Number(this.userinfo.organization_id);
    return {
      organization_id: organization_id
      // , site_id: 0
      , start_time: '00:00'
      , end_time: '23:59'
      , time_value: 'today'
      , level: 'Hour'
      , level_traffic: 'Hour'
      , open_time: '00:00'
      , operation: 'sum'
      , dimension: 'Site'
      , showChart: 1
    };
  }

  get_date(time_value) {
    const time_array = this.TimeInput.get_time(time_value);
    this.start_date = this.appservice.convert_date_tostring(time_array.ngaybatdau);
    this.end_date = this.appservice.convert_date_tostring(time_array.ngayketthuc);
    this.time_value = time_value;
  }

  reset_session() {
    const reset_data = [];
    this.site_id = null;
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(reset_data)).subscribe(res => {
      this.get_page_param();
    });
    // this.modalRef.hide();
    // location.reload();
  }

  startTimer() {
  }

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
    const agrument = { organization_id: this.organization_id };
    console.log('agrument', agrument);
    this.appservice.post(agrument, url).subscribe(res => {
      if (!environment.production) {
        console.log('res', res);
      }
      try {
        this.menu_tree = res.site_array.slice(0);
        if (!this.site_id) {
          this.site_id = this.menu_tree.find(item => Number(item.enables) === 1).id;
        }
        this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
        this.get_data();
      } catch (error) {
        this.blockUI.stop();
        this.show_error = true;
      }
    }, (error) => {
      this.blockUI.stop();
      this.show_error = true;
      // this.push_notification();
    }, () => {
      // this.blockUI.stop();
    });
  }

  get_date_from_emit(event) {
    if (event[0].start_date && event[0].end_date) {
      this.start_date = event[0].start_date;
      this.end_date = event[0].end_date;
      this.time_value = '';
    } else if (event[0].time_value) {
      this.time_value = event[0].time_value;
      this.get_date(this.time_value);
    }
  }

  get_emit_menu(event) {
    if (event.organization_id) {
      this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
      const agrument = { organization_id: event.organization_id };
      const url = environment.API.sites + '_get_site_for_report';
      this.appservice.post(agrument, url).subscribe(res => {
        // console.log(res);
        try {
          this.menu_tree = res.site_array.slice(0);
          this.organization_id = event.organization_id;
          this.site_id = this.menu_tree[0].id;
          this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
          this.get_data();
        } catch (error) {
          this.blockUI.stop();
          this.show_error = true;
        }
      }, (error) => {
        this.blockUI.stop();
        this.show_error = true;
      }, () => { });
    } else if (event.site_id || event.site_id === 0) {
      this.site_id = event.site_id;
    }
  }

  get_live() {
    this.status = true;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.getTrafficDataHistory();
    this.loadDataLiveView();
  }

  get_data() {
    this.time_generate_report = new Date();
    this.getTrafficDataHistory();
    this.loadDataLiveView();
  }


  chuyen_so_sang_ten(i: number) {
    let value = i.toString();
    if (i < 10) {
      value = '0' + i;
    }
    return value;
  }

  loadDataLiveView() {
    clearInterval(this.interval);
    const form_data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.open_time + '\''
      , level: this.level
    };
    this.appservice.post(form_data, environment.API.sp_footfall_get_traffic_live).subscribe(
      res => {
        if (!environment.production) {
          console.log('post data liveview: ', form_data);
          console.log('loadDataLiveView res ', res);
        }
        try {
          this.show_error = false;
          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.chart_data = null;
            this.blockUI.stop();
          }
          this.curent_day = res.date.year;
          this.curent_month = this.chuyen_so_sang_ten(res.date.mon);
          this.curent_year = res.date.mday;
          this.curent_hour = res.date.hours;
          this.curent_minute = this.chuyen_so_sang_ten(res.date.minutes);
          this.seconds = this.chuyen_so_sang_ten(res.date.seconds);
          this.live_datetime = res.date;
          // console.log(this.live_datetime);
          const xAxis = [];
          const chart_occupancy_data = [];
          const chart_enters_data = [];
          const chart_exits_data = [];
          let i = 0;

          this.live_occupancy_data = 0;
          this.live_enters_data = 0;
          this.live_exits_data = 0;

          res.live_data.forEach(element => {
            xAxis[i] = element.time_period;
            chart_occupancy_data[i] = Number(element.occupancy);
            chart_enters_data[i] = Number(element.num_to_enter);
            chart_exits_data[i] = Number(element.num_to_exit);

            // this.live_occupancy_data += chart_occupancy_data[i];
            this.live_enters_data += chart_enters_data[i];
            this.live_exits_data += chart_exits_data[i];
            i++;
          });
          if (i > 0) {
            if (res.live_data[res.live_data.length - 1].series_name !== null) {
              this.live_occupancy_data = chart_occupancy_data[i - 1];
            } else {
              this.live_occupancy_data = chart_occupancy_data[i - 2];
            }
            // this.live_enters_data = chart_enters_data[i - 1];
            // this.live_exits_data = chart_exits_data[i - 1];
          }
          // tslint:disable-next-line:max-line-length
          // this.live_occupancy_data =  this.live_enters_data >  this.live_exits_data ?  Number(this.live_enters_data) -  Number(this.live_exits_data) : 0;

          const chart_occupancy_data_yesterday = [];
          const chart_enters_data_yesterday = [];
          const chart_exits_data_yesterday = [];
          let j = 0;
          res.yesterday_data.forEach(element => {
            chart_occupancy_data_yesterday[j] = Number(element.occupancy);
            chart_enters_data_yesterday[j] = Number(element.num_to_enter);
            chart_exits_data_yesterday[j] = Number(element.num_to_exit);
            j++;
          });
          if (i > 0 && j > 0) {
            this.occupancy_str_compare = chart_occupancy_data_yesterday[j - 1].toString() + ' (0%)';
            this.enters_str_compare = chart_enters_data_yesterday[j - 1].toString() + ' (0%)';
            this.exits_str_compare = chart_exits_data_yesterday[j - 1].toString() + ' (0%)';

            let com_val = chart_occupancy_data[i - 1] - chart_occupancy_data_yesterday[j - 1];
            if (com_val > 0) {
              this.occupancy_updown = 'uparrow.png';
              // tslint:disable-next-line:max-line-length
              this.occupancy_str_compare = 'Tăng ' + com_val.toString() + ' (' + ((com_val / chart_occupancy_data[i - 1]) * 100).toFixed(2) + '%)';
            }
            if (com_val < 0) {
              this.occupancy_updown = 'downarrow.png';
              // tslint:disable-next-line:max-line-length
              this.occupancy_str_compare = 'Giảm ' + (-1 * com_val).toString() + ' (' + (-1 * (com_val / chart_occupancy_data[i - 1]) * 100).toFixed(2) + '%)';
            }
            com_val = chart_enters_data[i - 1] - chart_enters_data_yesterday[j - 1];
            if (com_val > 0) {
              this.enters_updown = 'uparrow.png';
              // tslint:disable-next-line:max-line-length
              this.enters_str_compare = 'Tăng ' + com_val.toString() + ' (' + ((com_val / chart_enters_data[i - 1]) * 100).toFixed(2) + '%)';
            }
            if (com_val < 0) {
              this.enters_updown = 'downarrow.png';
              // tslint:disable-next-line:max-line-length
              this.enters_str_compare = 'Giảm ' + (-1 * com_val).toString() + ' (' + (-1 * (com_val / chart_enters_data[i - 1]) * 100).toFixed(2) + '%)';
            }
            com_val = chart_exits_data[i - 1] - chart_exits_data_yesterday[j - 1];
            if (com_val > 0) {
              this.exits_updown = 'uparrow.png';
              // tslint:disable-next-line:max-line-length
              this.exits_str_compare = 'Tăng ' + com_val.toString() + ' (' + ((com_val / chart_exits_data[i - 1]) * 100).toFixed(2) + '%)';
            }
            if (com_val < 0) {
              this.exits_updown = 'downarrow.png';
              // tslint:disable-next-line:max-line-length
              this.exits_str_compare = 'Giảm ' + (-1 * com_val).toString() + ' (' + (-1 * (com_val / chart_exits_data[i - 1]) * 100).toFixed(2) + '%)';
            }
          }
          Highcharts.chart(this.chart_occupancy.nativeElement, {
            chart: {
              type: 'spline',
              scrollablePlotArea: { minWidth: 600, scrollPositionX: 1 }
            },
            title: { text: '' },
            tooltip: { shared: true },
            legend: { enabled: false },
            credits: { enabled: false },
            exporting: { buttons: { contextButton: { enabled: false } } },
            plotOptions: { series: { stacking: '' } },
            xAxis: { categories: xAxis, visible: false },
            yAxis: { gridLineWidth: 0, visible: false },
            series: [
              {
                data: chart_occupancy_data, showInLegend: false, name: 'Occupancy', marker: { enabled: false },
                color: environment.POC.colors.male
              },
              {
                data: chart_occupancy_data_yesterday, showInLegend: false, name: 'Occupancy yesterday',
                color: environment.POC.colors.female,
                marker: { enabled: false }
              }
            ]
          });

          Highcharts.chart(this.chart_enter.nativeElement, {
            chart: { type: 'spline', minWidth: 300 },
            title: { text: '' },
            tooltip: { shared: true },
            legend: { enabled: false },
            credits: { enabled: false },
            exporting: { enabled: false },
            plotOptions: { series: { stacking: '' } },
            xAxis: { categories: xAxis, visible: false },
            yAxis: { gridLineWidth: 0, visible: false },
            series: [
              {
                data: chart_enters_data, showInLegend: false, name: 'Enters', marker: { enabled: false },
                color: environment.POC.colors.male
              }, {
                data: chart_enters_data_yesterday, showInLegend: false, name: 'Enters yesterday',
                color: environment.POC.colors.female,
                marker: { enabled: false },
              }
            ]
          });

          // Highcharts.chart(this.chart_exits.nativeElement, {
          //     chart: { type: 'spline', minWidth: 600 },
          //     title: { text: '' },
          //     tooltip: { shared: true },
          //     legend: { enabled: false },
          //     credits: { enabled: false },
          //     exporting: { buttons: { contextButton: { enabled: false } } },
          //     plotOptions: { series: { stacking: 'normal' } },
          //     xAxis: { categories: xAxis, visible: false },
          //     yAxis: { min: 0, gridLineWidth: 0, visible: false },

          //     series: [
          //         {
          //             data: chart_exits_data, showInLegend: false, name: 'Exits', marker: { enabled: false },
          //             color: environment.POC.colors.male,
          //         }, {
          //             data: chart_exits_data_yesterday,
          //             showInLegend: false, name: 'Exits yesterday', marker: { enabled: false },
          //             color: environment.POC.colors.female,
          //         }
          //     ]
          // });
          if (this.status) {
            const save_data = this.set_data_to_save();
            this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(save_data));
          }
          this.interval = setInterval(() => {
            this.loadDataLiveView();
          }, 60000);
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

  set_data_to_save() {
    const data_to_save: { [k: string]: any } = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: this.start_time
      , end_time: this.end_time
      , level: this.level
      , level_traffic: this.level_traffic
      , open_time: this.open_time
      , operation: this.operation
      , dimension: this.dimension
      , showChart: this.showChart
    };
    if (this.time_value && this.time_value !== '') {
      data_to_save.time_value = this.time_value;
    } else if (this.start_date && this.end_date) {
      data_to_save.start_date = this.start_date;
      data_to_save.end_date = this.end_date;
    }
    if (!environment.production) {
      // console.log(data_to_save);
    }
    return data_to_save;
  }

  // button chon bieu do
  historyLineChart(chart_xAxis, num_to_enter, num_to_exits, traffic) {
    Highcharts.chart(this.container_historyLineChart.nativeElement, {
      title: { text: '' }, exporting: { enabled: false },
      xAxis: [{
        labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
        categories: chart_xAxis, crosshair: true
      }],
      // yAxis: yAxisArray,
      yAxis: [{ // Visits
        labels: { format: '{value}', style: { color: environment.POC.colors.visits } },
        title: { text: this.language_index_vn.Visitors, style: { color: environment.POC.colors.visits } },
      },
        { // Exits
        labels: { format: '{value}', style: { color: environment.POC.colors.exits } },
        title: { text: this.language_index_vn.Exits, style: { color: environment.POC.colors.exits } },
      },
        { // Traffic
        labels: { format: '{value}', style: { color: environment.POC.colors.traffic_flow } },
          title: { text: this.language_index_vn.Traffic, style: { color: environment.POC.colors.traffic_flow } },
      }
      ],
      tooltip: { shared: true },
      legend: { enabled: false, itemStyle: { fontSize: '80%', }, },
      plotOptions: { series: { events: { legendItemClick: function ($events) { } } } },
      series: [
        {
          name: this.language_index_vn.Visitors, color: environment.POC.colors.visits,
          type: 'line', yAxis: 0, data: num_to_enter, tooltip: { valueSuffix: this.language.luot_bieu_do },
        },
        {
          name: this.language_index_vn.Exits, color: environment.POC.colors.exits,
          type: 'line', yAxis: 0, data: num_to_exits, tooltip: { valueSuffix: this.language.luot_bieu_do },
        },
        {
          name: this.language_index_vn.Traffic, color: environment.POC.colors.traffic_flow,
          type: 'line', yAxis: 0, data: traffic, tooltip: { valueSuffix: this.language.luot_bieu_do },
        }
      ]

    });
  }

  historyColumnChart(chart_xAxis, num_to_enter, num_to_exits, traffic) {
    Highcharts.chart(this.container_historyColumnChart.nativeElement, {
      title: { text: '' }, exporting: { enabled: false },
      xAxis: [{
        labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
        categories: chart_xAxis, crosshair: true
      }],
      // yAxis: yAxisArray,
      yAxis: [
        { // Visits
          labels: { format: '{value}', style: { color: environment.POC.colors.visits } },
          title: { text: this.language_index_vn.Visitors, style: { color: environment.POC.colors.visits } },
        },
        { // Exits
          labels: { format: '{value}', style: { color: environment.POC.colors.exits } },
          title: { text: this.language_index_vn.Exits, style: { color: environment.POC.colors.exits } },
        },
        { // Traffic
          labels: { format: '{value}', style: { color: environment.POC.colors.traffic_flow } },
          title: { text: this.language_index_vn.Traffic, style: { color: environment.POC.colors.traffic_flow } },
        }
      ],
      tooltip: { shared: true },
      legend: { enabled: false, itemStyle: { fontSize: '80%', }, },
      plotOptions: { series: { events: { legendItemClick: function ($events) { } } } },
      series: [
        {
          name: this.language_index_vn.Visitors, color: environment.POC.colors.visits,
          type: 'column', yAxis: 0, data: num_to_enter, tooltip: { valueSuffix: this.language.luot_bieu_do },
        },
        {
          name: this.language_index_vn.Exits, color: environment.POC.colors.exits,
          type: 'column', yAxis: 0, data: num_to_exits, tooltip: { valueSuffix: this.language.luot_bieu_do },
        }
        ,
        {
          name: this.language_index_vn.Traffic, color: environment.POC.colors.traffic_flow,
          type: 'column', yAxis: 0, data: traffic, tooltip: { valueSuffix: this.language.luot_bieu_do },
        }
      ]

    });
  }

  getTrafficDataHistory() {
    this.blockUI.start(this.language.dang_tai_du_lieu);

    const form_data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , operation: this.operation
      , level: '\'' + this.level_traffic + '\'' // '\'Quarter Hour\''
      , dimension: this.dimension
    };
    if (!environment.production) {
      console.log('form_data', form_data);
    }
    this.appservice.post(form_data, environment.API.sp_footfall_get_traffic).subscribe(
      res => {
        try {

          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.chart_data = null;
            this.blockUI.stop();
          }
          // console.log('res', res);
          this.data_history = res.data;
          let i = 0;
          const chart_xAxis = [];
          if (res.data) {
            this.data_history.forEach(element => {
              chart_xAxis[i] = element.time_period;
              i++;
            });
            // console.log('chart_xAxis', chart_xAxis);
            i = 0;
            this.total_visit = 0;
            this.total_traffic = 0;
            const num_to_enter = [];
            this.data_history.forEach(element => {
              num_to_enter[i] = Number(element.num_to_enter);
              this.total_visit += num_to_enter[i];
              i++;
            });
            // console.log('num_to_enter', num_to_enter);

            i = 0;
            this.total_exit = 0;
            const num_to_exit = [];
            this.data_history.forEach(element => {
              num_to_exit[i] = Number(element.num_to_exit);
              this.total_exit += num_to_exit[i];
              i++;
            });

            i = 0;
            this.total_traffic = 0;
            const traffic = [];
            this.data_history.forEach(element => {
              traffic[i] = Number(element.traffic);
              this.total_traffic += traffic[i];
              i++;
            });
             
            // console.log('num_to_exit', num_to_exit);
            this.historyColumnChart(chart_xAxis, num_to_enter, num_to_exit, traffic);
            this.historyLineChart(chart_xAxis, num_to_enter, num_to_exit, traffic);
          }
          const save_data = this.set_data_to_save();
          this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(save_data));
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
    const info = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , operation: this.operation
      , level: '\'' + this.level_traffic + '\'' // '\'Quarter Hour\''
      , dimension: this.dimension
    };
    this.blockUI.start(this.language.dang_xuat_bao_cao);
    this.appservice.post(info, environment.API.sp_footfall_get_traffic + '_export_excel').subscribe(fileData => {
      window.open(this.url_api + fileData);
      this.name_of_excel = fileData;
      if (!environment.production) {
        // console.log('Đã xuất file cả trong public export laravel');
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
          // console.log('Đã xóa file trong public export laravel');
        }
      });
    }
    );
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}

