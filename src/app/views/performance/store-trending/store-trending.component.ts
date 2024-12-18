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
    templateUrl: 'store-trending.component.html',
    styleUrls: ['store-trending.component.scss'],
    // encapsulation: ViewEncapsulation.None
})
export class FootfallStoreStrendingComponent implements OnInit {
    @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
    defaultModule = 4;
    indexViewBy: number;
    currentPageId = environment.Pages.footfall.performance_store_trending;
    @ViewChild('MenuInput') MenuInput: MenutreeComponent;
    @ViewChild('MenuInput_1') MenuInput_1: MenutreeComponent;
    @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
    @ViewChild('content') public helloTemplate: ElementRef;
    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    @BlockUI() blockUI: NgBlockUI;
    page_id = environment.Pages.footfall.performance_store_trending;
    public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
    public navItems = navItems;
    public sidebarMinimized = true;
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
    index_viewby = 5;
    color: string;
    total_passer_by1 = 0;
    total_shopper_visits1 = 0;
    total_passer_by2 = 0;
    total_shopper_visits2 = 0;
    total_kid1 = 0;
    total_turn_rate1 = 0;
    total_kid2 = 0;
    total_turn_rate2 = 0;
    total_avg_time2 = 0;
    total_avg_time1 = 0;
    valueSuffix: string;
    tt_conver1 = 0;
    tt_atv1 = 0;
    tt_avg_item1 = 0;
    tt_sales_yeil1 = 0;
    tt_transactions1 = 0;
    tt_sales1 = 0;
    tt_missed_sales1 = 0;
    tt_loyal_visits1 = 0;
    tt_loy_tran1 = 0;
    tt_loy_conver1 = 0;
    tt_cx_index1 = 0;
    tt_nps_index1 = 0;
    tt_conver2 = 0;
    tt_atv2 = 0;
    tt_avg_item2 = 0;
    tt_sales_yeil2 = 0;
    tt_transactions2 = 0;
    tt_missed_sales2 = 0;
    tt_loyal_visits2 = 0;
    tt_loy_tran2 = 0;
    tt_cx_index2 = 0;
    tt_turn_rate1 = 0;
    tt_turn_rate2 = 0;
    tt_loy_conver2 = 0;
    tt_nps_index2 = 0;
    tt_sales2 = 0;
    tt_missed_loyal1 = 0;
    tt_missed_loyal2 = 0;
    type: string;
    tt_sales_hour2e = 0;
    tt_shopper_on_sh2 = 0;
    tt_sales_hour1 = 0;
    tt_shopper_on_sh1 = 0;
    tt_sales_on_sh1 = 0;
    tt_sales_on_sh2 = 0;
    items1 = 0; items2 = 0;
    staff1 = 0; staff2 = 0;
    loyal_purchased1 = 0; loyal_purchased2 = 0;
    tt_loyal_visits_nt1 = 0; tt_loyal_visits_nt2 = 0;
    checked: boolean;
    column_data_1 = 0; total_seconds1 = 0; total_seconds2 = 0;
    column_data_2 = 0;
    indexes: any;
    indexess: any;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    show_label_table: string;
    constructor(protected router: Router, protected appservice: AppService, private modalService: BsModalService) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
        this.indexes = this.indexess = indexes;
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
                try {
                    if (!environment.production) {
                        console.log('get_user_page_parametter', param);
                    }
                    let para = null;
                    this.indexes = param.list_index;
                    this.indexess = param.list_index_value;
                    this.indexOption = param.performance_index_group;
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
                    this.viewDataBy = para.view_by;
                    this.indexOptionSelected = para.indexOptionSelected;
                    this.TimeInput.get_data(para, this.time_period_array);
                } catch (error) {
                    this.blockUI.stop();
                }
            }, (error) => {
                if (!environment.production) {
                    console.log(error);
                }
                this.blockUI.stop();
                // this.push_notification();
                this.show_error = true;
            }, () => {
                this.get_sitetree().then(res => {
                    return this.get_sitetree_compare();
                }).then(res => {
                    this.get_data();
                });
                // this.get_sitetree();
                // this.get_sitetree_compare();
                // this.get_data();
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
        // const value_index = this.indexOption.find(item => item.label === this.indexess.shoppers).value;
        const value_index = this.indexOption[0].value;
        return {
            organization_id: organization_id
            , organization_id_compare: organization_id
            // , site_id: 0
            // , site_id_compare: 0
            , start_time: '8:00'
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
                    this.site_name = this.menu_tree[0].name;
                    this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
                    this.get_data();
                } catch (error) {
                    this.blockUI.stop();
                }
            }, (error) => {
                this.blockUI.stop();
                if (!environment.production) {
                    console.log(error);
                }
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
            const agrument = {
                organization_id: event.organization_id
            };
            const url = environment.API.sites + '_get_site_for_report';
            this.appservice.post(agrument, url).subscribe(res => {
                // console.log(res);
                try {
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
                if (!environment.production) {
                    console.log(error);
                }
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
                this.menu_tree = res.site_array.slice(0);
                const element = this.menu_tree.find(item => Number(item.enables) === 1);
                if (!this.site_id) {
                    this.site_id = element.id;
                }
                this.site_name = element.name;
                this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
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
            }, (error) => {
                this.blockUI.stop();
            }, () => {
                this.blockUI.stop();
                resolve();
            }
            );
        });
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
        this.viewDataBy = 'Hour';
    }

    function_tinh_toan(data: any, i: number) {
        let si = 0;
        data.forEach(element => {
            this['total_passer_by' + i] += Number(element.passer_by);
            this['total_num_to_enter' + i] += Number(element.num_to_enter);
            this['total_shopper_visits' + i] += Number(element.shopper_visits);
            this['total_turn_rate' + i] += Number(element.turn_in_rate);
            this['total_avg_time' + i] += Number(element.avg_time);
            this['total_kids' + i] += Number(element.kids_visits);
            this['total_traffic' + i] += Number(element.traffic);

            this['tt_transactions' + i] += Number(element.transactions);
            this['tt_sales_hour' + i] += Number(element.sales_hour);
            this['tt_sales' + i] += Number(element.sales);
            this['tt_missed_sales' + i] += Number(element.missed_sales);
            this['tt_cx_index' + i] += Number(element.cx_index);
            this['tt_nps_index' + i] += Number(element.nps_index);
            this['items' + i] += Number(element.items);
            this['staff' + i] += Number(element.staff);
            this['loyal_purchased' + i] += Number(element.loyal_purchased);
            this['tt_loyal_visits_nt' + i] += Number(element.loyal_visits_nt);
            this['total_seconds' + i] += Number(element.total_seconds);
            if (Number(element.avg_time) > 0) {
                si++;
            }
        });
        const row = Number(data.length);
        // if (this.viewDataBy === 'Hour') {
        // tslint:disable-next-line: max-line-length
        //     this['total_avg_time' + i] = Number(this['total_num_to_enter' + i]) > 0 ? Number(this['total_seconds' + i]) / Number(this['total_num_to_enter' + i]) : 0;
        // } else {
        this['total_avg_time' + i] = Number(si) > 0 ? Number((this['total_avg_time' + i] * 60 / si).toFixed(0)) : 0;
        // }

        // tslint:disable-next-line: max-line-length
        this['total_turn_rate' + i] = Number(this['total_passer_by' + i]) > 0 ? Number(((this['total_num_to_enter' + i] / this['total_passer_by' + i]) * 100).toFixed(2)) : 0;
        // tslint:disable-next-line: max-line-length
        this['tt_atv' + i] = this['tt_transactions' + i] > 0 ? Number((this['tt_sales' + i] / this['tt_transactions' + i]).toFixed(0)) : 0;
        // tslint:disable-next-line: max-line-length
        this['tt_loy_conver' + i] = this['tt_loyal_visits_nt' + i] > 0 ? Number(((this['loyal_purchased' + i] / this['tt_loyal_visits_nt' + i]) * 100).toFixed(2)) : 0;
        // tslint:disable-next-line: max-line-length
        this['tt_loy_tran' + i] = this['tt_transactions' + i] > 0 ? Number(((this['loyal_purchased' + i] / this['tt_transactions' + i]) * 100).toFixed(2)) : 0;
        // tslint:disable-next-line: max-line-length
        this['tt_conver' + i] = this['total_shopper_visits' + i] > 0 ? Number(((this['tt_transactions' + i] / this['total_shopper_visits' + i]) * 100).toFixed(2)) : 0;
        // tslint:disable-next-line: max-line-length
        this['tt_loyal_visits' + i] = this['total_shopper_visits' + i] > 0 ? Number(((this['tt_loyal_visits_nt' + i] / this['total_shopper_visits' + i]) * 100).toFixed(2)) : 0;
        this['tt_missed_loyal' + i] = Number(this['tt_loy_conver' + i]) > 0 ? 100 - Number(this['tt_loy_conver' + i]) : 0;
        // tslint:disable-next-line: max-line-length
        this['tt_sales_yeild' + i] = this['total_shopper_visits' + i] > 0 ? Number((this['tt_sales' + i] / this['total_shopper_visits' + i]).toFixed(0)) : 0;
        // tslint:disable-next-line: max-line-length
        this['tt_avg_item' + i] = this['tt_transactions' + i] > 0 ? Number((this['items' + i] / this['tt_transactions' + i]).toFixed(2)) : 0;
        // tslint:disable-next-line: max-line-length
        this['tt_shopper_on_sh' + i] = this['tt_sales_hour' + i] > 0 ? Number((this['total_shopper_visits' + i] / this['tt_sales_hour' + i]).toFixed(2)) : 0;
        // tslint:disable-next-line: max-line-length
        this['tt_sales_on_sh' + i] = this['tt_sales_hour' + i] > 0 ? Number((this['tt_sales' + i] / this['tt_sales_hour' + i]).toFixed(0)) : 0;
        this['tt_transactions' + i] = Number((this['tt_transactions' + i] / row).toFixed(0));
        this['tt_sales' + i] = Number((this['tt_sales' + i] / row).toFixed(0));
        this['tt_sales_hour' + i] = Number((this['tt_sales_hour' + i] / row).toFixed(2));
        this['tt_nps_index' + i] = Number((this['tt_nps_index' + i] / row).toFixed(2));
        this['tt_cx_index' + i] = Number((this['tt_cx_index' + i] / row).toFixed(2));
        this['total_passer_by' + i] = Number((this['total_passer_by' + i] / row).toFixed(0));
        this['total_num_to_enter' + i] = Number((this['total_num_to_enter' + i] / row).toFixed(0));
        this['total_shopper_visits' + i] = Number((this['total_shopper_visits' + i] / row).toFixed(0));
        this['total_kids' + i] = Number((this['total_kids' + i] / row).toFixed(0));
        this['total_traffic' + i] = Number((this['total_traffic' + i] / row).toFixed(0));

        this['tt_missed_sales' + i] = Number((this['tt_missed_sales' + i] / row).toFixed(0));

    }

    get_valuesuffix() {
        this.valueSuffix = '';
        if (this.indexOptionSelected === this.indexess.turn_in_rate
            || this.indexOptionSelected === this.indexess.conversion_rate || this.indexOptionSelected === this.indexess.member_visitors
            || this.indexOptionSelected === this.indexess.member_transactions
            || this.indexOptionSelected === this.indexess.member_conversion_rate
            || this.indexOptionSelected === this.indexess.missed_member_rate
            || this.indexOptionSelected === this.indexess.cx_index
            || this.indexOptionSelected === this.indexess.nps_index) {
            this.valueSuffix = ' (%)';
        }
    }

    get_data() {
        this.all_data = [];
        this.blockUI.start(this.language.dang_tai_du_lieu);
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
        // tslint:disable-next-line:max-line-length
        this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.viewDataBy === 'Hour' ? this.language.gio : this.viewDataBy === 'DayWorkofWeek' ? this.language.ngay_lam_viec_cuoi_tuan : this.language.ngay_lam_viec;
        this.time_generate_report = new Date();
        this.get_valuesuffix();

        this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_store_comparison').subscribe(
            res => {
                if (!environment.production) {
                    console.log('store_comparison', res);
                }
                try {
                    this.starttime = this.startTimeOption.find(item => item.value === this.start_time).label;
                    this.endtime = this.endTimeOption.find(item => item.value === this.end_time).label;
                    // this.title_index = this.indexOptionSelected;
                    this.title_index = this.indexOption.find(item => item.value === this.indexOptionSelected).label;
                    this.site_name = this.MenuInput.menu_tree.find(item => item.id === this.site_id).site_name;
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
                    const color_ = environment.POC.colors;
                    const chart_xAxis = [];
                    const chart_data = [];
                    const chart_data_compare = [];
                    this.show_error = false;
                    if (res.hasOwnProperty('status') && res.status === 0) {
                        // this.push_notification();
                        this.show_error = true;
                        this.blockUI.stop();
                    }
                    this.set_to_zero(
                        'total_num_to_enter1', 'total_num_to_enter2'
                        , 'total_traffic1', 'total_traffic2'
                        , 'total_shopper_visits1', 'total_shopper_visits2'
                        , 'total_passer_by1', 'total_passer_by2'
                        , 'total_kids1', 'total_kids2'
                        , 'total_turn_rate1', 'total_turn_rate2'
                        , 'total_avg_time1', 'total_avg_time2'
                        , 'tt_conver1', 'tt_conver2'
                        , 'tt_atv1', 'tt_atv2'
                        , 'tt_sales_yeild1', 'tt_sales_yeild2'
                        , 'tt_transactions1', 'tt_transactions2'
                        , 'tt_avg_item1', 'tt_avg_item2'
                        , 'tt_sales1', 'tt_sales2'
                        , 'tt_missed_sales1', 'tt_missed_sales2'
                        , 'tt_loyal_visits1', 'tt_loyal_visits2'
                        , 'tt_loy_tran1', 'tt_loy_tran2'
                        , 'tt_loy_conver1', 'tt_loy_conver2'
                        , 'tt_cx_index1', 'tt_cx_index2'
                        , 'tt_nps_index1', 'tt_nps_index2'
                        , 'tt_missed_loyal1', 'tt_missed_loyal2'
                        , 'tt_sales_hour1', 'tt_sales_hour2'
                        , 'tt_shopper_on_sh1', 'tt_shopper_on_sh2'
                        , 'tt_sales_on_sh1', 'tt_sales_on_sh2'
                        , 'items1', 'items2'
                        , 'staff1', 'staff2'
                        , 'total_seconds1', 'total_seconds2'
                        , 'loyal_purchased1', 'loyal_purchased2'
                        , 'tt_loyal_visits_nt1', 'tt_loyal_visits_nt2'
                    );
                    this.function_tinh_toan(res.data, 1);
                    this.function_tinh_toan(res.data_compare, 2);


                    res.data.forEach(element => { chart_xAxis.push(element.time_period); });
                    if (chart_xAxis.length > 0) {
                        this.show_label_table = chart_xAxis[0] + ' - ' + chart_xAxis[chart_xAxis.length - 1];
                    }
                    switch (this.indexOptionSelected) {
                        case this.indexess.passerby:
                            color = color_.passer_by;
                            res.data.forEach(element => { chart_data.push(Number(element.passer_by)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.passer_by)); });
                            this.column_data_1 = this['total_passer_by' + 1];
                            this.column_data_2 = this['total_passer_by' + 2];
                            break;
                        case this.indexess.shoppers:
                            color = color_.shopper_visits;
                            res.data.forEach(element => { chart_data.push(Number(element.shopper_visits)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.shopper_visits)); });
                            this.column_data_1 = this['total_shopper_visits' + 1];
                            this.column_data_2 = this['total_shopper_visits' + 2];
                            break;
                        case this.indexess.traffic_flow:
                            color = color_.traffic_flow;
                            res.data.forEach(element => { chart_data.push(Number(element.traffic)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.traffic)); });
                            this.column_data_1 = this['total_traffic' + 1];
                            this.column_data_2 = this['total_traffic' + 2];
                            break;
                        case this.indexess.kids_visitors:
                            color = color_.kids_visits;
                            res.data.forEach(element => { chart_data.push(Number(element.kids_visits)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.kids_visits)); });
                            this.column_data_1 = this['total_kids' + 1];
                            this.column_data_2 = this['total_kids' + 2];
                            break;
                        case this.indexess.turn_in_rate:
                            color = color_.turn_in_rate;
                            res.data.forEach(element => { chart_data.push(Number(element.turn_in_rate)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.turn_in_rate)); });
                            this.column_data_1 = this['total_turn_rate' + 1];
                            this.column_data_2 = this['total_turn_rate' + 2];
                            break;
                        case this.indexess.avg_time:
                            color = color_.avg_time;
                            res.data.forEach(element => { chart_data.push((Number(element.avg_time))); });
                            res.data_compare.forEach(element => { chart_data_compare.push((Number(element.avg_time))); });
                            this.column_data_1 = this['total_avg_time' + 1];
                            this.column_data_2 = this['total_avg_time' + 2];
                            break;
                        case this.indexess.visitors:
                            color = color_.visits;
                            res.data.forEach(element => { chart_data.push(Number(element.num_to_enter)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.num_to_enter)); });
                            this.column_data_1 = this['total_num_to_enter' + 1];
                            this.column_data_2 = this['total_num_to_enter' + 2];
                            break;
                        case this.indexess.conversion_rate:
                            color = color_.conversion;
                            res.data.forEach(element => { chart_data.push(Number(element.conversion)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.conversion)); });
                            this.column_data_1 = this['tt_conver' + 1];
                            this.column_data_2 = this['tt_conver' + 2];
                            break;
                        case this.indexess.atv:
                            color = color_.atv;
                            res.data.forEach(element => { chart_data.push(Number(element.atv)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.atv)); });
                            this.column_data_1 = this['tt_atv' + 1];
                            this.column_data_2 = this['tt_atv' + 2];
                            break;
                        case this.indexess.avg_items:
                            color = color_.items;
                            res.data.forEach(element => { chart_data.push(Number(element.avg_item)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.avg_item)); });
                            this.column_data_1 = this['tt_avg_item' + 1];
                            this.column_data_2 = this['tt_avg_item' + 2];
                            break;
                        case this.indexess.sales_yield:
                            color = color_.sales_yield;
                            res.data.forEach(element => { chart_data.push(Number(element.sales_yield)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.sales_yield)); });
                            this.column_data_1 = this['tt_sales_yeild' + 1];
                            this.column_data_2 = this['tt_sales_yeild' + 2];
                            break;
                        case this.indexess.transactions:
                            color = color_.customers;
                            res.data.forEach(element => { chart_data.push(Number(element.transactions)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.transactions)); });
                            this.column_data_1 = this['tt_transactions' + 1];
                            this.column_data_2 = this['tt_transactions' + 2];
                            break;
                        case this.indexess.sales:
                            color = color_.sales;
                            res.data.forEach(element => { chart_data.push(Number(element.sales)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.sales)); });
                            this.column_data_1 = this['tt_sales' + 1];
                            this.column_data_2 = this['tt_sales' + 2];
                            break;
                        case this.indexess.missed_sales_opportunity:
                            color = color_.missed_sales;
                            res.data.forEach(element => { chart_data.push(Number(element.missed_sales)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.missed_sales)); });
                            this.column_data_1 = this['tt_missed_sales' + 1];
                            this.column_data_2 = this['tt_missed_sales' + 2];
                            break;
                        case this.indexess.member_visitors:
                            color = color_.loyal_visits;
                            res.data.forEach(element => { chart_data.push(Number(element.loyal_visits)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.loyal_visits)); });
                            this.column_data_1 = this['tt_loyal_visits' + 1];
                            this.column_data_2 = this['tt_loyal_visits' + 2];
                            break;
                        case this.indexess.member_transactions:
                            color = color_.loyal_transactions;
                            res.data.forEach(element => { chart_data.push(Number(element.loyal_transactions)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.loyal_transactions)); });
                            this.column_data_1 = this['tt_loy_tran' + 1];
                            this.column_data_2 = this['tt_loy_tran' + 2];
                            break;
                        case this.indexess.member_conversion_rate:
                            color = color_.loyal_conversion;
                            res.data.forEach(element => { chart_data.push(Number(element.loyal_conversion)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.loyal_conversion)); });
                            this.column_data_1 = this['tt_loy_conver' + 1];
                            this.column_data_2 = this['tt_loy_conver' + 2];
                            break;
                        case this.indexess.cx_index:
                            color = color_.cxindex;
                            res.data.forEach(element => { chart_data.push(Number(element.cx_index)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.cx_index)); });
                            this.column_data_1 = this['tt_cx_index' + 1];
                            this.column_data_2 = this['tt_cx_index' + 2];
                            break;
                        case this.indexess.nps_index:
                            color = color_.npsindex;
                            res.data.forEach(element => { chart_data.push(Number(element.nps_index)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.nps_index)); });
                            this.column_data_1 = this['tt_nps_index' + 1];
                            this.column_data_2 = this['tt_nps_index' + 2];
                            break;
                        case this.indexess.sales_hours:
                            color = color_.sales_hour;
                            res.data.forEach(element => { chart_data.push(Number(element.sales_hour)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.sales_hour)); });
                            this.column_data_1 = this['tt_sales_hour' + 1];
                            this.column_data_2 = this['tt_sales_hour' + 2];
                            break;
                        case this.indexess.shoppers_on_sales_hour:
                            color = color_.shopper_on_sh;
                            res.data.forEach(element => { chart_data.push(Number(element.shopper_on_s_h)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.shopper_on_s_h)); });
                            this.column_data_1 = this['tt_shopper_on_sh' + 1];
                            this.column_data_2 = this['tt_shopper_on_sh' + 2];
                            break;
                        case this.indexess.sales_on_sales_hour:
                            color = color_.sales_on_s_h;
                            res.data.forEach(element => { chart_data.push(Number(element.sales_on_s_h)); });
                            res.data_compare.forEach(element => { chart_data_compare.push(Number(element.sales_on_s_h)); });
                            this.column_data_1 = this['tt_sales_on_sh' + 1];
                            this.column_data_2 = this['tt_sales_on_sh' + 2];
                            break;
                        case this.indexess.missed_member_rate:
                            color = color_.missed_loyal;
                            // tslint:disable-next-line:max-line-length
                            res.data.forEach(element => { const missed = Number(element.loyal_conversion) > 0 ? Number(100 - (Number(element.loyal_conversion))) : 0; chart_data.push(missed); });
                            // tslint:disable-next-line:max-line-length
                            res.data_compare.forEach(element => { const missed_compare = Number(element.loyal_conversion) > 0 ? Number(100 - (Number(element.loyal_conversion))) : 0; chart_data_compare.push(missed_compare); });
                            this.column_data_1 = this['tt_missed_loyal' + 1];
                            this.column_data_2 = this['tt_missed_loyal' + 2];
                            break;
                    }
                    this.get_table_data(chart_data, chart_data_compare, chart_xAxis, this.column_data_1, this.column_data_2);
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
        // tslint:disable-next-line:max-line-length
        this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_store_comparison_export_excel').subscribe(fileData => {
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

    log_all(...property) {
        property.forEach((element, index) => {
            // console.log(property[index], this[property[index]]);
        });
    }

    value_Suffix() {
        this.valueSuffix = '';
        if (this.indexOptionSelected === this.indexess.avg_time) {
            this.valueSuffix = ' (min)';
        }
        return this.valueSuffix;
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
            || this.indexOptionSelected === this.indexess.avg_items || this.indexOptionSelected === this.indexess.member_transactions
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

    load_highchart(...data) {
        const selft = this;
        const select = this.indexOptionSelected;
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
                // tslint:disable-next-line:max-line-length
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
                // tslint:disable-next-line:max-line-length
                labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: data[1] } },
                allowDecimals: false, maxPadding: 0, minPadding: 0, min: this.indexOptionSelected === this.indexess.nps_index ? null : 0,
                title: { text: selft.title_index, style: { color: data[1], fontWeight: 'bold' } },

            }],
            series: [
                {
                    name: this.site_name, color: data[1], type: selft.type_chart(), yAxis: 0, data: data[2],
                    // tslint:disable-next-line:max-line-length
                    tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + point.y.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '</b><br/>'; } }, selected: selft.selectd(),
                    visible: this.indexOptionSelected !== this.indexess.avg_time,
                    showInLegend: this.indexOptionSelected !== this.indexess.avg_time,
                }, {
                    name: this.site_name_compare, color: environment.POC.colors.compare, type: selft.type_chart(), yAxis: 0, data: data[3],
                    // tslint:disable-next-line:max-line-length
                    tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + point.y.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '</b><br/>'; } }, selected: selft.selectd(),
                    visible: this.indexOptionSelected !== this.indexess.avg_time,
                    showInLegend: this.indexOptionSelected !== this.indexess.avg_time,
                }, {
                    name: this.site_name, color: data[1], type: selft.type_chart(), yAxis: 0, data: data[2],
                    // tslint:disable-next-line:max-line-length
                    tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + selft.toHHMMSS(point.y * 60) + '</b><br/>'; } }, selected: selft.selectd(),
                    visible: this.indexOptionSelected === this.indexess.avg_time,
                    showInLegend: this.indexOptionSelected === this.indexess.avg_time,
                }, {
                    name: this.site_name_compare, color: environment.POC.colors.compare, type: selft.type_chart(), yAxis: 0, data: data[3],
                    // tslint:disable-next-line:max-line-length
                    tooltip: { pointFormatter() { const point = this; return '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + selft.toHHMMSS(point.y * 60) + '</b><br/>'; } }, selected: selft.selectd(),
                    visible: this.indexOptionSelected === this.indexess.avg_time,
                    showInLegend: this.indexOptionSelected === this.indexess.avg_time,
                }
            ]
        });
    }

    change_view() {
        this.get_data();
    }

    check_suffix(indexOptionSelected) {
        // let suffix_text = ' lượt';
        // if (indexOptionSelected === this.indexess.avg_time) {
        //     suffix_text = ' phút';
        // }
        // return suffix_text;
    }
}

