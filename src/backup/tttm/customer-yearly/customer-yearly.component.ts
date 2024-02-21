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
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
import { indexes } from '../../../list_index';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { StoreReportingFFScheduleComponent } from '../../useremailmodule/footfall/storereporting/storereporting.component';
import { NotifierService } from 'angular-notifier';
More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);
declare var $;
declare function intDateRangePicker_yearly_viewchild(start_date): any;
@Component({
    templateUrl: 'customer-yearly.component.html',
    styleUrls: ['customer-yearly.component.scss'],
    // encapsulation: ViewEncapsulation.None
})
export class FootfallCustomerYearlyComponent implements OnInit {
    @ViewChild(StoreReportingFFScheduleComponent) scheduleComponent: StoreReportingFFScheduleComponent;
    defaultModule = 1;
    @ViewChild(TimeperiodComponent) TimeInput: TimeperiodComponent;
    @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
    @ViewChild('content') public helloTemplate: ElementRef;
    private notifier: NotifierService;
    page_id = environment.Pages.footfall.customer_yearly;
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    organization_array: Array<IOption>;
    organization_id: string;
    siteSelectionDisplay = false;
    site_id: any;
    // * Site tree by organizations */
    start_date: any;
    style_start_date: any;
    end_date: any;
    // thoi gian start-end
    start_time: any;
    end_time: any;
    startTimeOption: Array<IOption>;
    endTimeOption: Array<IOption>;
    total_num_to_enter = 0;
    total_num_to_exit = 0;
    avg_traffic = 0;
    total_traffic = 0;
    total_passer_by = 0;
    total_shopper_visits = 0;
    total_ins = 0;
    viewDataBy = 'Month';
    sidebarMinimized = true;
    element: HTMLElement = document.body;
    time_period_array: any;
    menu_tree: any;
    parent_store: any;
    data: any;
    duLieuChiTiet: any[] = [];
    duLieuTongVaoCacCua: any[] = [];
    duLieuTongRaCacCua: any[] = [];
    duLieuTrungBinhCacCua: any[] = [];
    duLieuThuTuCacCua: any[] = [];
    show_label_table: string;
    btnApplyValid = false;
    // indexOption: Array<IOption>;
    // indexOptionSelected: string;
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
    total_kids = 0;
    total_turn_rate = 0; total_seconds = 0;
    type: string;
    checked: boolean;
    indexes: any; index_viewby = 1; show_error = false;
    public modalRef: BsModalRef;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    chilld_store: any;
    constructor(private router: Router,
        private appservice: AppService,
        private modalService: BsModalService
        , notifierService: NotifierService) {
        this.notifier = notifierService;
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
        this.indexes = indexes;
    }
    url_api = environment.apiUrl + 'exports/';
    name_of_excel: any; language: any;


    ngOnInit() {
        this.get_page_param();
        intDateRangePicker_yearly_viewchild(Number(new Date()));
        const self = this;
        $(function () {
            $('#startDateReportTemp').change(function () {
                console.log('Đã chọn lịch ');
                self.date_ranger_event();
            });
        });
    }
    date_ranger_event() {
        // this.start_date = (document.getElementById('startDateReportTemp') as HTMLInputElement).value
        //     ? (document.getElementById('startDateReportTemp') as HTMLInputElement).value : this.start_date;
        const selected_date = (document.getElementById('startDateReportTemp') as HTMLInputElement).value
            ? (document.getElementById('startDateReportTemp') as HTMLInputElement).value : '';

        if (selected_date != null) {
            const _date_S = new Date(selected_date);
            const firstDay = new Date(_date_S.getFullYear(), _date_S.getMonth(), 1);
            const lastDay = new Date(_date_S.getFullYear(), _date_S.getMonth() + 1, 0);
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(firstDay) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(lastDay) + '\'';
        }
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
        if (!environment.production) {
            console.log('site_id of report automatic', this.site_id);
        }
        const dataFromParent = {
            organization_id: this.organization_id
            , site_id: Number(this.site_id)
            , start_time: this.start_time
            , end_time: this.end_time
            , view_by: this.viewDataBy
        };

        const indexViewBy = 4;
        this.scheduleComponent.getParametter(dataFromParent, indexViewBy);
    }
    reCheckExistParams() {
        const dataFromParent = {
            organization_id: this.organization_id
            , site_id: Number(this.site_id)
            , start_time: this.start_time
            , end_time: this.end_time
            , view_by: this.viewDataBy
        };
        const indexViewBy = 4;
        this.scheduleComponent.getParametter(dataFromParent, indexViewBy);
    }
    // end chilren

