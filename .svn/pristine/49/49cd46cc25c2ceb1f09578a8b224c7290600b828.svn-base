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
More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';
import { language_index_vn } from '../../../list_index';
import { StoreReportingFFScheduleComponent } from '../../useremailmodule/footfall/storereporting/storereporting.component';
import { NotifierService } from 'angular-notifier';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
    templateUrl: 'effect-metrics.component.html',
    styleUrls: ['effect-metrics.component.scss']
})

export class FootfallEffectMetricsComponent implements OnInit {
    @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
    defaultModule = 4;
    indexViewBy: number;
    currentPageId = environment.Pages.footfall.performance_metrics;
    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
    @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
    @ViewChild('content') public helloTemplate: ElementRef;
    total_num_to_enter = 0;
    total_traffic = 0;
    total_avg_time = 0;
    viewDataBy: string;
    @BlockUI() blockUI: NgBlockUI;
    siteSelectionDisplay = false;
    organization_id: string;
    time_period_array: any[];
    organization_array: any[];
    site_id: any;
    start_date: any;
    end_date: any;
    time_value = '';
    public page_id = environment.Pages.footfall.performance_metrics;
    // public navItems = navItems;
    public sidebarMinimized = true;
    public element: HTMLElement = document.body;
    public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
    start_time: string;
    end_time: string;
    modalRef: BsModalRef;
    public chart_data: any[];
    public startTimeOption: Array<IOption>;
    public endTimeOption: Array<IOption>;
    btnApplyValid = false;
    dropdownList = [];
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
    sourceSelectedItems = [];
    destinationSelectedItems = [];
    operation = 'SUM';
    time_generate_report = new Date();
    dropdownList_compare: any[];
    menu_tree: any[];
    total_passer_by = 0;
    total_shopper_visits = 0; total_seconds = 0;
    total_kids_visits = 0;
    total_turn_in_rate = 0;
    tt_conver = 0;
    tt_atv = 0;
    tt_avg_item = 0;
    tt_sales_yeild = 0;
    items = 0;
    staff = 0;
    loyal_purchased = 0;
    tt_loyal_visits_nt = 0;
    tt_transactions = 0;
    tt_sales = 0;
    tt_missed_sales = 0;
    tt_loyal_visits = 0;
    tt_loy_tran = 0;
    tt_loy_conver = 0;
    tt_cx_index = 0;
    tt_nps_index = 0;
    miss_loyal_conversion = 0;
    tt_sales_hour: number;
    tt_shopper_on_sh: number;
    tt_sales_on_sh: number;
    t_f: boolean;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    indexes: any; indexess: any; language_index_vn: any;
    show_label_table: string;

