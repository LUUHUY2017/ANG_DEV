import { IOption } from 'ng-select';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Hightcharts from 'highcharts';
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';
import { Timeperiod2Component } from '../../viewchild/timeperiod2/timeperiod2.component';
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'effect-time.component.html',
    styleUrls: ['effect-time.component.scss'],
    // encapsulation: ViewEncapsulation.None
})

export class FootfallEffectTimeComponent implements OnInit {
    @ViewChild('TimeInput') TimeInput: TimeperiodComponent;
    @ViewChild('TimeInput_2') TimeInput_2: Timeperiod2Component;
    @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
    page_id = environment.Pages.footfall.performance_time;
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('content') public helloTemplate: ElementRef;
    @ViewChild('container1', { read: ElementRef }) container1: ElementRef;
    organizations = [];
    organization_id: string;
    organization_selected = '';
    siteSelectionDisplay = false;
    site_id: any;
    start_time: string;
    end_time: string;
    start_date: any;
    end_date: any;
    start_date_compare: any;
    end_date_compare: any;
    public startTimeOption: Array<IOption>;
    public endTimeOption: Array<IOption>;
    viewDataBy: string;
    num_to_enter = 0;
    num_to_enter_compare = 0;
    total_num_to_enter = 0;
    total_num_to_enter_compare = 0;
    total_num_to_traffic = 0;
    total_num_to_traffic_compare = 0;
    total_num_to_exit = 0;
    total_num_to_exit_compare = 0;
    total_avgtime = 0;
    total_avgtime_compare = 0;
    indexOption: Array<IOption>;
    btnApplyValid = false;
    // Index compare
    indexOptionSelected: string;
    // public navItems = navItems;
    public sidebarMinimized = true;
    public modalRef: BsModalRef;
    public element: HTMLElement = document.body;
    public chart_data: any;
    time_value = '';
    time_value_compare = '';
    public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
    time_period_array: any;
    organization_array: any;
    menu_tree: any[];
    url_api = environment.apiUrl + 'exports/';
    name_of_excel: any;
    time_generate_report = new Date();
    site_name: string;
    title_start_date: string;
    title_end_date: string;
    time_period: string;
    title_time_period: string;
    title_start_date_compare: string;
    title_end_date_compare: string;
    time_period_compare: string;
    title_time_period_compare: string;
    starttime: string;
    title_index: string;
    endtime: string;
    operator = 'SUM';
    total_passer_by = 0; index_viewby = 0;
    total_shopper_visits = 0;
    total_passer_by_compare = 0;
    total_shopper_visits_compare = 0;
    total_kids_compare = 0;
    total_kids = 0;

    total_turn_rate = 0;
    tt_conver = 0;
    tt_atv = 0;
    tt_avg_item = 0;
    tt_sales_yeild = 0;
    tt_transactions = 0;
    tt_sales = 0;
    tt_missed_sales = 0;
    tt_loyal_visits = 0;
    tt_loy_tran = 0;
    tt_loy_conver = 0;
    tt_cx_index = 0;
    tt_nps_index = 0;

    total_turn_rate_compare = 0;
    tt_conver_compare = 0;
    tt_atv_compare = 0;
    tt_avg_item_compare = 0;
    tt_sales_yeild_compare = 0;
    tt_transactions_compare = 0;
    tt_sales_compare = 0;
    tt_missed_sales_compare = 0;
    tt_loyal_visits_compare = 0;
    tt_loy_tran_compare = 0;
    tt_loy_conver_compare = 0;
    tt_cx_index_compare = 0;
    tt_nps_index_compare = 0;
    miss_loyal_conversion = 0;
    items_compare = 0;
    staff_compare = 0;
    loyal_purchased_compare = 0;
    tt_loyal_visits_nt_compare = 0;
    items = 0;
    staff = 0;
    loyal_purchased = 0;
    tt_loyal_visits_nt = 0;
    up_or_down: string;
    number_chenh_lech: number;
    tt_missed_loyal: number;
    total_seconds = 0;
    total_seconds_compare = 0;
    tt_missed_loyal_compare: number;
    type: string;
    view: string;
    tt_sales_hour: number;
    tt_shopper_on_sh: number;
    tt_sales_on_sh: number;
    tt_sales_hour_compare: number;
    tt_shopper_on_sh_compare: number;
    tt_sales_on_sh_compare: number;

