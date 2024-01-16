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
More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
import { log } from 'util';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';
import { language_index_vn } from '../../../list_index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { StoreReportingFFScheduleComponent } from '../../useremailmodule/footfall/storereporting/storereporting.component';
import { NotifierService } from 'angular-notifier';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
    templateUrl: 'metrics-comparison.component.html',
    styleUrls: ['metrics-comparison.component.scss']
})

export class FootfallMetricsComparisonComponent implements OnInit {
    @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
    defaultModule = 1;
    indexViewBy: number;
    currentPageId = environment.Pages.footfall.metrics_comparison;
    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
    @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
    @ViewChild('pdf_export') exports: ElementRef;
    @ViewChild('content') public helloTemplate: ElementRef;

    total_num_to_enter = 0; total_traffic = 0; total_avg_time = 0; viewDataBy: string;
    @BlockUI() blockUI: NgBlockUI;
    siteSelectionDisplay = false;
    organization_id: string; time_period_array: any[]; organization_array: any[];
    site_id: any; start_date: any; end_date: any; time_value = '';
    public page_id = environment.Pages.footfall.metrics_comparison;
    // public navItems = navItems;
    sidebarMinimized = true;
    public modalRef: BsModalRef;
    element: HTMLElement = document.body;
    userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
    start_time: string; end_time: string; chart_data: any[]; startTimeOption: Array<IOption>;
    endTimeOption: Array<IOption>;
    btnApplyValid = false;
    dropdownList = []; sourceSelectedItems = []; destinationSelectedItems = [];
    sourceIndexOptionSettings = {
        singleSelection: true,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: false
    };
    destinationIndexOptionSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        // groupBy: 'value',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: false
    };
    operation = 'SUM'; time_generate_report = new Date(); dropdownList_compare: any[];
    menu_tree: any[]; total_passer_by = 0; total_shopper_visits = 0; total_seconds = 0;
    total_kids_visits = 0; total_turn_in_rate = 0; t_f: boolean; indexes: any; index_value: any; language_index_vn: any;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    show_label_table: string;
    constructor(protected router: Router, protected appservice: AppService, private modalService: BsModalService) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
        this.indexes = this.index_value = indexes;
        this.language_index_vn = language_index_vn;
    }
    url_api = environment.apiUrl + 'exports/';
    name_of_excel: any; site_name: string;
    title_start_date: string; title_end_date: string; time_period: string; title_time_period: string;
    starttime: string; endtime: string; index_viewby = 1;
    group_select = {
        percent: [],
        people: [],
    };
    view: string; language: any; show_error = false;
    ngOnInit() {
        this.get_page_param();
    }

    get_page_param() {
        this.blockUI.start(this.language.dang_tai_cau_hinh);
        this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
            param => {
                try {
                    if (!environment.production) {
                        console.log('get_user_page_parametter', param);
                    }
                    let para = null;
                    this.dropdownList = [];
                    this.indexes = param.list_index;
                    this.index_value = param.list_index_value;
                    this.language_index_vn = param.language_index === '\'vn\'' ? language_index_vn : indexes;
                    param.traffic_index.forEach((element, index) => {
                        this.dropdownList.push({
                            item_id: index
                            , label: element.label
                            , value: element.value
                            , group: element.group
                            , visible: true
                        });
                    });
                    if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
                        para = param.user_page_parametter;
                        this.group_select = para.group_select;
                    } else {
                        const defaultOrgId = param.organization_arr.length > 0 ? param.organization_arr[0].value : 6;
                        para = this.set_default(defaultOrgId);
                        // para = this.set_default();
                        this.group_select.percent = [this.index_value.turn_in_rate];
                        // tslint:disable-next-line: max-line-length
                        this.group_select.people = [this.index_value.passerby, this.index_value.visitors, this.index_value.shoppers, this.index_value.kids_visitors, this.index_value.traffic_flow];
                    }
                    this.destinationSelectedItems = para.indexOptionSelected_compare;
                    if (!environment.production) {
                        console.log('para', para, ' this.destinationSelectedItems', this.destinationSelectedItems);
                    }
                    this.viewDataBy = para.view_by;
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
                    this.operation = para.operation;
                    if (para.time_value) {
                        this.get_date(para.time_value);
                    } else if (para.start_date && para.end_date) {
                        this.start_date = para.start_date;
                        this.end_date = para.end_date;
                    }
                    this.TimeInput.get_data(para, this.time_period_array);
                    this.get_sitetree();
                } catch (error) {
                    // this.push_notification();
                    this.show_error = true;
                    this.blockUI.stop();
                }
            }, (error) => {
                this.blockUI.stop();
            }, () => { }
        );
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
    sendParamToChildren( ) {
        console.log('site_id 1111', this.site_id);
        const dataFromParent = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , start_time: this.start_time
            , end_time: this.end_time
            , view_by: this.viewDataBy
            , operation: this.operation
            , export: 'sosanh'
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
            , operation: this.operation
            , export: 'sosanh'
        };
        const indexViewBy = this.TimeInput.indexViewby;
        this.scheduleComponent.checkExistParam(dataFromParent, indexViewBy);
        if (!environment.production) {
            console.log('dataFromParent', dataFromParent, 'indexViewBy', indexViewBy);
        }
    }
    // end chilren

    get_date(time_value) {
        const time_array = this.TimeInput.get_time(time_value);
        this.start_date = this.appservice.convert_date_tostring(time_array.ngaybatdau);
        this.end_date = this.appservice.convert_date_tostring(time_array.ngayketthuc);
        this.time_value = time_value;
        this.index_viewby = time_array.order;
    }

    set_default(defaultOrgId: any) {
        const organization_id = this.userinfo.organization_id === '0' ? defaultOrgId : Number(this.userinfo.organization_id);
        // const organization_id = this.userinfo.organization_id === '0' ? 6 : Number(this.userinfo.organization_id);
        // const value_index = this.dropdownList.find(item => item.value === this.index_value .shoppers).value;
        const value_index = this.dropdownList[0].value;
        return {
            organization_id: organization_id
            // , site_id: 0
            , start_time: '00:00'
            , end_time: '23:59'
            , time_value: 'today'
            , view_by: 'Hour'
            , operation: this.operation
            , indexOptionSelected: [0]
            , indexOptionSelected_compare: [value_index]
        };
    }

    get_data() {
        this.blockUI.start(this.language.dang_tai_du_lieu);
        const indexOptionSelected = [];
        const indexOptionSelected_compare = this.destinationSelectedItems;
        const data = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , start_time: '\'' + this.start_time + '\''
            , end_time: '\'' + this.end_time + '\''
            , start_date: this.start_date
            , end_date: this.end_date
            , view_by: this.viewDataBy
            , operation: this.operation
            , indexOptionSelected: indexOptionSelected
            , indexOptionSelected_compare: indexOptionSelected_compare
            , group_select: this.group_select
        };
        this.t_f = indexOptionSelected_compare.length > 1 ? true : false;
        if (!environment.production) {
            // console.log('data', data);
        }
        // tslint:disable-next-line:max-line-length
        this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.language.gio;
        this.time_generate_report = new Date();
        this.appservice.post(data, environment.API.sp_poc_data_in_out_sum_by_site).subscribe(
            res => {
                try {
                    this.show_error = false;
                    this.chart_data = res;
                    if (res.hasOwnProperty('status') && res.status === 0) {
                        // this.push_notification();
                        this.show_error = true;
                        this.chart_data = [];
                        this.blockUI.stop();
                    }
                    this.starttime = this.startTimeOption.find(item => item.value === this.start_time).label;
                    this.endtime = this.endTimeOption.find(item => item.value === this.end_time).label;
                    this.site_name = this.MenuInput.menu_tree.find(item => item.id === this.site_id).site_name;

                    const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                    const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                    this.title_start_date = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
                    this.title_end_date = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
                    if (this.start_date !== this.end_date) {
                        this.time_period = this.title_start_date + ' - ' + this.title_end_date;
                    } else { this.time_period = this.title_start_date; }

                    this.title_time_period = this.language.ngay;
                    this.reset_to_zero('total_num_to_enter', 'total_traffic', 'total_avg_time', 'total_passer_by',
                        'total_kids_visits', 'total_turn_in_rate', 'total_shopper_visits', 'total_seconds');
                    let si = 0;
                    res.forEach(element => {
                        this.total_num_to_enter += Number(element.num_to_enter);
                        this.total_traffic += Number(element.traffic);
                        this.total_avg_time += Number(element.avg_time);
                        this.total_passer_by += Number(element.passer_by);
                        this.total_kids_visits += Number(element.kids_visits);
                        this.total_turn_in_rate += Number(element.turn_in_rate);
                        this.total_shopper_visits += Number(element.shopper_visits);
                        this.total_seconds += Number(element.total_seconds);
                        if (Number(element.avg_time) > 0) {
                            si++;
                        }
                    });
                    console.log(' this.total_seconds', this.total_seconds, ' this.total_num_to_enter', this.total_num_to_enter);
                    const row = Number(res.length);
                    this.total_avg_time = Number(si) > 0 ? Number((this.total_avg_time * 60 / si).toFixed(0)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.total_turn_in_rate = Number(this.total_passer_by) > 0 ? Number(((this.total_num_to_enter / this.total_passer_by) * 100).toFixed(2)) : 0;
                    if (this.chart_data.length > 0) {
                        this.loadHightChart();
                    }
                    let save_data;
                    if (this.time_value !== '') {
                        const data_2 = {
                            organization_id: this.organization_id
                            , site_id: this.site_id
                            , start_time: this.start_time
                            , end_time: this.end_time
                            , time_value: this.time_value
                            , view_by: this.viewDataBy
                            , operation: this.operation
                            , indexOptionSelected: indexOptionSelected
                            , indexOptionSelected_compare: indexOptionSelected_compare
                            , group_select: this.group_select
                        };
                        save_data = data_2;
                    } else {
                        save_data = data;
                    }
                    this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(save_data));
                } catch (error) {
                    this.blockUI.stop();
                    this.show_error = true;
                }
            }, (error) => {
                this.blockUI.stop();
                // this.push_notification();
                this.show_error = true;
            }, () => {
                this.sendParamToChildren();
                this.blockUI.stop();
            }
        );
    }

    reset_to_zero(...array) {
        array.forEach(element => { this[element] = 0; });
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
        this.btnApplyValid = !(this.destinationSelectedItems.length > 0);
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
            , operation: this.operation
            , export: 'sosanh'
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

    change_view() {
        this.get_data();
    }

    loadHightChart() {
        const color = environment.POC.colors;
        let i = 0;
        const chart_xAxis = [];
        const num_to_enter = [];
        const traffic = [];
        const avg_time = [];
        const passer_by = [];
        const kids_visits = [];
        const turn_in_rate = [];
        const shopper_visits = [];
        this.chart_data.forEach(element => {
            chart_xAxis[i] = element.time_period;
            num_to_enter[i] = Number(element.num_to_enter);
            traffic[i] = Number(element.traffic);
            avg_time[i] = this.toMM(Number(element.avg_time));
            avg_time[i] = (Number(element.avg_time));
            passer_by[i] = (Number(element.passer_by));
            kids_visits[i] = (Number(element.kids_visits));
            turn_in_rate[i] = (Number(element.turn_in_rate));
            shopper_visits[i] = (Number(element.shopper_visits));
            i++;
        });

        if (chart_xAxis.length > 0) {
            this.show_label_table = chart_xAxis[0] + ' - ' + chart_xAxis[chart_xAxis.length - 1];
        }
        this.dropdownList.forEach(function (value) {
            value.visible = false;
        });
        if (this.destinationSelectedItems.length > 0) {
            for (const value of this.dropdownList) {
                for (const value1 of this.destinationSelectedItems) {
                    if (value.value === value1) {
                        value.visible = true;
                    }
                }
            }
        }
        const selft = this;
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
                text: ''
            },
            xAxis: [{
                labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
                categories: chart_xAxis, crosshair: true
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
            yAxis: [
                {
                    // formatter() { return this.axis.defaultLabelFormatter.call(this); }
                    labels: { format: '{value} ', style: { color: color.male } },
                    allowDecimals: false, title: { text: this.language_index_vn.people, style: { color: color.male, fontWeight: 'bold' } },
                    min: 0, visible: true, showEmpty: false,
                }, {
                    labels: { format: '{value} ', style: { color: color.turn_in_rate } },
                    // tslint:disable-next-line: max-line-length
                    allowDecimals: false, title: { text: this.indexes.turn_in_rate, style: { color: color.turn_in_rate, fontWeight: 'bold' } },
                    opposite: this.t_f, visible: selft.check_has_index(this.index_value.turn_in_rate),
                    showEmpty: false, min: 0, maxPadding: 0, minPadding: 0,
                }, {
                    title: { text: this.indexes.avg_time + this.language.min, style: { color: color.avg_time, fontWeight: 'bold' } },
                    labels: { format: '{value} ', style: { color: color.avg_time, } }, allowDecimals: false,
                    min: 0, maxPadding: 0, minPadding: 0, opposite: this.t_f, visible: selft.check_has_index(this.index_value.avg_time),
                    showEmpty: false,
                }
            ],
            series: [
                {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.passerby, color: color.passer_by, type: 'column', yAxis: selft.set_position(this.index_value.passerby),
                    // tslint:disable-next-line: max-line-length
                    showInLegend: selft.check_has_index(this.index_value.passerby), visible: selft.check_has_index(this.index_value.passerby),
                    data: passer_by,
                }, {
                    name: this.indexes.visitors, color: color.visits, type: 'column',
                    // tslint:disable-next-line: max-line-length
                    yAxis: selft.set_position(this.index_value.visitors), data: num_to_enter, showInLegend: selft.check_has_index(this.index_value.visitors),
                    visible: selft.check_has_index(this.index_value.visitors),
                }, {
                    name: this.indexes.shoppers, color: color.shopper_visits, type: 'column',
                    yAxis: selft.set_position(this.index_value.shoppers), data: shopper_visits,
                    // tslint:disable-next-line: max-line-length
                    visible: selft.check_has_index(this.index_value.shoppers), showInLegend: selft.check_has_index(this.index_value.shoppers),
                }, {
                    name: this.indexes.kids_visitors, color: color.kids_visits, type: 'column',
                    yAxis: selft.set_position(this.index_value.kids_visitors), data: kids_visits,
                    // tslint:disable-next-line: max-line-length
                    visible: selft.check_has_index(this.index_value.kids_visitors), showInLegend: selft.check_has_index(this.index_value.kids_visitors),
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.traffic_flow, color: color.traffic_flow, type: 'column', yAxis: selft.set_position(this.index_value.traffic_flow),
                    data: traffic, showInLegend: selft.check_has_index(this.index_value.traffic_flow),
                    visible: selft.check_has_index(this.index_value.traffic_flow),
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.avg_time + this.language.min, color: color.avg_time, type: 'spline', yAxis: 2, data: avg_time, selected: true,
                    // tslint:disable-next-line:max-line-length
                    tooltip: { pointFormatter: function () { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + selft.toHHMMSS(point.y * 60) + '</b><br/>'; } },
                    // tslint:disable-next-line: max-line-length
                    showInLegend: selft.check_has_index(this.index_value.avg_time), visible: selft.check_has_index(this.index_value.avg_time),
                }, {
                    name: this.indexes.turn_in_rate, color: color.turn_in_rate, type: 'spline', selected: true,
                    yAxis: selft.set_position(this.index_value.turn_in_rate), data: turn_in_rate,
                    // tslint:disable-next-line: max-line-length
                    showInLegend: selft.check_has_index(this.index_value.turn_in_rate), visible: selft.check_has_index(this.index_value.turn_in_rate),
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
            number = 1;
        }
        if (this.group_select.people.includes(indexOptionSelected)) {
            number = 0;
        }
        return Number(number);
    }

    Go_number(number, total) {
        let tong = 0;
        if (total !== 0) {
            tong = ((Number(number) / total) * 100); return tong.toFixed(2);
        }
        return tong;
    }

    get_sitetree() {
        this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
        const url = environment.API.sites + '_get_site_for_report';
        const data = {
            organization_id: this.organization_id
        };
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
        this.viewDataBy = 'Hour';
    }

    reset_session() {
        const data = [];
        this.site_id = null;
        this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
            this.get_page_param();
            this.time_generate_report = new Date();
        });
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


    download() {
        // const margins = {
        //     top: 80,
        //     bottom: 60,
        //     left: 40,
        //     width: 522
        // };
        // const doc = new jsPDF();
        // doc.fromHTML(this.exports.nativeElement.innerHTML, margins.left, margins.top, {}, function () {
        //     doc.save('export.pdf');
        // }, margins);
        // this.appservice.downloadPDF(this.router.url).subscribe(
        //     (res) => {
        //         saveAs(res, 'myPDF.pdf');

        //         const fileURL = URL.createObjectURL(res);
        //         window.open(fileURL);

        //     }
        // );



        const data = document.getElementById('pdf_export');
        html2canvas(data, { quality: 2, scale: 1, logging: false, backgroundColor: '#555555', allowTaint: false }).then(canvas => {
            const imgWidth = 208;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const heightLeft = imgHeight;

            const contentDataURL = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
            const position = 0;
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
            pdf.save('All_charts_' + Date.now() + '.pdf');
        });
    }

    showPopupRegister() {
        this.scheduleComponent.openPopupRegisterAgain();
    }

}
