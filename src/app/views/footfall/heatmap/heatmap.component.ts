import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SelectItem } from 'primeng/api';
import { IOption } from 'ng-select';
// highcharts
import Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import Tree from 'highcharts/modules/treemap';
import Heatmap from 'highcharts/modules/heatmap';
import { NotifierService } from 'angular-notifier';
More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);
import { TreeNode } from 'primeng/components/common/treenode';
// Viewchild
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';

import { UserPermissionGuard } from '../../../shared/user_permission.guard';

import { Subscription } from 'rxjs';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  templateUrl: 'heatmap.component.html',
  styleUrls: ['heatmap.component.scss'],
})
export class FootfallHeatMapComponent implements OnInit, OnDestroy {
  @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
  @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
  page_id = environment.Pages.footfall.heatmap;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  @ViewChild('content') public helloTemplate: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  organizations = [];
  organization_id: string;
  organization_selected = '';
  siteSelectionDisplay = false;
  siteTreeList: any; // khai báo site tree list
  site_name: any;
  site_id: number;
  siteNodeSelected: TreeNode;
  private readonly notifier: NotifierService;
  // * Site tree by organizations */
  start_time: string;
  public modalRef: BsModalRef;
  end_time: string;
  start_date: any;
  end_date: any;
  index_source: string;
  public startTimeOption: Array<IOption>;
  public endTimeOption: Array<IOption>;
  public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
  // public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  // Nghĩa thêm biến dành cho viewchild từ ngày 28/12
  start_date_to_child: any;
  end_date_to_child: any;
  start_date_int: any;
  end_date_int: any;
  menu_tree: any;
  time_period_array: any;
  time_label: any;
  time_value = '';
  organization_array: Array<IOption>;
  subcriber: Subscription;
  all_data: any;
  total_index = 0;
  valueSuffix = ''; index_viewby = 2;
  // End Nghĩa
  type_language = JSON.parse(localStorage.getItem(environment.language));
  indexes: any;
  constructor(private router: Router
    , private appservice: AppService
    , private userpermission: UserPermissionGuard
    , private modalService: BsModalService
    , notifierService: NotifierService) {
    this.notifier = notifierService;
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.indexes = indexes;
  }
  url_api = environment.apiUrl + 'exports/';
  name_of_excel: any;
  btnApplyValid = false;
  // ng select
  dropdownselect: Array<IOption>;
  time_generate_report = new Date();
  title_start_date: string;
  title_end_date: string;
  time_period: string;
  title_time_period: string;
  title_index: string; viewDataBy: string;
  starttime: string;
  endtime: string; language: any; show_error = false;

  ngOnInit() {
    this.get_page_param();

    this.subcriber = this.userpermission.message.subscribe(res => {
      if (res === 3) {
        this.got_error('Bạn không có quyền truy cập');
        this.subcriber.unsubscribe();
      }
    });
  }
  push_notification() {
    if (this.modalRef == null || this.modalRef === undefined) {
      this.modalRef = this.modalService.show(this.helloTemplate, {
        backdrop: true,
        ignoreBackdropClick: true
      });
    }
  }

  ngOnDestroy() {
    this.subcriber.unsubscribe();
  }

