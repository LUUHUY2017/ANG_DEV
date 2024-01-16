import { IOption } from 'ng-select';

import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// highcharts
import Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import Tree from 'highcharts/modules/treemap';
import Heatmap from 'highcharts/modules/heatmap';
// import router
import { ActivatedRoute } from '@angular/router';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);
// thêm mới dateranger
declare function intDateRangePickerFBA(start_date, end_date): any;
@Component({
    selector: 'app-age-overview',
    templateUrl: './age-overview.component.html',
    styleUrls: [
        './age-overview.component.scss',
        './age-overview.component.css'
    ],
})
export class AgeOverviewComponent implements OnInit, OnDestroy {
    page_id = '\'' + environment.Pages.age.overview + '\'';
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('content') public helloTemplate: ElementRef;
    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    @ViewChild('container2', { read: ElementRef }) container2: ElementRef;
    time_generate_report = new Date();
    public modalRef: BsModalRef;
    // navItems = navItems;
    sidebarMinimized = true;
    element: HTMLElement = document.body;
    name_of_excel: any;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    constructor(private router: Router,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private appservice: AppService) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
    }
    organization_id: number;
    // chọn organization khi load hộp thoại
    snap_menu_tree: any;
    siteSelectionDisplay = false;
    siteSelectionDisplay2 = false;
    locationSelectionDisplay = false;
    start_date: any;
    end_date: any;
    site_id: number;
    style_start_date: any;
    style_end_date: any;

    startTimeOption: Array<IOption>;
    endTimeOption: Array<IOption>;
    startTime: string;
    endTime: string;

    time_period: string;
    time_value: string;
    time_period2: string;
    location: string;

    data: any; data2: any;
    fba_time_period_overview: any;
    menu_tree: any;
    hidden_menu_location = false;
    indexOption: Array<IOption>;
    organization_arr_option: Array<IOption>;
    indexOptionSelected: string;
    /*----------  Giá trị mặc định  ----------*/
    viewDataBy = 'Week';
    Viewhienthi = 'Số lượng';
    has_site: number;
    category_data = [];
    age18 = 0;
    age18_24 = 0; age25_34 = 0; age35_44 = 0; age45_54 = 0;
    age55_64 = 0; age65 = 0; total_age = 0; age_unknown = 0; total_noun = 0;
    female = 0; male = 0; unknown = 0; total_gender = 0;
    url_api = environment.apiUrl + 'exports/';
    interval; language: any; show_error = false;

    ngOnInit() {
        this.get_location_time();
        this.show_menu_location();
        intDateRangePickerFBA(Number(new Date()), Number(new Date()));
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

    get_location_time() {
        this.blockUI.start(this.language.dang_tai_cau_hinh);
        this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
            param => {
                try {
                    if (!environment.production) {
                        console.log('get_user_page_parametter', param);
                    }
                    this.organization_arr_option = param.organization_arr;
                    this.fba_time_period_overview = param.fba_time_period_metrics;
                    this.startTimeOption = param.start_time_list;
                    this.endTimeOption = param.end_time_list;
                    this.indexOption = param.fba_index;
                    // this.indexOptionSelected = this.indexOption[1].value;

                    let para = null;
                    if (param.user_page_parametter.length > 0 || !this.appservice.isEmptyObject(param.user_page_parametter)) {
                        para = param.user_page_parametter;
                        this.organization_id = para.organization_id;
                        this.startTime = para.start_time;
                        this.endTime = para.end_time;
                        // this.time_period = para.time_period;
                        this.time_period = param.fba_time_period_metrics.find(e => e.value === para.time_value).label;
                        this.site_id = para.site_id;
                        this.get_time(para.time_value);
                        this.has_site = 1;
                        // console.log('time_value', para.time_value);
                    } else {
                        /*----------  Xử lí thời gian   ----------*/
                        this.organization_id = param.organization_arr[0].value;
                        const time_on_now = new Date();
                        this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
                        this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(time_on_now) + '\'';
                        // this.time_period = 'Hôm nay';
                        // this.time_value = 'today';
                        this.time_period = this.fba_time_period_overview[0].label;
                        this.time_value = this.fba_time_period_overview[0].value;
                        this.startTime = this.startTimeOption[8].value.toString();
                        this.endTime = this.endTimeOption[23].value.toString();
                        console.log('this.endTime', this.endTime);
                    }
                    this.get_sitetree();
                } catch (error) {
                    this.blockUI.stop();
                    this.show_error = true;
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

    get_sitetree() {
        this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
        const url = environment.API.sites + '_get_site_for_report';
        const data = { organization_id: this.organization_id };
        this.appservice.post(data, url).subscribe(res => {
            try {
                if (!environment.production) {
                    console.log('get_sitetree', res);
                }
                this.menu_tree = [];
                this.recusive_menu(res.site_array);
                this.snap_menu_tree = this.menu_tree.slice(0);
                if (this.has_site === 2 || this.has_site !== 1) {
                    const first_array = this.menu_tree.find(item => Number(item.enables) === 1);
                    this.site_id = first_array.id;
                    this.location = first_array.site_name;
                } else {
                    this.location = this.menu_tree.filter(x => x.id === this.site_id)[0].site_name;
                }
                this.new_get_data();
            } catch (error) {
                this.blockUI.stop();
                this.show_error = true;
            }
        }, (error) => {
            this.blockUI.stop();
            // this.push_notification();
            this.show_error = true;
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

    /*----------  Kích sự kiện thay đổi  ----------*/
    // hiện menu tổ chức theo user
    show_menu_location() {
        const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
        if (!environment.production) {
            console.log('userInfo', userInfo);
        }
        if (userInfo.lever === '0') {
            this.hidden_menu_location = false;
        } else {
            this.hidden_menu_location = true;
        }
    }

    // thay đổi tổ chức
    changeorganization(event) {
        this.organization_id = event.value;
        this.has_site = 2;
        this.locationSelectionDisplay = false;
        this.get_sitetree();
    }

    //  chọn địa điểm
    changeitem(site_name, organization_id, id) {
        this.site_id = id;
        this.location = site_name;
        this.siteSelectionDisplay = false;
        this.new_get_data();
    }

    // search menu
    search_menu(value: string) {
        // chuyển giá trị truyền vào về chữ thường để so sánh
        const string = value.toLowerCase();
        if (string === '') {
            this.menu_tree = this.snap_menu_tree;
        } else {
            this.menu_tree = this.snap_menu_tree.filter(x => x.site_name.toLowerCase().indexOf(string) !== -1);
        }
    }

    // thay đổi tuần tháng năm thời kỳ
    chonthoigian(item) {
        this.blockUI.start(this.language.dang_tai_du_lieu);
        this.time_period = item.label;
        const time = item.value;
        this.get_time(time);
        this.new_get_data();
    }

    get_time(time_value) {
        const ngayhomnay = new Date();
        if (time_value === 'yesterday') {
            const yesterday = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
            this.siteSelectionDisplay2 = false;
        } else if (time_value === 'last_week') {
            const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
            const beforeOneWeek2 = new Date(beforeOneWeek);
            const day = beforeOneWeek.getDay();
            const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
            const lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
            const lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(lastMonday) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(lastSunday) + '\'';
            this.siteSelectionDisplay2 = false;
        } else if (time_value === 'last_month') {
            const month_now = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 0);
            const yesterday = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()) - 1, 1);
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(yesterday) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(month_now) + '\'';
            this.siteSelectionDisplay2 = false;
        } else if (time_value === 'last_year') {
            const ngaybatdaun = new Date(Number(ngayhomnay.getFullYear()) - 1, 0, 1);
            const ngayketthucn = new Date(Number(ngayhomnay.getFullYear()) - 1, 11, 31);
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn) + '\'';
            this.siteSelectionDisplay2 = false;
        } else if (time_value === 'today') {
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayhomnay) + '\'';
            this.siteSelectionDisplay2 = false;
        } else if (time_value === 'this_week') {
            const currentWeekDay = ngayhomnay.getDay();
            const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
            const wkStart = new Date(new Date(ngayhomnay).setDate(ngayhomnay.getDate() - lessDays));
            const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(wkStart) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(wkEnd) + '\'';
            this.siteSelectionDisplay2 = false;
        } else if (time_value === 'this_month') {
            const ngaydauthangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 1);
            const ngaycuoithangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth() + 1, 0);
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaydauthangnay) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaycuoithangnay) + '\'';
            this.siteSelectionDisplay2 = false;
        } else if (time_value === 'last_fourteen_day') {
            const ngaybatdau = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 14);
            const ngayketthuc = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdau) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthuc) + '\'';
            this.siteSelectionDisplay2 = false;
        } else if (time_value === 'this_year') {
            const ngaybatdaun = new Date(ngayhomnay.getFullYear(), 0, 1);
            const ngayketthucn = new Date(ngayhomnay.getFullYear(), 11, 31);
            this.start_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun) + '\'';
            this.end_date = '\'' + this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn) + '\'';
            this.siteSelectionDisplay2 = false;
        }
        this.time_value = time_value;
        if (!environment.production) {
            console.log('a', this.start_date);
            console.log('b', this.end_date);
        }
    }

    reset_to_zero(...array) {
        array.forEach(element => {
            this[element] = 0;
        });
    }

    new_get_data() {
        this.blockUI.start(this.language.dang_tai_du_lieu);
        this.get_data2();
        this.get_data();
    }

    get_live() {
        this.get_data();
        this.get_data2();
    }

    get_data() {
        clearInterval(this.interval);
        const data = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , start_hour: '\'' + this.startTime + '\''
            , end_hour: '\'' + this.endTime + '\''
            , start_date: this.start_date
            , end_date: this.end_date
            , view_by: this.viewDataBy
        };
        if (!environment.production) {
            console.log('age', data);
        }
        this.time_generate_report = new Date();
        this.appservice.post(data, environment.GENDERAGE.API.sp_poc_gender_metric_analytic).subscribe(
            res => {
                try {
                    if (!environment.production) {
                        console.log('data age', res);
                    }
                    this.data = res;
                    this.show_error = false;
                    if (res.hasOwnProperty('status') && res.status === 0) {
                        // this.push_notification();
                        this.show_error = true;
                        this.data = null;
                        this.blockUI.stop();
                    }
                    // tslint:disable-next-line: max-line-length
                    this.reset_to_zero('age18', 'age18_24', 'age25_34', 'age35_44', 'age45_54', 'age55_64', 'age65', 'age_unknown', 'total_age', 'total_noun');
                    this.data.forEach(element => {
                        this.age18 += Number(element.age18);
                        this.age18_24 += Number(element.age18_24);
                        this.age25_34 += Number(element.age25_34);
                        this.age35_44 += Number(element.age35_44);
                        this.age45_54 += Number(element.age45_54);
                        this.age55_64 += Number(element.age55_64);
                        this.age65 += Number(element.age65);
                        // this.age_unknown += Number(element.unknown);

                    });
                    // tslint:disable-next-line:max-line-length
                    this.total_age = Number(this.age18 + this.age18_24 + this.age25_34 + this.age35_44 + this.age45_54 + this.age55_64 + this.age65 + this.unknown);
                    this.total_noun = this.total_age - this.unknown;
                    this.age18 = Number(this.go_number(this.age18, this.total_noun));
                    this.age18_24 = Number(this.go_number(this.age18_24, this.total_noun));
                    this.age25_34 = Number(this.go_number(this.age25_34, this.total_noun));
                    this.age35_44 = Number(this.go_number(this.age35_44, this.total_noun));
                    this.age45_54 = Number(this.go_number(this.age45_54, this.total_noun));
                    this.age55_64 = Number(this.go_number(this.age55_64, this.total_noun));
                    this.age65 = Number(this.go_number(this.age65, this.total_noun));
                    // tslint:disable-next-line:max-line-length
                    this.category_data = [this.age18, this.age18_24, this.age25_34, this.age35_44, this.age45_54, this.age55_64, this.age65];
                    // this.age_unknown
                    this.showchart(this.category_data);
                } catch (error) {
                    this.blockUI.stop();
                }
            }, (error) => {
                if (!environment.production) {
                    console.log(error);
                }
                this.blockUI.stop();
            }, () => {
                this.blockUI.stop();
                this.interval = setInterval(() => {
                    this.get_live();
                }, 60000);
            }
        );
    }

    go_number(number, total) {
        let tong = 0;
        if (total !== 0) {
            tong = ((Number(number) / total) * 100);
            return tong.toFixed(2);
        }
        return tong;
    }
    // Biểu đồ tuổi bên phải
    showchart(category_data) {
        Highcharts.chart(this.container.nativeElement, {
            chart: { type: 'bar' },
            title: { text: '' },
            subtitle: { text: '' }, exporting: { enabled: false },
            xAxis: { categories: ['18-', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
            yAxis: {
                min: 0, allowDecimals: false,
                title: { text: '', align: '' },
                labels: { overflow: '' }
            },
            tooltip: {
                useHTML: true,
                // tslint:disable-next-line:max-line-length
                headerFormat: '<div style="color:#0f0303;font-family:Roboto, sans-serif;font-size:12px;font-weight:bold;" >' + this.language.do_tuoi_bieu_do + ' {point.key}</div>',
                // tslint:disable-next-line:max-line-length
                pointFormat: '<span  style= color:{point.color};"font-family:Roboto, sans-serif;font-size:11px;">' + this.language.phan_tram + ' {point.y:,.2f} ' + ' %' + ' </span><br/>',
            },
            // plotOptions: { bar: { dataLabels: { enabled: true } } },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f} %'
                    }
                }
            },
            legend: {
                enabled: false, layout: 'vertical', align: 'right', verticalAlign: 'top',
                x: -40, y: 80, floating: false, borderWidth: 1, shadow: true,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),

            },
            credits: { enabled: false },
            series: [{ name: '', data: category_data, color: environment.POC.colors.age, }]
        });
    }
    // Biểu đồ  tròn
    get_data2() {
        const data = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , start_hour: '\'' + this.startTime + '\''
            , end_hour: '\'' + this.endTime + '\''
            , start_date: this.start_date
            , end_date: this.end_date
            , view_by: this.viewDataBy
        };
        if (!environment.production) {
            console.log('gender', data);
        }
        this.appservice.post(data, environment.GENDERAGE.API.sp_poc_gender_metrics_comparison).subscribe(
            res => {
                try {
                    if (!environment.production) {
                        console.log('data gender', res);
                    }
                    this.data2 = res;
                    this.show_error = false;
                    if (res.hasOwnProperty('status') && res.status === 0) {
                        // this.push_notification();
                        this.show_error = true;
                        this.data2 = null;
                        this.blockUI.stop();
                    }
                    this.female = 0;
                    this.male = 0;
                    this.unknown = 0;
                    this.total_gender = 0;
                    if (this.data2 != null) {
                        this.data2.forEach(element => {
                            this.female += Number(element.female);
                            this.male += Number(element.male);
                            this.unknown += Number(element.unknown);
                        });
                    }

                    this.total_gender = Number(this.female + this.male + this.unknown);
                    this.female = this.total_gender > 0 ? Number(((this.female / (this.total_gender - this.unknown)) * 100).toFixed(2)) : 0;
                    this.male = this.total_gender > 0 ? Number(((this.male / (this.total_gender - this.unknown)) * 100).toFixed(2)) : 0;
                    // console.log('gender', this.female, this.male, this.unknown);
                    this.showchart2(this.female, this.male, this.unknown, this.total_gender);
                    this.time_generate_report = new Date();
                    const data_2 = {
                        organization_id: this.organization_id
                        , site_id: this.site_id
                        , start_time: this.startTime
                        , end_time: this.endTime
                        , time_period: this.time_period
                        , time_value: this.time_value
                        , view_by: this.viewDataBy
                    };
                    this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(data_2));
                } catch (ex) {
                    console.log(ex);
                    this.blockUI.stop();
                }
            }, (error) => {
                this.blockUI.stop();
                // this.push_notification();
                this.show_error = true;
            }, () => {
                this.blockUI.stop();
                this.blockUI.stop();
            }
        );
    }
    // Chart tròn
    showchart2(female, male, unknown, total_gender) {
        Highcharts.setOptions({
            colors: ['#f32a86', '#00a8ff', '#aaa69d', '#C5D930', '#C1A0C5']
        });
        const self = this;
        Highcharts.chart(this.container2.nativeElement, {
            chart: {
                type: 'pie', options3d: { enabled: false, alpha: 0 },
                events: {
                    // tslint:disable-next-line:max-line-length self.language.tat_ca_bieu_do
                    load() { this.setTitle({ text: '<div style="text-align:center;font-family:Roboto, sans-serif;font-size:13px;">' + 'Shoppers' + '</div>' + '<p style="text-align:center;font-family:Roboto, sans-serif;font-size:18px;font-weight:bold;"> ' + Highcharts.numberFormat(total_gender, 0) + '</p>', useHTML: true, y: -40, x: -5 }); }
                }
            }, exporting: { enabled: false },
            title: { verticalAlign: 'middle', floating: true, text: 'Shoppers' + '<br>' + total_gender, },
            subtitle: { text: ' ' },
            plotOptions: {
                pie: { innerSize: 200, showInLegend: true, depth: 45 },
                series: { dataLabels: { enabled: true, format: '{point.name}: {point.y:,.2f}' + ' %' } }
            },
            tooltip: {
                formatter() { return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.y, 2) + '%'; }
            },
            legend: {
                enabled: true,
                // layout: 'vertical', // xuống dòng
                labelFormatter() {
                    // tslint:disable-next-line:max-line-length     Highcharts.numberFormat(this.y, 0)
                    return '<span style="font-family:Roboto, sans-serif; font-weight: normal;">' + this.name + '</span>  <span style:"font-weight: normal;"> <b>' + (Math.round(this.percentage * 100) / 100).toFixed(2) + ' %' + '<br/></span>';
                }
            },
            series: [{
                name: this.language.gioi_tinh,
                data: [[this.language.nu_bieu_do, female], [this.language.nam_bieu_do, male],
                    // [this.language.khong_xac_dinh, unknown],
                ],
                size: '80%', innerSize: '85%',
            }]
        });
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    reset_session() {
        const all_session = [];
        this.site_id = null;
        this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(all_session)).subscribe(res => {
            this.get_location_time();
        });
    }
}