    constructor(protected router: Router, protected appservice: AppService,
        private modalService: BsModalService) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
        this.indexes = this.indexess = indexes;
        this.language_index_vn = language_index_vn;
    }
    url_api = environment.apiUrl + 'exports/';
    name_of_excel: any;
    site_name: string;
    title_start_date: string;
    title_end_date: string;
    time_period: string;
    title_time_period: string;
    starttime: string;
    endtime: string;
    view: string;
    language: any; index_viewby = 1; show_error = false;

    ngOnInit() {
        this.get_page_param();
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
    }
    // end chilren
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
                    this.indexess = param.list_index_value;
                    this.language_index_vn = param.language_index === '\'vn\'' ? language_index_vn : indexes;
                    param.performance_index_group.forEach((element, index) => {
                        this.dropdownList.push({
                            item_id: index
                            , label: element.label
                            , value: element.value
                            , group: element.group
                            , visible: true
                        });
                    });
                    if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
                        // console.log('trong if');
                        para = param.user_page_parametter;
                        this.group_select = para.group_select;
                    } else {
                        // console.log('ngoai if');
                        const defaultOrgId = param.organization_arr.length > 0 ? param.organization_arr[0].value : 6;
                        para = this.set_default(defaultOrgId);
                        // para = this.set_default();
                        // tslint:disable-next-line: max-line-length
                        this.reset_group_select();
                    }
                    if (!environment.production) {
                        console.log(para);
                    }

                    this.destinationSelectedItems = para.indexOptionSelected_compare;
                    this.viewDataBy = para.view_by;
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
                    this.operation = para.operation;
                    if (para.time_value) {
                        this.get_date(para.time_value);
                    } else if (para.start_date && para.end_date) {
                        this.start_date = para.start_date;
                        this.end_date = para.end_date;
                        this.start_time = this.start_time.replace(/[']/g, '');
                        this.end_time = this.end_time.replace(/[']/g, '');
                    }
                    this.TimeInput.get_data(para, this.time_period_array);
                    this.get_sitetree();
                } catch (error) {
                    this.blockUI.stop();
                }
            },
            (error) => {
                this.blockUI.stop();
                // this.push_notification();
                this.show_error = true;
            }, () => { });
    }

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
        // const value_index = this.dropdownList.find(item => item.label === indexes.shoppers).value;
        const value_index = this.dropdownList[0].value;
        return {
            organization_id: organization_id
            // , site_id: 0
            , start_time: '8:00'
            , end_time: '23:59'
            , time_value: 'today'
            , view_by: 'Hour'
            , operation: this.operation
            , indexOptionSelected: [0]
            , indexOptionSelected_compare: [value_index]

        };
    }

    get_data_box() {
        this.modalRef.hide();
        this.get_data();
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
        if (indexOptionSelected_compare.length > 1) {
            this.t_f = true;
        } else {
            this.t_f = false;
        }
        if (!environment.production) {
            console.log('data', data);
            console.log('group_select', this.group_select);
            console.log('dropdownList', this.dropdownList);
        }
        // tslint:disable-next-line:max-line-length
        this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.language.gio;
        this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_data_by_site').subscribe(
            res => {
                if (!environment.production) {
                    console.log(res);
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
                this.chart_data = res;
                this.show_error = false;
                if (res.hasOwnProperty('status') && res.status === 0) {
                    // this.push_notification();
                    this.show_error = true;
                    this.chart_data = null;
                    this.blockUI.stop();
                }
                this.time_generate_report = new Date();
                // tslint:disable-next-line:max-line-length
                this.reset_to_zero('total_num_to_enter', 'total_traffic', 'total_avg_time', 'total_passer_by',
                    'tt_conver', 'tt_atv', 'tt_avg_item', 'tt_sales_yeild', 'tt_transactions', 'tt_sales', 'tt_missed_sales',
                    'miss_loyal_conversion', 'tt_loyal_visits', 'tt_loy_tran', 'tt_loy_tran', 'tt_loy_conver', 'tt_cx_index',
                    'tt_nps_index', 'total_kids_visits', 'total_turn_in_rate', 'total_shopper_visits', 'tt_sales_hour',
                    'tt_shopper_on_sh', 'tt_sales_on_sh', 'items', 'staff', 'loyal_purchased', 'tt_loyal_visits_nt', 'total_seconds'
                );
                let si = 0;
                if (this.chart_data != null) {
                    this.chart_data.forEach(element => {
                        this.total_num_to_enter += Number(element.num_to_enter);
                        this.total_traffic += Number(element.traffic);
                        this.total_avg_time += Number(element.avg_time);
                        this.total_passer_by += Number(element.passer_by);
                        this.total_kids_visits += Number(element.kids_visits);
                        this.total_shopper_visits += Number(element.shopper_visits);

                        this.tt_transactions += Number(element.transactions);
                        this.tt_sales += Number(element.sales);
                        this.tt_missed_sales += Number(element.missed_sales);
                        this.tt_sales_hour += Number(element.sales_hour);
                        this.items += Number(element.items);
                        this.staff += Number(element.staff);
                        this.loyal_purchased += Number(element.loyal_purchased);
                        this.total_seconds += Number(element.total_seconds);
                        this.tt_loyal_visits_nt += Number(element.loyal_visits_nt);

                        this.tt_cx_index += Number(element.cx_index);
                        this.tt_nps_index += Number(element.nps_index);
                        if (Number(element.avg_time) > 0) {
                            si++;
                        }
                    });
                }

                const row = Number(res.length);
                // tslint:disable-next-line: max-line-length
                this.total_turn_in_rate = Number(this.total_passer_by) > 0 ? Number(((this.total_num_to_enter / this.total_passer_by) * 100).toFixed(2)) : 0;
                this.tt_atv = this.tt_transactions > 0 ? Number((this.tt_sales / this.tt_transactions).toFixed(0)) : 0;
                // tslint:disable-next-line: max-line-length
                this.tt_loy_conver = this.tt_loyal_visits_nt > 0 ? Number(((this.loyal_purchased / this.tt_loyal_visits_nt) * 100).toFixed(2)) : 0;
                // tslint:disable-next-line: max-line-length
                this.tt_loy_tran = this.tt_transactions > 0 ? Number(((this.loyal_purchased / this.tt_transactions) * 100).toFixed(2)) : 0;
                // tslint:disable-next-line: max-line-length
                this.tt_loyal_visits = this.total_shopper_visits > 0 ? Number(((this.tt_loyal_visits_nt / this.total_shopper_visits) * 100).toFixed(2)) : 0;
                this.miss_loyal_conversion = Number(this.tt_loy_conver) > 0 ? 100 - Number(this.tt_loy_conver) : 0;
                // tslint:disable-next-line: max-line-length
                this.tt_conver = this.total_shopper_visits > 0 ? Number(((this.tt_transactions / this.total_shopper_visits) * 100).toFixed(2)) : 0;
                // tslint:disable-next-line: max-line-length
                this.tt_sales_yeild = this.total_shopper_visits > 0 ? Number((this.tt_sales / this.total_shopper_visits).toFixed(0)) : 0;
                this.tt_avg_item = this.tt_transactions > 0 ? Number((this.items / this.tt_transactions).toFixed(2)) : 0;
                // tslint:disable-next-line: max-line-length
                this.tt_shopper_on_sh = this.tt_sales_hour > 0 ? Number((this.total_shopper_visits / this.tt_sales_hour).toFixed(2)) : 0;
                this.tt_sales_on_sh = this.tt_sales_hour > 0 ? Number((this.tt_sales / this.tt_sales_hour).toFixed(0)) : 0;
                // if (this.viewDataBy === 'Hour') {
                // tslint:disable-next-line: max-line-length
                //     this.total_avg_time = Number(this.total_num_to_enter) > 0 ? Number(this.total_seconds) / Number(this.total_num_to_enter) : 0;
                // } else {
                this.total_avg_time = Number(si) > 0 ? Number((this.total_avg_time * 60 / si).toFixed(0)) : 0;
                // }

                this.tt_cx_index = Number((this.tt_cx_index / row).toFixed(2));
                this.tt_nps_index = Number((this.tt_nps_index / row).toFixed(2));
                this.loadHightChart();
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
            }, (error) => {
                // console.log(error);
                this.blockUI.stop();
                // this.push_notification();
                this.show_error = true;
            }, () => {
                this.blockUI.stop(); // Stop blocking
            }
        );
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
        // tslint:disable-next-line:max-line-length
        this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_data_by_site_export_excel').subscribe(fileData => {
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
        let i = 0;
        const chart_xAxis = [];
        const num_to_enter = [];
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
        const cxindex = [];
        const npsindex = [];
        const miss_loyal_conversion = [];
        if (this.chart_data != null) {
            this.chart_data.forEach(element => {
                chart_xAxis[i] = element.time_period;
                num_to_enter[i] = Number(element.num_to_enter);
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
                cxindex[i] = (Number(element.cx_index));
                npsindex[i] = (Number(element.nps_index));
                i++;
            });
        }


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
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.passer_by } },
                    allowDecimals: false, title: {
                        text: this.language_index_vn.people, style: { color: c_.passer_by, fontWeight: 'bold' },
                    },
                    visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.avg_time + this.language.min, style: { color: c_.avg_time, fontWeight: 'bold' }, },
                    allowDecimals: false, labels: { format: '{value} ', style: { color: c_.avg_time, fontWeight: 'bold' } },
                    visible: true, opposite: this.t_f, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.turn_in_rate } },
                    allowDecimals: false, title: { text: this.language.Percent, style: { color: c_.turn_in_rate, fontWeight: 'bold' }, },
                    visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, opposite: this.t_f,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.atv } },
                    allowDecimals: false, title: { text: this.language.VND, style: { color: c_.atv, fontWeight: 'bold' }, },
                    visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.items } },
                    allowDecimals: false, title: { text: this.indexes.avg_items, style: { color: c_.items, fontWeight: 'bold' }, },
                    visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0, opposite: this.t_f,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.customers } },
                    allowDecimals: false, title: { text: this.indexes.transactions, style: { color: c_.customers, fontWeight: 'bold' }, },
                    visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.sales } },
                    allowDecimals: false, title: { text: this.language.VND, style: { color: c_.sales, fontWeight: 'bold' }, },
                    visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.sales_hour } },
                    opposite: this.t_f, title: { text: this.indexes.sales_hours, style: { color: c_.sales_hour, fontWeight: 'bold' }, },
                    visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.shopper_on_sh } },
                    // tslint:disable-next-line: max-line-length
                    opposite: this.t_f, title: { text: this.indexes.shoppers_on_sales_hour, style: { color: c_.shopper_on_sh, fontWeight: 'bold' }, },
                    visible: true, showEmpty: false, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
                },
            ],
            series: [
                {
                    name: this.indexes.passerby, color: c_.passer_by, type: 'column',
                    visible: selft.check_has_index(this.indexess.passerby),
                    yAxis: selft.set_position(this.indexess.passerby), data: passer_by,
                    showInLegend: selft.check_has_index(this.indexess.passerby),
                }, {
                    name: this.indexes.visitors, color: c_.visits, type: 'column',
                    visible: selft.check_has_index(indexes.visitors),
                    yAxis: selft.set_position(this.indexess.visitors), data: num_to_enter,
                    showInLegend: selft.check_has_index(this.indexess.visitors),
                }, {
                    name: this.indexes.shoppers, color: c_.shopper_visits, type: 'column',
                    visible: selft.check_has_index(this.indexess.shoppers),
                    yAxis: selft.set_position(this.indexess.shoppers), data: shopper_visits,
                    showInLegend: selft.check_has_index(this.indexess.shoppers),
                }, {
                    name: this.indexes.kids_visitors, color: c_.kids_visits, type: 'column',
                    visible: selft.check_has_index(this.indexess.kids_visitors),
                    yAxis: selft.set_position(this.indexess.kids_visitors), data: kids_visits,
                    showInLegend: selft.check_has_index(this.indexess.kids_visitors),
                }, {
                    name: this.indexes.traffic_flow, color: c_.traffic_flow, type: 'column',
                    yAxis: selft.set_position(this.indexess.traffic_flow),
                    showInLegend: selft.check_has_index(this.indexess.traffic_flow),
                    visible: selft.check_has_index(this.indexess.traffic_flow), data: traffic,
                }, {
                    name: this.indexes.avg_time + this.language.min, color: c_.avg_time, type: 'spline', yAxis: 1,
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
                    name: this.indexes.sales_yield, color: c_.sales_yield, type: 'column',
                    yAxis: selft.set_position(this.indexess.sales_yield),
                    showInLegend: selft.check_has_index(this.indexess.sales_yield),
                    visible: selft.check_has_index(this.indexess.sales_yield), data: sales_yield,
                }, {
                    name: this.indexes.transactions, color: c_.customers, type: 'column',
                    yAxis: selft.set_position(this.indexess.transactions),
                    showInLegend: selft.check_has_index(this.indexess.transactions),
                    visible: selft.check_has_index(this.indexess.transactions), data: transactions,
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
                    name: this.indexes.sales_hours, color: c_.sales_hour, type: 'spline',
                    yAxis: selft.set_position(this.indexess.sales_hours),
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


    Go_number(number, total) {
        let tong = 0;
        if (total !== 0) {
            tong = ((Number(number) / total) * 100);
            return tong.toFixed(2);
        }
        return tong;
    }

    get_sitetree() {
        //   this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
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
            const data = {
                organization_id: event.organization_id
            };
            const url = environment.API.sites + '_get_site_for_report';
            this.appservice.post(data, url).subscribe(res => {
                // console.log(res);
                this.menu_tree = res.site_array.slice(0);
                this.organization_id = event.organization_id;
                this.site_id = this.menu_tree[0].id;
                this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
                this.get_data();
            }, (error) => {
                this.blockUI.stop();
                if (!environment.production) {
                    console.log(error);
                }
            }, () => {
                this.blockUI.stop();
            });
        } else if (event.site_id || event.site_id === 0) {
            this.site_id = event.site_id;
        }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {
            backdrop: true,
            ignoreBackdropClick: true
        });
    }

    reset_group_select() {
        // tslint:disable-next-line: max-line-length
        this.group_select.percent = [this.indexess.turn_in_rate, this.indexess.conversion_rate, this.indexess.member_visitors, this.indexess.member_transactions, this.indexess.member_conversion_rate, this.indexess.missed_member_rate, this.indexess.cx_index, this.indexess.nps_index];
        // tslint:disable-next-line: max-line-length
        this.group_select.people = [this.indexess.passerby, this.indexess.visitors, this.indexess.shoppers, this.indexess.kids_visitors, this.indexess.traffic_flow];
        this.group_select.vnd1 = [this.indexess.sales_yield, this.indexess.atv, this.indexess.sales_on_sales_hour];
        this.group_select.vnd2 = [this.indexess.missed_sales_opportunity, this.indexess.sales];
        this.group_select.avg_item = [this.indexess.avg_items];
        this.group_select.transactions = [this.indexess.transactions];
        this.group_select.sales_hours = [this.indexess.sales_hours];
        this.group_select.shopper_on_sales_hour = [this.indexess.shoppers_on_sales_hour];
    }

    change_item_group_select(e) {
        // console.log(e);
    }
}
