import { IOption } from 'ng-select';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
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
    templateUrl: 'metrics-boston.component.html',
    styleUrls: ['metrics-boston.component.scss'],
})
export class FootfallBostonComponent implements OnInit {
    @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
    defaultModule = 4;
    indexViewBy: number;
    currentPageId = environment.Pages.footfall.boston;
    @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
    @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
    page_id = environment.Pages.footfall.boston;
    @ViewChild('content') public helloTemplate: ElementRef;
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
    total_traffic = 0;
    total_avg_time = 0;
    viewDataBy: any;
    sidebarMinimized = true;
    public modalRef: BsModalRef;
    element: HTMLElement = document.body;
    time_period_array: any;
    menu_tree: any;
    chart_data: any;
    btnApplyValid = false;
    indexOption: Array<IOption>;
    indexOptionSelected1: string;
    indexOptionSelected2: string;
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
    title_index1: string;
    title_index2: string;
    starttime: string;
    endtime: string;
    view: string;
    sourceSelectedItems = [];
    dropdownList = [];
    destinationIndexOptionSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: false
    };
    valueSuffix1: string;
    valueSuffix2: string;
    all_data: any;
    avg_ox: number;
    avg_oy: number;
    valueSuffix_html1: string;
    valueSuffix_html2: string; indexes: any; indexess: any; language_index_vn: any;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    constructor(private router: Router, private appservice: AppService, private modalService: BsModalService) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
        this.indexes = this.indexess = indexes;
        this.language_index_vn = language_index_vn;
    }
    url_api = environment.apiUrl + 'exports/';
    name_of_excel: any;
    language: any; show_error = false;

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
    sendParamToChildren(event) {
        console.log('site_id 1111', this.site_id);
        const dataFromParent = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , start_time: this.start_time
            , end_time: this.end_time
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
                    this.indexOption = param.performance_index_group;
                    this.language_index_vn = param.language_index === '\'vn\'' ? language_index_vn : indexes;
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
                    this.startTimeOption = param.start_time_list;
                    this.endTimeOption = param.end_time_list;
                    this.organization_id = para.organization_id;
                    if ('site_id' in para) {
                        this.site_id = para.site_id;
                    }
                    this.start_time = para.start_time;
                    this.end_time = para.end_time;
                    if (para.time_value) {
                        this.get_date(para.time_value);
                    } else if (para.start_date && para.end_date) {
                        this.start_date = para.start_date;
                        this.end_date = para.end_date;
                        this.start_time = this.start_time.replace(/[']/g, '');
                        this.end_time = this.end_time.replace(/[']/g, '');
                    }
                    this.operation = para.operation;
                    this.viewDataBy = para.view_by;
                    this.indexOptionSelected1 = para.indexOptionSelected1;
                    this.indexOptionSelected2 = para.indexOptionSelected2;
                    this.title_index1 = this.indexOption.find(item => item.value === this.indexOptionSelected1).label;
                    this.title_index2 = this.indexOption.find(item => item.value === this.indexOptionSelected2).label;

                    this.TimeInput.get_data(para, this.time_period_array);
                    this.get_sitetree();
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

    set_default(defaultOrgId: any) {
        const organization_id = this.userinfo.organization_id === '0' ? defaultOrgId : Number(this.userinfo.organization_id);
        // const organization_id = this.userinfo.organization_id === '0' ? 6 : Number(this.userinfo.organization_id);
        // const value_index = this.indexOption.find(item => item.value === this.indexess.shoppers).value;
        // const value_index2 = this.indexOption.find(item => item.value === this.indexess.visitors).value;
        const value_index = this.indexOption[0].value;
        const value_index2 = this.indexOption[0].value;
        return {
            organization_id: organization_id
            // , site_id: 0
            , start_time: '8:00'
            , end_time: '23:59'
            , time_value: 'today'
            , operation: 'sum'
            , view_by: 'Hour'
            , indexOptionSelected1: value_index
            , indexOptionSelected2: value_index2
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

    // ng-multiselect-dropdown
    destinationOnSelect(item: any) {
        this.validate_source_destination_index();
    }
    destinationOnDeSelect(items: any) {
        this.validate_source_destination_index();
    }
    destinationOnSelectAll(items: any) {
        // this.validate_source_destination_index();
        this.btnApplyValid = false;
    }
    destinationOnDeSelectAll(items: any) {
        // this.validate_source_destination_index();
        this.btnApplyValid = true;
    }
    validate_source_destination_index() {
        if (this.indexOptionSelected1 === this.indexOptionSelected2) {
            this.btnApplyValid = true;
        } else {
            this.btnApplyValid = false;
        }
    }

    get_data() {
        this.blockUI.start(this.language.dang_tai_du_lieu);
        const indexOptionSelected = [];
        this.sourceSelectedItems.forEach(element => {
            indexOptionSelected.push(element.item_id);
        });
        const data = {
            organization_id: this.organization_id
            , site_id: Number(this.site_id)
            , start_time: '\'' + this.start_time + '\''
            , end_time: '\'' + this.end_time + '\''
            , start_date: this.start_date
            , end_date: this.end_date
            , view_by: this.viewDataBy
            , operation: this.operation
            , indexOptionSelected1: this.indexOptionSelected1
            , indexOptionSelected2: this.indexOptionSelected2
        };
        if (!environment.production) {
            console.log('data', data);
        }
        this.title_index1 = this.indexOption.find(item => item.value === this.indexOptionSelected1).label;
        this.title_index2 = this.indexOption.find(item => item.value === this.indexOptionSelected2).label;
        this.value_Suffix();
        this.appservice.post(data, environment.API.sp_footfall_heatmap_treemap_coloraxis_sum + '_metrics_boston').subscribe(
            res => {
                try {
                    this.starttime = this.startTimeOption.find(item => item.value === this.start_time).label;
                    this.endtime = this.endTimeOption.find(item => item.value === this.end_time).label;
                    // this.title_index = this.indexOptionSelected;
                    // tslint:disable-next-line:max-line-length
                    this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.language.gio;

                    this.site_name = this.MenuInput.menu_tree.find(item => Number(item.id) === Number(this.site_id)).site_name;
                    const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                    const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                    this.title_start_date = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
                    this.title_end_date = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
                    if (this.start_date !== this.end_date) {
                        this.time_period = this.title_start_date + ' - ' + this.title_end_date;
                    } else { this.time_period = this.title_start_date; }
                    this.title_time_period = this.language.ngay;
                    this.show_error = false;
                    if (res.hasOwnProperty('status') && res.status === 0) {
                        // this.push_notification();
                        this.show_error = true;
                        this.chart_data = null;
                        this.blockUI.stop();
                    }
                    this.all_data = res.chart;
                    this.avg_ox = 0;
                    this.avg_oy = 0;
                    this.avg_ox = res.avg_ox;
                    this.avg_oy = res.avg_oy;
                    let i = 0;
                    const ox = [];
                    const oy = [];
                    res.chart.forEach(element => { ox[i] = element.x; oy[i] = element.y; i++; });

                    let xMax = ox.length > 0 ? ox.reduce((a, b) => {
                        return Math.max(a, b);
                    }) : 0;
                    let yMax = oy.length > 0 ? oy.reduce((a, b) => {
                        return Math.max(a, b);
                    }) : 0;
                    xMax = xMax > res.avg_ox ? (xMax * 1.09).toFixed(2) : (xMax * 2).toFixed(2);
                    yMax = yMax > res.avg_oy ? (yMax * 1.09).toFixed(2) : (yMax * 2).toFixed(2);
                    if (!environment.production) {
                        console.log('res', res, xMax, yMax);
                    }
                    this.loadHightChart(res.chart, res.avg_ox, res.avg_oy, xMax, yMax);
                    this.time_generate_report = new Date();
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
                            , indexOptionSelected1: this.indexOptionSelected1
                            , indexOptionSelected2: this.indexOptionSelected2
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
            }, () => {
                this.blockUI.stop();
            }
        );
    }

    convert_to_chart(Max, data) { Max = Max > data ? (Max * 1.09).toFixed(2) : (Max * 2).toFixed(2); }

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
        };
        this.blockUI.start(this.language.dang_xuat_bao_cao);
        this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_boston_export_excel').subscribe(fileData => {
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
        this.time_value = time_value;
    }

    get_sitetree() {
        this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
        const url = environment.API.sites + '_get_site_for_report';
        const data = { organization_id: this.organization_id };
        this.appservice.post(data, url).subscribe(res => {
            try {
                // console.log(res);
                this.menu_tree = res.site_array.slice(0);
                if (!this.site_id) {
                    this.site_id = this.menu_tree.find(item => Number(item.enables) === 1).id;
                }
                // console.log(this.site_id);
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
        } else if (event[0].time_value) {
            this.time_value = event[0].time_value;
            this.get_date(this.time_value);
        }
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

    get_valuesuffix(i: number) {
        this['valueSuffix' + i] = '';
        this['valueSuffix_html' + i] = '';
        if (this['indexOptionSelected' + i] === this.indexess.turn_in_rate
            || this['indexOptionSelected' + i] === this.indexess.conversion_rate
            || this['indexOptionSelected' + i] === this.indexess.member_visitors
            || this['indexOptionSelected' + i] === this.indexess.member_transactions
            || this['indexOptionSelected' + i] === this.indexess.member_conversion_rate
            || this['indexOptionSelected' + i] === this.indexess.missed_member_rate
            || this['indexOptionSelected' + i] === this.indexess.cx_index
            || this['indexOptionSelected' + i] === this.indexess.nps_index) {
            this['valueSuffix' + i] = '';
            this['valueSuffix_html' + i] = '';
        } else if (this['indexOptionSelected' + i] === this.indexess.avg_time) {
            this['valueSuffix' + i] = this.language_index_vn.min;
            this['valueSuffix_html' + i] = ' ';
        }
    }

    value_Suffix() {
        this.get_valuesuffix(1);
        this.get_valuesuffix(2);
    }

    loadHightChart(chart: any, avg_ox: number, avg_oy: number, xMax: number, yMax: number) {
        // const ox = this.indexOptionSelected2;
        // const oy = this.indexOptionSelected1;
        const ox = this.indexOption.find(item => item.value === this.indexOptionSelected2).label;
        const oy = this.indexOption.find(item => item.value === this.indexOptionSelected1).label;

        Highcharts.setOptions({
            global: { useUTC: false, }, lang: { decimalPoint: '.', thousandsSep: ' ' }
        });
        Highcharts.chart(this.container.nativeElement, {
            chart: { type: 'bubble', zoomType: 'xy', style: { fontFamily: 'Roboto,sans-serif !important;', } },
            legend: { enabled: false }, exporting: { enabled: false },
            title: {
                text: '<h5  style="font-family:Roboto, sans-serif;color:#23282c" > ' + this.language.mo_hinh_boston + '</h5>'
            },
            subtitle: { text: ' ' },
            // tslint:disable-next-line:max-line-length
            plotOptions: { bubble: { minSize: 8, maxSize: 35, }, series: { dataLabels: { enabled: true, format: '<span  style="font-family:Roboto, sans-serif;font-size:10px;"> {point.name} </span>', allowOverlap: false } }, }, // cho phép show all allowOverlap true
            xAxis: {
                gridLineWidth: 1, maxPadding: 0, min: 0, max: xMax, allowDecimals: false,
                // tslint:disable-next-line:max-line-length
                title: { text: '<span style="font-family:Roboto, sans-serif; text-align:right;font-weight:bold;color:#23282c"> ' + ox + '</span>', margin: 15, align: 'high' },
                labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); } },
                // tslint:disable-next-line:max-line-length
                plotLines: [{ color: 'red', dashStyle: 'dot', width: 1, value: avg_ox, label: { rotation: 0, y: 15, style: { fontStyle: 'italic' }, text: avg_ox }, zIndex: 3 }]
            },
            yAxis: {
                startOnTick: false, endOnTick: false,
                // tslint:disable-next-line:max-line-length
                title: { text: '</br> <span  style="font-family:Roboto, sans-serif;font-weight:bold;color:#23282c"> ' + oy + '</span>', margin: 10, align: 'high' },
                // High ' + oy
                labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); } },
                maxPadding: 0, allowDecimals: false, min: 0, max: yMax,
                // tslint:disable-next-line:max-line-length
                plotLines: [{ color: 'red', dashStyle: 'dot', width: 1, value: avg_oy, label: { align: 'right', style: { fontStyle: 'italic' }, text: avg_oy, x: -10 }, zIndex: 3 }]
            },
            tooltip: {
                // tslint:disable-next-line:max-line-length
                useHTML: true, headerFormat: '<table style="font-family:Roboto, sans-serif;">', footerFormat: '</table>', followPointer: true,
                // tslint:disable-next-line:max-line-length
                pointFormat: '<tr><th colspan="2"><h6>{point.country}</h6></th></tr>' + '<tr><th>' + oy + ': &nbsp; &nbsp;</th><td>  {point.y}</td></tr>' + '<tr><th>' + ox + ' &nbsp; &nbsp; </th><td> {point.x:,.f}</td></tr>',

            },
            series: [{
                data: chart,
                // tslint:disable-next-line:max-line-length
                marker: { fillColor: { radialGradient: { cx: 0.5, cy: 0.3, r: 0.3 }, stops: [[0, 'rgba(255,255,255,0.9)'], [1, Highcharts.Color(environment.POC.colors.logo).setOpacity(0.8).get('rgba')]] }, fillOpacity: 1 }
            }]
        });
    }
}
