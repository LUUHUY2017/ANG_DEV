import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
//
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// highcharts
import Highcharts from 'highcharts';

// tooltip
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
declare var $;
// thêm mới dateranger
declare function intDateRangePickerFBA(start_date, end_date): any;
// treenode
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
// import { userInfo } from 'os';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';
@Component({
  templateUrl: 'overview.component.html',
  styleUrls: ['./overview.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

@ViewChild(MenutreeComponent)

export class FootfallOverviewComponent implements OnInit {
  @ViewChild('content') public helloTemplate: ElementRef;
  organization_id: any;
  menu_tree: any;
  site_id: any;
  operation: any;
  displaylocation = false;
  public modalRef: BsModalRef;
  site_label: any;
  time_label: any;
  start_date: any;
  end_date: any;
  viewDataBy: any;

  time_value: any;
  status: number;
  page_id = '\'' + environment.Pages.footfall.overview + '\'';
  time_array: any;
  total_num_to_enter = 0;
  total_num_to_enter_2 = 0;
  total_num_to_enter_3 = 0;
  total_num_to_enter_4 = 0;
  total_num_to_enter_5 = 0;
  total_num_to_enter1: number; total_num_to_enter2: number; total_num_to_enter3: number; total_num_to_enter4: number;
  total_traffic1: number; total_traffic2: number; total_traffic3: number; total_traffic4: number;
  total_avg_time1: number; total_avg_time2: number; total_avg_time3: number; total_avg_time4: number;
  total_passer_by1: number; total_passer_by2: number; total_passer_by3: number; total_passer_by4: number;
  total_shopper_visits1: number; total_shopper_visits2: number; total_shopper_visits3: number; total_shopper_visits4: number;
  total_kids1: number; total_kids2: number; total_kids3: number; total_kids4: number;
  total_turn_rate1: number; total_turn_rate2: number; total_turn_rate3: number; total_turn_rate4: number;
  live_occupancy_data1: number; live_occupancy_data2: number; live_occupancy_data3: number; live_occupancy_data4: number;

  chart_1_session = [];
  chart_2_session = [];
  chart_3_session = [];
  chart_4_session = [];
  chart_5_session = [];
  start_time_list: any;
  end_time_list: any;
  start_time: any;
  end_time: any;
  level: any;
  get_data_chart_1 = [];
  get_data_chart_2 = [];
  get_data_chart_3 = [];
  get_data_chart_4 = [];
  get_data_chart_5 = [];
  status_change = true;
  organization_array: any;
  snap_menu_tree = [];
  search_key: any;
  dimension: any;
  time_generate_report = new Date();
  show_sum = true;
  siteSelectionDisplay3 = false;
  interval;
  live_occupancy_data: number;
  data: any;
  suffix1: string; suffix2: string; suffix3: string; suffix4: string;
  data_show1 = 0; data_show2 = 0; data_show3 = 0; data_show4 = 0;
  selected_show1 = ''; selected_show4 = ''; selected_show3 = ''; selected_show2 = ''; selected_show = '';
  title_index_name1 = ''; title_index_name4 = ''; title_index_name3 = ''; title_index_name2 = '';
  show_error1 = false; show_error2 = false; show_error3 = false; show_error4 = false; show_error5 = false;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  indexes: any; indexess: any;
  constructor(private router: Router
    , private appservice: AppService
    , private modalService: BsModalService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.indexes = this.indexess = indexes;
  }
  @ViewChild('container1', { read: ElementRef }) container1: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));

  // chart 1
  public barChartData1: Array<any> = [{ data: [], label: ' ' }];
  public barChartLabels1: Array<any> = [];
  public barChartOptions11: any = {
    tooltips: {
      enabled: false,
      custom: function (tooltipModel) {
        const _setCanvasId = () => {
          const _idMaker = () => {
            const _hex = 16;
            const _multiplier = 0x10000;
            // tslint:disable-next-line:no-bitwise
            return ((1 + Math.random()) * _multiplier | 0).toString(_hex);
          };
          const _canvasId = `_canvas-${_idMaker() + _idMaker()}`;
          this._chart.canvas.id = _canvasId;
          return _canvasId;
        };
        const ClassName = {
          ABOVE: 'above',
          BELOW: 'below',
          CHARTJS_TOOLTIP: 'chartjs-tooltip',
          NO_TRANSFORM: 'no-transform',
          TOOLTIP_BODY: 'tooltip-body',
          TOOLTIP_BODY_ITEM: 'tooltip-body-item',
          TOOLTIP_BODY_ITEM_COLOR: 'tooltip-body-item-color',
          TOOLTIP_BODY_ITEM_LABEL: 'tooltip-body-item-label',
          TOOLTIP_BODY_ITEM_VALUE: 'tooltip-body-item-value',
          TOOLTIP_HEADER: 'tooltip-header',
          TOOLTIP_HEADER_ITEM: 'tooltip-header-item'
        };
        const Selector = {
          DIV: 'div',
          SPAN: 'span',
          TOOLTIP: `${this._chart.canvas.id || _setCanvasId()}-tooltip`
        };
        let tooltip = document.getElementById(Selector.TOOLTIP);
        if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.id = Selector.TOOLTIP;
          tooltip.className = ClassName.CHARTJS_TOOLTIP;
          this._chart.canvas.parentNode.appendChild(tooltip);
        }
        // Hide if no tooltip
        if (tooltipModel.opacity === 0) {
          tooltip.style.opacity = '0';
          return;
        }
        // Set caret Position
        tooltip.classList.remove(ClassName.ABOVE, ClassName.BELOW, ClassName.NO_TRANSFORM);
        if (tooltipModel.yAlign) {
          tooltip.classList.add(tooltipModel.yAlign);
        } else {
          tooltip.classList.add(ClassName.NO_TRANSFORM);
        }
        // Set Text
        if (tooltipModel.body) {
          const titleLines = tooltipModel.title || [];

          const tooltipHeader = document.createElement(Selector.DIV);
          tooltipHeader.className = ClassName.TOOLTIP_HEADER;

          titleLines.forEach((title) => {
            const tooltipHeaderTitle = document.createElement(Selector.DIV);
            tooltipHeaderTitle.className = ClassName.TOOLTIP_HEADER_ITEM;
            tooltipHeaderTitle.innerHTML = title;
            tooltipHeader.appendChild(tooltipHeaderTitle);
          });

          const tooltipBody = document.createElement(Selector.DIV);
          tooltipBody.className = ClassName.TOOLTIP_BODY;

          const tooltipBodyItems = tooltipModel.body.map((item) => item.lines);
          tooltipBodyItems.forEach((item, i) => {
            const tooltipBodyItem = document.createElement(Selector.DIV);
            tooltipBodyItem.className = ClassName.TOOLTIP_BODY_ITEM;

            const colors = tooltipModel.labelColors[i];

            const tooltipBodyItemColor = document.createElement(Selector.SPAN);
            tooltipBodyItemColor.className = ClassName.TOOLTIP_BODY_ITEM_COLOR;
            tooltipBodyItemColor.style.backgroundColor = colors.backgroundColor;

            tooltipBodyItem.appendChild(tooltipBodyItemColor);

            if (item[0].split(':').length > 1) {
              const tooltipBodyItemLabel = document.createElement(Selector.SPAN);
              tooltipBodyItemLabel.className = ClassName.TOOLTIP_BODY_ITEM_LABEL;
              tooltipBodyItemLabel.innerHTML = item[0].split(': ');

              tooltipBodyItem.appendChild(tooltipBodyItemLabel);

              // const tooltipBodyItemValue = document.createElement(Selector.SPAN);
              // tooltipBodyItemValue.className = ClassName.TOOLTIP_BODY_ITEM_VALUE;
              // tooltipBodyItemValue.innerHTML = item[0].split(': ').pop();

              // tooltipBodyItem.appendChild(tooltipBodyItemValue);
            } else {
              const tooltipBodyItemValue = document.createElement(Selector.SPAN);
              tooltipBodyItemValue.className = ClassName.TOOLTIP_BODY_ITEM_VALUE;
              tooltipBodyItemValue.innerHTML = item[0];

              tooltipBodyItem.appendChild(tooltipBodyItemValue);
            }

            tooltipBody.appendChild(tooltipBodyItem);
          });

          tooltip.innerHTML = '';

          tooltip.appendChild(tooltipHeader);
          tooltip.appendChild(tooltipBody);
        }
        const positionY = this._chart.canvas.offsetTop;
        const positionX = this._chart.canvas.offsetLeft;

        // Display, position, and set styles for font
        tooltip.style.opacity = '1';
        tooltip.style.left = `${positionX + tooltipModel.caretX}px`;
        tooltip.style.top = `${positionY + tooltipModel.caretY}px`;
      },
      callbacks: {
        label: function (t, d) {
          const dstLabel = d.datasets[t.datasetIndex].label;
          const yLabel = Number(t.yLabel);
          let int = Number(yLabel * 60);
          const hh = Math.floor(int / 3600).toFixed(0);
          int %= 3600;
          const mm = Math.floor(int / 60).toFixed(0);
          const sc = (int % 60).toFixed(0);
          const m = String(mm).padStart(2, '00');
          const h = String(hh).padStart(2, '00');
          const s = String(sc).padStart(2, '00');
          return '    ' + dstLabel + '    ' + h + ':' + m + ':' + s;
        }
      },
    },
    maintainAspectRatio: false,
    scales: { xAxes: [{ display: false, barPercentage: 0.6, }], yAxes: [{ display: false }] },
    legend: { display: false }
  };
  public barChartOptions12: any = {
    tooltips: { enabled: false, custom: CustomTooltips },
    maintainAspectRatio: false,
    scales: { xAxes: [{ display: false, barPercentage: 0.6, }], yAxes: [{ display: false }] },
    legend: { display: false }
  };
  public barChartColours1: Array<any> = [{ backgroundColor: 'rgba(255,255,255,0.8)', borderWidth: 0 }];
  public barChartLegend1 = false;
  public barChartType1 = 'bar';
  // Line chart1
  public lineChartData1: Array<any> = [{ data: [], label: ' ' }];
  public lineChartLabels1: Array<any> = [];
  public lineChartOptions1: any = {
    tooltips: { enabled: false, custom: CustomTooltips },
    maintainAspectRatio: false,
    scales: { xAxes: [{ display: false }], yAxes: [{ display: false }] },
    elements: { line: { borderWidth: 2 }, point: { radius: 0, hitRadius: 10, hoverRadius: 4, }, },
    legend: { display: false }
  };
  public lineChartColours1: Array<any> = [{ backgroundColor: '#1da1ef', borderColor: 'rgba(255,255,255,.8)', }];
  public lineChartLegend1 = false;
  public lineChartType1 = 'line';

  // chart 2
  public barChartData2: Array<any> = [{ data: [], label: ' ' }];
  public barChartLabels2: Array<any> = [];
  public barChartColour3s2: Array<any> = [{ backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 0 }];
  // Line chart 2
  public lineChartData2: Array<any> = [{ data: [], label: ' ' }];
  public lineChartLabels2: Array<any> = [];
  public lineChartColours2: Array<any> = [{ backgroundColor: '#35cbf7', borderColor: 'rgba(255,255,255,.8)', }];
  // chart3
  public barChartData3: Array<any> = [{ data: [], label: ' ' }];
  public barChartLabels3: Array<any> = [];
  public barChartColours3: Array<any> = [{ backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 0 }];
  // Line chart3
  public lineChartData3: Array<any> = [{ data: [], label: ' ' }];
  public lineChartLabels3: Array<any> = [];
  public lineChartColours3: Array<any> = [{ backgroundColor: '#ffc20b', borderColor: 'rgba(255,255,255,.8)', }];
  // chart4
  public barChartData4: Array<any> = [{ data: [], label: ' ' }];
  public barChartLabels4: Array<any> = [];
  public barChartColours4: Array<any> = [{ backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 0 }];
  // Line chart 4
  public lineChartData4: Array<any> = [{ data: [], label: ' ' }];
  public lineChartLabels4: Array<any> = [];
  public lineChartColours4: Array<any> = [{ backgroundColor: '#fd254d', borderColor: 'rgba(255,255,255,.8)', }];

  select_visit_option = []; language: any;
  _overview = JSON.parse(localStorage.getItem(environment.localStorage.overview));
  _dashboard_overview = JSON.parse(localStorage.getItem(environment.localStorage.dashboard_overview));
  _start_time_list = JSON.parse(localStorage.getItem(environment.localStorage.start_time_list));
  _end_time_list = JSON.parse(localStorage.getItem(environment.localStorage.end_time_list));
  _performance_index_group = JSON.parse(localStorage.getItem(environment.localStorage.performance_index_group));
  _organization_arr = JSON.parse(localStorage.getItem(environment.localStorage.organization_arr));
  _traffic_index = JSON.parse(localStorage.getItem(environment.localStorage.traffic_index));
  _indexes = JSON.parse(localStorage.getItem(environment.localStorage.indexes));
  _indexess = JSON.parse(localStorage.getItem(environment.localStorage.indexess));

  ngOnInit() {
    this.get_page_param();
    // localStorage.removeItem('overview');
    this.time_generate_report = new Date();
  }

  reset_chart() {
    for (let i = 1; i <= 5; i++) {
      if (this['chart_' + i + '_session'].length > 0) {
        this['chart_' + i + '_session'] = [];
      }
      if (this['get_data_chart_' + i].length > 0) {
        this['get_data_chart_' + i] = [];
      }
    }
  }

  get_page_param() {
    this.blockUI.start(this.language.dang_tai_cau_hinh);
    if (this._overview != null && (this._overview.length > 0 || !this.appservice.isEmptyObject(this._overview))) {
      this.time_array = this._dashboard_overview;
      this.start_time_list = this._start_time_list;
      this.end_time_list = this._end_time_list;
      this.organization_array = this._organization_arr;
      this.reset_chart();
      this.select_visit_option = this._traffic_index;
      this.indexes =  this._indexes;
      this.indexess = this._indexess;
      this.select_visit_option.push({ label: 'Accupancy', value: 'Accupancy' });
      // tslint:disable-next-line: max-line-length
      this.selected_show1 = this.selected_show4 = this.selected_show3 = this.selected_show2 = this.selected_show = this.select_visit_option[0].value;
      this._overview.forEach(element => {
        this['chart_' + element.chart_id_session + '_session'] = [element];
      });
      this.organization_id = Number(this.userinfo.organization_id) === 0
        ? this.organization_array[0].value : this.userinfo.organization_id; // 6 hoặc user.organization_id
      this.get_sitetree().then(res => {
        this.load_phien_lam_viec(5);
      }, (error) => {
        this.blockUI.stop();
        if (!environment.production) {
          console.log('lỗi');
        }
        this['show_error' + 1] = true;
        this['show_error' + 2] = true;
        this['show_error' + 3] = true;
        this['show_error' + 4] = true;
        this['show_error' + 5] = true;
        // this.push_notification();
      });
      if (!environment.production) {
        console.log('ok1');
      }
    } else {
      this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
        param => {
          if (!environment.production) {
            console.log(param);
          }
          this.time_array = param.dashboard_overview;
          this.start_time_list = param.start_time_list;
          this.end_time_list = param.end_time_list;
          this.organization_array = param.organization_arr;
          this.reset_chart();
          this.indexes = param.list_index;
          this.indexess = param.list_index_value;
          this.select_visit_option = param.traffic_index;
          this.select_visit_option.push({ label: 'Accupancy', value: 'Accupancy' });
          // tslint:disable-next-line: max-line-length
          this.selected_show1 = this.selected_show4 = this.selected_show3 = this.selected_show2 = this.selected_show = this.select_visit_option[0].value;
          param.user_page_parametter.forEach(element => {
            this['chart_' + element.chart_id_session + '_session'] = [element];
          });
          if (!environment.production) {
            console.log('ok2');
          }
        }, error => {
          this.blockUI.stop();
          // this.push_notification();
          this['show_error' + 1] = true;
          this['show_error' + 2] = true;
          this['show_error' + 3] = true;
          this['show_error' + 4] = true;
          this['show_error' + 5] = true;
        }, () => {
          this.blockUI.stop();
          this.organization_id = Number(this.userinfo.organization_id) === 0
            ? this.organization_array[0].value : this.userinfo.organization_id; // 6 hoặc user.organization_id
          this.get_sitetree().then(res => {
            this.load_phien_lam_viec(5);
          });
        });
    }
  }

  show_config(config: TemplateRef<any>, id: number) {
    this.status = id;
    this.status_change = false;
    this.get_session(id);
    if (this.userinfo.organization_id === '0') {
      this.get_organization();
    }
    this.modalRef = this.modalService.show(config, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  get_apply_event() {
    this.modalRef.hide();
    this['get_data_chart' + this.status]();
  }

  get_organization() {
    this.get_sitetree().then(res => {
      this.blockUI.stop();
    }).catch(error => {
      this.blockUI.stop();
      // this.push_notification();
      this['show_error' + 1] = true;
      this['show_error' + 2] = true;
      this['show_error' + 3] = true;
      this['show_error' + 4] = true;
      this['show_error' + 5] = true;
    });
  }

  change_organization() {
    this.get_sitetree().then(res => {
      this.site_id = this.menu_tree.find(item => Number(item.enables) === 1).id;
      this.site_label = this.menu_tree.find(item => Number(item.enables) === 1).site_name;
      this.blockUI.stop();
    }).catch(error => {
      this.blockUI.stop();
    });
  }

  get_sitetree() {
    this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
    const url = environment.API.sites + '_get_site_for_report';
    const agrument = {
      organization_id: this.organization_id
    };
    return new Promise(resolve => {
      this.appservice.post(agrument, url).subscribe(res => {
        try {
          this.menu_tree = [];
          this.snap_menu_tree = [];
          const new_menu = res.site_array.slice(0);
          this.recusive_menu(new_menu);
          // this.menu_tree = res;
          this.snap_menu_tree = this.menu_tree.slice(0);
          // console.log(this.menu_tree);
          resolve(res.site_array);
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        // this.push_notification();
        this['show_error' + 1] = true;
        this['show_error' + 2] = true;
        this['show_error' + 3] = true;
        this['show_error' + 4] = true;
        this['show_error' + 5] = true;
      }, () => {
        this.blockUI.stop();
        // resolve();
      }
      );
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

  load_phien_lam_viec(id) {
    for (let i = 1; i <= id; i++) {
      if (this['chart_' + i + '_session'].length === 0) {
        this.load_default();
        this.set_session(i);
      } else {
        this.get_session(i);
      }
      if (this['get_data_chart' + i]) {
        this['get_data_chart' + i]();
      }
    }
  }

  load_default() {
    this.start_date = this.appservice.convert_date_tostring(new Date());
    this.end_date = this.appservice.convert_date_tostring(new Date());
    this.viewDataBy = 'hour';
    this.operation = 'SUM';
    this.start_time = '00:00';
    this.end_time = '23:59';
    this.time_label = this.time_array[0].label;
    this.time_value = this.time_array[0].value;
    this.site_id = this.menu_tree.find(item => Number(item.enables) === 1).id;
    this.site_label = this.menu_tree.find(item => Number(item.enables) === 1).site_name;
    this.level = 'Quarter Hour';
    this.selected_show = this.selected_show;
  }

  get_session(id: number) {
    try {
      this.organization_id = this['chart_' + id + '_session'][0].organization_id;
      this.site_id = this['chart_' + id + '_session'][0].site_id;
      this.site_label = this['chart_' + id + '_session'][0].site_label;
      // this.time_label =   this['chart_' + id + '_session'][0].time_label;
      this.time_label = this.time_array.find(e => e.value === this['chart_' + id + '_session'][0].time_value).label;
      this.time_value = this['chart_' + id + '_session'][0].time_value;
      this.get_time(this.time_value);
      this.start_time = this['chart_' + id + '_session'][0].start_time;
      this.end_time = this['chart_' + id + '_session'][0].end_time;
      this.viewDataBy = this['chart_' + id + '_session'][0].view_by;
      this.operation = this['chart_' + id + '_session'][0].operation;
      this.level = this['chart_' + id + '_session'][0].level;
      this.selected_show = this['chart_' + id + '_session'][0].selected_show;
    } catch (error) {
      this.blockUI.stop();
    }
  }

  set_session(i: number) {
    this['chart_' + i + '_session'] = [{
      chart_id_session: i
      , organization_id: this.organization_id
      , site_id: this.site_id
      , site_label: this.site_label
      // , start_date: this.start_date
      // , end_date: this.end_date
      , time_label: this.time_label
      , time_value: this.time_value
      , start_time: this.start_time
      , end_time: this.end_time
      , view_by: this.viewDataBy
      , selected_show: this.selected_show
      , operation: 'SUM'
      , level: this.level
    }];
  }

  luu_phien_lam_viec() {
    const all_session = [];
    for (let i = 1; i <= 5; i++) {
      if (this['chart_' + i + '_session'].length > 0) {
        all_session.push(this['chart_' + i + '_session'][0]);
      }
    }
    localStorage.setItem(environment.localStorage.overview, JSON.stringify(all_session));
    this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(all_session));
  }

  get_data_chart1() {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , view_by: this.viewDataBy
      , start_date: this.start_date
      , end_date: this.end_date
      , level: '\'' + this.level + '\''
      , operation: 'SUM'
    };
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.selected_show1 = this.selected_show;
    if (!environment.production) {
      console.log('data_send_1', data);
      console.log('selected_show1', this.selected_show1);
    }
    if (this.selected_show1 !== 'Accupancy') {
      this.get_poc(data, 1);
    } else if (this.selected_show1 === 'Accupancy') {
      this.get_accupancy_overview(data, 1);
    }
    this.set_session(1);
    if (!this.status_change) {
      this.luu_phien_lam_viec();
    }
  }

  get_data_chart2() {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , view_by: this.viewDataBy
      , start_date: this.start_date
      , end_date: this.end_date
      , level: '\'' + this.level + '\''
      , operation: 'SUM'
    };
    if (!environment.production) {
      console.log('selected_sho2', this.selected_show2);
      console.log('data_send_2', data);
    }
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.selected_show2 = this.selected_show;
    if (this.selected_show2 !== 'Accupancy') {
      this.get_poc(data, 2);
    } else if (this.selected_show2 === 'Accupancy') {
      this.get_accupancy_overview(data, 2);
    }
    this.set_session(2);
    if (!this.status_change) {
      this.luu_phien_lam_viec();
    }
  }

  get_data_chart3() {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , view_by: this.viewDataBy
      , start_date: this.start_date
      , end_date: this.end_date
      , level: '\'' + this.level + '\''
      , operation: 'SUM'
    };
    if (!environment.production) {
      console.log('data_send_3', data);
      console.log('selected_show3', this.selected_show3);
    }
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.selected_show3 = this.selected_show;
    if (this.selected_show3 !== 'Accupancy') {
      this.get_poc(data, 3);
    } else if (this.selected_show3 === 'Accupancy') {
      this.get_accupancy_overview(data, 3);
    }
    this.set_session(3);
    if (!this.status_change) {
      this.luu_phien_lam_viec();
    }
  }

  get_data_chart4() {
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , view_by: this.viewDataBy
      , start_date: this.start_date
      , end_date: this.end_date
      , level: '\'' + this.level + '\''
      , operation: 'SUM'
    };
    if (!environment.production) {
      console.log('data_send_4', data); console.log('selected_show4', this.selected_show4);
    }
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.selected_show4 = this.selected_show;
    if (this.selected_show4 !== 'Accupancy') {
      this.get_poc(data, 4);
    } else if (this.selected_show4 === 'Accupancy') {
      this.get_accupancy_overview(data, 4);
    }
    this.set_session(4);
    if (!this.status_change) {
      this.luu_phien_lam_viec();
    }
  }

  get_poc(data, i: number) {
    this['barChartLabels' + i] = [];
    this['lineChartLabels' + i] = [];
    this.appservice.post(data, environment.API.sp_poc_data_in_out_sum_by_site).subscribe(
      res => {
        if (!environment.production) {
          console.log('body  get_poc ô' + i, res);
        }
        try {
          this['show_error' + i] = false;
          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_notification();
            this['show_error' + i] = true;
            this.data = null;
            this.blockUI.stop();
          }
          this.data = res;
          this.reset_to_zero('total_num_to_enter' + i,'total_num_to_exit' + i, 'total_traffic' + i, 'total_avg_time' + i, 'total_passer_by' + i,
            'total_shopper_visits' + i, 'total_kids' + i, 'total_turn_rate' + i, 'lineChartData' + i, 'total_seconds' + i);
          let si = 0;
          res.forEach(element => {
            this['total_num_to_enter' + i] += Number(element.num_to_enter);
            this['total_num_to_exit' + i] += Number(element.num_to_exit);
            this['total_traffic' + i] += Number(element.traffic);
            this['total_avg_time' + i] += Number(element.avg_time);
            this['total_passer_by' + i] += Number(element.passer_by);
            this['total_shopper_visits' + i] += Number(element.shopper_visits);
            this['total_kids' + i] += Number(element.kids_visits);
            this['total_turn_rate' + i] += Number(element.turn_in_rate);
            this['total_seconds' + i] += Number(element.total_seconds);
            if (Number(element.avg_time) > 0) {
              si++;
            }
          });
          this['total_avg_time' + i] = Number(si) > 0 ? Number((this['total_avg_time' + i] * 60 / si).toFixed(0)) : 0;
          // tslint:disable-next-line: max-line-length
          this['total_turn_rate' + i] = Number(this['total_passer_by' + i]) > 0 ? ((Number(this['total_num_to_enter' + i]) / Number(this['total_passer_by' + i])) * 100).toFixed(2) : 0;

          const visit = [];
          const exit = [];
          const traffic_num = [];
          const avg_time = [];
          const passer_by = [];
          const shopper_visits = [];
          const kids_visits = [];
          const turn_in_rate = [];
          this.data.forEach(element => {
            const num_to_enter = Number(element.num_to_enter);
            const num_to_exit = Number(element.num_to_exit);
            const traffic = Number(element.traffic);
            const avg = Number(element.avg_time);
            const pass = Number(element.passer_by);
            const shopper = Number(element.shopper_visits);
            const kids = Number(element.kids_visits);
            const turn = Number(element.turn_in_rate);
            visit.push(num_to_enter);
            exit.push(num_to_exit);
            traffic_num.push(traffic);
            avg_time.push(avg);
            passer_by.push(pass);
            shopper_visits.push(shopper);
            kids_visits.push(kids);
            turn_in_rate.push(turn);
            this['barChartLabels' + i].push(element.time_period);
            this['lineChartLabels' + i].push(element.time_period);
          });

          this['title_index_name' + i] = this.select_visit_option.find(item => item.value === this['selected_show' + i]).label;



          if (this['selected_show' + i] === this.indexess.visitors) {
            this['barChartData' + i] = [{ data: visit, label: this['title_index_name' + i] }];
            this['suffix' + i] = '';
            this['data_show' + i] = this['total_num_to_enter' + i];
          } else if (this['selected_show' + i] === this.indexess.exits) {
            this['barChartData' + i] = [{ data: exit, label: this['title_index_name' + i] }];
            this['suffix' + i] = '';
            this['data_show' + i] = this['total_num_to_exit' + i];
          } else if (this['selected_show' + i] === this.indexess.traffic_flow) {
            this['barChartData' + i] = [{ data: traffic_num, label: this['title_index_name' + i]  }];
            this['suffix' + i] = '';
            this['data_show' + i] = this['total_traffic' + i];
          } else if (this['selected_show' + i] === this.indexess.avg_time) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['total_avg_time' + i];
            this['barChartData' + i] = [{ data: avg_time, label: this['title_index_name' + i]  }];
          } else if (this['selected_show' + i] === this.indexess.passerby) {
            this['barChartData' + i] = [{ data: passer_by, label: this['title_index_name' + i]  }];
            this['suffix' + i] = '';
            this['data_show' + i] = this['total_passer_by' + i];
          } else if (this['selected_show' + i] === this.indexess.shoppers) {
            this['barChartData' + i] = [{ data: shopper_visits, label: this['title_index_name' + i]  }];
            this['suffix' + i] = '';
            this['data_show' + i] = this['total_shopper_visits' + i];
          } else if (this['selected_show' + i] === this.indexess.kids_visitors) {
            this['barChartData' + i] = [{ data: kids_visits, label: this['title_index_name' + i]  }];
            this['suffix' + i] = '';
            this['data_show' + i] = this['total_kids' + i];
          } else if (this['selected_show' + i] === this.indexess.turn_in_rate) {
            this['lineChartData' + i] = [{ data: turn_in_rate, label: this['title_index_name' + i]  }];
            this['suffix' + i] = ' (%)';
            this['data_show' + i] = this['total_turn_rate' + i];
          }
          clearInterval(this['interval' + i]);
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        this['show_error' + i] = true;
        // this.push_notification();
      },
      () => {
        this.blockUI.stop();
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

  get_accupancy_overview(data, i: number) {
    clearInterval(this['interval' + i]);
    const form_data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , level: this.level
    };
    this['lineChartLabels' + i] = [];
    this.appservice.post(data, environment.API.sp_footfall_get_traffic_live).subscribe(
      res => {
        if (!environment.production) {
          console.log('post data liveview: ', form_data);
          console.log('loadDataLiveView res ', res);
        }
        try {
          const chart_occupancy_data = [];
          let a = 0;
          this['live_occupancy_data' + i] = this['data_show' + i] = 0;
          const occupancy = [];
          res.live_data.forEach(element => {
            const occu = Number(element.occupancy);
            chart_occupancy_data[a] = Number(element.occupancy);
            occupancy.push(occu);
            this['lineChartLabels' + i].push(element.time_period);
            a++;
          });
          if (a > 0) {
            if (res.live_data[res.live_data.length - 1].series_name !== null) {
              this['live_occupancy_data' + i] = chart_occupancy_data[a - 1];

            } else {
              this['live_occupancy_data' + i] = chart_occupancy_data[a - 2];
            }
            this['suffix' + i] = '';
            this['data_show' + i] = this['live_occupancy_data' + i];
          }
          this['lineChartData' + i] = [{ data: occupancy, label: 'Accupancy' }];
          this['show_error' + i] = false;
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        this['show_error' + i] = true;
      },
      () => {
        this.blockUI.stop();
        this['interval' + i] = setInterval(() => {
          this.get_accupancy_overview(data, i);
        }, 60000);
      }
    );
  }

  get_data_chart5() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      organization_id: this.organization_id
      , site_id: this.site_id
      , start_time: '\'' + this.start_time + '\''
      , end_time: '\'' + this.end_time + '\''
      , view_by: this.viewDataBy
      , operation: this.operation
      , start_date: this.start_date
      , end_date: this.end_date
    };
    if (!environment.production) {
      console.log('get_5', data);
    }
    const url = environment.API.sp_poc_data_in_out_sum_by_site + '_overview';
    this.appservice.post(data, url).subscribe(res => {
      this.get_data_chart_5 = res.data;
      if (!environment.production) {
        console.log(' this.get_data_chart_5', this.get_data_chart_5);
      }
      this.show_error5 = false;
      if (res.hasOwnProperty('status') && res.status === 0) {
        this.show_error5 = true;
        this.get_data_chart_5 = [];
        this.blockUI.stop();
      }
      if (this.get_data_chart_5.length > 0) {
        this.chart5();
      }
      this.set_session(5);
      this.luu_phien_lam_viec();

    }, (error) => {
      this.blockUI.stop();
      this.show_error5 = true;
    },
      () => {
        this.blockUI.stop();
      });
  }

  chart5() {
    // console.log(this.get_data_chart_5);
    const category = [];
    const category_data = [];
    this.get_data_chart_5.forEach(element => {
      category.push(element.site_name);

      let total_num_to_enter = 0;
      const num_to_enter = Number(element.shopper_visits);
      total_num_to_enter += num_to_enter;
      category_data.push(total_num_to_enter);
    });
    const number_row = category_data.length * 35;
    Highcharts.chart(this.container1.nativeElement, {
      chart: {
        type: 'bar',
        // height: (9 / 16 * 100) + '%'
        height: number_row,
      },
      title: { text: '<h5  style="font-family:Roboto, sans-serif;" >' + this.language.top_cua_hang_mua_sam + '</h5>' },
      subtitle: { text: '' },
      xAxis: { categories: category, title: { text: null }, },
      yAxis: { min: 0, maxPadding: 0, allowDecimals: false, title: { text: '', align: '' }, labels: { overflow: '', format: '{value}' } },
      tooltip: {
        useHTML: true,
        // tslint:disable-next-line:max-line-length
        headerFormat: '<div style="color:#0f0303;font-family:Roboto, sans-serif;font-size:12px;font-weight:bold;" >' + this.language.dia_diem_bieu_do + ' {point.key}</div>',
        // tslint:disable-next-line:max-line-length
        pointFormat: '<span  style= color:{point.color};"font-family:Roboto, sans-serif;font-size:11px;">' + this.language.so_luong + ' {point.y} </span><br/>',
      },
      plotOptions: { bar: { dataLabels: { enabled: true } } },
      legend: {
        enabled: false, layout: 'vertical', align: 'right', verticalAlign: 'top',
        x: -40, y: 80, floating: false, borderWidth: 1, backgroundColor: environment.POC.colors.avg_time, shadow: true
      },
      credits: { enabled: false },
      series: [{ name: '', data: category_data, color: environment.POC.colors.overview, }]
    });
  }

  reset_to_zero(...array) {
    array.forEach(element => {
      this[element] = 0;
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

  changemenu(item) {
    this.site_label = item.site_name;
    this.site_id = item.id;
    // this.displaylocation = false;
    this.set_value_empty();
  }

  change_operation(element) {
    this.operation = element.text;
  }

  change_time(element) {
    this.time_label = element.label;
    this.time_value = element.value;
    this.siteSelectionDisplay3 = false;
    this.get_time(this.time_value);
  }

  get_time(time_value: string) {
    const ngayhomnay = new Date();
    time_value = time_value.toLocaleLowerCase();
    if (time_value === 'today') {
      this.start_date = ngayhomnay;
      this.end_date = this.start_date;
      this.viewDataBy = 'hour';
    } else if (time_value === 'yesterday') {
      const ngayhomqua = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
      this.start_date = ngayhomqua;
      this.end_date = this.start_date;
      this.viewDataBy = 'hour';
    } else if (time_value === 'this_week') {
      const currentWeekDay = ngayhomnay.getDay();
      const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
      const wkStart = new Date(new Date(ngayhomnay).setDate(ngayhomnay.getDate() - lessDays));
      const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
      this.start_date = wkStart;
      this.end_date = wkEnd;
      this.viewDataBy = 'day';
    } else if (time_value === 'last_week') {
      const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
      const beforeOneWeek2 = new Date(beforeOneWeek);
      const day = beforeOneWeek.getDay();
      const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
      const lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
      const lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));
      this.start_date = lastMonday;
      this.end_date = lastSunday;
      this.viewDataBy = 'day';
    } else if (time_value === 'this_month') {
      const ngaydauthangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 1);
      const ngaycuoithangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth() + 1, 0);
      this.start_date = ngaydauthangnay;
      this.end_date = ngaycuoithangnay;
      this.viewDataBy = 'week';
    } else if (time_value === 'last_month') {
      const thangtruocbatdau = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()) - 1, 1);
      const thangtruocketthuc = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()), 0);
      this.start_date = thangtruocbatdau;
      this.end_date = thangtruocketthuc;
      this.viewDataBy = 'week';
    } else if (time_value === 'this_year') {
      const ngaybatdaun = new Date(ngayhomnay.getFullYear(), 0, 1);
      const ngayketthucn = new Date(ngayhomnay.getFullYear(), 11, 31);
      this.start_date = ngaybatdaun;
      this.end_date = ngayketthucn;
      this.viewDataBy = 'month';
    } else if (time_value === 'last_year') {
      const daunamtruoc = new Date(Number(ngayhomnay.getFullYear()) - 1, 0, 1);
      const cuoinamtruoc = new Date(Number(ngayhomnay.getFullYear()) - 1, 11, 31);
      this.start_date = daunamtruoc;
      this.end_date = cuoinamtruoc;
      this.viewDataBy = 'month';
    } else if (time_value === 'last_fourteen_day') {
      const ngaybatdau = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 14);
      const ngayketthuc = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
      this.start_date = ngaybatdau;
      this.end_date = ngayketthuc;
      this.viewDataBy = 'day';
    }

    if (typeof this.start_date !== 'string' && typeof this.end_date !== 'string') {
      this.start_date = this.appservice.convert_date_tostring(this.start_date);
      this.end_date = this.appservice.convert_date_tostring(this.end_date);
    }
    if (!environment.production) {
      console.log('start_date', this.start_date);
      console.log('end_date', this.end_date);
    }
  }

  reset_session() {
    const all_session = [];
    this.site_id = null;
    this.status_change = true;
    localStorage.removeItem(environment.localStorage.overview);
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(all_session)).subscribe(res => {
      this.get_page_param();
    });
  }

  // Hàm tìm kiếm menu
  search_menu() {
    // chuyển giá trị truyền vào về chữ thường để so sánh
    const string = this.search_key !== undefined ? this.search_key.toLowerCase() : '';
    if (string === '') {
      this.menu_tree = this.snap_menu_tree;
    } else {
      this.menu_tree = this.snap_menu_tree.filter(x => x.site_name.toLowerCase().indexOf(string) !== -1);
    }
  }

  // Hàm khi click ngoài menu tree
  set_value_empty() {
    this.displaylocation = false;
    this.search_key = '';
    this.menu_tree = this.snap_menu_tree;
  }

  is_column_chart_box(selected_show) {

    console.log("selected_show",selected_show);
    console.log("this.indexess",this.indexess);

    if (selected_show === this.indexess.visitors || selected_show === this.indexess.exits  || selected_show === this.indexess.traffic_flow
      || selected_show === this.indexess.kids_visitors || selected_show === this.indexess.shoppers
      || selected_show === this.indexess.passerby) {
      return true;
    } else {
      return false;
    }
  }

  is_line_chart_box(selected_show) {
    if (selected_show === 'Accupancy' || selected_show === this.indexess.turn_in_rate) {
      return true;
    } else {
      return false;
    }
  }


}