    get_page_param() {
        this.blockUI.start(this.language.dang_tai_cau_hinh);
        const time_on_now = new Date();
        this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
            param => {
                if (!environment.production) {
                    console.log('get_user_page_parametter', param);
                }
                try {
                    let para = null;
                    if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
                        para = param.user_page_parametter;
                    } else {
                        const defaultOrgId = param.organization_arr.length > 0 ? param.organization_arr[0].value : 6;
                        para = this.set_default(defaultOrgId);
                    }
                    this.organization_array = param.organization_arr;
                    this.startTimeOption = param.start_time_list;
                    this.endTimeOption = param.end_time_list;
                    this.organization_id = para.organization_id;
                    if ('site_id' in para) {
                        this.site_id = para.site_id;
                    }
                    this.start_time = para.start_time.replace(/[']/g, '');
                    this.end_time = para.end_time.replace(/[']/g, '');
                    if (para.start_date && para.end_date) {
                        this.start_date = para.start_date;
                        const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                        intDateRangePicker_yearly_viewchild(Number(start_d));
                        this.end_date = para.end_date;
                        if (start_d.getFullYear() === time_on_now.getFullYear()) {
                            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
                            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
                        }
                    } else {
                        this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
                        this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
                        intDateRangePicker_yearly_viewchild(Number(time_on_now));
                    }
                    const start_date = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                    this.style_start_date = new Date(start_date);
                    this.get_sitetree();
                } catch (error) {
                    this.blockUI.stop();
                }
            }, (error) => {
                this.show_error = true;
                this.blockUI.stop();
            }, () => {
                // this.blockUI.stop();
            }
        );
    }

    set_default(defaultOrgId: any) {
        const organization_id = this.userinfo.organization_id === '0' ? defaultOrgId : Number(this.userinfo.organization_id);
        return {
            organization_id: organization_id
            // , site_id: 0
            , start_time: '00:00'
            , end_time: '23:59'
            , time_value: 'today'
            , operation: 'sum'
            , view_by: 'Hour'
            // , indexOptionSelected: value_index

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
    reset__array_to_null(...array) {
        array.forEach(element => {
            this[element] = [];
        });
    }

    chuyen_so_sang_ten_thang(i: number) {
        let months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        if (this.type_language === 'vn') {
            months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        }
        return months[i - 1];
    }

    get_data() {
        this.blockUI.start(this.language.dang_tai_du_lieu);
        const data = {
            organization_id: this.organization_id
            , site_id: Number(this.site_id)
            , start_time: '\'' + this.start_time + '\''
            , end_time: '\'' + this.end_time + '\''
            , start_date: this.start_date
            , end_date: this.start_date
        };
        if (!environment.production) {
            console.log('data', data);
        }
        this.time_generate_report = new Date();
        const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
        this.style_start_date = new Date(start_d);
        this.appservice.post(data, environment.API.sp_report_poc_raw_data_by_year).subscribe(
            res => {
                try {
                    this.data = res; // data cho bảng
                    if (!environment.production) {
                        console.log('this.data', this.data);
                    }
                    this.reset_to_zero('total_num_to_enter', 'total_num_to_exit', 'avg_traffic');
                    // tslint:disable-next-line: max-line-length
                    this.reset__array_to_null('duLieuChiTiet', 'duLieuTongVaoCacCua', 'duLieuTongRaCacCua', 'duLieuTrungBinhCacCua', 'duLieuThuTuCacCua');
                    // try {
                    this.total_ins = 0;
                    this.data.forEach(element => {

                        let item = this.duLieuChiTiet.find(o => o.time_period === element.time_period);
                        if (item === undefined) {
                            const ins = new Array(this.chilld_store.length + 1);
                            for (let i = 0; i < ins.length; i++) {
                                ins[i] = null;
                            }
                            const outs = new Array(this.chilld_store.length + 1);
                            for (let i = 0; i < outs.length; i++) {
                                outs[i] = null;
                            }
                            item = {
                                'time_period': element.time_period,
                                'ins': ins,
                                'outs': outs,
                            };
                            this.duLieuChiTiet.push(item);
                        }
                        for (const i in this.chilld_store) {
                            if (this.chilld_store[i].id === element.site_id) {
                                item.ins[i] = element.num_to_enter;
                                if (element.num_to_enter !== null) {
                                    if (item.ins[this.chilld_store.length] !== null) {
                                        // tslint:disable-next-line: max-line-length
                                        item.ins[this.chilld_store.length] = Number(item.ins[this.chilld_store.length]) + Number(element.num_to_enter);
                                    } else {
                                        item.ins[this.chilld_store.length] = Number(element.num_to_enter);
                                    }
                                }
                                item.outs[i] = element.num_to_exit;
                                if (element.num_to_exit !== null) {
                                    if (item.outs[this.chilld_store.length] !== null) {
                                        // tslint:disable-next-line: max-line-length
                                        item.outs[this.chilld_store.length] = Number(item.outs[this.chilld_store.length]) + Number(element.num_to_exit);
                                    } else {
                                        item.outs[this.chilld_store.length] = Number(element.num_to_exit);
                                    }
                                }
                            }
                        }


                    });

                    this.duLieuTongVaoCacCua = new Array(this.chilld_store.length + 1);
                    for (let i = 0; i < this.duLieuTongVaoCacCua.length; i++) {
                        this.duLieuTongVaoCacCua[i] = null;
                    }
                    this.duLieuTongRaCacCua = new Array(this.chilld_store.length + 1);
                    for (let i = 0; i < this.duLieuTongRaCacCua.length; i++) {
                        this.duLieuTongRaCacCua[i] = null;
                    }
                    this.duLieuTrungBinhCacCua = new Array(this.chilld_store.length + 1);
                    for (let i = 0; i < this.duLieuTrungBinhCacCua.length; i++) {
                        this.duLieuTrungBinhCacCua[i] = null;
                    }
                    this.duLieuThuTuCacCua = new Array(this.chilld_store.length);
                    for (let i = 0; i < this.duLieuThuTuCacCua.length; i++) {
                        this.duLieuThuTuCacCua[i] = null;
                    }
                    // tslint:disable-next-line: forin
                    for (let i = 0; i < this.duLieuTongVaoCacCua.length; i++) {
                        this.duLieuChiTiet.forEach(element => {
                            if (element.ins[i] !== null) {
                                if (this.duLieuTongVaoCacCua[i] === null) {
                                    this.duLieuTongVaoCacCua[i] = Number(element.ins[i]);
                                } else {
                                    this.duLieuTongVaoCacCua[i] = Number(this.duLieuTongVaoCacCua[i]) + Number(element.ins[i]);
                                }
                            }
                        });
                    }

                    // tslint:disable-next-line: forin
                    for (let i = 0; i < this.duLieuTongRaCacCua.length; i++) {
                        this.duLieuChiTiet.forEach(element => {
                            if (element.ins[i] !== null) {
                                if (this.duLieuTongRaCacCua[i] === null) {
                                    this.duLieuTongRaCacCua[i] = Number(element.outs[i]);
                                } else {
                                    this.duLieuTongRaCacCua[i] = Number(this.duLieuTongRaCacCua[i]) + Number(element.outs[i]);
                                }
                            }
                        });
                    }

                    for (let i = 0; i < this.duLieuTrungBinhCacCua.length; i++) {

                        let tt;
                        if (this.duLieuTongVaoCacCua[i] !== null) {
                            tt = Number(this.duLieuTongVaoCacCua[i]);
                        }

                        if (this.duLieuTongRaCacCua[i] !== null) {
                            if (tt === null) {
                                tt = Number(this.duLieuTongRaCacCua[i]);
                            } else {
                                tt = Number(tt) + Number(this.duLieuTongRaCacCua[i]);
                            }
                        }
                        if (tt !== undefined) {
                            this.duLieuTrungBinhCacCua[i] = Number(tt / 2).toFixed(0);
                        }
                    }


                    const duLieuTrungBinhCacCuaTG = new Array();
                    for (let i = 0; i < this.duLieuTrungBinhCacCua.length; i++) {
                        if (this.duLieuTrungBinhCacCua[i] !== null) {
                            const item = duLieuTrungBinhCacCuaTG.find(o => o === this.duLieuTrungBinhCacCua[i]);
                            if (item !== null) {
                                duLieuTrungBinhCacCuaTG.push(this.duLieuTrungBinhCacCua[i]);
                            }
                        }
                    }
                    duLieuTrungBinhCacCuaTG.sort(function (a, b) { return b - a; });

                    for (let i = 0; i < this.duLieuTrungBinhCacCua.length - 1; i++) {
                        if (this.duLieuTrungBinhCacCua[i] !== null) {
                            const index = duLieuTrungBinhCacCuaTG.findIndex(o => o === this.duLieuTrungBinhCacCua[i]);
                            if (index !== null) {
                                this.duLieuThuTuCacCua[i] = index;
                            }
                        }
                    }
                    if (!environment.production) {
                        console.log('duLieuTrungBinhCacCuaTG', duLieuTrungBinhCacCuaTG);
                        console.log('this.duLieuTongVaoCacCua', this.duLieuTongVaoCacCua);
                        console.log('this.duLieuTongRaCacCua', this.duLieuTongRaCacCua);
                        console.log('this.duLieuTrungBinhCacCua', this.duLieuTrungBinhCacCua);
                    }
                    // } catch (error) {
                    //     console.log('ôi lỗi', error);
                    // }

                    this.starttime = this.startTimeOption.find(item => item.value === this.start_time).label;
                    this.endtime = this.endTimeOption.find(item => item.value === this.end_time).label;
                    this.site_name = this.MenuInput.menu_tree.find(item => Number(item.id) === Number(this.site_id)).site_name;

                    this.show_error = false;
                    if (res.hasOwnProperty('status') && res.status === 0) {
                        this.show_error = true;
                        this.blockUI.stop();
                    }
                    this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(data));
                } catch (error) {
                    this.blockUI.stop();
                }
            }, (error) => {
                // this.push_notification();
                this.show_error = true;
                this.blockUI.stop();
            }, () => {
                this.sendParamToChildren();

                this.blockUI.stop();
            }
        );
    }

    groupBy(arr, property) {
        return arr.reduce(function (memo, x) {
            if (!memo[x[property]]) { memo[x[property]] = []; }
            memo[x[property]].push(x);
            return memo;
        }, {});
    }


    lapdulieu(array: any[], id = null, space = 0) {
        array.forEach(element => {
            if (element.parent_id === id) {
                const a_id = element.id;
                this.menu_tree.push({
                    id: element.id
                    , site_name: element.site_name
                    , parent_id: element.parent_id
                    , num_to_enter: element.num_to_enter
                    , num_to_exit: element.num_to_exit
                });
                const scope = space + 1;
                this.lapdulieu(array, a_id, scope);
            }
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
            , site_id: Number(this.site_id)
            , start_time: '\'' + this.start_time + '\''
            , end_time: '\'' + this.end_time + '\''
            , start_date: this.start_date
            , end_date: this.start_date
        };
        this.blockUI.start(this.language.dang_xuat_bao_cao);
        this.appservice.post(data, environment.API.sp_report_poc_raw_data_by_year + '_export_excel').subscribe(fileData => {
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
        this.index_viewby = time_array.order;
        this.time_value = time_value;
    }

    get_sitetree() {
        this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
        const url = environment.API.sites + '_get_site_for_report';
        const data = { organization_id: this.organization_id };
        this.appservice.post(data, url).subscribe(res => {
            // try {
            if (!environment.production) {
                console.log('get_sitetree', res);
            }
            this.menu_tree = res.site_array.slice(0);

            this.tinh_phan_tu_con_trong_menu_cha(this.menu_tree, '0', 0);
            this.parent_store = this.menu_tree.filter(o => o.parent_id === '0').sort(function (a, b) {
                return a.id - b.id;
            });
            this.chilld_store = this.menu_tree.filter(o => o.parent_id !== '0' && o.parent_id !== null).sort(function (a, b) {
                return a.parent_id - b.parent_id;
            });
            if (!environment.production) {
                console.log('menu_tree', this.menu_tree);
                console.log('chilld_store', this.chilld_store);
                console.log('parent_store', this.parent_store);
            }

            if (!this.site_id) {
                this.site_id = this.menu_tree.find(item => Number(item.enables) === 1).id;
            }

            this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
            this.get_data();
            // } catch (error) {
            //     this.blockUI.stop();
            // }
        }, (error) => {
            this.blockUI.stop();
            // this.push_notification();
            this.show_error = true;
        }, () => {
            // this.blockUI.stop();
        });
    }

    tinh_phan_tu_con_trong_menu_cha(array: any[], id = null, space = 0) {
        let si = 1;
        array.forEach(element => {
            if (element.parent_id === id) {
                const scope = si++;
                const a_id = element.id;
                const value = array.find(o => o.id === id);
                value.number = scope;
                this.tinh_phan_tu_con_trong_menu_cha(array, a_id, scope);
            }
        });
    }

    export_xls(element) {
        try {
            const _date_S = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
            const _date_SS = _date_S.getFullYear();

            let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

            tab_text = tab_text + '<x:Name>' + _date_SS + '</x:Name>';

            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

            tab_text = tab_text + '<table   cellspacing=\'1\' cellpadding=\'1\' border=\'1px\'>';
            tab_text = tab_text + document.getElementById(element).innerHTML;
            tab_text = tab_text + '</table></body></html>';

            const data_type = 'data:application/vnd.ms-excel';

            const ua = window.navigator.userAgent;
            const msie = ua.indexOf('MSIE ');

            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                if (window.navigator.msSaveBlob) {
                    const blob = new Blob([tab_text], {
                        type: 'application/csv;charset=utf-8;'
                    });
                    navigator.msSaveBlob(blob, 'Yearly Traffic Report on ' + _date_SS + '.xls');
                }
            } else {
                const downloadLink = document.createElement('a');
                document.body.appendChild(downloadLink);
                downloadLink.href = data_type + ', ' + encodeURIComponent(tab_text);
                downloadLink.download = 'Yearly Traffic Report on ' + _date_SS + '.xls';
                downloadLink.click();
            }
        } catch (error) {
            console.warn('Error! Có lỗi xảy ra');
        }
    }

    // Nghĩa thêm function get emit data
    get_date_from_emit(event) {
        console.log('event', event);
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
            const data = { organization_id: event.organization_id };
            const url = environment.API.sites + '_get_site_for_report';
            this.appservice.post(data, url).subscribe(res => {
                try {
                    // console.log(res);
                    this.menu_tree = res.site_array.slice(0);
                    this.organization_id = event.organization_id;
                    this.site_id = this.menu_tree[0].id;
                    this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);

                    this.tinh_phan_tu_con_trong_menu_cha(this.menu_tree, '0', 0);
                    this.parent_store = this.menu_tree.filter(o => o.parent_id === '0').sort(function (a, b) {
                        return a.id - b.id;
                    });
                    this.chilld_store = this.menu_tree.filter(o => o.parent_id !== '0' && o.parent_id !== null).sort(function (a, b) {
                        return a.parent_id - b.parent_id;
                    });
                    if (!environment.production) {
                        console.log('menu_tree', this.menu_tree);
                        console.log('chilld_store', this.chilld_store);
                        console.log('parent_store', this.parent_store);
                    }

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

    showPopupRegister() {
        this.scheduleComponent.openPopupRegisterAgain();
    }
}
