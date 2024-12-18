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
    templateUrl: 'effect-visits.component.html',
    styleUrls: ['effect-visits.component.scss'],
})
export class FootfallEffectVisitsComponent implements OnInit {
    @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
    defaultModule = 4;
    indexViewBy: number;
    currentPageId = environment.Pages.footfall.performance_visits;
    @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
    @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
    page_id = environment.Pages.footfall.performance_visits;
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
    tt_enter = 0;
    tt_traffic = 0;
    tt_time = 0;
    viewDataBy: any;
    sidebarMinimized = true;
    public modalRef: BsModalRef;
    element: HTMLElement = document.body;
    time_period_array: any;
    menu_tree: any;
    chart_data: any;
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
    tt_sales: number;
    tt_transactions = 0;
    tt_avg_item = 0;
    tt_conver = 0;
    tt_atv = 0;
    tt_passer = 0;
    tt_shop_visits = 0;
    tt_turn_rate = 0;
    tt_kids_visits = 0;
    tt_sales_yeild = 0;
    items = 0;
    staff = 0;
    loyal_purchased = 0;
    tt_loyal_visits_nt = 0;
    tt_loyal_visits = 0;
    tt_loy_tran = 0;
    tt_loy_conver = 0;
    tt_missed_sales = 0;
    tt_missed_loyal = 0;
    tt_cx_index = 0;
    tt_nps_index = 0; total_seconds = 0;
    type: string;
    tt_sales_hour: number;
    tt_shopper_on_sh: number;
    tt_sales_on_sh: number;
    checked: boolean;
    indexes: any; indexess: any; index_viewby = 5;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    show_label_table: string; language_index_vn: any;
    constructor(private router: Router, private appservice: AppService, private modalService: BsModalService) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
        this.indexes = this.indexess = indexes;
        this.language_index_vn = language_index_vn;
    }
    url_api = environment.apiUrl + 'exports/';
    name_of_excel: any; language: any; show_error = false;

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
            , view_by: this.viewDataBy
            , operation: this.operation
            , indexOptionSelected: this.indexOptionSelected
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
            , indexOptionSelected: this.indexOptionSelected
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
                    this.indexOption = param.performance_index_group;
                    this.indexes = param.list_index;
                    this.indexess = param.list_index_value;
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
                    this.indexOptionSelected = para.indexOptionSelected;
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
        // const value_index = this.indexOption.find(item => item.label === indexes.shoppers).value;ư
        const value_index = this.indexOption[0].value;
        return {
            organization_id: organization_id
            // , site_id: 0
            , start_time: '8:00'
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
        this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_data_by_site').subscribe(
            res => {
                if (!environment.production) {
                    console.log('res', res);
                }
                try {
                    this.show_error = false;
                    if (res.hasOwnProperty('status') && res.status === 0) {
                        // this.push_notification();
                        this.show_error = true;
                        this.chart_data = null;
                        this.blockUI.stop();
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
                    // tslint:disable-next-line: max-line-length
                    this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.language.gio;
                    this.title_time_period = this.language.ngay;
                    this.chart_data = res;
                    // tslint:disable-next-line:max-line-length
                    this.reset_to_zero('tt_enter', 'tt_traffic', 'tt_time', 'tt_sales',
                        'tt_passer', 'tt_shop_visits', 'tt_turn_rate', 'tt_kids_visits',
                        'tt_sales_yeild', 'tt_avg_item', 'tt_loyal_visits', 'tt_atv',
                        'tt_loy_conver', 'tt_loy_tran', 'tt_missed_sales', 'tt_conver', 'tt_transactions',
                        'tt_nps_index', 'tt_missed_loyal', 'tt_cx_index',
                        'tt_sales_hour', 'tt_shopper_on_sh', 'tt_sales_on_sh', 'items', 'staff', 'loyal_purchased',
                        'tt_loyal_visits_nt', 'total_seconds'
                    );
                    let si = 0;
                    res.forEach(element => {
                        this.tt_passer += Number(element.passer_by);
                        this.tt_enter += Number(element.num_to_enter);
                        this.tt_shop_visits += Number(element.shopper_visits);
                        this.tt_kids_visits += Number(element.kids_visits);
                        this.tt_time += Number(element.avg_time);
                        this.tt_traffic += Number(element.traffic);
                        this.tt_transactions += Number(element.transactions);
                        this.tt_sales += Number(element.sales);
                        this.tt_missed_sales += Number(element.missed_sales);
                        this.tt_sales_hour += Number(element.sales_hour);
                        this.tt_cx_index += Number(element.cx_index);
                        this.tt_nps_index += Number(element.nps_index);
                        this.total_seconds += Number(element.total_seconds);

                        this.items += Number(element.items);
                        this.staff += Number(element.staff);
                        this.loyal_purchased += Number(element.loyal_purchased);
                        this.tt_loyal_visits_nt += Number(element.loyal_visits_nt);
                        if (Number(element.avg_time) > 0) {
                            si++;
                        }
                    });

                    const row = Number(res.length);
                    // tslint:disable-next-line: max-line-length
                    this.tt_turn_rate = Number(this.tt_passer) > 0 ? Number(((this.tt_enter / this.tt_passer) * 100).toFixed(2)) : 0;
                    this.tt_atv = this.tt_transactions > 0 ? Number((this.tt_sales / this.tt_transactions).toFixed(0)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_loy_conver = this.tt_loyal_visits_nt > 0 ? Number(((this.loyal_purchased / this.tt_loyal_visits_nt) * 100).toFixed(2)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_loy_tran = this.tt_transactions > 0 ? Number(((this.loyal_purchased / this.tt_transactions) * 100).toFixed(2)) : 0;

                    // tslint:disable-next-line: max-line-length
                    this.tt_loyal_visits = this.tt_shop_visits > 0 ? Number(((this.tt_loyal_visits_nt / this.tt_shop_visits) * 100).toFixed(2)) : 0;
                    this.tt_missed_loyal = Number(this.tt_loy_conver) > 0 ? 100 - Number(this.tt_loy_conver) : 0;
                    this.tt_conver = this.tt_shop_visits > 0 ? Number(((this.tt_transactions / this.tt_shop_visits) * 100).toFixed(2)) : 0;

                    this.tt_sales_yeild = this.tt_shop_visits > 0 ? Number((this.tt_sales / this.tt_shop_visits).toFixed(0)) : 0;
                    this.tt_avg_item = this.tt_transactions > 0 ? Number((this.items / this.tt_transactions).toFixed(2)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_shopper_on_sh = this.tt_sales_hour > 0 ? Number((this.tt_shop_visits / this.tt_sales_hour).toFixed(2)) : 0;
                    this.tt_sales_on_sh = this.tt_sales_hour > 0 ? Number((this.tt_sales / this.tt_sales_hour).toFixed(0)) : 0;

                    this.tt_cx_index = Number((this.tt_cx_index / row).toFixed(2));
                    this.tt_nps_index = Number((this.tt_nps_index / row).toFixed(2));
                    // if (this.viewDataBy === 'Hour') {
                    // tslint:disable-next-line: max-line-length
                    //     this.tt_time = Number(this.tt_enter) > 0 ? Number(this.total_seconds) / Number(this.tt_enter) : 0;
                    // } else {
                    this.tt_time = Number(si) > 0 ? Number((this.tt_time * 60 / si).toFixed(0)) : 0;
                    // }

                    if (!environment.production) {
                        console.log('tt_loy_conver', this.tt_loy_conver);
                        console.log('tt_missed_loyal', this.tt_missed_loyal);
                    }
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
            }, () => {
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
            , site_id: Number(this.site_id)
            , start_time: '\'' + this.start_time + '\''
            , end_time: '\'' + this.end_time + '\''
            , start_date: this.start_date
            , end_date: this.end_date
            , view_by: this.viewDataBy
            , operation: this.operation
            , indexOptionSelected: this.indexOptionSelected
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
        this.index_viewby = time_array.order;
    }

    get_sitetree() {
        this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
        const url = environment.API.sites + '_get_site_for_report';
        const data = { organization_id: this.organization_id };
        this.appservice.post(data, url).subscribe(res => {
            console.log('menu_sitree', res);
            try {
                this.menu_tree = res.site_array.slice(0);
                if (!this.site_id) {
                    this.site_id = this.menu_tree.find(item => Number(item.enables) === 1).id;
                }
                // console.log(this.site_id);
                this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
            } catch (error) {
                this.blockUI.stop();
            }
        }, (error) => {
            this.blockUI.stop();
            // this.push_notification();
            this.show_error = true;
        }, () => {
            this.get_data();
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

    type_chart() {
        if (this.indexOptionSelected === this.indexess.turn_in_rate || this.indexOptionSelected === this.indexess.conversion_rate
            || this.indexOptionSelected === this.indexess.avg_time || this.indexOptionSelected === this.indexess.member_visitors
            || this.indexOptionSelected === this.indexess.atv
            || this.indexOptionSelected === this.indexess.avg_items || this.indexOptionSelected === this.indexess.member_transactions
            || this.indexOptionSelected === this.indexess.member_conversion_rate
            || this.indexOptionSelected === this.indexess.missed_member_rate
            || this.indexOptionSelected === this.indexess.cx_index || this.indexOptionSelected === this.indexess.nps_index
            || this.indexOptionSelected === this.indexess.sales_hours
            || this.indexOptionSelected === this.indexess.shoppers_on_sales_hour) {
            this.type = 'spline';
        } else {
            this.type = 'column';
        }
        return this.type;
    }

    selectd() {
        if (this.indexOptionSelected === this.indexess.turn_in_rate || this.indexOptionSelected === this.indexess.conversion_rate
            || this.indexOptionSelected === this.indexess.avg_time || this.indexOptionSelected === this.indexess.member_visitors
            || this.indexOptionSelected === this.indexess.atv
            || this.indexOptionSelected === this.indexess.avg_items
            || this.indexOptionSelected === this.indexess.member_transactions
            || this.indexOptionSelected === this.indexess.member_conversion_rate
            || this.indexOptionSelected === this.indexess.missed_member_rate
            || this.indexOptionSelected === this.indexess.cx_index
            || this.indexOptionSelected === this.indexess.nps_index
            || this.indexOptionSelected === this.indexess.sales_hours
            || this.indexOptionSelected === this.indexess.shoppers_on_sales_hour) {
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
        const turn_in_rate = [];
        const kids_visits = [];
        const traffic = [];
        const avg_time = [];
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
        const cx_index = [];
        const nps_index = [];
        const atv = [];
        this.chart_data.forEach(element => {
            chart_xAxis[i] = element.time_period;
            kids_visits[i] = Number(element.kids_visits);
            turn_in_rate[i] = Number(element.turn_in_rate);
            num_to_enter[i] = Number(element.num_to_enter);
            traffic[i] = Number(element.traffic);
            avg_time[i] = (Number(element.avg_time));
            passer_by[i] = (Number(element.passer_by));
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
            miss_loyal_conversion[i] = Number(element.loyal_conversion) > 0 ? Number(100 - (Number(element.loyal_conversion))) : 0;
            cx_index[i] = Number(element.cx_index);
            nps_index[i] = Number(element.nps_index);
            i++;
        });
        if (chart_xAxis.length > 0) {
            this.show_label_table = chart_xAxis[0] + ' - ' + chart_xAxis[chart_xAxis.length - 1];
        }
        const selft = this;
        const select = this.indexOptionSelected;
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
            subtitle: {
                useHTML: true, align: 'left', y: 0,
                // tslint:disable-next-line:max-line-length
                text: ' '
            },
            xAxis: [{
                labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
                categories: chart_xAxis,
                crosshair: true
            }],
            tooltip: { shared: true, distance: 80, padding: 10, },
            navigation: { buttonOptions: { align: 'right', verticalAlign: 'bottom', y: -8 } },
            // tslint:disable-next-line:max-line-length
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
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.passer_by } }, allowDecimals: false,
                    title: { text: this.indexes.passerby, style: { color: c_.passer_by, fontWeight: 'bold' } },
                    visible: select === this.indexess.passerby, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.kids_visits } }, allowDecimals: false,
                    title: { text: this.indexes.kids_visitors, style: { color: c_.kids_visits, fontWeight: 'bold' } },
                    visible: select === this.indexess.kids_visitors, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.turn_in_rate } }, allowDecimals: false,
                    title: { text: this.indexes.turn_in_rate, style: { color: c_.turn_in_rate, fontWeight: 'bold' } },
                    visible: select === this.indexess.turn_in_rate,
                }, {
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.visits } }, allowDecimals: false,
                    title: { text: this.indexes.visitors, style: { color: c_.visits, fontWeight: 'bold' } },
                    visible: select === this.indexess.visitors, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.traffic_flow } }, allowDecimals: false,
                    title: { text: this.indexes.traffic_flow, style: { color: c_.traffic_flow, fontWeight: 'bold' } },
                    visible: select === this.indexess.traffic_flow, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.shopper_visits } }, allowDecimals: false,
                    title: { text: this.indexes.shoppers, style: { color: c_.shopper_visits, fontWeight: 'bold' } },
                    visible: select === this.indexess.shoppers, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.avg_time + this.language.min, style: { color: c_.avg_time, fontWeight: 'bold' } },
                    allowDecimals: false,
                    labels: { format: '{value} ', style: { color: c_.avg_time, fontWeight: 'bold' } },
                    visible: select === this.indexess.avg_time, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.conversion_rate, style: { color: c_.conversion, } }, allowDecimals: false,
                    labels: { format: '{value} ', style: { color: c_.conversion, fontWeight: 'bold' } },
                    visible: select === this.indexess.conversion_rate, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.atv, style: { color: c_.atv, fontWeight: 'bold' } }, allowDecimals: false, maxPadding: 0,
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.atv, } }, visible: select === this.indexess.atv, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.avg_items, style: { color: c_.items, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { format: '{value} ', style: { color: c_.items, } },
                    visible: select === this.indexess.avg_items, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.sales_yield, style: { color: c_.sales_yield, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { format: '{value} ', style: { color: c_.sales_yield, } },
                    visible: select === this.indexess.sales_yield, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.transactions, style: { color: c_.customers, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { format: '{value} ', style: { color: c_.customers, } },
                    visible: select === this.indexess.transactions, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.sales, style: { color: c_.sales, fontWeight: 'bold' } },
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.sales, } }, visible: select === this.indexess.sales, allowDecimals: false, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.missed_sales_opportunity, style: { color: c_.missed_sales, fontWeight: 'bold' } },
                    // tslint:disable-next-line:max-line-length
                    allowDecimals: false, labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.missed_sales, } }, visible: select === this.indexess.missed_sales_opportunity, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.sales_hours, style: { color: c_.sales_hour, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { format: '{value} ', style: { color: c_.sales_hour, } },
                    visible: select === this.indexess.sales_hours, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.shoppers_on_sales_hour, style: { color: c_.shopper_on_sh, fontWeight: 'bold' } },
                    allowDecimals: false, labels: { format: '{value} ', style: { color: c_.shopper_on_sh, } },
                    visible: select === this.indexess.shoppers_on_sales_hour, maxPadding: 0, minPadding: 0, min: 0,
                }, {

                    // tslint:disable-next-line: max-line-length
                    title: { text: this.indexes.sales_on_sales_hour, style: { color: c_.sales_on_s_h, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: c_.sales_on_s_h, } },
                    visible: select === this.indexess.sales_on_sales_hour, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    // tslint:disable-next-line: max-line-length
                    title: { text: this.indexes.member_visitors, style: { color: c_.loyal_visits, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { format: '{value} ', style: { color: c_.loyal_visits, } },
                    visible: select === this.indexess.member_visitors, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.member_transactions, style: { color: c_.loyal_transactions, fontWeight: 'bold' } },
                    allowDecimals: false, labels: { format: '{value} ', style: { color: c_.loyal_transactions, } },
                    visible: select === this.indexess.member_transactions, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.member_conversion_rate, style: { color: c_.loyal_conversion, fontWeight: 'bold' } },
                    allowDecimals: false, labels: { format: '{value} ', style: { color: c_.loyal_conversion, } },
                    visible: select === this.indexess.member_conversion_rate, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.missed_member_rate + '  rate (%)', style: { color: c_.missed_loyal, fontWeight: 'bold' } },
                    allowDecimals: false, labels: { format: '{value} ', style: { color: c_.missed_loyal, } },
                    visible: select === this.indexess.missed_member_rate, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: {
                        text: this.indexes.cx_index, style: { color: c_.cxindex, fontWeight: 'bold' }
                    },
                    allowDecimals: false, maxPadding: 0, minPadding: 0, min: 0,
                    labels: { format: '{value} ', style: { color: c_.cxindex, } }, visible: select === this.indexess.cx_index,
                }, {
                    title: { text: this.indexes.nps_index, style: { color: c_.npsindex, fontWeight: 'bold' } },
                    allowDecimals: false, maxPadding: 0, minPadding: 0,
                    labels: { format: '{value} ', style: { color: c_.npsindex, } }, visible: select === this.indexess.nps_index,
                },
            ],

            series: [
                {
                    name: this.indexes.passerby, color: c_.passer_by, showInLegend: select === this.indexess.passerby,
                    selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 0, data: passer_by, visible: select === this.indexess.passerby,
                }, {
                    name: this.indexes.visitors, color: c_.visits, showInLegend: select === this.indexess.visitors,
                    selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 3, data: num_to_enter, visible: select === this.indexess.visitors,
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.kids_visitors, color: c_.kids_visits, showInLegend: select === this.indexess.kids_visitors, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 1, data: kids_visits, visible: select === this.indexess.kids_visitors,
                }, {
                    name: this.indexes.turn_in_rate, color: c_.turn_in_rate, showInLegend: select === this.indexess.turn_in_rate,
                    // tslint:disable-next-line: max-line-length
                    type: selft.type_chart(), yAxis: 2, data: turn_in_rate, visible: select === this.indexess.turn_in_rate, selected: selft.selectd()
                }, {
                    name: this.indexes.traffic_flow, color: c_.traffic_flow, showInLegend: select === this.indexess.traffic_flow,
                    type: selft.type_chart(), yAxis: 4, data: traffic, visible: select === this.indexess.traffic_flow,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.shoppers, color: c_.shopper_visits, showInLegend: select === this.indexess.shoppers,
                    selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 5, data: shopper_visits, visible: select === this.indexess.shoppers,
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.avg_time + this.language.min, color: c_.avg_time, showInLegend: select === this.indexess.avg_time, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 6, data: avg_time,
                    // tslint:disable-next-line:max-line-length
                    tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + selft.toHHMMSS(point.y * 60) + '</b><br/>'; } }, visible: select === this.indexess.avg_time,
                }, {
                    name: this.indexes.conversion_rate, color: c_.conversion, showInLegend: select === this.indexess.conversion_rate,
                    // tslint:disable-next-line: max-line-length
                    type: selft.type_chart(), yAxis: 7, data: conversion, visible: select === this.indexess.conversion_rate, selected: selft.selectd(),
                }, {
                    name: this.indexes.atv, color: c_.atv, showInLegend: select === this.indexess.atv, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 8, data: atv, visible: select === this.indexess.atv,
                }, {
                    name: this.indexes.avg_items, color: c_.items, showInLegend: select === this.indexess.avg_items,
                    selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 9, data: avg_item, visible: select === this.indexess.avg_items,
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.sales_yield, color: c_.sales_yield, showInLegend: select === this.indexess.sales_yield, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 10, data: sales_yield, visible: select === this.indexess.sales_yield,
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.transactions, color: c_.customers, showInLegend: select === this.indexess.transactions, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 11, data: transactions, visible: select === this.indexess.transactions,
                }, {
                    name: this.indexes.sales, color: c_.sales, showInLegend: select === this.indexess.sales, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 12, data: sales, visible: select === this.indexess.sales,
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.missed_sales_opportunity, color: c_.missed_sales, showInLegend: select === this.indexess.missed_sales_opportunity,
                    type: selft.type_chart(), yAxis: 13, data: missed_sales, visible: select === this.indexess.missed_sales_opportunity,
                    selected: selft.selectd(),
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.sales_hours, color: c_.sales_hour, showInLegend: select === this.indexess.sales_hours, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 14, data: sales_hour, visible: select === this.indexess.sales_hours,
                }, {
                    name: this.indexes.shoppers_on_sales_hour, color: c_.shopper_on_sh,
                    showInLegend: select === this.indexess.shoppers_on_sales_hour,
                    type: selft.type_chart(), yAxis: 15, data: shopper_on_sh, visible: select === this.indexess.shoppers_on_sales_hour,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.sales_on_sales_hour, color: c_.sales_on_s_h,
                    showInLegend: select === this.indexess.sales_on_sales_hour,
                    type: selft.type_chart(), yAxis: 16, data: sales_on_s_h, visible: select === this.indexess.sales_on_sales_hour,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.member_visitors, color: c_.loyal_visits, showInLegend: select === this.indexess.member_visitors,
                    selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 17, data: loyal_visits, visible: select === this.indexess.member_visitors,
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.member_transactions, color: c_.loyal_transactions, showInLegend: select === this.indexess.member_transactions,
                    type: selft.type_chart(), yAxis: 18, data: loyal_transactions,
                    visible: select === this.indexess.member_transactions, selected: selft.selectd(),
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.member_conversion_rate, color: c_.loyal_conversion, showInLegend: select === this.indexess.member_conversion_rate,
                    type: selft.type_chart(), yAxis: 19, data: loyal_conversion,
                    visible: select === this.indexess.member_conversion_rate, selected: selft.selectd(),
                }, {
                    name: this.indexes.missed_member_rate, color: c_.missed_loyal,
                    showInLegend: select === this.indexess.missed_member_rate,
                    type: selft.type_chart(), yAxis: 20, data: miss_loyal_conversion,
                    visible: select === this.indexess.missed_member_rate, selected: selft.selectd(),
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.cx_index, color: c_.cxindex, showInLegend: select === this.indexess.cx_index, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 21, data: cx_index, visible: select === this.indexess.cx_index,
                }, {
                    // tslint:disable-next-line: max-line-length
                    name: this.indexes.nps_index, color: c_.npsindex, showInLegend: select === this.indexess.nps_index, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 22, data: nps_index, visible: select === this.indexess.nps_index,
                }
            ]

        });
    }
}