  set_default(defaultOrgId: any) {
    const organization_id = this.userinfo.organization_id === '0' ? defaultOrgId : Number(this.userinfo.organization_id);
    // const organization_id = this.userinfo.organization_id === '0' ? 6 : Number(this.userinfo.organization_id);
     // const value_index = this.dropdownselect.find(item => item.value === indexes.shoppers).value;
     const value_index = this.dropdownselect[0].value;
    return {
      organization_id: organization_id
      // , site_id: 0
      , start_time: '00:00'
      , end_time: '23:59'
      , time_value: 'today'
      , index_source: value_index
      , view_by: 'Day'
    };
  }

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
          // this.dropdownselect = param.traffic_index;
          this.dropdownselect = param.traffic_index.filter(function (obj) {
            return obj.value !== indexes.avg_time;
          });
          this.organization_array = param.organization_arr;
          if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
            // console.log('trong if');
            para = param.user_page_parametter;
          } else {
            // console.log('ngoai if');
            const defaultOrgId = param.organization_arr.length > 0 ? param.organization_arr[0].value : 6;
            para = this.set_default(defaultOrgId);
            // para = this.set_default();
          }
          this.organization_id = para.organization_id;

          if ('site_id' in para) {
            this.site_id = para.site_id;
          }
          this.viewDataBy = para.view_by;
          this.time_period_array = param.fba_time_period_metrics;
          this.start_time = para.start_time.replace(/[']/g, '');
          this.end_time = para.end_time.replace(/[']/g, '');
          if (para.time_value) {
            this.get_date(para.time_value);
          } else if (para.start_date && para.end_date) {
            this.start_date = para.start_date;
            this.end_date = para.end_date;
            // this.start_date_to_child = this.start_date;
            // this.end_date_to_child = this.end_date;
          }
          this.TimeInput.get_data(para, this.time_period_array);
          this.index_source = para.index_source;
          this.title_index = this.dropdownselect.find(item => item.value === para.index_source).label;

          this.startTimeOption = param.start_time_list;
          this.endTimeOption = param.end_time_list;
        } catch (error) { this.blockUI.stop(); }
      }, (error) => {
        this.blockUI.stop();
        // this.push_notification();
        this.show_error = true;
      }, () => {
        // this.blockUI.stop();
        this.get_sitetree();
      }
    );
  }

  get_date(time_value) {
    const time_array = this.TimeInput.get_time(time_value);
    // console.log(time_array);
    this.start_date = this.appservice.convert_date_tostring(time_array.ngaybatdau);
    this.end_date = this.appservice.convert_date_tostring(time_array.ngayketthuc);
    this.time_value = time_value;
    this.index_viewby = time_array.order;
  }

  // Nghĩa thêm function ngày 28/12
  get_sitetree() {
    this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
    const url = environment.API.sites + '_get_site_for_report';
    const data = { organization_id: this.organization_id };
    this.appservice.post(data, url).subscribe(res => {
      // console.log(res);
      try {
        this.menu_tree = res.site_array.slice(0);
        if (!this.site_id) {
          this.site_id = this.menu_tree.find(item => Number(item.enables) === 1).id;
        }
        this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
      } catch (error) { this.blockUI.stop(); }
    }, (error) => {
      this.blockUI.stop();
      // this.push_notification();
      this.show_error = true;
    }, () => {
      this.blockUI.stop();
      this.get_data();
    });
  }

  change_view() {
    this.get_data();
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
    this.viewDataBy = 'Day';
  }

  get_emit_menu(event) {
    if (event.organization_id) {
      this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
      const data = { organization_id: event.organization_id };
      const url = environment.API.sites + '_get_site_for_report';
      this.appservice.post(data, url).subscribe(res => {
        // console.log(res);
        try {
          this.menu_tree = res.site_array.slice(0);
          this.organization_id = event.organization_id;
          this.site_id = this.menu_tree[0].id;
          this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
          this.get_data();
        } catch (error) { }
      }, (error) => {
        this.blockUI.stop();
      }, () => {
        this.blockUI.stop();
      });
    } else if (event.site_id || event.site_id === 0) {
      this.site_id = event.site_id;
    }
  }

  get_data() {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , index_source: this.index_source
      , view_by: this.viewDataBy
    };
    this.blockUI.start(this.language.dang_tai_du_lieu);
    if (!environment.production) {
      // console.log('get_data', data);
    }
    this.value_Suffix();
    this.time_generate_report = new Date();
    this.appservice.post(data, environment.API.sp_footfall_heatmap_treemap_coloraxis_sum).subscribe(
      res => {
        if (!environment.production) {
          console.log('res: ', res);
        }
        try {
          this.show_error = false;
          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_notification();
            this.show_error = true;
            this.blockUI.stop();
          }
          this.all_data = res.data;
          this.starttime = this.startTimeOption.find(item => item.value === this.start_time).label;
          this.endtime = this.endTimeOption.find(item => item.value === this.end_time).label;
          // this.title_index = this.index_source;
          this.title_index = this.dropdownselect.find(item => item.value === this.index_source).label;
          // res.forEach(element => {
          //   this.total_index += Number(element.value);
          // });

          // const row = Number(res.length);
          // if (this.index_source === indexes.avg_time) {
          //   this.total_index = Number((this.total_index * 60 / row).toFixed(0));
          // } else if (this.index_source === indexes.turn_in_rate) {
          //   this.total_index = Number((this.total_index / row).toFixed(2));
          // }

          this.site_name = this.MenuInput.menu_tree.find(item => item.id === this.site_id).site_name;
          const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
          this.title_start_date = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
          this.title_end_date = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
          if (this.start_date !== this.end_date) {
            this.time_period = this.title_start_date + ' - ' + this.title_end_date;
          } else { this.time_period = this.title_start_date; }

          this.title_time_period = this.language.ngay;
          this.chart_heatmap(res);
          let save_data;
          if (this.time_value !== '') {
            const data_2 = {
              organization_id: this.organization_id
              , site_id: this.site_id
              , start_time: this.start_time
              , end_time: this.end_time
              , time_value: this.time_value
              , index_source: this.index_source
              , view_by: this.viewDataBy
            };
            save_data = data_2;
          } else {
            save_data = data;
          }
          this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(save_data));
        } catch (error) {
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

  Go_number(number, total) {
    let tong = 0;
    if (total !== 0) {
      tong = ((Number(number) / total) * 100);
    }
    return tong;
  }

  value_Suffix() {
    if (this.index_source === indexes.avg_time) {
      return this.valueSuffix = ' (min)';
    } else {
      return this.valueSuffix = '';
    }
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

  chart_heatmap2(res: any) {
    const selft = this;
    const label = this.index_source.slice(0);
    Highcharts.setOptions({
      global: { useUTC: false, }, lang: { decimalPoint: '.', thousandsSep: ' ' }
    });
    Highcharts.chart(this.container.nativeElement, {
      chart: {
        height: (1 / 2 * 100) + '%' // 16:9 ratio
      },
      mapNavigation: {
        enableMouseWheelZoom: true
      },
      colorAxis: {
        minColor: environment.POC.colors.heatmap,
        maxColor: '#FFFFFF',
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true, style: { zIndex: 2 }, useHTML: true, allowOverlap: false, distance: -50,
            formatter: function () {
              if (label === indexes.avg_time) {
                // tslint:disable-next-line:max-line-length
                return '<span  style="font-family:Roboto, sans-serif;font-weight:bold"> ' + this.point.name + '</span><br> ' + '<span  style="font-family:Roboto, sans-serif;font-weight:200">' + label + selft.value_Suffix() + ':  ' + selft.toHHMMSS(this.point.value * 60) + '</span>';
                // tslint:disable-next-line:max-line-length
              } else { return '<span  style="font-family:Roboto, sans-serif;font-weight:bold"> ' + this.point.name + '</span><br> ' + '<span  style="font-family:Roboto, sans-serif;font-weight:200">' + label + selft.value_Suffix() + ':  ' + this.point.value.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '</span>'; }
            }
          },
          events: {
            click: function (e) {
            }
          }
        },
      },
      exporting: { enabled: false },
      tooltip: {
        shared: true,
        formatter: function () {
          if (label !== indexes.avg_time) {
            // tslint:disable-next-line:max-line-length
            return '<span  style="font-family:Roboto, sans-serif;font-weight:bold"> ' + this.point.name + '</span> ' + '<span  style="font-family:Roboto, sans-serif;font-weight:200">' + ':  ' + this.point.value.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '</span>';
            // tslint:disable-next-line:max-line-length
          } else { return '<span  style="font-family:Roboto, sans-serif;font-weight:bold"> ' + this.point.name + '</span> ' + '<span  style="font-family:Roboto, sans-serif;font-weight:200">' + ':  ' + selft.toHHMMSS(this.point.value * 60) + '</span>'; }
        }
      },
      series: [{
        type: 'treemap', layoutAlgorithm: 'squarified', data: res, color: environment.POC.colors.heatmap,
        zIndex: 2, title: { text: '', enabled: false },
      }],
      title: { text: '' }
    });
  }

  chart_heatmap(res: any) {
    const height_item = res.data.length;
    const item_min = res.time_day.length;
    const selft = this;
    function getPointCategoryName(point, dimension) {
      const series = point.series,
        isY = dimension === 'y',
        axis = series[isY ? 'yAxis' : 'xAxis'];
      return axis.categories[point[isY ? 'y' : 'x']];
    }
    let i = 0;
    let j = 0;
    const time_hour = [];
    res.time_hour.forEach(element => {
      time_hour[i] = element.time_period;
      i++;
    });
    const time_day = [];
    res.time_day.forEach(element => {
      time_day[j] = element.time_period;
      j++;
    });
    // console.log('time_hour:', time_hour, 'time_day:', time_day);
    // console.log('data:', res.data);
    Highcharts.chart(this.container.nativeElement, {
      chart: {
        type: 'heatmap',
        height: item_min === 1 ? 150 : item_min === 2 ? 200
          : item_min === 3 ? 280 : item_min === 4 ? 320 : height_item * 3.5,
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 0.7
      },
      title: {
        text:  this.language.Ban_do_nhiet_heatmap
      },
      xAxis: {
        categories: time_hour
      },

      yAxis: {
        categories: time_day,
        title: null,
        reversed: true
      },
      accessibility: {
        point: {
          descriptionFormatter: function (point) {
            const ix = point.index + 1,
              xName = getPointCategoryName(point, 'x'),
              yName = getPointCategoryName(point, 'y'),
              val = point.value;
            return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
          }
        }
      },

      colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: '#FF3300'
      },

      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
      },

      tooltip: {
        formatter: function () {
          // tslint:disable-next-line: max-line-length
          return '<b>' + getPointCategoryName(this.point, 'y') + '</b> <br />'
            // + getPointCategoryName(this.point, 'x') + ': ' +
            + selft.title_index + ': ' +
            this.point.value;
        }
      },
      series: [{
        name: 'Sales per employee',
        borderWidth: 0.2,
        data: res.data,
        dataLabels: {
          enabled: true,
          color: '#000000'
        }
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 1000
          },
          chartOptions: {
            yAxis: {
              labels: {
                formatter: function () {
                  return this.value.charAt(0);
                }
              }
            }
          }
        }]
      }
    });
  }

  exportExcel(): void {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , start_date: this.start_date
      , end_date: this.end_date
      , index_source: this.index_source
      , view_by: this.viewDataBy
    };
    this.blockUI.start(this.language.dang_xuat_bao_cao);
    this.appservice.post(data, environment.API.sp_footfall_heatmap_treemap_coloraxis_sum + '_export_excel').subscribe(fileData => {
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
      this.get_page_param();
    });
  }

  openSchedule(scheduleTemplate: any) {
    this.modalRef = this.modalService.show(scheduleTemplate);
  }

  got_error(message =  this.language.co_loi_xay_ra, callback: Function = null) {
    this.notifier.notify('error', message);
    if (callback) {
      callback();
    }
  }
}
