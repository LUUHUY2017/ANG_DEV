import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
// import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { IOption } from 'ng-select';

import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AppService } from '../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// highcharts
import Highcharts from 'highcharts';
// chỉnh css angular
// import { ViewEncapsulation } from '@angular/core';
// import router
import { ActivatedRoute } from '@angular/router';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import notification
import { NotifierService } from 'angular-notifier';
import { language } from '../../language';
import { language_en } from '../../language_en';
import { indexes } from '../../list_index';
import { language_index_vn } from '../../list_index';
import { PushNotificationsService } from 'ng-push';

// thêm mới dateranger
declare function intDateRangePickerFBA(start_date, end_date): any;
@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: [
    './dashboard.component.css',
    './dashboard.component.scss'
  ],
  // chỉnh css angular
  // encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  page_id = environment.Pages.dashboard.dashboard;
  public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('content') public helloTemplate: ElementRef;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;
  @ViewChild('containerFBA', { read: ElementRef }) containerFBA: ElementRef;
  private readonly notifier: NotifierService;
  starttime: string;
  endtime: string;
  indexOption5 = [];
  t_f: boolean;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  indexes: any; indexess: any; language_index_vn: any;
  IsmodelShow = false;
  show_error1 = false; show_error2 = false; show_error3 = false; show_error4 = false; show_error5 = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private _pushNotifications: PushNotificationsService,
    notifierService: NotifierService,
    private modalService: BsModalService,
    private appservice: AppService) {
    this._pushNotifications.requestPermission();
    // this.notifier = notifierService;
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.language_index_vn = language_index_vn;
    this.indexes = this.indexess = indexes;
  }
  // Khai báo biến

  box_time_selected1: string; box_time_selected2: string; box_time_selected3: string; box_time_selected4: string;
  box_time_selected5: string;
  box_time_selected_end1: string; box_time_selected_end2: string; box_time_selected_end3: string; box_time_selected_end4: string;
  box_time_selected_end5: string;
  time_period5: string; time_period6: string;
  modalRef: BsModalRef;
  menu_tree: any;
  viewDataBy: string;
  siteSelectionDisplay = false;
  siteSelectionDisplay1 = false;
  siteSelectionDisplay3 = false;
  locationSelectionDisplay = false;
  start_date1: any; start_date2: any; start_date3: any; start_date4: any; start_date5: any; start_date6: any;
  end_date1: any; end_date2: any; end_date3: any; end_date4: any; end_date5: any; end_date6: any;
  location1: string; location2: string; location3: string; location4: string; location5: string; location6: string;
  box_location1: string; box_location2: string; box_location3: string; box_location4: string; box_location5: string;
  box_location6: string;
  site_id1: number; site_id2: number; site_id3: number; site_id4: number; site_id5: number; site_id6: number;
  view_by_data1 = 'Hour'; view_by_data2 = 'Hour'; view_by_data3 = 'Hour'; view_by_data4 = 'Hour'; view_by_data5 = 'Hour';
  view_by_data6 = 'Hour';
  data_show1 = 0; data_show2 = 0; data_show3 = 0; data_show4 = 0;
  index_viewby = 1;

  // Khai báo biến
  snap_menu_tree: any;
  fba_time_period_overview: any;
  organization_id1: number; organization_id2: number; organization_id3: number; organization_id4: number; organization_id5: number;
  organization_id6: number;
  question_id1: number; question_id2: number; question_id3: number; question_id4: number; question_id5: number;
  data: any; data2: any;
  questions_ongoing: any;
  title_time_period1: string;

  startTimeOption: Array<IOption>; endTimeOption: Array<IOption>;
  startTime1: string; startTime2: string; startTime3: string; startTime4: string; startTime5: string; startTime6: string;
  endTime1: string; endTime2: string; endTime3: string; endTime4: string; endTime5: string; endTime6: string;
  organization_array: any;

  // ng-multiselect-dropdown
  dropdownList = [];
  sourceSelectedItems = [];
  sourceIndexOptionSettings = {};
  destinationIndexOptionSettings = {};
  btnApplyValid = false;
  select_visit_option = [];
  traffic_index = [];
  selected_show1 = ''; selected_show4 = ''; selected_show3 = ''; selected_show2 = '';
  value1: string; value2: string; value3: string; value4: string;
  title_index_name1: string; title_index_name2: string; title_index_name3: string; title_index_name4: string;
  suffix1: string; suffix2: string; suffix3: string; suffix4: string;
  list_session = [];
  o_1_session = [];
  o_2_session = [];
  o_3_session = [];
  o_4_session = [];
  o_5_session = [];
  o_6_session = [];

  time_generate_report = new Date();
  status_change = true;
  view5: string;
  view6: string;
  date_start: any; date_end: any;
  moduleFBA = false; modulePOC = false; moduleGEN = false; load_data = false;

  /*********************************Biểu đồ cho các ô ********************* */
  // barChart1 cho Visit
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
          TOOLTIP_BODY_ITEM_VALUE: 'tooltip-body-item-title_index_name',
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
  // Line chart 2 Cho CXINdex
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
  /**********End Ô1************* */
  // barChart1 cho Visit
  public barChartData2: Array<any> = [{ data: [], label: ' ' }];
  public barChartLabels2: Array<any> = [];
  public barChartColours2: Array<any> = [{ backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 0 }];
  // Line chart 2 Cho CXINdex
  public lineChartColours2: Array<any> = [{ backgroundColor: '#35cbf7', borderColor: 'rgba(255,255,255,.8)', }];
  /**********End Ô2************* */
  // barChart1 cho Visit
  public barChartData3: Array<any> = [
    { data: [], label: ' ' }];
  public barChartLabels3: Array<any> = [];
  public barChartColours3: Array<any> = [{ backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 0 }];
  // Line chart 2 Cho CXINdex
  public lineChartColours3: Array<any> = [{ backgroundColor: '#ffc20b', borderColor: 'rgba(255,255,255,.8)', }];
  /**********End Ô3************* */
  // barChart1 cho Visit
  public barChartData4: Array<any> = [{ data: [], label: ' ' }];
  public barChartLabels4: Array<any> = [];
  public barChartColours4: Array<any> = [{ backgroundColor: 'rgba(255,255,255,0.9)', borderWidth: 0 }];
  // Line chart 2 Cho CXINdex
  public lineChartColours4: Array<any> = [{ backgroundColor: '#fd254d', borderColor: 'rgba(255,255,255,.8)', }];
  /**********End Ô4************* */
  interval; language: any;
  group_select = {
    percent: [],
    people: [],
    vnd1: [],
    vnd2: [],
    avg_item: [],
    transactions: [],
    sales_hours: [],
    shopper_on_sales_hour: [],
  };

  _dashboard = JSON.parse(localStorage.getItem(environment.localStorage.dashboard));
  _dashboard_overview = JSON.parse(localStorage.getItem(environment.localStorage.dashboard_overview));
  _start_time_list = JSON.parse(localStorage.getItem(environment.localStorage.start_time_list));
  _end_time_list = JSON.parse(localStorage.getItem(environment.localStorage.end_time_list));
  _performance_index_group = JSON.parse(localStorage.getItem(environment.localStorage.performance_index_group));
  _organization_arr = JSON.parse(localStorage.getItem(environment.localStorage.organization_arr));
  _traffic_index = JSON.parse(localStorage.getItem(environment.localStorage.traffic_index));
  _menu_tree = JSON.parse(localStorage.getItem(environment.localStorage.menu_tree));
  _question_id = JSON.parse(localStorage.getItem(environment.localStorage.question_id));
  _indexes = JSON.parse(localStorage.getItem(environment.localStorage.indexes));
  _indexess = JSON.parse(localStorage.getItem(environment.localStorage.indexess));
  _language_index_vn = JSON.parse(localStorage.getItem(environment.localStorage.language_index_vn));

  ngOnInit(): void {
    this.get_page_param();
  }

  push_notification(title, messenger) {
    const options = {
      body: messenger,
      icon: 'assets/img/avatars/alert.png',
      requireInteraction: true
    };
    this._pushNotifications.create(title, options).subscribe(
      res => {
        if (res.event.type === 'click') {
          // clearTimeout(this.interval);
        }
      },
      err => console.log('err', err)
    );
  }

  get_page_param() {
    this.blockUI.start(this.language.dang_tai_cau_hinh);

    if (this._dashboard != null && (this._dashboard.length > 0 || !this.appservice.isEmptyObject(this._dashboard))) {
      try {
        this.fba_time_period_overview = this._dashboard_overview;
        this.startTimeOption = this._start_time_list;
        this.endTimeOption = this._end_time_list;
        this.organization_array = this._organization_arr;
        this.select_visit_option = this._performance_index_group;
        this.traffic_index = this._traffic_index;
        this.indexes = this._indexes;
        this.indexess = this._indexess;
        this.language_index_vn = this._language_index_vn;
        this.selected_show1 = this.selected_show4 = this.selected_show3 = this.selected_show2
          = this.select_visit_option[0].value;
        this.dropdownList = [];
        this.select_visit_option.forEach((element, index) => {
          this.dropdownList.push({
            item_id: index
            , label: element.label
            , value: element.value
            , group: element.group
            , visible: true
          });
        });
        this._dashboard.forEach(element => {
          this['o_' + element.o_session + '_session'] = [element];
          this.get_session(element.o_session);
        });
        this.get_data_o1();
        this.get_data_o2();
        this.get_data_o3();
        this.get_data_o4();
        this.get_data_body_poc();
        this.reset_group_select();
        if (!environment.production) {
          console.log('ok1');
        }
      } catch (error) {
        this.blockUI.stop();
      }
    } else {
      this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
        param => {
          if (!environment.production) {
            console.log('get_user_page_parametter', param);
          }
          try {
            this.language_index_vn = param.language_index === '\'vn\'' ? language_index_vn : indexes;
            this.fba_time_period_overview = param.dashboard_overview;
            this.startTimeOption = param.start_time_list;
            this.endTimeOption = param.end_time_list;
            this.organization_array = param.organization_arr;
            this.select_visit_option = param.performance_index_group;
            this.traffic_index = param.traffic_index;
            this.indexes = param.list_index;
            this.indexess = param.list_index_value;
            this.selected_show1 = this.selected_show4 = this.selected_show3 = this.selected_show2
              = this.select_visit_option[0].value;

            this['indexOption' + 5] = [this.select_visit_option[0].value];
            this.dropdownList = [];
            this.select_visit_option.forEach((element, index) => {
              this.dropdownList.push({
                item_id: index
                , label: element.label
                , value: element.value
                , group: element.group
                , visible: true
              });
            });
            if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
              param.user_page_parametter.forEach(element => {
                this['o_' + element.o_session + '_session'] = [element];
                this.get_session(element.o_session);
              });
              this.get_data_o1();
              this.get_data_o2();
              this.get_data_o3();
              this.get_data_o4();
              this.get_data_body_poc();
              if (!environment.production) {
                console.log('từ phiên làm việc Db');
              }
            } else {
              if (!environment.production) {
                console.log('chạy default');
              }
              this.title_time_period1 = param.fba_time_period_metrics[0].label;
              for (let i = 1; i < 6; i++) {
                const time_on_now = new Date();

                this['organization_id' + i] = param.organization_arr[0].value;
                this['time_period' + i] = param.fba_time_period_metrics[0].label;
                this['time_value' + i] = param.fba_time_period_metrics[0].value;
                this['startTime' + i] = this.startTimeOption[0].value.toString(); // 8
                this['endTime' + i] = this.endTimeOption[23].value.toString();

                this.date_start = this.appservice.convert_date_tostringdate_by_nghia(time_on_now);

                this['start_date' + i] = '\'' + this.date_start + '\'';
                this['end_date' + i] = '\'' + this.date_start + '\'';
                const start_d = new Date(this.date_start.replace(/[']/g, '').replace(/[-]/g, '/'));
                this['style_start_date' + i] = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
                this['box_time_selected' + i] = this['style_start_date' + i];
              }

              this.get_sitetree(this.organization_id1, 1, 2);
              this.get_sitetree(this.organization_id2, 2, 2);
              this.get_sitetree(this.organization_id3, 3, 2);
              this.get_sitetree(this.organization_id4, 4, 2);
              this.get_sitetree(this.organization_id5, 5, 2);
            }

            localStorage.setItem(environment.localStorage.dashboard_overview, JSON.stringify(this.fba_time_period_overview));
            localStorage.setItem(environment.localStorage.start_time_list, JSON.stringify(this.startTimeOption));
            localStorage.setItem(environment.localStorage.end_time_list, JSON.stringify(this.endTimeOption));
            localStorage.setItem(environment.localStorage.performance_index_group, JSON.stringify(this.select_visit_option));
            localStorage.setItem(environment.localStorage.organization_arr, JSON.stringify(this.organization_array));
            localStorage.setItem(environment.localStorage.traffic_index, JSON.stringify(this.traffic_index));
            localStorage.setItem(environment.localStorage.indexes, JSON.stringify(this.indexes));
            localStorage.setItem(environment.localStorage.indexess, JSON.stringify(this.indexess));
            localStorage.setItem(environment.localStorage.language_index_vn, JSON.stringify(this.language_index_vn));

            this.reset_group_select();

          } catch (error) {
            this.blockUI.stop();
          }
        }, (error) => {
          this.blockUI.stop();
          this.show_error1 = this.show_error2 = this.show_error3 = this.show_error4 = this.show_error5 = true;
          // this.push_modal_notification();
        },
        () => {
          this.blockUI.stop();
        });
    }
  }

  push_modal_notification() {
    if (this.modalRef == null || this.modalRef === undefined) {
      this.modalRef = this.modalService.show(this.helloTemplate, {
        // backdrop: true,
        // ignoreBackdropClick: true
        keyboard: true,
      });
    }
  }

  get_sitetree(organization_id: number, i: number, lever: number) {
    this._menu_tree = JSON.parse(localStorage.getItem(environment.localStorage.menu_tree));
    this._question_id = JSON.parse(localStorage.getItem(environment.localStorage.question_id));
    if (this._menu_tree != null && (this._menu_tree.length > 0 || !this.appservice.isEmptyObject(this._menu_tree))) {
      this['menu_tree' + i] = [];
      this['menu_tree' + i] = this._menu_tree;
      this['snap_menu_tree' + i] = this['menu_tree' + i];
    } else {
      this.appservice.get_menu_tree_by_account(organization_id)
        .then(res => {
          switch (i) {
            case 1:
              this.get_info_from_tree(1, res);
              break;
            case 2:
              this.get_info_from_tree(2, res);
              break;
            case 3:
              this.get_info_from_tree(3, res);
              break;
            case 4:
              this.get_info_from_tree(4, res);
              break;
            case 5:
              this.get_info_from_tree(5, res);
              break;
            case 6:
              this.get_info_from_tree(6, res);
              break;
          }
        }).catch(error => {
          this.blockUI.stop();
        });
    }
    if (this._question_id != null) {
      this['question_id' + i] = this._question_id;
    } else {
      switch (i) {
        case 1:
          this.get_question(this.organization_id1, 1, lever);
          break;
        case 2:
          this.get_question(this.organization_id2, 2, lever);
          break;
        case 3:
          this.get_question(this.organization_id3, 3, lever);
          break;
        case 4:
          this.get_question(this.organization_id4, 4, lever);
          break;
        case 5:
          this.get_question(this.organization_id4, 5, lever);
          break;
        case 6:
          this.get_question(this.organization_id6, 6, lever);
          break;
      }
    }
  }

  // Lấy menu tree cả phiên làm việc và default
  get_info_from_tree(i: number, res: any) {
    this['menu_tree' + i] = [];
    this['menu_tree' + i] = res;
    localStorage.setItem(environment.localStorage.menu_tree, JSON.stringify(this['menu_tree' + i]));
    this['snap_menu_tree' + i] = this['menu_tree' + i];
    if (this['o_' + i + '_session'].length === 0) {
      this['site_id' + i] = this['menu_tree' + i][0].id;
      this['location' + i] = this['box_location' + i] = this['menu_tree' + i][0].site_name;
    }
  }

  // Lấy câu hỏi sau đó lấy data nếu chạy đầu tiên
  get_question(or_id: number, i: number, level: number) {
    const organization = { organization_id: or_id };
    this.appservice.post(organization, environment.FBA.API.get_question_for_report).subscribe(
      param => {
        switch (i) {
          case 1:
            this.get_info_from_question(param, 1);
            if (level === 2) {
              this.get_data_o1();
            }
            break;
          case 2:
            this.get_info_from_question(param, 2);
            if (level === 2) {
              this.get_data_o2();
            }
            break;
          case 3:
            this.get_info_from_question(param, 3);
            if (level === 2) {
              this.get_data_o3();
            }
            break;
          case 4:
            this.get_info_from_question(param, 4);
            if (level === 2) {
              this.get_data_o4();
            }
            break;
          case 5:
            this.get_info_from_question(param, 5);
            if (level === 2) {
              this.get_data_body_poc();
            }
            break;
        }
      }, (error) => {
        this.blockUI.stop();
      }, () => {
        this.blockUI.stop();
      }
    );
  }

  // thay đổi tổ chức trên ô
  change_organization(event, id: number) {
    this['menu_tree' + id] = [];
    this.snap_menu_tree = [];
    this['question_id' + id] = '';
    this.get_sitetree2(event.value).then(res => {
      this['menu_tree' + id] = res;
      this['snap_menu_tree' + id] = this['menu_tree' + id];
      this['site_id' + id] = this['menu_tree' + id][0].id;
      this['location' + id] = this['box_location' + id] = this['menu_tree' + id][0].site_name;
      this.blockUI.stop();
    });
    this.get_question(event.value, id, 1);
  }

  // lấy menu tree đã chộn ở ô
  get_sitetree2(organization_id: number) {
    this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
    return this.appservice.fba_get_org_tree(organization_id);
  }

  get_info_from_question(param: any, i: number) {
    this['questions_ongoing' + i] = param.questions_ongoing;
    if (param.questions_ongoing.length > 0) {
      this['question_id' + i] = param.questions_ongoing[0].question_id;
    } else if (this['o_' + i + '_session'].length === 0) {
      this['question_id' + i] = ' ';
    }
    if (!environment.production) {
      console.log('cau hoi la' + i, this['question_id' + i]);
    }
    localStorage.setItem(environment.localStorage.question_id, JSON.stringify(this['question_id' + i]));
  }

  // thực hiện lưu phiên làm việc
  save_session() {
    this.list_session = [];
    for (let i = 1; i < 6; i++) {
      if (this['o_' + i + '_session'].length > 0) {
        this.list_session.push(this['o_' + i + '_session'][0]);
      }
    }
    localStorage.setItem(environment.localStorage.dashboard, JSON.stringify(this.list_session));
    this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(this.list_session));
  }

  // Cấu hình thông tin cần lưu
  set_session(i: number) {
    this['o_' + i + '_session'] = [{
      o_session: i
      , organization_id: this['organization_id' + i]
      , question_id: this['question_id' + i]
      , site_id: this['site_id' + i]
      , location: this['location' + i]
      , start_date: this['start_date' + i]
      , end_date: this['end_date' + i]
      , time_period: this['time_period' + i]
      , time_value: this['time_value' + i]
      , start_time: this['startTime' + i]
      , start_hour: this['startTime' + i]
      , end_time: this['endTime' + i]
      , end_hour: this['endTime' + i]
      , view_by: this['view_by_data' + i]
      , show: this['selected_show' + i]
      , indexOption: this['indexOption' + i]
    }];
  }

  // lấy thông tin đã lưu phiên làm việc
  get_session(i: number) {
    try {
      this['organization_id' + i] = this['o_' + i + '_session'][0].organization_id;
      this['question_id' + i] = this['o_' + i + '_session'][0].question_id;
      this['site_id' + i] = this['o_' + i + '_session'][0].site_id;
      this['time_value' + i] = this['o_' + i + '_session'][0].time_value;
      this.get_time_date(this['time_value' + i], i);
      this['startTime' + i] = this['o_' + i + '_session'][0].start_time;
      this['endTime' + i] = this['o_' + i + '_session'][0].end_time;
      this['question_name' + i] = this['o_' + i + '_session'][0].question_name;
      this['location' + i] = this['o_' + i + '_session'][0].location;
      // this['time_period' + i] = this['o_' + i + '_session'][0].time_period;
      this['time_period' + i] = this.fba_time_period_overview.find(e => e.value === this['o_' + i + '_session'][0].time_value).label;
      this['view_by_data' + i] = this['o_' + i + '_session'][0].view_by;
      this['selected_show' + i] = this['o_' + i + '_session'][0].show;
      this['indexOption' + i] = this['o_' + i + '_session'][0].indexOption;
    } catch (error) {
      this.blockUI.stop();
    }
  }

  // Chọn thời gian ở ô modal
  chonthoigian(i: number, item) {
    const value = item.value;
    this.get_time(value);
    this.siteSelectionDisplay3 = false;
    this['time_period' + i] = item.label;
    this['time_value' + i] = item.value;
    this['start_date' + i] = '\'' + this.date_start + '\'';
    if (i < 5) {
      this['view_by_data' + i] = this.viewDataBy;
    } else {
      this['view_by_data' + i] = 'Hour';
    }
    this['end_date' + i] = '\'' + this.date_end + '\'';
    const start_d = new Date(this.date_start.replace(/[']/g, '').replace(/[-]/g, '/'));
    const end_d = new Date(this.date_end.replace(/[']/g, '').replace(/[-]/g, '/'));

    this['style_start_date' + i] = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
    this['style_end_date' + i] = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
    if (this['style_start_date' + i] === this['style_end_date' + i]) {
      this['box_time_selected' + i] = this['style_start_date' + i];
    } else {
      this['box_time_selected' + i] = this['style_start_date' + i] + ' - ' + this['style_end_date' + i];
    }
  }

  // lấy thời gian theo time_value đã lưu
  get_time_date(time_value, i: number) {
    try {
      this.get_time(time_value);
      this['start_date' + i] = '\'' + this.date_start + '\'';
      this['end_date' + i] = '\'' + this.date_end + '\'';
      const start_d = new Date(this.date_start.replace(/[']/g, '').replace(/[-]/g, '/'));
      const end_d = new Date(this.date_end.replace(/[']/g, '').replace(/[-]/g, '/'));
      this['style_start_date' + i] = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
      this['style_end_date' + i] = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
      if (this['style_start_date' + i] === this['style_end_date' + i]) {
        this['box_time_selected' + i] = this['style_start_date' + i];
      } else {
        this['box_time_selected' + i] = this['style_start_date' + i] + ' - ' + this['style_end_date' + i];
      }
    } catch (error) {
      this.blockUI.stop();
    }
  }

  // Lấy ngày ngày bắt đầu và kết thúc theo định dạng get_data
  get_time(time_value) {
    const ngayhomnay = new Date();
    if (time_value === 'yesterday') {
      const yesterday = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
      this.date_start = this.appservice.convert_date_tostringdate_by_nghia(yesterday);
      this.date_end = this.appservice.convert_date_tostringdate_by_nghia(yesterday);
      this.viewDataBy = 'hour';
      this.index_viewby = 1;
    } else if (time_value === 'last_week') {
      const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
      const beforeOneWeek2 = new Date(beforeOneWeek);
      const day = beforeOneWeek.getDay();
      const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
      const lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
      const lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));
      this.date_start = this.appservice.convert_date_tostringdate_by_nghia(lastMonday);
      this.date_end = this.appservice.convert_date_tostringdate_by_nghia(lastSunday);
      this.viewDataBy = 'day';
      this.index_viewby = 2;
    } else if (time_value === 'last_month') {
      const month_now = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 0);
      const yesterday = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()) - 1, 1);
      this.date_start = this.appservice.convert_date_tostringdate_by_nghia(yesterday);
      this.date_end = this.appservice.convert_date_tostringdate_by_nghia(month_now);
      this.viewDataBy = 'week';
      this.index_viewby = 4;
    } else if (time_value === 'last_year') {
      const ngaybatdaun = new Date(Number(ngayhomnay.getFullYear()) - 1, 0, 1);
      const ngayketthucn = new Date(Number(ngayhomnay.getFullYear()) - 1, 11, 31);
      this.date_start = this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun);
      this.date_end = this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn);
      this.viewDataBy = 'day';
      this.index_viewby = 5;
    } else if (time_value === 'today') {
      this.date_start = this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay);
      this.date_end = this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay);
      this.viewDataBy = 'hour';
      this.index_viewby = 1;
    } else if (time_value === 'this_week') {
      const currentWeekDay = ngayhomnay.getDay();
      const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
      const wkStart = new Date(new Date(ngayhomnay).setDate(ngayhomnay.getDate() - lessDays));
      const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
      this.date_start = this.appservice.convert_date_tostringdate_by_nghia(wkStart);
      this.date_end = this.appservice.convert_date_tostringdate_by_nghia(wkEnd);
      this.viewDataBy = 'day';
      this.index_viewby = 2;
    } else if (time_value === 'this_month') {
      const ngaydauthangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 1);
      const ngaycuoithangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth() + 1, 0);
      this.date_start = this.appservice.convert_date_tostringdate_by_nghia(ngaydauthangnay);
      this.date_end = this.appservice.convert_date_tostringdate_by_nghia(ngaycuoithangnay);
      this.viewDataBy = 'week';
      this.index_viewby = 4;
    } else if (time_value === 'last_fourteen_day') {
      const ngaybatdau = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 14);
      const ngayketthuc = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
      this.date_start = this.appservice.convert_date_tostringdate_by_nghia(ngaybatdau);
      this.date_end = this.appservice.convert_date_tostringdate_by_nghia(ngayketthuc);
      this.viewDataBy = 'day';
      this.index_viewby = 3;
    } else if (time_value === 'this_year') {
      const ngaybatdaun = new Date(ngayhomnay.getFullYear(), 0, 1);
      const ngayketthucn = new Date(ngayhomnay.getFullYear(), 11, 31);
      this.date_start = this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun);
      this.date_end = this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn);
      this.viewDataBy = 'month';
      this.index_viewby = 5;
    }
  }

  // Tìm kiếm menu
  search_menu(value: string, i: number) {
    const string = value.toLowerCase();
    if (string === '') { this['menu_tree' + i] = this['snap_menu_tree' + i]; } else {
      this['menu_tree' + i] = this['snap_menu_tree' + i].filter(x => x.site_name.toLowerCase().indexOf(string) !== -1);
    }
  }

  // chọn địa điểm
  changeitem(e: number, site_name, id) {
    this.siteSelectionDisplay = false;
    if (e === 1) {
      this.location1 = site_name; this.site_id1 = id;
    } else if (e === 2) {
      this.location2 = site_name; this.site_id2 = id;
    } else if (e === 3) {
      this.location3 = site_name; this.site_id3 = id;
    } else if (e === 4) {
      this.location4 = site_name; this.site_id4 = id;
    } else if (e === 5) {
      this.location5 = site_name; this.site_id5 = id;
    } else if (e === 6) {
      this.location6 = site_name; this.site_id6 = id;
    }
  }

  // Thay đổi ngày, giờ, tháng năm POC
  change_view_by_poc() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.get_data_body_poc();
  }

  // Thay đổi ngày, giờ, tháng năm FBA
  change_view_by_fba() {
    //   this.blockUI.start(this.language.dang_tai_du_lieu);
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

  // Áp dụng cho ô1
  load_data_box1() {
    this.status_change = false;
    // if (this.load_data) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.get_data_o1();
    this.modalRef.hide();
    // }
  }

  // Load dữ liệu cho ô1
  get_data_o1() {
    const data = {
      organization_id: this.organization_id1
      , site_id: this.site_id1
      , question_id: this.question_id1
      , start_date: this.start_date1
      , end_date: this.end_date1
      , start_hour: '\'' + this.startTime1 + '\''
      , end_hour: '\'' + this.endTime1 + '\''
      , view_by: this.view_by_data1
      , start_time: '\'' + this.startTime1 + '\''
      , end_time: '\'' + this.endTime1 + '\''
      , operation: 'sum'
    };
    if (!environment.production) {
      console.log('ô1', data);
    }
    if (this.show_error1) {
      this.blockUI.start(this.language.dang_tai_du_lieu);
    }
    this.box_location1 = this.location1;
    if (this['selected_show' + 1] === this.indexess.cx_index || this['selected_show' + 1] === this.indexess.nps_index) {
      this.get_metrics(data, 1);
    } else {
      this.get_poc(data, 1);
    }

    this.set_session(1);
    if (!this.status_change) {
      this.save_session();
    }
  }

  // Áp dụng cho ô2
  load_data_box2() {
    this.status_change = false;
    // if (this.load_data) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.get_data_o2();
    this.modalRef.hide();
    // }
  }

  // Load dữ liệu cho ô1
  get_data_o2() {
    const data = {
      organization_id: this.organization_id2
      , site_id: this.site_id2
      , question_id: this.question_id2
      , start_date: this.start_date2
      , end_date: this.end_date2
      , start_hour: '\'' + this.startTime2 + '\''
      , end_hour: '\'' + this.endTime2 + '\''
      , view_by: this.view_by_data2
      , start_time: '\'' + this.startTime2 + '\''
      , end_time: '\'' + this.endTime2 + '\''
      , operation: 'sum'
    };
    if (!environment.production) {
      console.log('ô2', data);
    }
    if (this.show_error2) {
      this.blockUI.start(this.language.dang_tai_du_lieu);
    }
    this.box_location2 = this.location2;
    if (this['selected_show' + 2] === this.indexess.cx_index || this['selected_show' + 2] === this.indexess.nps_index) {
      this.get_metrics(data, 2);
    } else {
      this.get_poc(data, 2);
    }
    this.set_session(2);
    if (!this.status_change) {
      this.save_session();
    }
  }
  // Áp dụng cho ô3
  load_data_box3() {
    this.status_change = false;
    // if (this.load_data) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.get_data_o3();
    this.modalRef.hide();
    // }
  }

  // Load dữ liệu cho ô1
  get_data_o3() {
    const data = {
      organization_id: this.organization_id3
      , site_id: this.site_id3
      , question_id: this.question_id3
      , start_date: this.start_date3
      , end_date: this.end_date3
      , start_hour: '\'' + this.startTime3 + '\''
      , end_hour: '\'' + this.endTime3 + '\''
      , view_by: this.view_by_data3
      , start_time: '\'' + this.startTime3 + '\''
      , end_time: '\'' + this.endTime3 + '\''
      , operation: 'sum'
    };
    if (!environment.production) {
      console.log('ô3', data);
    }
    if (this.show_error3) {
      this.blockUI.start(this.language.dang_tai_du_lieu);
    }
    this.box_location3 = this.location3;
    if (this['selected_show' + 3] === this.indexess.cx_index || this['selected_show' + 3] === this.indexess.nps_index) {
      this.get_metrics(data, 3);
    } else {
      this.get_poc(data, 3);
    }
    this.set_session(3);
    if (!this.status_change) {
      this.save_session();
    }
  }

  // Áp dụng cho ô4
  load_data_box4() {
    this.status_change = false;
    // if (this.load_data) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.get_data_o4();
    this.modalRef.hide();
    // }
  }
  // Load dữ liệu cho ô1
  get_data_o4() {
    const data = {
      organization_id: this.organization_id4
      , site_id: this.site_id4
      , question_id: this.question_id4
      , start_date: this.start_date4
      , end_date: this.end_date4
      , start_hour: '\'' + this.startTime4 + '\''
      , end_hour: '\'' + this.endTime4 + '\''
      , view_by: this.view_by_data4
      , start_time: '\'' + this.startTime4 + '\''
      , end_time: '\'' + this.endTime4 + '\''
      , operation: 'sum'
    };
    if (!environment.production) {
      console.log('ô4', data);
    }
    if (this.show_error4) {
      this.blockUI.start(this.language.dang_tai_du_lieu);
    }
    this.box_location4 = this.location4;
    if (this['selected_show' + 4] === this.indexess.cx_index || this['selected_show' + 4] === this.indexess.nps_index) {
      this.get_metrics(data, 4);
    } else {
      this.get_poc(data, 4);
    }
    this.set_session(4);
    if (!this.status_change) {
      this.save_session();
    }
  }

  get_metrics(data, id: number) {
    this['barChartLabels' + id] = [];
    this.appservice.post(data, environment.FBA.API.fba_report_metrics_analytic).subscribe(
      respo => {
        if (!environment.production) {
          console.log('body get_metrics in out ô' + id, respo);
        }
        try {
          if (respo.hasOwnProperty('status') && respo.status === 0) {
            // this.push_modal_notification();
            this['show_error' + id] = true;
            this.data = null;
            this.blockUI.stop();
          }
          this.data = respo.metrics;
          this.reset_to_zero('total_total_response' + id, 'total_very_positive' + id, 'total_positive' + id,
            'total_negative' + id, 'total_very_negative' + id, 'avg_very_positive_percent' + id,
            'avg_negative_percent' + id, 'avg_positive_percent' + id, 'avg_very_negative_percent' + id,
            'cx_index' + id, 'nps_index' + id);
          // Tính tổng đánh giá từng đánh giá
          this.data.forEach(element => {
            this['total_total_response' + id] += Number(element.total_response);
            this['total_very_positive' + id] += Number(element.very_positive);
            this['total_positive' + id] += Number(element.positive);
            this['total_negative' + id] += Number(element.negative);
            this['total_very_negative' + id] += Number(element.very_negative);
          });
          // Tính trung bình phần trăm các đánh giá
          this['avg_very_positive_percent' + id] = Number(((this['total_very_positive' + id]
            / this['total_total_response' + id]) * 100).toFixed(2));
          this['avg_positive_percent' + id] = Number(((this['total_positive' + id]
            / this['total_total_response' + id]) * 100).toFixed(2));
          this['avg_negative_percent' + id] = Number(((this['total_negative' + id]
            / this['total_total_response' + id]) * 100).toFixed(2));
          this['avg_very_negative_percent' + id] = Number(((this['total_very_negative' + id]
            / this['total_total_response' + id]) * 100).toFixed(2));
          // Tính CX Index
          this['cx_index' + id] = Number((((this['total_very_positive' + id] * 100) + (this['total_positive' + id] * 66.66)
            + (this['total_negative' + id] * 33.33)) / (this['total_total_response' + id])).toFixed(2));
          this['nps_index' + id] = Number((this['avg_very_positive_percent' + id] - this['avg_negative_percent' + id]
            - this['avg_very_negative_percent' + id]).toFixed(2));
          if (this['selected_show' + id] === this.indexess.cx_index) {
            this['data_show' + id] = this['cx_index' + id];
          } else if (this['selected_show' + id] === this.indexess.nps_index) {
            this['data_show' + id] = this['nps_index' + id];
          }
          this['suffix' + id] = ' (%)';
          this['value' + id] = this['selected_show' + id];

          this['title_index_name' + id] = this.select_visit_option.find(item => item.value === this['selected_show' + id]).label;



          /*----------Hiển thị biểu đồ ô1 ----------*/
          let i = 0;
          const cxindex = [];
          const npsindex = [];
          this.data.forEach(element => {
            const cx_index = Number(element.cx_index);
            const nps_index = Number(element.nps_index);
            cxindex.push(cx_index);
            npsindex.push(nps_index);
            this['barChartLabels' + id].push(element.time_period);
            i++;
          });
          // tslint:disable-next-line:max-line-length
          this['barChartData' + id] = this['selected_show' + id] === this.indexess.cx_index ? [{ data: cxindex, label: this.indexess.cx_index }] : [{ data: npsindex, label: this.indexess.nps_index }];
          this['show_error' + id] = false;
        } catch (error) {
          this.blockUI.stop();
        }
      }, (error) => {
        this.blockUI.stop();
        // this.push_modal_notification();
        this['show_error' + id] = true;
      },
      () => {
        this.blockUI.stop();
      }
    );
  }

  get_poc(data, i: number) {
    this['barChartLabels' + i] = [];
    this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_data_by_site').subscribe(
      res => {
        if (!environment.production) {
          console.log('body  get_poc ô' + i, res);
        }
        try {
          if (res.hasOwnProperty('status') && res.status === 0) {
            // this.push_modal_notification();
            this['show_error' + i] = true;
            this.data = null;
            this.blockUI.stop();
          }
          this.data = res;
          let si = 0;
          this.reset_to_zero('total_num_to_enter' + i,'total_num_to_exit' + i, 'tt_passer' + i, 'total_traffic' + i, 'total_avg_time' + i, 'tt_shop_visits' + i,
            'tt_turn_rate' + i, 'tt_kids_visits' + i, 'tt_conver' + i, 'tt_atv' + i, 'tt_avg_item' + i, 'tt_sales_yeild' + i,
            'tt_transactions' + i, 'tt_sales' + i, 'tt_missed_sales' + i, 'tt_loyal_visits' + i, 'tt_loy_tran' + i, 'tt_loy_conver' + i,
            'miss_loyal_conversion' + i, 'tt_sales_hour' + i, 'tt_shopper_on_sh' + i, 'tt_sales_on_sh' + i,
            'tt_loyal_visits_nt' + i, 'loyal_purchased' + i, 'staff' + i, 'items' + i, 'total_seconds' + i);
          res.forEach(element => {
            this['tt_sales_hour' + i] += Number(element.sales_hour);
            this['tt_passer' + i] += Number(element.passer_by);
            this['total_num_to_enter' + i] += Number(element.num_to_enter);
            this['total_num_to_exit' + i] += Number(element.num_to_exit);
            this['tt_shop_visits' + i] += Number(element.shopper_visits);
            this['total_avg_time' + i] += Number(element.avg_time);
            this['tt_kids_visits' + i] += Number(element.kids_visits);
            this['total_traffic' + i] += Number(element.traffic);
            this['tt_transactions' + i] += Number(element.transactions);
            this['tt_sales' + i] += Number(element.sales);
            this['tt_missed_sales' + i] += Number(element.missed_sales);
            // this['tt_cx_index' + i] += Number(element.cx_index);
            // this['tt_nps_index' + i] += Number(element.nps_index);
            this['items' + i] += Number(element.items);
            this['staff' + i] += Number(element.staff);
            this['loyal_purchased' + i] += Number(element.loyal_purchased);
            this['tt_loyal_visits_nt' + i] += Number(element.loyal_visits_nt);
            this['total_seconds' + i] += Number(element.total_seconds);
            if (Number(element.avg_time) > 0) {
              si++;
            }
          });
          const row = Number(res.length);

          // if (this['view_by_data' + i] === 'Hour') {
          // tslint:disable-next-line: max-line-length
          //   this['total_avg_time' + i] = Number(this['total_num_to_enter' + i]) > 0 ? Number(this['total_seconds' + i]) / Number(this['total_num_to_enter' + i]) : 0;
          // } else {
          this['total_avg_time' + i] = Number(si) > 0 ? Number((this['total_avg_time' + i] * 60 / si).toFixed(0)) : 0;
          // }
          // tslint:disable-next-line: max-line-length
          this['tt_turn_rate' + i] = this['tt_passer' + i] > 0 ? Number(((this['total_num_to_enter' + i] / this['tt_passer' + i]) * 100).toFixed(2)) : 0;
          // tslint:disable-next-line: max-line-length
          this['tt_atv' + i] = this['tt_transactions' + i] > 0 ? (Number(this['tt_sales' + i] / this['tt_transactions' + i]).toFixed(0)) : 0;
          // tslint:disable-next-line: max-line-length
          this['tt_loy_conver' + i] = this['tt_loyal_visits_nt' + i] > 0 ? (Number((this['loyal_purchased' + i] / this['tt_loyal_visits_nt' + i]) * 100).toFixed(2)) : 0;
          // tslint:disable-next-line: max-line-length
          this['tt_loy_tran' + i] = this['tt_transactions' + i] > 0 ? (Number((this['loyal_purchased' + i] / this['tt_transactions' + i]) * 100).toFixed(2)) : 0;
          // tslint:disable-next-line: max-line-length
          this['tt_conver' + i] = this['tt_shop_visits' + i] > 0 ? (Number((this['tt_transactions' + i] / this['tt_shop_visits' + i]) * 100).toFixed(2)) : 0;
          // tslint:disable-next-line: max-line-length
          this['tt_loyal_visits' + i] = (this['tt_shop_visits' + i] > 0) ? (Number((this['tt_loyal_visits_nt' + i] / this['tt_shop_visits' + i]) * 100).toFixed(2)) : 0;
          this['miss_loyal_conversion' + i] = Number(this['tt_loy_conver' + i]) > 0 ? 100 - Number(this['tt_loy_conver' + i]) : 0;
          // tslint:disable-next-line: max-line-length
          this['tt_sales_yeild' + i] = this['tt_shop_visits' + i] > 0 ? (Number(this['tt_sales' + i] / this['tt_shop_visits' + i]).toFixed(0)) : 0;
          // tslint:disable-next-line: max-line-length
          this['tt_avg_item' + i] = this['tt_transactions' + i] > 0 ? (Number(this['items' + i] / this['tt_transactions' + i]).toFixed(2)) : 0;
          // tslint:disable-next-line: max-line-length
          this['tt_shopper_on_sh' + i] = this['tt_sales_hour' + i] > 0 ? (Number(this['tt_shop_visits' + i] / this['tt_sales_hour' + i]).toFixed(2)) : 0;
          // tslint:disable-next-line: max-line-length
          this['tt_sales_on_sh' + i] = this['tt_sales_hour' + i] > 0 ? (Number(this['tt_sales' + i] / this['tt_sales_hour' + i]).toFixed(0)) : 0;
          this['tt_cx_index' + i] = Number((this['tt_cx_index' + i] / row).toFixed(2));

          if (i === 1 && this.traffic_index.length > 0
            && this.traffic_index.find(e => e.value === this.indexess.passerby)
            && this.traffic_index.find(e => e.value === this.indexess.shoppers)) {
            if (this['tt_shop_visits' + 1] > this['tt_passer' + 1]) {
              this.interval =
                this.push_notification('Cảnh báo!', this['time_period' + 1] + ': ' + this.box_location1 + ' chỉ số '
                  + this.indexess.shoppers + ' cao hơn ' + this.indexess.passerby);
            }
          }

          // /*----------Hiển thị biểu đồ ô1 ----------*/
          const visit = [];
          const exit = [];
          const traffic_num = [];
          const avg_time = [];
          const turn_in_rate = [];
          const kids_visits = [];
          const passer_by = [];
          const shopper_visits = [];
          const sales = [];
          const avg_item = [];
          const transactions = [];
          const sales_yield = [];
          const sales_hour = [];
          const shopper_on_sh = [];
          const sales_on_s_h = [];
          const missed_sales = [];
          const loyal_visits = [];
          const loyal_transactions = [];
          const loyal_conversion = [];
          const miss_loyal_conversion = [];
          const conversion = [];
          const atv = [];
          this.data.forEach(element => {
            const miss_loy = Number(element.loyal_conversion) > 0 ? Number(100 - (Number(element.loyal_conversion))) : 0;
            visit.push(Number(element.num_to_enter));
            exit.push(Number(element.num_to_exit));
            traffic_num.push(Number(element.traffic));
            avg_time.push(Number(element.avg_time));
            kids_visits.push(Number(element.kids_visits));
            passer_by.push(Number(element.turn_in_rate));
            turn_in_rate.push(Number(element.turn_in_rate));
            shopper_visits.push(Number(element.shopper_visits));
            conversion.push((Number(element.conversion)));
            sales.push(Number(element.sales));
            avg_item.push(Number(element.avg_item));
            transactions.push(Number(element.transactions));
            sales_yield.push(Number(element.sales_yield));
            missed_sales.push(Number(element.missed_sales));
            loyal_visits.push(Number(element.loyal_visits));
            loyal_transactions.push(Number(element.loyal_transactions));
            loyal_conversion.push(Number(element.loyal_conversion));
            miss_loyal_conversion.push(miss_loy);
            atv.push((Number(element.atv)));
            sales_hour.push(Number(element.sales_hour));
            shopper_on_sh.push(Number(element.shopper_on_s_h));
            sales_on_s_h.push(Number(element.sales_on_s_h));
            this['barChartLabels' + i].push(element.time_period);
          });
          this['title_index_name' + i] = this.select_visit_option.find(item => item.value === this['selected_show' + i]).label;
          this['value' + i] = this['selected_show' + i];
          console.log(this['value' + i], this['value' + i]);
          if (this['selected_show' + i] === this.indexess.visitors) {
            this['suffix' + i] = '';
            this['barChartData' + i] = [{ data: visit, label: this['title_index_name' + i] }];
            this['data_show' + i] = this['total_num_to_enter' + i];
          } else if (this['selected_show' + i] === this.indexess.exits) {
            this['suffix' + i] = '';
            this['barChartData' + i] = [{ data: exit, label: this['title_index_name' + i] }];
            this['data_show' + i] = this['total_num_to_exit' + i];
          } else if (this['selected_show' + i] === this.indexess.traffic_flow) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['total_traffic' + i];
            this['barChartData' + i] = [{ data: traffic_num, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.avg_time) {
            this['data_show' + i] = this['total_avg_time' + i];
            this['suffix' + i] = '';
            this['barChartData' + i] = [{ data: avg_time, label: this['title_index_name' + i] + '(min)' }];
          } else if (this['selected_show' + i] === this.indexess.passerby) {
            this['data_show' + i] = this['tt_passer' + i];
            this['suffix' + i] = '';
            this['barChartData' + i] = [{ data: passer_by, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.shoppers) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_shop_visits' + i];
            this['barChartData' + i] = [{ data: shopper_visits, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.turn_in_rate) {
            this['suffix' + i] = ' (%)';
            this['data_show' + i] = this['tt_turn_rate' + i];
            this['barChartData' + i] = [{ data: turn_in_rate, label: this['title_index_name' + i] + ' (%)' }];
          } else if (this['selected_show' + i] === this.indexess.kids_visitors) {
            this['suffix' + i] = ' ';
            this['data_show' + i] = this['tt_kids_visits' + i];
            this['barChartData' + i] = [{ data: kids_visits, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.conversion_rate) {
            this['suffix' + i] = ' (%)';
            this['data_show' + i] = this['tt_conver' + i];
            this['barChartData' + i] = [{ data: conversion, label: this['title_index_name' + i] + ' (%)' }];
          } else if (this['selected_show' + i] === this.indexess.atv) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_atv' + i];
            this['barChartData' + i] = [{ data: atv, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.avg_items) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_avg_item' + i];
            this['barChartData' + i] = [{ data: avg_item, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.sales_yield) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_sales_yeild' + i];
            this['barChartData' + i] = [{ data: sales_yield, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.transactions) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_transactions' + i];
            this['barChartData' + i] = [{ data: transactions, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.sales) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_sales' + i];
            this['barChartData' + i] = [{ data: sales, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.missed_sales_opportunity) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_missed_sales' + i];
            this['barChartData' + i] = [{ data: missed_sales, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.member_visitors) {
            this['suffix' + i] = ' (%)';
            this['data_show' + i] = this['tt_loyal_visits' + i];
            this['barChartData' + i] = [{ data: loyal_visits, label: this['title_index_name' + i] + ' (%)' }];
          } else if (this['selected_show' + i] === this.indexess.member_transactions) {
            this['suffix' + i] = ' (%)';
            this['data_show' + i] = this['tt_loy_tran' + i];
            this['barChartData' + i] = [{ data: loyal_transactions, label: this['title_index_name' + i] + ' (%)' }];
          } else if (this['selected_show' + i] === this.indexess.member_conversion_rate) {
            this['suffix' + i] = ' (%)';
            this['data_show' + i] = this['tt_loy_conver' + i];
            this['barChartData' + i] = [{ data: loyal_conversion, label: this['title_index_name' + i] + ' (%)' }];
          } else if (this['selected_show' + i] === this.indexess.missed_member_rate) {
            this['suffix' + i] = ' (%)';
            this['data_show' + i] = this['miss_loyal_conversion' + i];
            this['barChartData' + i] = [{ data: miss_loyal_conversion, label: this['title_index_name' + i] + ' (%)' }];
          } else if (this['selected_show' + i] === this.indexess.sales_hours) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_sales_hour' + i];
            this['barChartData' + i] = [{ data: sales_hour, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.shoppers_on_sales_hour) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_shopper_on_sh' + i];
            this['barChartData' + i] = [{ data: shopper_on_sh, label: this['title_index_name' + i] }];
          } else if (this['selected_show' + i] === this.indexess.sales_on_sales_hour) {
            this['suffix' + i] = '';
            this['data_show' + i] = this['tt_sales_on_sh' + i];
            this['barChartData' + i] = [{ data: sales_on_s_h, label: this['title_index_name' + i] }];
          }
          this['show_error' + i] = false;
        } catch (error) {
          this.blockUI.stop();
        }
      },
      (error) => {
        this.blockUI.stop();
        this['show_error' + i] = true;
        // this.push_modal_notification();
      },
      () => {
        this.blockUI.stop();
      }
    );
  }
  // Áp dụng cho biểu đồ POC body
  load_data_highchart_poc() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.status_change = false;
    this.get_data_body_poc();
    this.modalRef.hide();
  }
  // Lấy dữ liệu biểu đồ POC
  get_data_body_poc() {
    const data = {
      organization_id: this.organization_id5
      , site_id: this.site_id5
      , question_id: this.question_id5
      , start_date: this.start_date5
      , end_date: this.end_date5
      , start_hour: '\'' + this.startTime5 + '\''
      , end_hour: '\'' + this.endTime5 + '\''
      , view_by: this.view_by_data5
      , start_time: '\'' + this.startTime5 + '\''
      , end_time: '\'' + this.endTime5 + '\''
      , operation: 'sum'
    };
    if (!environment.production) {
      console.log('header poc', this.indexOption5);
    }

    this.indexOption5 = this.indexOption5;

    if (this.indexOption5.length > 1) {
      this.t_f = true;
    } else {
      this.t_f = false;
    }
    this.box_location5 = this.location5;
    this.starttime = this.startTimeOption.find(item => item.value === this.startTime5).label;
    this.endtime = this.endTimeOption.find(item => item.value === this.endTime5).label;
    this.title_time_period1 = this.time_period5;
    // tslint:disable-next-line:max-line-length
    this.view5 = this.view_by_data5 === 'Day' ? this.language.ngay : this.view_by_data5 === 'Week' ? this.language.tuan : this.view_by_data5 === 'Month' ? this.language.thang : this.view_by_data5 === 'Year' ? this.language.nam : this.view_by_data5 === 'Hour' ? this.language.gio : 'Hour';
    this.appservice.post(data, environment.API.sp_poc_data_in_out_sum_by_site + '_and_fba_metrics').subscribe(
      res => {
        if (!environment.production) {
          console.log('body poc', res);
        }
        this.show_error5 = false;
        this.data = res.items;
        this.data2 = res.metrics;
        if (res.hasOwnProperty('status') && res.status === 0) {
          this.show_error5 = true;
          this.data = [];
          this.data2 = [];
          this.blockUI.stop();
        }
        if (this.data.length > 0 && this.data2.length > 0) {
          this.showchart_poc();
        }
      }, (error) => {
        this.blockUI.stop();
        this.show_error5 = true;
      }, () => {
        this.blockUI.stop();
        this.set_session(5);
        // if (!this.status_change) {
        this.save_session();
        // }
      }
    );
  }
  // Reset giá trị bằng 0F
  reset_to_zero(...array) {
    array.forEach(element => {
      this[element] = 0;
    });
  }

  showchart_poc() {
    let i = 0;
    const chart_xAxis = [];
    const num_to_enter = [];
    const num_to_exit = [];
    const traffic = [];
    const avg_time = [];
    const passer_by = [];
    const kids_visits = [];
    const turn_in_rate = [];
    const shopper_visits = [];
    const conversion = [];
    const atv = [];
    const avg_item = [];
    const sales_yield = [];
    const sales_hour = [];
    const shopper_on_sh = [];
    const sales_on_s_h = [];

    const transactions = [];
    const sales = [];
    const missed_sales = [];
    const loyal_visits = [];
    const loyal_transactions = [];
    const loyal_conversion = [];
    const miss_loyal_conversion = [];
    this.data.forEach(element => {
      chart_xAxis[i] = element.time_period;
      num_to_enter[i] = Number(element.num_to_enter);
      num_to_exit[i] = Number(element.num_to_exit);
      traffic[i] = Number(element.traffic);
      avg_time[i] = (Number(element.avg_time));
      passer_by[i] = (Number(element.passer_by));
      kids_visits[i] = (Number(element.kids_visits));
      turn_in_rate[i] = (Number(element.turn_in_rate));
      shopper_visits[i] = (Number(element.shopper_visits));
      conversion[i] = (Number(element.conversion));
      atv[i] = (Number(element.atv));
      avg_item[i] = (Number(element.avg_item));
      sales_yield[i] = (Number(element.sales_yield));
      sales_hour[i] = (Number(element.sales_hour));
      shopper_on_sh[i] = (Number(element.shopper_on_s_h));
      sales_on_s_h[i] = (Number(element.sales_on_s_h));
      transactions[i] = (Number(element.transactions));
      sales[i] = (Number(element.sales));
      missed_sales[i] = (Number(element.missed_sales));
      loyal_visits[i] = (Number(element.loyal_visits));
      loyal_transactions[i] = (Number(element.loyal_transactions));
      loyal_conversion[i] = (Number(element.loyal_conversion));
      miss_loyal_conversion[i] = (Number(element.loyal_conversion)) > 0 ? Number(100 - (Number(element.loyal_conversion))) : 0;
      i++;
    });
    // FBA
    let j = 0;
    const cxindex = [];
    const npsindex = [];
    this.data2.forEach(element => {
      cxindex[j] = Number(element.cx_index);
      npsindex[j] = Number(element.nps_index);
      j++;
    });
    if (!environment.production) {
      console.log('cxindex', cxindex, 'npsindex', npsindex);
    }

    this.dropdownList.forEach(function (value) {
      value.visible = false;
    });
    if (this.indexOption5.length > 0) {
      for (const value of this.dropdownList) {
        for (const value1 of this.indexOption5) {
          if (value.value === value1) {
            value.visible = true;
          }
        }
      }
    }

    const selft = this;
    const c_ = environment.POC.colors;
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
      subtitle: { useHTML: true, align: 'left', y: 0, text: '  ' },
      xAxis: [{
        labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
        categories: chart_xAxis, crosshair: true
      }],
      tooltip: { shared: true, distance: 80, padding: 10, },
      navigation: { buttonOptions: { align: 'right', verticalAlign: 'bottom', y: -8 } },
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
          // labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.items } },
          labels: { format: '{value}', style: { color: c_.passer_by } },
          allowDecimals: false, title: { text: this.language_index_vn.people, style: { color: c_.passer_by, fontWeight: 'bold' }, },
          visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
        }, {
          title: { text: this.indexes.avg_time + ' (min)', style: { color: c_.avg_time, fontWeight: 'bold' }, },
          allowDecimals: false, labels: { format: '{value} ', style: { color: c_.avg_time, fontWeight: 'bold' } },
          visible: true, opposite: this.t_f, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
        }, {
          labels: { format: '{value}', style: { color: c_.turn_in_rate } },
          allowDecimals: false, title: { text: ' Percent (%)', style: { color: c_.turn_in_rate, fontWeight: 'bold' }, },
          visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, opposite: this.t_f,
        }, {
          labels: { format: '{value}', style: { color: c_.atv } },
          allowDecimals: false, title: { text: 'VNĐ', style: { color: c_.atv, fontWeight: 'bold' }, },
          visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
        }, {
          labels: { format: '{value}', style: { color: c_.items } },
          allowDecimals: false, title: { text: this.indexes.avg_items, style: { color: c_.items, fontWeight: 'bold' }, },
          visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0, opposite: this.t_f,
        }, {
          labels: { format: '{value}', style: { color: c_.customers } },
          allowDecimals: false, title: { text: this.indexes.transactions, style: { color: c_.customers, fontWeight: 'bold' }, },
          visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
        }, {
          labels: { format: '{value}', style: { color: c_.sales } },
          allowDecimals: false, title: { text: 'VNĐ', style: { color: c_.sales, fontWeight: 'bold' }, },
          visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
        }, {
          labels: { format: '{value}', style: { color: c_.sales_hour } },
          opposite: this.t_f, title: { text: this.indexes.sales_hours, style: { color: c_.sales_hour, fontWeight: 'bold' }, },
          visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
        }, {
          labels: { format: '{value}', style: { color: c_.shopper_on_sh } },
          // tslint:disable-next-line: max-line-length
          opposite: this.t_f, title: { text: this.indexes.shoppers_on_sales_hour, style: { color: c_.shopper_on_sh, fontWeight: 'bold' }, },
          visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
        },
      ],
      series: [
        {
          name: this.indexes.passerby, color: c_.passer_by, type: 'column', visible: selft.check_has_index(this.indexess.passerby),
          yAxis: selft.set_position(this.indexess.passerby), data: passer_by, showInLegend: selft.check_has_index(this.indexess.passerby),
        }, {
          name: this.indexes.visitors, color: c_.visits, type: 'column', visible: selft.check_has_index(this.indexess.visitors),
          // tslint:disable-next-line: max-line-length
          yAxis: selft.set_position(this.indexess.visitors), data: num_to_enter, showInLegend: selft.check_has_index(this.indexess.visitors),
        },
        {
          name: this.indexes.exits, color: c_.exits, type: 'column', visible: selft.check_has_index(this.indexess.exits),
          // tslint:disable-next-line: max-line-length
          yAxis: selft.set_position(this.indexess.exits), data: num_to_exit, showInLegend: selft.check_has_index(this.indexess.exits),
        }, {
          name: this.indexes.shoppers, color: c_.shopper_visits, type: 'column', visible: selft.check_has_index(this.indexess.shoppers),
          yAxis: selft.set_position(this.indexess.shoppers), data: shopper_visits,
          showInLegend: selft.check_has_index(this.indexess.shoppers),
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.kids_visitors, color: c_.kids_visits, type: 'column', visible: selft.check_has_index(this.indexess.kids_visitors),
          // tslint:disable-next-line: max-line-length
          yAxis: selft.set_position(this.indexess.kids_visitors), data: kids_visits, showInLegend: selft.check_has_index(this.indexess.kids_visitors),
        }, {
          name: this.indexes.traffic_flow, color: c_.traffic_flow, type: 'column', yAxis: selft.set_position(this.indexess.traffic_flow),
          // tslint:disable-next-line: max-line-length
          showInLegend: selft.check_has_index(this.indexess.traffic_flow), visible: selft.check_has_index(this.indexess.traffic_flow), data: traffic,
        }, {
          name: this.indexes.avg_time + ' (min)', color: c_.avg_time, type: 'spline', yAxis: 1,
          // tslint:disable-next-line: max-line-length
          tooltip: { pointFormatter: function () { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + selft.toHHMMSS(point.y * 60) + '</b><br/>'; } },
          showInLegend: selft.check_has_index(this.indexess.avg_time), visible: selft.check_has_index(this.indexess.avg_time),
          selected: true, data: avg_time,
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.conversion_rate, color: c_.conversion, type: 'spline', yAxis: selft.set_position(this.indexess.conversion_rate),
          showInLegend: selft.check_has_index(this.indexess.conversion_rate),
          visible: selft.check_has_index(this.indexess.conversion_rate), selected: true, data: conversion,
        }, {
          name: this.indexes.avg_items, color: c_.items, type: 'spline', yAxis: selft.set_position(this.indexess.avg_items),
          showInLegend: selft.check_has_index(this.indexess.avg_items),
          visible: selft.check_has_index(this.indexess.avg_items), data: avg_item, selected: true,
        }, {
          name: this.indexes.sales_yield, color: c_.sales_yield, type: 'column', yAxis: selft.set_position(this.indexess.sales_yield),
          // tslint:disable-next-line: max-line-length
          showInLegend: selft.check_has_index(this.indexess.sales_yield), visible: selft.check_has_index(this.indexess.sales_yield), data: sales_yield,
        }, {
          name: this.indexes.transactions, color: c_.customers, type: 'column', yAxis: selft.set_position(this.indexess.transactions),
          showInLegend: selft.check_has_index(this.indexess.transactions), visible: selft.check_has_index(this.indexess.transactions),
          data: transactions,
        }, {
          name: this.indexes.sales, color: c_.sales, type: 'column', yAxis: selft.set_position(this.indexess.sales), data: sales,
          showInLegend: selft.check_has_index(this.indexess.sales), visible: selft.check_has_index(this.indexess.sales),
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.missed_sales_opportunity, color: c_.missed_sales, yAxis: selft.set_position(this.indexess.missed_sales_opportunity),
          data: missed_sales, showInLegend: selft.check_has_index(this.indexess.missed_sales_opportunity),
          visible: selft.check_has_index(this.indexess.missed_sales_opportunity), type: 'column',
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.atv, color: c_.atv, type: 'spline', yAxis: selft.set_position(this.indexess.atv), data: atv, selected: true,
          showInLegend: selft.check_has_index(this.indexess.atv), visible: selft.check_has_index(this.indexess.atv),
        }, {
          name: this.indexes.sales_hours, color: c_.sales_hour, type: 'spline', yAxis: selft.set_position(this.indexess.sales_hours),
          showInLegend: selft.check_has_index(this.indexess.sales_hours),
          visible: selft.check_has_index(this.indexess.sales_hours), selected: true, data: sales_hour,
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.shoppers_on_sales_hour, color: c_.shopper_on_sh, yAxis: selft.set_position(this.indexess.shoppers_on_sales_hour),
          showInLegend: selft.check_has_index(this.indexess.shoppers_on_sales_hour),
          visible: selft.check_has_index(this.indexess.shoppers_on_sales_hour), selected: true,
          data: shopper_on_sh, type: 'spline',
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.sales_on_sales_hour, color: c_.sales_on_s_h, type: 'column', yAxis: selft.set_position(this.indexess.sales_on_sales_hour),
          showInLegend: selft.check_has_index(this.indexess.sales_on_sales_hour),
          visible: selft.check_has_index(this.indexess.sales_on_sales_hour), data: sales_on_s_h,
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.member_visitors, color: c_.loyal_visits, type: 'spline', yAxis: selft.set_position(this.indexess.member_visitors),
          showInLegend: selft.check_has_index(this.indexess.member_visitors),
          visible: selft.check_has_index(this.indexess.member_visitors), selected: true, data: loyal_visits,
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.member_transactions, color: c_.loyal_transactions, yAxis: selft.set_position(this.indexess.member_transactions),
          data: loyal_transactions, showInLegend: selft.check_has_index(this.indexess.member_transactions),
          visible: selft.check_has_index(this.indexess.member_transactions),
          selected: true, type: 'spline',
        }, {
          name: this.indexes.member_conversion_rate, yAxis: selft.set_position(this.indexess.member_conversion_rate),
          data: loyal_conversion, showInLegend: selft.check_has_index(this.indexess.member_conversion_rate),
          visible: selft.check_has_index(this.indexess.member_conversion_rate), color: c_.loyal_conversion,
          selected: true, type: 'spline',
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.missed_member_rate, color: c_.missed_loyal, type: 'spline', yAxis: selft.set_position(this.indexess.missed_member_rate),
          data: miss_loyal_conversion, showInLegend: selft.check_has_index(this.indexess.missed_member_rate),
          visible: selft.check_has_index(this.indexess.missed_member_rate),
          selected: true,
        }, {
          // tslint:disable-next-line: max-line-length
          name: this.indexes.turn_in_rate, color: c_.turn_in_rate, type: 'spline', visible: selft.check_has_index(this.indexess.turn_in_rate),
          // tslint:disable-next-line: max-line-length
          yAxis: selft.set_position(this.indexess.turn_in_rate), data: turn_in_rate, showInLegend: selft.check_has_index(this.indexess.turn_in_rate),
          selected: true,
        }, {
          name: this.indexes.cx_index, color: c_.cxindex, type: 'spline', yAxis: selft.set_position(this.indexess.cx_index),
          showInLegend: selft.check_has_index(this.indexess.cx_index), visible: selft.check_has_index(this.indexess.cx_index),
          data: cxindex, selected: true,
        }, {
          name: this.indexes.nps_index, color: c_.npsindex, type: 'spline', yAxis: selft.set_position(this.indexess.nps_index),
          showInLegend: selft.check_has_index(this.indexess.nps_index), visible: selft.check_has_index(this.indexess.nps_index),
          data: npsindex, selected: true,
        }
      ]
    });
  }

  check_has_index(name) {
    let value = false;
    for (let i = 0; i < this.dropdownList.length; i++) {
      if (this.dropdownList[i].value === name) {
        value = this.dropdownList[i].visible ? true : false;
      }
    }
    return value;
  }

  set_position(indexOptionSelected) {
    let number = 2;
    if (this.group_select.percent.includes(indexOptionSelected)) {
      number = 2;
    }
    if (this.group_select.vnd1.includes(indexOptionSelected)) {
      number = 3;
    }
    if (this.group_select.vnd2.includes(indexOptionSelected)) {
      number = 6;
    }
    if (this.group_select.people.includes(indexOptionSelected)) {
      number = 0;
    }
    if (this.group_select.sales_hours.includes(indexOptionSelected)) {
      number = 7;
    }
    if (this.group_select.shopper_on_sales_hour.includes(indexOptionSelected)) {
      number = 8;
    }
    if (this.group_select.avg_item.includes(indexOptionSelected)) {
      number = 4;
    }
    if (this.group_select.transactions.includes(indexOptionSelected)) {
      number = 5;
    }
    return Number(number);
  }

  destinationOnSelect() {
    this.validate_source_destination_index();
  }

  destinationOnDeSelect() {
    this.validate_source_destination_index();
  }

  destinationOnSelectAll() {
    // this.validate_source_destination_index();
    this.btnApplyValid = false;
  }

  destinationOnDeSelectAll() {
    // this.validate_source_destination_index();
    this.btnApplyValid = true;
  }

  validate_source_destination_index() {
    this.btnApplyValid = !(this.indexOption5.length > 0);
  }

  openModal1(template1: TemplateRef<any>) {
    this.get_sitetree(this.organization_id1, 1, 1);
    this.modalRef = this.modalService.show(template1, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  openModal2(template2: TemplateRef<any>) {
    this.get_sitetree(this.organization_id2, 2, 1);
    this.modalRef = this.modalService.show(template2, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  openModal3(template3: TemplateRef<any>) {
    this.get_sitetree(this.organization_id3, 3, 1);
    this.modalRef = this.modalService.show(template3, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  openModal4(template4: TemplateRef<any>) {
    this.get_sitetree(this.organization_id4, 4, 1);
    this.modalRef = this.modalService.show(template4, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  openModal5(template5: TemplateRef<any>) {
    this.get_sitetree(this.organization_id5, 5, 1);
    this.modalRef = this.modalService.show(template5, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  reset_session() {
    const list_session = [];
    // tslint:disable-next-line: max-line-length
    // this.site_id1 = this.site_id2 = this.site_id3 = this.site_id4 = this.site_id5 = 0;
    // this.modalRef.hide();
    localStorage.removeItem(environment.localStorage.dashboard);
    this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(list_session)).subscribe(res => {
      this.get_page_param();
    });
    // this.modalRef.hide();
  }

  reset_group_select() {
    // tslint:disable-next-line: max-line-length
    this.group_select.percent = [this.indexess.turn_in_rate, this.indexess.conversion_rate, this.indexess.member_visitors, this.indexess.member_transactions, this.indexess.member_conversion_rate, this.indexess.missed_member_rate, this.indexess.cx_index, this.indexess.nps_index];
    // tslint:disable-next-line: max-line-length
    this.group_select.people = [this.indexess.passerby, this.indexess.visitors,this.indexess.exits, this.indexess.shoppers, this.indexess.kids_visitors, this.indexess.traffic_flow];
    this.group_select.vnd1 = [this.indexess.sales_yield, this.indexess.atv, this.indexess.sales_on_sales_hour];
    this.group_select.vnd2 = [this.indexess.missed_sales_opportunity, this.indexess.sales];
    this.group_select.avg_item = [this.indexess.avg_items];
    this.group_select.transactions = [this.indexess.transactions];
    this.group_select.sales_hours = [this.indexess.sales_hours];
    this.group_select.shopper_on_sales_hour = [this.indexess.shoppers_on_sales_hour];
  }

  is_column_chart_box(selected_show) {
    if (selected_show === this.indexess.visitors || selected_show === this.indexess.exits || selected_show === this.indexess.traffic_flow
      || selected_show === this.indexess.passerby || selected_show === this.indexess.shoppers
      || selected_show === this.indexess.kids_visitors || selected_show === this.indexess.atv
      || selected_show === this.indexess.sales_yield || selected_show === this.indexess.sales
      || selected_show === this.indexess.missed_sales_opportunity
      || selected_show === this.indexess.sales_on_sales_hour || selected_show === this.indexess.transactions) {
      return true;
    } else {
      return false;
    }
  }

  is_line_chart_box(selected_show) {
    if (selected_show === this.indexess.cx_index || selected_show === this.indexess.nps_index
      || selected_show === this.indexess.turn_in_rate || selected_show === this.indexess.conversion_rate
      || selected_show === this.indexess.avg_items || selected_show === this.indexess.member_visitors
      || selected_show === this.indexess.member_transactions || selected_show === this.indexess.member_conversion_rate
      || selected_show === this.indexess.missed_member_rate
      || selected_show === this.indexess.sales_hours || selected_show === this.indexess.shoppers_on_sales_hour) {
      return true;
    } else {
      return false;
    }
  }

  close() {
    this.IsmodelShow = true;
  }
}