    checked: boolean; language: any; indexes: any; indexess: any;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    show_label_table: string; show_error = false;
    constructor(private router: Router, private appservice: AppService, private modalService: BsModalService) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
        this.indexes = this.indexess = indexes;
    }

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
                    if (para.time_value && para.time_value_compare) {
                        this.get_date(para.time_value, 1);
                        this.get_date(para.time_value_compare, 2);
                    } else if (para.start_date && para.end_date && para.start_date_compare && para.end_date_compare) {
                        this.start_date = para.start_date;
                        this.end_date = para.end_date;
                        this.start_date_compare = para.start_date_compare;
                        this.end_date_compare = para.end_date_compare;
                        this.start_time = this.start_time.replace(/[']/g, '');
                        this.end_time = this.end_time.replace(/[']/g, '');
                    }
                    this.viewDataBy = para.view_by;
                    this.indexOptionSelected = para.indexOptionSelected;
                    this.TimeInput.get_data(para, this.time_period_array);
                    this.TimeInput_2.get_data_compare(para, this.time_period_array);
                } catch (error) {
                    this.blockUI.stop();
                }
            },
            (error) => {
                this.blockUI.stop();
                // this.push_notification();
                this.show_error = true;
            },
            () => {
                this.get_sitetree();
                // this.blockUI.stop();
            }
        );
    }
    get_date(time, id) {
        const time_array = this.TimeInput.get_time(time);
        switch (id) {
            case 1: {
                this.start_date = this.appservice.convert_date_tostring(time_array.ngaybatdau);
                this.end_date = this.appservice.convert_date_tostring(time_array.ngayketthuc);
                this.time_value = time;
                this.index_viewby = time_array.order;
                break;
            }
            case 2: {
                this.start_date_compare = this.appservice.convert_date_tostring(time_array.ngaybatdau);
                this.end_date_compare = this.appservice.convert_date_tostring(time_array.ngayketthuc);
                this.time_value_compare = time;
                break;
            }
        }
    }

    set_default(defaultOrgId: any) {
        const organization_id = this.userinfo.organization_id === '0' ? defaultOrgId : Number(this.userinfo.organization_id);
        // const organization_id = this.userinfo.organization_id === '0' ? 6 : Number(this.userinfo.organization_id);
        // const value_index = this.indexOption.find(item => item.label === this.indexess.shoppers).value;
        const value_index = this.indexOption[0].value;
        return {
            organization_id: organization_id
            // , site_id: 0
            , start_time: '8:00'
            , end_time: '23:59'
            , time_value: 'today'
            , time_value_compare: 'yesterday'
            , view_by: 'Hour'
            , indexOptionSelected: value_index
        };
    }

    reset_session() {
        const data = [];
        this.site_id = null;
        this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
            this.get_page_param();
        });
    }

    get_sitetree() {
        this.blockUI.start(this.language.dang_tai_du_lieu);
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
            } catch (error) {
                this.blockUI.stop();
            }
        }, (error) => {
            this.blockUI.stop();
            // this.push_notification();
            this.show_error = true;
        }, () => {
            this.blockUI.stop();
            this.get_data();

        }
        );
    }
    // Nghĩa thêm function get emit data
    get_date_from_emit(event, id) {
        switch (id) {
            case 1: {
                if (event[0].start_date && event[0].end_date) {
                    this.start_date = event[0].start_date;
                    this.end_date = event[0].end_date;
                    this.time_value = '';
                    this.index_viewby = 2;
                } else if (event[0].time_value) {
                    this.time_value = event[0].time_value;
                    this.get_date(this.time_value, 1);
                    this.index_viewby = event[0].index_viewby;
                }
                break;
            }
            case 2: {
                if (event[0].start_date && event[0].end_date) {
                    this.start_date_compare = event[0].start_date;
                    this.end_date_compare = event[0].end_date;
                    this.time_value_compare = '';
                } else if (event[0].time_value) {
                    this.time_value_compare = event[0].time_value;
                    this.get_date(this.time_value_compare, 2);
                }
                break;
            }
        }
        this.viewDataBy = 'Hour';
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
                } catch (error) {
                    this.blockUI.stop();
                }
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
    // Huy thêm hàm lấy số dương
    get_number_int(number_comared: number, number2: number) {
        const chenhlech = Number(number2 - number_comared);
        this.up_or_down = chenhlech > 0 ? 'caret-up' : chenhlech === 0 ? 'sort' : 'caret-down';
        this.number_chenh_lech = Math.abs(chenhlech);
        return Math.abs(chenhlech);
    }

    get_compar_per(number1: number, number2: number) {
        let per = 0;
        // if (Number(number1) >= Number(number2)) {
        //     per = (Number(number2) / Number(number1) * 100);
        // } else {
        per = (Number(number1) / Number(number2) * 100);
        // }
        return per;
    }

    Go_number(number, total) {
        let tong = 0;
        if (total !== 0) {
            tong = ((Number(number) / total) * 100);
            return tong.toFixed(2);
        }
        return tong;
    }

    get_data() {
        this.blockUI.start(this.language.dang_tai_du_lieu);
        const data = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , start_time: '\'' + this.start_time + '\''
            , end_time: '\'' + this.end_time + '\''
            , start_date: this.start_date
            , end_date: this.end_date
            , view_by: this.viewDataBy
            , start_date_compare: this.start_date_compare
            , end_date_compare: this.end_date_compare
            , indexOptionSelected: this.indexOptionSelected
            , operator: this.operator
        };
        if (!environment.production) {
            console.log('data', data);
        }

        this.time_generate_report = new Date();
        this.title_time_period_compare = this.title_time_period = this.language.ngay;
        // tslint:disable-next-line:max-line-length
        this.view = this.viewDataBy === 'Day' ? this.language.ngay : this.viewDataBy === 'Week' ? this.language.tuan : this.viewDataBy === 'Month' ? this.language.thang : this.viewDataBy === 'Year' ? this.language.nam : this.language.gio;
        this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_time_comparison').subscribe(
            res => {
                if (!environment.production) {
                    console.log('res', res);
                }
                try {
                    this.show_error = false;
                    if (res.hasOwnProperty('status') && res.status === 0) {
                        // this.push_notification();
                        this.show_error = true;
                        this.blockUI.stop();
                    }
                    this.starttime = this.startTimeOption.find(item => item.value === this.start_time).label;
                    this.endtime = this.endTimeOption.find(item => item.value === this.end_time).label;
                    // this.title_index = this.indexOptionSelected;
                    this.title_index = this.indexOption.find(item => item.value === this.indexOptionSelected).label;
                    this.site_name = this.MenuInput.menu_tree.find(item => item.id === this.site_id).site_name;
                    // Lấy thời gian so sánh
                    const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                    const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                    this.title_start_date = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
                    this.title_end_date = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
                    if (this.start_date !== this.end_date) {
                        this.time_period = this.title_start_date + ' - ' + this.title_end_date;
                    } else { this.time_period = this.title_start_date; }
                    // Lấy thời gian so sánh được so sánh
                    const start_d_compare = new Date(this.start_date_compare.replace(/[']/g, '').replace(/[-]/g, '/'));
                    const end_d_compare = new Date(this.end_date_compare.replace(/[']/g, '').replace(/[-]/g, '/'));
                    this.title_start_date_compare = this.appservice.convert_date_tostringdate_by_nghia(start_d_compare, false);
                    this.title_end_date_compare = this.appservice.convert_date_tostringdate_by_nghia(end_d_compare, false);
                    if (this.title_start_date_compare !== this.title_end_date_compare) {
                        this.time_period_compare = this.title_start_date_compare + ' - ' + this.title_end_date_compare;
                    } else { this.time_period_compare = this.title_start_date_compare; }

                    const chart_xAxis = [];
                    this.chart_data = [];
                    // hiển thị giá trị vao biểu đồ bảng theo dữ liệu trả về của data
                    let i = 0;
                    if (res.data_compare.length >= res.data.length) {
                        this.get_data_right_more(res.data_compare, res.data);
                        res.data_compare.forEach(element => {
                            chart_xAxis[i] = element.time_period;
                            i++;
                        });
                    } else {
                        this.get_data_left_more(res.data, res.data_compare);
                        i = 0;
                        res.data.forEach(element => {
                            chart_xAxis[i] = element.time_period;
                            i++;
                        });
                    }
                    const num_to_enter = [];
                    const num_to_enter_compare = [];
                    const traffic = [];
                    const traffic_compare = [];
                    const passer_by = [];
                    const passer_by_compare = [];
                    const shopper_visits = [];
                    const shopper_visits_compare = [];
                    const turn_rate = [];
                    const turn_rate_compare = [];
                    const kids_visits = [];
                    const kids_visits_compare = [];
                    const avg_time = [];
                    const avg_time_compare = [];

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
                    const cx_index = [];
                    const nps_index = [];
                    const miss_loyal_conversion = [];

                    const sales_hour_compare = [];
                    const shopper_on_sh_compare = [];
                    const sales_on_s_h_compare = [];
                    const conversion_compare = [];
                    const atv_compare = [];
                    const avg_item_compare = [];
                    const sales_yield_compare = [];
                    const transactions_compare = [];
                    const sales_compare = [];
                    const missed_sales_compare = [];
                    const loyal_visits_compare = [];
                    const loyal_transactions_compare = [];
                    const loyal_conversion_compare = [];
                    const cx_index_compare = [];
                    const nps_index_compare = [];
                    const miss_loyal_conversion_compare = [];

                    // biểu đồ theo  lịch 1
                    i = 0;
                    this.reset_to_zero('total_num_to_enter', 'total_num_to_enter_compare',
                        'total_num_to_traffic', 'total_num_to_traffic_compare',
                        'total_avgtime', 'total_avgtime_compare',
                        'total_passer_by', 'total_passer_by_compare',
                        'total_kids', 'total_kids_compare',
                        'total_shopper_visits', 'total_shopper_visits_compare',
                        'total_turn_rate', 'total_turn_rate_compare',
                        'tt_conver', 'tt_conver_compare',
                        'tt_atv', 'tt_atv_compare',
                        'tt_avg_item', 'tt_avg_item_compare',
                        'tt_sales_yeild', 'tt_sales_yeild_compare',
                        'tt_transactions', 'tt_transactions_compare',
                        'tt_sales', 'tt_sales_compare',
                        'tt_missed_sales', 'tt_missed_sales_compare',
                        'tt_loyal_visits', 'tt_loyal_visits_compare',
                        'tt_loy_tran', 'tt_loy_tran_compare',
                        'tt_loy_conver', 'tt_loy_conver_compare',
                        'tt_missed_loyal', 'tt_missed_loyal_compare',
                        'tt_cx_index', 'tt_cx_index_compare'
                        , 'tt_sales_hour', 'tt_sales_hour_compare'
                        , 'tt_shopper_on_sh', 'tt_shopper_on_sh_compare'
                        , 'tt_sales_on_sh', 'tt_sales_on_sh_compare'
                        , 'tt_nps_index', 'tt_nps_index_compare'
                        , 'items', 'items_compare'
                        , 'staff', 'staff_compare'
                        , 'loyal_purchased', 'loyal_purchased_compare'
                        , 'total_seconds', 'total_seconds_compare'
                        , 'tt_loyal_visits_nt', 'tt_loyal_visits_nt_compare'
                    );
                    let si = 0;
                    res.data.forEach(element => {
                        num_to_enter[i] = Number(element.num_to_enter);
                        traffic[i] = Number(element.traffic);
                        passer_by[i] = Number(element.passer_by);
                        shopper_visits[i] = Number(element.shopper_visits);
                        turn_rate[i] = Number(element.turn_in_rate);
                        kids_visits[i] = Number(element.kids_visits);
                        avg_time[i] = Number(element.avg_time);


                        conversion[i] = (Number(element.conversion));
                        atv[i] = (Number(element.atv));
                        avg_item[i] = (Number(element.avg_item));
                        sales_yield[i] = (Number(element.sales_yield));
                        transactions[i] = (Number(element.transactions));
                        sales[i] = (Number(element.sales));
                        missed_sales[i] = (Number(element.missed_sales));
                        loyal_visits[i] = (Number(element.loyal_visits));
                        loyal_transactions[i] = (Number(element.loyal_transactions));
                        loyal_conversion[i] = (Number(element.loyal_conversion));
                        // tslint:disable-next-line:max-line-length
                        miss_loyal_conversion[i] = Number(element.loyal_conversion) > 0 ? Number(100 - (Number(element.loyal_conversion))) : 0;
                        cx_index[i] = (Number(element.cx_index));
                        nps_index[i] = (Number(element.nps_index));
                        sales_hour[i] = (Number(element.sales_hour));
                        shopper_on_sh[i] = (Number(element.shopper_on_s_h));
                        sales_on_s_h[i] = (Number(element.sales_on_s_h));


                        this.items += Number(element.items);
                        this.staff += Number(element.staff);
                        this.loyal_purchased += Number(element.loyal_purchased);
                        this.tt_loyal_visits_nt += Number(element.loyal_visits_nt);

                        this.total_kids += Number(kids_visits[i]);
                        this.total_passer_by += Number(passer_by[i]);
                        this.total_num_to_traffic += Number(traffic[i]);
                        this.total_num_to_enter += Number(num_to_enter[i]);

                        this.total_shopper_visits += Number(shopper_visits[i]);
                        this.tt_sales_hour += Number(element.sales_hour);
                        this.total_avgtime += Number(avg_time[i]);
                        this.tt_transactions += Number(transactions[i]);
                        this.tt_sales += Number(sales[i]);
                        this.tt_missed_sales += Number(missed_sales[i]);
                        this.tt_cx_index += Number(cx_index[i]);
                        this.tt_nps_index += Number(nps_index[i]);
                        this.total_seconds += Number(element.total_seconds);
                        i++;
                        if (Number(element.avg_time) > 0) {
                            si++;
                        }
                    });
                    const row1 = Number(res.data.length);
                    // tslint:disable-next-line: max-line-length
                    this.total_turn_rate = Number(this.total_passer_by) > 0 ? Number(((this.total_num_to_enter / this.total_passer_by) * 100).toFixed(2)) : 0;
                    this.tt_atv = this.tt_transactions > 0 ? Number((this.tt_sales / this.tt_transactions).toFixed(0)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_loy_conver = this.tt_loyal_visits_nt > 0 ? Number(((this.loyal_purchased / this.tt_loyal_visits_nt) * 100).toFixed(2)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_loy_tran = this.tt_transactions > 0 ? Number(((this.loyal_purchased / this.tt_transactions) * 100).toFixed(2)) : 0;

                    // tslint:disable-next-line: max-line-length
                    this.tt_loyal_visits = this.total_shopper_visits > 0 ? Number(((this.tt_loyal_visits_nt / this.total_shopper_visits) * 100).toFixed(2)) : 0;
                    this.tt_missed_loyal = Number(this.tt_loy_conver) > 0 ? 100 - Number(this.tt_loy_conver) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_conver = this.total_shopper_visits > 0 ? Number(((this.tt_transactions / this.total_shopper_visits) * 100).toFixed(2)) : 0;

                    // tslint:disable-next-line: max-line-length
                    this.tt_sales_yeild = this.total_shopper_visits > 0 ? Number((this.tt_sales / this.total_shopper_visits).toFixed(0)) : 0;
                    this.tt_avg_item = this.tt_transactions > 0 ? Number((this.items / this.tt_transactions).toFixed(2)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_shopper_on_sh = this.tt_sales_hour > 0 ? Number((this.total_shopper_visits / this.tt_sales_hour).toFixed(2)) : 0;
                    this.tt_sales_on_sh = this.tt_sales_hour > 0 ? Number((this.tt_sales / this.tt_sales_hour).toFixed(0)) : 0;

                    this.tt_cx_index = Number((this.tt_cx_index / row1).toFixed(2));
                    this.tt_nps_index = Number((this.tt_nps_index / row1).toFixed(2));

                    // // biểu đồ theo  lịch 2
                    i = 0;
                    let si_compared = 0;
                    res.data_compare.forEach(element => {
                        num_to_enter_compare[i] = Number(element.num_to_enter);
                        traffic_compare[i] = Number(element.traffic);
                        passer_by_compare[i] = Number(element.passer_by);
                        shopper_visits_compare[i] = Number(element.shopper_visits);
                        turn_rate_compare[i] = Number(element.turn_in_rate);
                        kids_visits_compare[i] = Number(element.kids_visits);
                        avg_time_compare[i] = Number(element.avg_time);
                        conversion_compare[i] = (Number(element.conversion));
                        atv_compare[i] = (Number(element.atv));
                        avg_item_compare[i] = (Number(element.avg_item));
                        sales_yield_compare[i] = (Number(element.sales_yield));
                        transactions_compare[i] = (Number(element.transactions));
                        sales_compare[i] = (Number(element.sales));
                        missed_sales_compare[i] = (Number(element.missed_sales));
                        loyal_visits_compare[i] = (Number(element.loyal_visits));
                        loyal_transactions_compare[i] = (Number(element.loyal_transactions));
                        loyal_conversion_compare[i] = (Number(element.loyal_conversion));
                        // tslint:disable-next-line:max-line-length
                        miss_loyal_conversion_compare[i] = Number(element.loyal_conversion) > 0 ? Number(100 - (Number(element.loyal_conversion))) : 0;
                        cx_index_compare[i] = (Number(element.cx_index));
                        nps_index_compare[i] = (Number(element.nps_index));
                        sales_hour_compare[i] = (Number(element.sales_hour));
                        shopper_on_sh_compare[i] = (Number(element.shopper_on_s_h));
                        sales_on_s_h_compare[i] = (Number(element.sales_on_s_h));

                        this.items_compare += Number(element.items);
                        this.staff_compare += Number(element.staff);
                        this.loyal_purchased_compare += Number(element.loyal_purchased);
                        this.tt_loyal_visits_nt_compare += Number(element.loyal_visits_nt);

                        this.total_num_to_enter_compare += Number(num_to_enter_compare[i]);
                        this.total_num_to_traffic_compare += Number(traffic_compare[i]);
                        this.total_shopper_visits_compare += Number(shopper_visits_compare[i]);
                        this.total_passer_by_compare += Number(passer_by_compare[i]);
                        this.total_kids_compare += Number(kids_visits_compare[i]);
                        this.total_avgtime_compare += Number(avg_time_compare[i]);

                        this.tt_transactions_compare += Number(transactions_compare[i]);
                        this.tt_sales_compare += Number(sales_compare[i]);
                        this.tt_missed_sales_compare += Number(missed_sales_compare[i]);
                        this.tt_cx_index_compare += Number(cx_index_compare[i]);
                        this.tt_nps_index_compare += Number(nps_index_compare[i]);
                        this.tt_sales_hour_compare += Number(sales_hour_compare[i]);
                        this.total_seconds_compare += Number(element.total_seconds);
                        if (Number(element.avg_time) > 0) {
                            si_compared++;
                        }
                        i++;
                    });

                    const row2 = Number(res.data_compare.length);

                    // if (this.viewDataBy === 'Hour') {
                    // tslint:disable-next-line: max-line-length
                    // this.total_avgtime = Number(this.total_num_to_enter) > 0 ? Number(this.total_seconds) / Number(this.total_num_to_enter) : 0;
                    // tslint:disable-next-line: max-line-length
                    // this.total_avgtime_compare = Number(this.total_num_to_enter_compare) > 0 ? Number(this.total_seconds) / Number(this.total_num_to_enter_compare) : 0;
                    // } else {
                    this.total_avgtime = Number(si) > 0 ? Number((this.total_avgtime * 60 / si).toFixed(0)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.total_avgtime_compare = Number(si_compared) > 0 ? Number((this.total_avgtime_compare * 60 / si_compared).toFixed(0)) : 0;
                    // }
                    // tslint:disable-next-line: max-line-length
                    this.tt_avg_item_compare = this.tt_transactions_compare > 0 ? Number((this.items / this.tt_transactions_compare).toFixed(2)) : 0;

                    // tslint:disable-next-line: max-line-length
                    this.total_turn_rate_compare = Number(this.total_passer_by_compare) > 0 ? Number((Number(this.total_num_to_enter_compare) / Number(this.total_passer_by_compare) * 100).toFixed(2)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_atv_compare = this.tt_transactions_compare > 0 ? Number((this.tt_sales_compare / this.tt_transactions_compare).toFixed(0)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_loy_conver_compare = this.tt_loyal_visits_nt_compare > 0 ? Number(((this.loyal_purchased_compare / this.tt_loyal_visits_nt_compare) * 100).toFixed(2)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_loy_tran_compare = this.tt_transactions_compare > 0 ? Number(((this.loyal_purchased_compare / this.tt_transactions_compare) * 100).toFixed(2)) : 0;

                    // tslint:disable-next-line: max-line-length
                    this.tt_loyal_visits_compare = this.total_shopper_visits_compare > 0 ? Number(((this.tt_loyal_visits_nt_compare / this.total_shopper_visits_compare) * 100).toFixed(2)) : 0;
                    this.tt_missed_loyal_compare = Number(this.tt_loy_conver_compare) > 0 ? 100 - Number(this.tt_loy_conver_compare) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_conver_compare = this.total_shopper_visits_compare > 0 ? Number(((this.tt_transactions_compare / this.total_shopper_visits_compare) * 100).toFixed(2)) : 0;

                    // tslint:disable-next-line: max-line-length
                    this.tt_sales_yeild_compare = this.total_shopper_visits_compare > 0 ? Number((this.tt_sales_compare / this.total_shopper_visits_compare).toFixed(0)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_shopper_on_sh_compare = this.tt_sales_hour_compare > 0 ? Number((this.total_shopper_visits_compare / this.tt_sales_hour_compare).toFixed(2)) : 0;
                    // tslint:disable-next-line: max-line-length
                    this.tt_sales_on_sh_compare = this.tt_sales_hour_compare > 0 ? Number((this.tt_sales / this.tt_sales_hour_compare).toFixed(2)) : 0;

                    this.tt_cx_index_compare = Number((this.tt_cx_index_compare / row2).toFixed(2));
                    this.tt_nps_index_compare = Number((this.tt_nps_index_compare / row2).toFixed(2));
                    if (chart_xAxis.length > 0) {
                        this.show_label_table = chart_xAxis[0] + ' - ' + chart_xAxis[chart_xAxis.length - 1];
                    }
                    this.chart1(chart_xAxis, num_to_enter, num_to_enter_compare, avg_time, avg_time_compare, traffic, traffic_compare,
                        passer_by, passer_by_compare, shopper_visits, shopper_visits_compare, kids_visits, kids_visits_compare, turn_rate,
                        turn_rate_compare, conversion, conversion_compare, atv, atv_compare, avg_item, avg_item_compare, sales_yield,
                        sales_yield_compare, transactions, transactions_compare, sales, sales_compare, missed_sales, missed_sales_compare,
                        loyal_visits, loyal_visits_compare, loyal_transactions, loyal_transactions_compare, loyal_conversion,
                        loyal_conversion_compare, miss_loyal_conversion, miss_loyal_conversion_compare,
                        cx_index, cx_index_compare, nps_index, nps_index_compare, sales_hour, sales_hour_compare, shopper_on_sh,
                        shopper_on_sh_compare, sales_on_s_h, sales_on_s_h_compare);
                    let save_data;
                    if (this.time_value !== '' && this.time_value_compare !== '') {
                        const data_2 = {
                            organization_id: this.organization_id
                            , site_id: this.site_id
                            , start_time: this.start_time
                            , end_time: this.end_time
                            , time_value: this.time_value
                            , view_by: this.viewDataBy
                            , time_value_compare: this.time_value_compare
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

    reset_to_zero(...array) {
        array.forEach(element => { this[element] = 0; });
    }

    get_data_right_more(data1, data2) {
        let chart_data: { [k: string]: any } = {};
        data1.forEach((element, index) => {
            if (data2[index]) {
                chart_data = data2[index];
                // console.log('chart_data' + index, chart_data['time_period']);
                if (this.viewDataBy !== 'Hour') {
                    const time_old = chart_data['time_period'];
                    delete chart_data['time_period'];
                    chart_data['time_period'] = time_old + ' / ' + element.time_period;
                }
            } else {
                chart_data = {
                    time_period: element.time_period,
                    avg_time: null,
                    id: null,
                    num_to_enter: null,
                    num_to_exit: null,
                    traffic: null,
                    avg_item: null,
                    sales: null,
                    transactions: null,
                    conversion: null,
                    atv: null,
                    kids_visits: null,
                    loyal_conversion: null,
                    loyal_transactions: null,
                    loyal_visits: null,
                    missed_sales: null,
                    passer_by: null,
                    sales_compare: null,
                    sales_yield: null,
                    shopper_visits: null,
                    missed_loyal: null,
                    turn_in_rate: null,
                    cx_index: null,
                    nps_index: null,
                    sales_hour: null,
                    shopper_on_sh: null,
                    sales_on_s_h: null,
                };
            }
            chart_data.num_to_enter_compare = element.num_to_enter;
            chart_data.traffic_compare = element.traffic;
            chart_data.avg_time_compare = element.avg_time;
            chart_data.avg_item_compare = element.avg_item;
            chart_data.sales_compare = element.sales;
            chart_data.transactions_compare = element.transactions;
            chart_data.conversion_compare = element.conversion;
            chart_data.atv_compare = element.atv;
            chart_data.kids_visits_compare = element.kids_visits;
            chart_data.loyal_conversion_compare = element.loyal_conversion;
            chart_data.loyal_transactions_compare = element.loyal_transactions;
            chart_data.loyal_visits_compare = element.loyal_visits;
            chart_data.missed_sales_compare = element.missed_sales;
            chart_data.passer_by_compare = element.passer_by;
            chart_data.sales_yield_compare = element.sales_yield;
            chart_data.shopper_visits_compare = element.shopper_visits;
            chart_data.turn_in_rate_compare = element.turn_in_rate;
            chart_data.missed_loyal_compare = Number(element.loyal_conversion) > 0 ? Number(100 - (Number(element.loyal_conversion))) : 0;
            chart_data.cx_index_compare = element.cx_index;
            chart_data.nps_index_compare = element.nps_index;
            chart_data.sales_hour_compare = element.sales_hour;
            chart_data.shopper_on_sh_compare = element.shopper_on_s_h;
            chart_data.sales_on_s_h_compare = element.sales_on_s_h;
            this.chart_data.push(chart_data);
        });
    }

    get_data_left_more(data1, data2) {
        let chart_data: { [k: string]: any } = {};
        data1.forEach((element, index) => {
            chart_data = data1[index];
            if (data2[index]) {
                if (this.viewDataBy !== 'Hour') {
                    const time_data_compa = data2[index]['time_period'];
                    const time_data = element.time_period;
                    delete chart_data['time_period'];
                    chart_data['time_period'] = time_data + ' / ' + time_data_compa;
                    chart_data['num_to_enter_compare'] = data2[index].num_to_enter;
                    chart_data['traffic_compare'] = data2[index].traffic;
                    chart_data['avg_time_compare'] = data2[index].avg_time;
                    chart_data['avg_item_compare'] = data2[index].avg_item;
                    chart_data['sales_compare'] = data2[index].sales;
                    chart_data['transactions_compare'] = data2[index].transactions;
                    chart_data['conversion_compare'] = data2[index].conversion;
                    chart_data['atv_compare'] = data2[index].atv;
                    chart_data['kids_visits_compare'] = data2[index].kids_visits;
                    chart_data['loyal_conversion_compare'] = data2[index].loyal_conversion;
                    chart_data['loyal_transactions_compare'] = data2[index].loyal_transactions;
                    chart_data['loyal_visits_compare'] = data2[index].loyal_visits;
                    chart_data['missed_sales_compare'] = data2[index].missed_sales;
                    chart_data['passer_by_compare'] = data2[index].passer_by;
                    chart_data['sales_yield_compare'] = data2[index].sales_yield;
                    chart_data['sales_hour_compare'] = data2[index].sales_hour;
                    chart_data['shopper_on_s_h_compare'] = data2[index].shopper_on_s_h;
                    chart_data['sales_on_s_h_compare'] = data2[index].sales_on_s_h;
                    chart_data['shopper_visits_compare'] = data2[index].shopper_visits;
                    chart_data['turn_in_rate_compare'] = data2[index].turn_in_rate;
                    // tslint:disable-next-line:max-line-length
                    chart_data['missed_loyal_compare'] = Number(data2[index].loyal_conversion) > 0 ? Number(100 - (Number(data2[index].loyal_conversion))) : 0;
                    chart_data['cx_index_compare'] = data2[index].cx_index;
                    chart_data['nps_index_compare'] = data2[index].nps_index;
                }
            } else {
                chart_data['num_to_enter_compare'] = null;
                chart_data['traffic_compare'] = null;
                chart_data['avg_time_compare'] = null;
                chart_data['avg_item_compare'] = null;
                chart_data['sales_compare'] = null;
                chart_data['transactions_compare'] = null;
                chart_data['conversion_compare'] = null;
                chart_data['atv_compare'] = null;
                chart_data['kids_visits_compare'] = null;
                chart_data['loyal_conversion_compare'] = null;
                chart_data['loyal_transactions_compare'] = null;
                chart_data['loyal_visits_compare'] = null;
                chart_data['missed_sales_compare'] = null;
                chart_data['passer_by_compare'] = null;
                chart_data['sales_yield_compare'] = null;
                chart_data['sales_hour_compare'] = null;
                chart_data['shopper_on_s_h_compare'] = null;
                chart_data['sales_on_s_h_compare'] = null;
                chart_data['shopper_visits_compare'] = null;
                chart_data['turn_in_rate_compare'] = null;
                chart_data['missed_loyal_compare'] = null;
                chart_data['cx_index_compare'] = null;
                chart_data['nps_index_compare'] = null;
            }
            this.chart_data.push(chart_data);
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

    exportExcel(): void {
        const data = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , start_time: '\'' + this.start_time + '\''
            , end_time: '\'' + this.end_time + '\''
            , start_date: this.start_date
            , end_date: this.end_date
            , view_by: this.viewDataBy
            , start_date_compare: this.start_date_compare
            , end_date_compare: this.end_date_compare
            , indexOptionSelected: this.indexOptionSelected
        };
        this.blockUI.start(this.language.dang_xuat_bao_cao);
        // tslint:disable-next-line:max-line-length
        this.appservice.post(data, environment.PERFORMANCE.API.sp_footfall_performance + '_time_comparison_export_excel').subscribe(fileData => {
            window.open(this.url_api + fileData);
            this.name_of_excel = fileData;
            if (!environment.production) { console.log('Successed'); }
        }, (error) => {
            this.blockUI.stop();
        }, () => {
            this.blockUI.stop();
            const data2 = { name_of_excel: this.name_of_excel };
            const url = environment.FBA.API.export_metrics_analytic + '_delete_excel';
            this.appservice.post(data2, url).subscribe(res => {
                if (!environment.production) { console.log('Deleted'); }
            });
        }
        );
    }

    type_chart() {
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
            || this.indexOptionSelected === this.indexess.cx_index || this.indexOptionSelected === this.indexess.nps_index
            || this.indexOptionSelected === this.indexess.sales_hours
            || this.indexOptionSelected === this.indexess.shoppers_on_sales_hour) {
            this.checked = true;
        } else {
            this.checked = false;
        }
        return this.checked;
    }


    chart1(chart_xAxis, num_to_enter, num_to_enter_compare, avg_time, avg_time_compare, traffic, traffic_compare,
        passer_by, passer_by_compare, shopper_visits, shopper_visits_compare, kids_visits, kids_visits_compare, turn_in_rate,
        turn_in_rate_compare,
        conversion, conversion_compare, atv, atv_compare, avg_item, avg_item_compare, sales_yield, sales_yield_compare,
        transactions, transactions_compare, sales, sales_compare, missed_sales, missed_sales_compare, loyal_visits, loyal_visits_compare,
        loyal_transactions, loyal_transactions_compare, loyal_conversion, loyal_conversion_compare, miss_loyal_conversion,
        miss_loyal_conversion_compare, cx_index, cx_index_compare, nps_index, nps_index_compare, sales_hour,
        sales_hour_compare, shopper_on_sh, shopper_on_sh_compare, sales_on_s_h, sales_on_s_h_compare
    ) {
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
        })(Hightcharts);
        Hightcharts.chart(this.container1.nativeElement, {
            chart: { height: 500, style: { fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif !important;', } },
            title: { text: '' },
            subtitle: {
                useHTML: true, align: 'left', y: 0,
                text: ' '
            },
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
            xAxis: [{
                labels: { rotation: -45, style: { fontSize: '90%', fontFamily: 'Roboto, sans-serif' } },
                categories: chart_xAxis,
            }],
            yAxis: [
                {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.visits } },
                    allowDecimals: false, title: { text: this.indexes.visitors, style: { color: color.visits, fontWeight: 'bold' } },
                    visible: select === this.indexess.visitors, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.traffic_flow } },
                    allowDecimals: false, title: {
                        text: this.indexes.traffic_flow,
                        style: { color: color.traffic_flow, fontWeight: 'bold' }
                    },
                    visible: select === this.indexess.traffic_flow, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.passer_by } },
                    allowDecimals: false, title: { text: this.indexes.passerby, style: { color: color.passer_by, fontWeight: 'bold' } },
                    visible: select === this.indexess.passerby, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    labels: {
                        formatter() { return this.axis.defaultLabelFormatter.call(this); },
                        style: { color: color.shopper_visits }
                    },
                    allowDecimals: false, title: {
                        text: this.indexes.shoppers,
                        style: { color: color.shopper_visits, fontWeight: 'bold' }
                    },
                    visible: select === this.indexess.shoppers, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    labels: {
                        formatter() { return this.axis.defaultLabelFormatter.call(this); },
                        style: { color: color.kids_visits }
                    },
                    allowDecimals: false, title: {
                        text: this.indexes.kids_visitors,
                        style: { color: color.kids_visits, fontWeight: 'bold' }
                    },
                    visible: select === this.indexess.kids_visitors, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.turn_in_rate } },
                    title: { text: this.indexes.turn_in_rate, style: { color: color.turn_in_rate, fontWeight: 'bold' } },
                    visible: select === this.indexess.turn_in_rate, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
                }, {
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.avg_time } },
                    title: { text: this.indexes.avg_time + this.language.min, style: { color: color.avg_time, fontWeight: 'bold' } },
                    visible: select === this.indexess.avg_time, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
                }, {
                    title: { text: this.indexes.conversion_rate, style: { color: color.conversion, fontWeight: 'bold' } },
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.conversion, } },
                    visible: select === this.indexess.conversion_rate, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
                }, {
                    title: { text: this.indexes.atv, style: { color: color.atv, fontWeight: 'bold' } }, allowDecimals: false,
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter: function () { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.atv, } },
                    visible: select === this.indexess.atv, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.avg_items, style: { color: color.items, fontWeight: 'bold' } }, allowDecimals: false,
                    // tslint:disable-next-line:max-line-length
                    labels: {
                        formatter: function () { return this.axis.defaultLabelFormatter.call(this); },
                        style: { color: color.items, }
                    },
                    visible: select === this.indexess.avg_items, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.sales_yield, style: { color: color.sales_yield, fontWeight: 'bold' } },
                    allowDecimals: false,
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.sales_yield, } },
                    maxPadding: 0, minPadding: 0, min: 0, visible: select === this.indexess.sales_yield,
                }, {
                    title: { text: this.indexes.transactions, style: { color: color.customers, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.customers, } },
                    visible: select === this.indexess.transactions, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.sales, style: { color: color.sales, fontWeight: 'bold' } }, allowDecimals: false,
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter: function () { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.sales, } },
                    visible: select === this.indexess.sales, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.missed_sales_opportunity, style: { color: color.missed_sales, fontWeight: 'bold' } },
                    // tslint:disable-next-line:max-line-length
                    allowDecimals: false, labels: { formatter: function () { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.missed_sales, } },
                    visible: select === this.indexess.missed_sales_opportunity, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.sales_hours, style: { color: color.sales_hour, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { format: '{value} ', style: { color: color.sales_hour, } }, visible: select === this.indexess.sales_hours,
                    maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.shoppers_on_sales_hour, style: { color: color.shopper_on_sh, fontWeight: 'bold' } },
                    labels: { format: '{value} ', style: { color: color.shopper_on_sh, } },
                    maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false, visible: select === this.indexess.shoppers_on_sales_hour,
                }, {
                    title: { text: this.indexes.sales_on_sales_hour, style: { color: color.sales_on_s_h, fontWeight: 'bold' } },
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.sales_on_s_h, } },
                    visible: select === this.indexess.sales_on_sales_hour, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
                }, {
                    title: { text: this.indexes.member_visitors, style: { color: color.loyal_visits, fontWeight: 'bold' } },
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.loyal_visits, } },
                    visible: select === this.indexess.member_visitors, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
                }, {
                    title: { text: this.indexes.member_transactions, style: { color: color.loyal_transactions, fontWeight: 'bold' } },
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.loyal_transactions, } },
                    allowDecimals: false, visible: select === this.indexess.member_transactions, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.member_conversion_rate, style: { color: color.loyal_conversion, fontWeight: 'bold' } },
                    // tslint:disable-next-line:max-line-length
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.loyal_conversion, } },
                    allowDecimals: false, visible: select === this.indexess.member_conversion_rate,
                }, {
                    title: { text: this.indexes.missed_member_rate, style: { color: color.missed_loyal, fontWeight: 'bold' } },
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.missed_loyal, } },
                    visible: select === this.indexess.missed_member_rate, maxPadding: 0, minPadding: 0, min: 0, allowDecimals: false,
                }, {
                    title: { text: this.indexes.cx_index, style: { color: color.cxindex, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.cxindex, } },
                    visible: select === this.indexess.cx_index, maxPadding: 0, minPadding: 0, min: 0,
                }, {
                    title: { text: this.indexes.nps_index, style: { color: color.npsindex, fontWeight: 'bold' } }, allowDecimals: false,
                    labels: { formatter() { return this.axis.defaultLabelFormatter.call(this); }, style: { color: color.npsindex, } },
                    visible: select === this.indexess.nps_index, maxPadding: 0, minPadding: 0,
                },
            ],
            series: [
                {
                    // tslint:disable-next-line:max-line-length
                    name: this.indexes.visitors, color: color.visits, type: selft.type_chart(), yAxis: 0, data: num_to_enter, // tooltip: { valueSuffix: ' lượt' }
                    showInLegend: select === this.indexess.visitors, visible: select === this.indexess.visitors, selected: selft.selectd(),
                }, {
                    name: this.indexes.visitors + this.language.Compared, color: color.compare, type: selft.type_chart(), yAxis: 0,
                    data: num_to_enter_compare,
                    showInLegend: select === this.indexess.visitors, visible: select === this.indexess.visitors, selected: selft.selectd(),
                }, {
                    name: this.indexes.passerby, color: color.passer_by, type: selft.type_chart(), yAxis: 2, data: passer_by,
                    showInLegend: select === this.indexess.passerby, visible: select === this.indexess.passerby, selected: selft.selectd(),
                }, {
                    name: this.indexes.passerby + this.language.Compared, color: color.compare,
                    type: selft.type_chart(), yAxis: 2, data: passer_by_compare,
                    showInLegend: select === this.indexess.passerby, visible: select === this.indexess.passerby, selected: selft.selectd(),
                }, {
                    name: this.indexes.shoppers, color: color.shopper_visits, type: selft.type_chart(), yAxis: 3, data: shopper_visits,
                    showInLegend: select === this.indexess.shoppers, visible: select === this.indexess.shoppers, selected: selft.selectd(),
                }, {
                    name: this.indexes.shoppers + this.language.Compared, color: color.compare,
                    type: selft.type_chart(), data: shopper_visits_compare,
                    showInLegend: select === this.indexess.shoppers, visible: select === this.indexess.shoppers,
                    selected: selft.selectd(), yAxis: 3,
                }, {
                    name: this.indexes.traffic_flow, color: color.traffic_flow, type: selft.type_chart(), yAxis: 1, data: traffic,
                    showInLegend: select === this.indexess.traffic_flow,
                    visible: select === this.indexess.traffic_flow, selected: selft.selectd(),
                }, {
                    name: this.indexes.traffic_flow + this.language.Compared, color: color.compare,
                    type: selft.type_chart(), data: traffic_compare,
                    showInLegend: select === this.indexess.traffic_flow, visible: select === this.indexess.traffic_flow,
                    selected: selft.selectd()
                    , yAxis: 1,
                }, {
                    name: this.indexes.kids_visitors, color: color.kids_visits,
                    type: selft.type_chart(), yAxis: 4, data: kids_visits,
                    showInLegend: select === this.indexess.kids_visitors, visible: select === this.indexess.kids_visitors,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.kids_visitors + this.language.Compared, color: color.compare, type: selft.type_chart(), yAxis: 4,
                    data: kids_visits_compare,
                    showInLegend: select === this.indexess.kids_visitors, visible: select === this.indexess.kids_visitors,
                    selected: selft.selectd(),
                }, {

                    name: this.indexes.turn_in_rate, color: color.turn_in_rate, type: selft.type_chart(), yAxis: 5,
                    data: turn_in_rate,
                    showInLegend: select === this.indexess.turn_in_rate, visible: select === this.indexess.turn_in_rate,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.turn_in_rate + this.language.Compared + ' (%)', color: color.compare,
                    type: selft.type_chart(), yAxis: 5,
                    showInLegend: select === this.indexess.turn_in_rate, visible: select === this.indexess.turn_in_rate,
                    selected: selft.selectd(),
                    data: turn_in_rate_compare,
                }, {
                    name: this.indexes.avg_time + this.language.min, color: color.avg_time, type: 'spline', selected: selft.selectd(),
                    yAxis: 6, data: avg_time,
                    // tslint:disable-next-line:max-line-length
                    tooltip: { pointFormatter: function () { const point1 = this; return '<span style="color:' + point1.color + '">\u25CF</span> ' + point1.series.name + ': <b>' + selft.toHHMMSS(point1.y * 60) + '</b><br/>'; } },
                    showInLegend: select === this.indexess.avg_time, visible: select === this.indexess.avg_time,
                }, {
                    name: this.indexes.avg_time + this.language.Compared + this.language.min, color: color.compare,
                    type: 'spline', yAxis: 6, data: avg_time_compare, selected: selft.selectd(),
                    // tslint:disable-next-line:max-line-length
                    tooltip: { pointFormatter: function () { const point2 = this; return '<span style="color:' + point2.color + '">\u25CF</span> ' + point2.series.name + ': <b>' + selft.toHHMMSS(point2.y * 60) + '</b><br/>'; } },
                    showInLegend: select === this.indexess.avg_time, visible: select === this.indexess.avg_time,
                }, {
                    name: this.indexes.conversion_rate, color: color.conversion, type: selft.type_chart(), yAxis: 7, data: conversion,
                    showInLegend: select === this.indexess.conversion_rate, visible: select === this.indexess.conversion_rate,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.conversion_rate + this.language.Compared + ' (%)', color: color.compare, type: selft.type_chart(),
                    yAxis: 7, selected: selft.selectd(),
                    data: conversion_compare, showInLegend: select === this.indexess.conversion_rate,
                    visible: select === this.indexess.conversion_rate
                }, {
                    name: this.indexes.atv, color: color.atv, type: selft.type_chart(), yAxis: 8, data: atv,
                    showInLegend: select === this.indexess.atv, visible: select === this.indexess.atv, selected: selft.selectd(),
                }, {
                    name: this.indexes.atv + this.language.Compared, color: color.compare, type: selft.type_chart(),
                    yAxis: 8, data: atv_compare,
                    showInLegend: select === this.indexess.atv, visible: select === this.indexess.atv, selected: selft.selectd(),
                }, {
                    name: this.indexes.avg_items, color: color.items, type: selft.type_chart(), yAxis: 9, data: avg_item,
                    showInLegend: select === this.indexess.avg_items, visible: select === this.indexess.avg_items,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.avg_items + this.language.Compared, color: color.compare, type: selft.type_chart(),
                    yAxis: 9, data: avg_item_compare,
                    showInLegend: select === this.indexess.avg_items, visible: select === this.indexess.avg_items,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.sales_yield, color: color.sales_yield, type: selft.type_chart(), yAxis: 10,
                    data: sales_yield,
                    showInLegend: select === this.indexess.sales_yield, visible: select === this.indexess.sales_yield,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.sales_yield + this.language.Compared, color: color.compare,
                    type: selft.type_chart(),
                    yAxis: 10, data: sales_yield_compare,
                    showInLegend: select === this.indexess.sales_yield, visible: select === this.indexess.sales_yield,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.transactions, color: color.customers, type: selft.type_chart(), yAxis: 11, data: transactions,
                    showInLegend: select === this.indexess.transactions, visible: select === this.indexess.transactions,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.transactions + this.language.Compared, color: color.compare, type: selft.type_chart(),
                    yAxis: 11, data: transactions_compare,
                    showInLegend: select === this.indexess.transactions, visible: select === this.indexess.transactions,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.sales, color: color.sales, type: selft.type_chart(), yAxis: 12, data: sales,
                    showInLegend: select === this.indexess.sales, visible: select === this.indexess.sales, selected: selft.selectd(),
                }, {
                    name: this.indexes.sales + this.language.Compared, color: color.compare, type: selft.type_chart(),
                    yAxis: 12, data: sales_compare,
                    showInLegend: select === this.indexess.sales, visible: select === this.indexess.sales, selected: selft.selectd(),
                }, {
                    name: this.indexes.missed_sales_opportunity, color: color.missed_sales, type: selft.type_chart(), yAxis: 13,
                    showInLegend: select === this.indexess.missed_sales_opportunity, data: missed_sales,
                    visible: select === this.indexess.missed_sales_opportunity, selected: selft.selectd(),
                }, {
                    name: this.indexes.missed_sales_opportunity + this.language.Compared, color: color.compare,
                    type: selft.type_chart(), yAxis: 13,
                    data: missed_sales_compare, showInLegend: select === this.indexess.missed_sales_opportunity,
                    visible: select === this.indexess.missed_sales_opportunity, selected: selft.selectd(),
                }, {
                    name: this.indexes.sales_hours, color: color.sales_hour, showInLegend: select === this.indexess.sales_hours,
                    type: selft.type_chart(), yAxis: 14, data: sales_hour, visible: select === this.indexess.sales_hours,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.sales_hours + this.language.Compared, color: color.compare,
                    showInLegend: select === this.indexess.sales_hours, selected: selft.selectd(),
                    type: selft.type_chart(), yAxis: 14, data: sales_hour_compare, visible: select === this.indexess.sales_hours,
                }, {
                    name: this.indexes.shoppers_on_sales_hour, color: color.shopper_on_sh,
                    type: selft.type_chart(), yAxis: 15, data: shopper_on_sh, visible: select === this.indexess.shoppers_on_sales_hour,
                    selected: selft.selectd(), showInLegend: select === this.indexess.shoppers_on_sales_hour,
                }, {
                    name: this.indexes.shoppers_on_sales_hour + this.language.Compared, color: color.compare,
                    type: selft.type_chart(), yAxis: 15, data: shopper_on_sh_compare,
                    visible: select === this.indexess.shoppers_on_sales_hour,
                    selected: selft.selectd(), showInLegend: select === this.indexess.shoppers_on_sales_hour,
                }, {
                    name: this.indexes.sales_on_sales_hour, color: color.sales_on_s_h,
                    showInLegend: select === this.indexess.sales_on_sales_hour,
                    type: selft.type_chart(), yAxis: 16, data: sales_on_s_h, visible: select === this.indexess.sales_on_sales_hour,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.sales_on_sales_hour + this.language.Compared,
                    showInLegend: select === this.indexess.sales_on_sales_hour,
                    type: selft.type_chart(), yAxis: 16, data: sales_on_s_h_compare, visible: select === this.indexess.sales_on_sales_hour,
                    selected: selft.selectd(), color: color.compare,
                }, {
                    name: this.indexes.member_visitors, type: selft.type_chart(), yAxis: 17, data: loyal_visits,
                    showInLegend: select === this.indexess.member_visitors, visible: select === this.indexess.member_visitors,
                    color: color.loyal_visits, selected: selft.selectd(),
                }, {
                    name: this.indexes.member_visitors + this.language.Compared + ' (%)', color: color.compare,
                    type: selft.type_chart(), yAxis: 17,
                    showInLegend: select === this.indexess.member_visitors, visible: select === this.indexess.member_visitors,
                    selected: selft.selectd(), data: loyal_visits_compare,
                }, {
                    name: this.indexes.member_transactions, color: color.loyal_transactions, type: selft.type_chart(), yAxis: 18,
                    data: loyal_transactions, showInLegend: select === this.indexess.member_transactions,
                    visible: select === this.indexess.member_transactions, selected: selft.selectd(),
                }, {
                    name: this.indexes.member_transactions + this.language.Compared + ' (%)', color: color.compare,
                    type: selft.type_chart(), yAxis: 18,
                    data: loyal_transactions_compare, showInLegend: select === this.indexess.member_transactions,
                    visible: select === this.indexess.member_transactions, selected: selft.selectd(),
                }, {
                    name: this.indexes.member_conversion_rate, color: color.loyal_conversion, type: selft.type_chart(), yAxis: 19,
                    data: loyal_conversion, showInLegend: select === this.indexess.member_conversion_rate,
                    visible: select === this.indexess.member_conversion_rate, selected: selft.selectd(),
                }, {
                    name: this.indexes.member_conversion_rate + this.language.Compared + ' (%)', color: color.compare,
                    type: selft.type_chart(), yAxis: 19,
                    data: loyal_conversion_compare, showInLegend: select === this.indexess.member_conversion_rate,
                    visible: select === this.indexess.member_conversion_rate, selected: selft.selectd(),
                }, {
                    name: this.indexes.missed_member_rate, color: color.missed_loyal, type: selft.type_chart(), yAxis: 20,
                    data: miss_loyal_conversion, showInLegend: select === this.indexess.missed_member_rate,
                    visible: select === this.indexess.missed_member_rate, selected: selft.selectd(),
                }, {
                    name: this.indexes.missed_member_rate + this.language.Compared + ' (%)', color: color.compare,
                    type: selft.type_chart(), yAxis: 20,
                    data: miss_loyal_conversion_compare, showInLegend: select === this.indexess.missed_member_rate,
                    visible: select === this.indexess.missed_member_rate, selected: selft.selectd(),
                }, {
                    name: this.indexes.cx_index, color: color.cxindex, type: selft.type_chart(), yAxis: 21, data: cx_index,
                    showInLegend: select === this.indexess.cx_index, visible: select === this.indexess.cx_index, selected: selft.selectd(),
                }, {
                    name: this.indexes.cx_index + this.language.Compared + ' (%)', color: color.compare,
                    type: selft.type_chart(), yAxis: 21,
                    data: cx_index_compare,
                    showInLegend: select === this.indexess.cx_index, visible: select === this.indexess.cx_index, selected: selft.selectd(),
                }, {
                    name: this.indexes.nps_index, color: color.npsindex, type: selft.type_chart(),
                    yAxis: 22, data: nps_index,
                    showInLegend: select === this.indexess.nps_index, visible: select === this.indexess.nps_index,
                    selected: selft.selectd(),
                }, {
                    name: this.indexes.nps_index + this.language.Compared + ' (%)', color: color.compare,
                    type: selft.type_chart(), yAxis: 22,
                    data: nps_index_compare,
                    showInLegend: select === this.indexess.nps_index, visible: select === this.indexess.nps_index,
                    selected: selft.selectd(),
                }
            ]
        });
    }

    remove_percent(index_name) {
        return index_name.replace('(%)', '');
    }


    change_view() {
        this.get_data();
    }
}
