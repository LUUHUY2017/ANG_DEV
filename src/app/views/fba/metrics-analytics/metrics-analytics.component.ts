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
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
// 22/11 export pdf
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);

// thêm mới dateranger
declare function intDateRangePickerFBA(start_date, end_date): any;

// tree node
import { TreeNode } from 'primeng/components/common/treenode';

@Component({
    templateUrl: 'metrics-analytics.component.html',
    styleUrls: ['metrics-analytics.component.css'],
    // chỉnh css angular
    encapsulation: ViewEncapsulation.None
})

export class FbaMetricsAnalyticsComponent implements OnInit {
    page_id = '\'' + environment.Pages.fba.metrics_analytics + '\'';
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    time_generate_report = new Date();


    // public openTime: Array<string> = [this.open_time.toString()];
    // ==================
    // Decorator wires up blockUI instance

    // public navItems = navItems;
    public sidebarMinimized = true;
    private changes: MutationObserver;
    public element: HTMLElement = document.body;

    // **** kết thúc phần hiển thị popup ******
    constructor(private router: Router, private appservice: AppService) {
        // thêm mới
        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
        });
        this.changes.observe(<Element>this.element, {
            attributes: true
        });
    }  // kết thúc

    // Khai báo
    organizations = [];
    organization_id: number;
    organization_selected = ''; // chọn organization khi load hộp thoại

    siteSelectionDisplay = false;
    siteSelectionDisplay2 = false;
    locationSelectionDisplay = false;
    start_date: any;
    end_date: any;
    site_id: number;
    style_start_date: any;
    style_end_date: any;
    style_start_date_number: any;
    style_end_date_number: any;

    public startTimeOption: Array<IOption>;
    public endTimeOption: Array<IOption>;
    public startTime: string;
    public endTime: string;

    public time_period: string;
    public title_time_period: string;
    public time_period2: string;
    public question_name: string;
    public title_question_name: string;
    public location: string;
    public title_location: string;

    public question_id: number;
    public data: any;
    public questions_ongoing: any;
    public questions_upcoming: any;
    public questions_ended: any;
    public fba_time_period_overview: any;
    public organization_arr: any;
    public menu_tree: any;
    public image_very_negative_img: string;      // ảnh tức giận
    public image_negative_img: string;           // ảnh bình thường
    public image_very_positive_img: string;      // ảnh rất hài lòng
    public image_positive_img: string;           // ảnh ảnh hài lòng
    public time_now: string;
    public Indexstart: any;                      // ngModel ngày bắt đầu
    public IndexEnd: any;                        // ngModel ngày kế thúc
    public table: any;
    btnApplyValid = false;
    displaylocation = false;
    displayquestion = false;
    hidden_menu_location = false;
    indexOption: Array<IOption>;
    organization_arr_option: Array<IOption>;
    organization_arr_optionSelected: string;     // thay đổi theo sự kiện click
    indexOptionSelected: string;                 // thay đổi theo sự kiện click
    very_negative_name: string;                  // tên đánh giá: kém
    negative_name: string;
    very_positive_name: string;
    positive_name: string;
    /*----------  Giá trị mặc định  ----------*/
    viewDataBy = 'Hour';
    Viewhienthi = 'Số lượng';
    total_total_response = 0;
    total_very_positive = 0;
    total_positive = 0;
    total_negative = 0;
    total_very_negative = 0;
    avg_very_positive_percent = 0;
    avg_positive_percent = 0;
    avg_negative_percent = 0;
    avg_very_negative_percent = 0;
    cxindex = 0;
    npsindex = 0;
    // 23/11/2018
    margins = {
        top: 70,
        bottom: 40,
        left: 10,
        width: 1800
    };
    /*----------  ngOnInit  ----------*/
    ngOnInit() {
        this.get_location_time();
        // hiện menu tổ chức theo user
        this.show_menu_location();
    } //  ngOnInit

    get_location_time() {
        this.blockUI.start('Đang tải cấu hình...');
        this.appservice.get_user_page_parametter(this.page_id).subscribe(
            param => {
                // console.log('get_user_page_parametter', param);
                // load khối thời gian
                this.fba_time_period_overview = param.fba_time_period_metrics;
                this.organization_arr_option = param.organization_arr;
                this.organization_id = param.organization_arr[0].value;

                /*----------  Xử lí thời gian   ----------*/
                intDateRangePickerFBA(Number(new Date()), Number(new Date()));       // hàm cho ngày 2  input bắt đầu và kết thúc
                // tslint:disable-next-line:max-line-length
                this.start_date = this.appservice.convert_dateint_tostringdate((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
                // tslint:disable-next-line:max-line-length
                this.end_date = this.appservice.convert_dateint_tostringdate((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
                /*----------  Định dạng hiển thị ngày lên giao diện ----------*/
                // tslint:disable-next-line:max-line-length
                this.style_start_date = this.appservice.convert_dateint_tostringdatemonth((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
                // tslint:disable-next-line:max-line-length
                this.style_end_date = this.appservice.convert_dateint_tostringdatemonth((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
                // this.time_period = this.style_start_date + ' - ' + this.style_end_date; // hiện khung giờ
                this.time_period = 'Hôm nay'; // hiện khung giờ
                this.title_time_period = this.time_period;
                this.indexOption = param.fba_index;                         // NPS INDEX
                this.indexOptionSelected = this.indexOption[1].value;       // CX INDEX đầu tiên
                this.startTimeOption = param.start_time_list;               // Mảng thời gian bắt đầu
                this.startTime = this.startTimeOption[0].value.toString();  // thời gian bắt đầu hiện selected
                this.endTimeOption = param.end_time_list;                   // Mảng thời gian kết thúc
                this.endTime = this.endTimeOption[22].value.toString();     // thời gian kết thúc hiện selected
            },
            (error) => {
                // console.log(error);
                this.blockUI.stop();
                this.blockUI.start('Lỗi, không kết nối được máy chủ');
            },
            () => {
                this.blockUI.stop();
                this.get_sitetree();
            }
        );
    }

    get_sitetree() {
        this.blockUI.start('Đang tải thông tin tổ chức...');
        this.appservice.fba_get_org_tree(this.organization_id)
            .then(res => {
                if (!environment.production) {
                    // console.log('get_sitetree', res);
                }
                this.menu_tree = res;
                this.location = this.menu_tree[0].site_name;
                this.title_location = this.location;
                this.site_id = this.menu_tree[0].id;
                this.blockUI.stop();
                this.get_question();
            })
            .catch(error => {
                this.blockUI.stop();
                this.blockUI.start('Lỗi, không tải được thông tin tổ chức');
            });
    }
    get_question() {
        this.blockUI.start('Đang tải câu hỏi...');
        const organization = {
            organization_id: this.organization_id
        };
        this.appservice.post(organization, environment.FBA.API.get_question_for_report).subscribe(
            param => {
                if (!environment.production) {
                    // console.log('get_question', param);
                    // console.log('ID organization tổ chức in get_question', organization);
                }
                this.questions_ongoing = param.questions_ongoing; // 3 vòng lặp
                this.questions_upcoming = param.questions_upcoming;
                this.questions_ended = param.questions_ended;
                if (param.questions_ongoing.length > 0) {
                    this.question_name = this.questions_ongoing[0].question_name;
                    this.title_question_name = this.question_name;             // hiện trên giao diện
                    // tslint:disable-next-line:max-line-length
                    this.question_id = this.questions_ongoing[0].question_id;                      // gắn question_id mặc định khi load đầu tiên
                    this.image_very_negative_img = this.questions_ongoing[0].very_negative_img;    // lấy ảnh mặc định
                    this.image_negative_img = this.questions_ongoing[0].negative_img;
                    this.image_very_positive_img = this.questions_ongoing[0].very_positive_img;
                    this.image_positive_img = this.questions_ongoing[0].positive_img;

                    this.very_negative_name = this.questions_ongoing[0].very_negative;                   // lấy tên đánh giá: kém
                    this.negative_name = this.questions_ongoing[0].negative;
                    this.very_positive_name = this.questions_ongoing[0].very_positive;
                    this.positive_name = this.questions_ongoing[0].positive;
                } else if (param.questions_ended.length > 0) {
                    this.question_name = this.questions_ended[0].question_name;
                    this.question_id = this.questions_ended[0].question_id;
                    this.image_very_negative_img = this.questions_ended[0].very_negative_img;
                    this.image_negative_img = this.questions_ended[0].negative_img;
                    this.image_very_positive_img = this.questions_ended[0].very_positive_img;
                    this.image_positive_img = this.questions_ended[0].positive_img;

                    this.very_negative_name = this.questions_ended[0].very_negative;                   // lấy tên đánh giá: kém
                    this.negative_name = this.questions_ended[0].negative;
                    this.very_positive_name = this.questions_ended[0].very_positive;
                    this.positive_name = this.questions_ended[0].positive;
                } else if (param.questions_upcoming.length > 0) {
                    this.question_name = this.questions_upcoming[0].question_name;
                    this.question_id = this.questions_upcoming[0].question_id;
                    this.image_very_negative_img = this.questions_upcoming[0].very_negative_img;
                    this.image_negative_img = this.questions_upcoming[0].negative_img;
                    this.image_very_positive_img = this.questions_upcoming[0].very_positive_img;
                    this.image_positive_img = this.questions_upcoming[0].positive_img;

                    this.very_negative_name = this.questions_upcoming[0].very_negative;                   // lấy tên đánh giá: kém
                    this.negative_name = this.questions_upcoming[0].negative;
                    this.very_positive_name = this.questions_upcoming[0].very_positive;
                    this.positive_name = this.questions_upcoming[0].positive;
                } else {
                    this.question_name = 'Đang cập nhật';
                    this.question_id = null;
                    this.image_very_negative_img = '';
                    this.image_negative_img = '';
                    this.image_very_positive_img = '';
                    this.image_positive_img = '';
                    this.very_negative_name = '';                   // lấy tên đánh giá: kém
                    this.negative_name = '';
                    this.very_positive_name = '';
                    this.positive_name = '';
                }
                // console.log(this.question_id);
            },
            (error) => {
                // console.log(error);
                this.blockUI.stop();
                // this.blockUI.start('Lỗi, không kết nối được máy chủ');
            },
            () => {
                this.blockUI.stop();
                this.get_data();
            }
        ); // get_user_page_parametter

    }
    /*----------  Kích sự kiện thay đổi  ----------*/
    show_menu_location() {                            // hiện menu tổ chức theo user
        const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
        if (!environment.production) {
            // console.log('userInfo', userInfo);
        }
        if (userInfo.lever === '0') {
            this.hidden_menu_location = false;
        } else {
            this.hidden_menu_location = true;
        }
    }
    changeorganization(event) {                     // thay đổi tổ chức
        this.organization_id = event.value;
        this.locationSelectionDisplay = false;
        this.get_sitetree();
    }
    thaydoichart(event) {
        if (!environment.production) {
            // console.log('tên chart', event.value);       // thay đổi chart khi chọn Index
        }
        this.indexOptionSelected = event.value;
        // this.get_data();
    }
    changeitem(organization_id, id, site_name) {    //  chọn địa điểm
        this.organization_id = organization_id;
        this.site_id = id;
        this.location = site_name;
        this.siteSelectionDisplay = false;
        // this.get_data();
    }
    // sự kiện khi thay đổi câu hỏi
    question_change(question_id, question_name, very_positive_img, positive_img, negative_img, very_negative_img) {
        this.question_id = question_id;
        this.question_name = question_name;
        this.image_very_negative_img = very_negative_img;
        this.image_negative_img = negative_img;
        this.image_very_positive_img = very_positive_img;
        this.image_positive_img = positive_img;
        // this.get_data();
    }
    // thay đổi giờ, ngày, tuần  tháng năm trên thanh  block
    change_view() {
        this.blockUI.start('Đang tải dữ liệu...');
        this.get_data();
    }

    chonthoigian(item) {                               // thay đổi tuần tháng năm thời kỳ
        // khai báo ngày hiện tại
        const ngayhomnay = new Date();
        const stylehomnay = Number(ngayhomnay);              // đổi kiểu ngày sang number giống dateranker value
        if (item.value === 'yesterday') {
            const ngayhomqua = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            const stylehomqua = Number(ngayhomqua);          //  đổi kiểu ngày sang number giống dateranker value
            // console.log(stylehomqua);
            this.time_period = item.label;
            this.Indexstart = stylehomqua;                   // ngModel ngày bắt đầu
            this.IndexEnd = stylehomqua;                     // ngModel ngày kết thúc
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'last_week') {
            const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
            const beforeOneWeek2 = new Date(beforeOneWeek);
            const day = beforeOneWeek.getDay();
            const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
            const lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
            const lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));
            const stylelastMonday = Number(lastMonday);
            const stylelastSunday = Number(lastSunday);
            this.Indexstart = stylelastMonday;
            this.IndexEnd = stylelastSunday;
            this.time_period = item.label;
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'last_month') {
            const thangtruocbatdau = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()) - 1, 1);
            const stylethangtruoc = Number(thangtruocbatdau);                   // đổi kiểu ngày
            const thangtruocketthuc = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()), 0);
            const stylethangtruocketthuc = Number(thangtruocketthuc);         // đổi kiểu ngày
            this.time_period = item.label;
            this.Indexstart = stylethangtruoc;
            this.IndexEnd = stylethangtruocketthuc;
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'last_year') {
            const daunamtruoc = new Date(Number(ngayhomnay.getFullYear()) - 1, 0, 1);
            const cuoinamtruoc = new Date(Number(ngayhomnay.getFullYear()) - 1, 11, 31);
            const styledaunamtruoc = Number(daunamtruoc);     // đổi kiểu ngày
            const stylecuoinamtruoc = Number(cuoinamtruoc);   // đổi kiểu ngày
            this.time_period = item.label;
            this.Indexstart = styledaunamtruoc;
            this.IndexEnd = stylecuoinamtruoc;
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'today') {                                    // hôm nay
            const ngayhomqua = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            const stylehomqua = Number(ngayhomqua);                            //  đổi kiểu ngày sang number giống dateranker value
            this.time_period = 'Hôm nay';
            this.Indexstart = stylehomnay;
            this.IndexEnd = stylehomnay;
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'this_week') {                                                     // tuần này
            const currentWeekDay = ngayhomnay.getDay();                            // lấy ngày thứ mấy  trong tuần
            const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
            const wkStart = new Date(new Date(ngayhomnay).setDate(ngayhomnay.getDate() - lessDays));
            const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
            const stylewkStart = Number(wkStart);
            const stylewkEnd = Number(wkEnd);
            this.time_period = 'Tuần này';
            this.Indexstart = stylewkStart;
            this.IndexEnd = stylewkEnd;
            this.siteSelectionDisplay2 = false;

        } else if (item.value === 'this_month') {                                                      // tháng này
            const ngaydauthangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 1);
            const stylengaydauthangnay = Number(ngaydauthangnay);
            if (!environment.production) {
                // console.log('a', ngaydauthangnay);
            }
            const ngaycuoithangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth() + 1, 0);
            const stylengaycuoithangnay = Number(ngaycuoithangnay);
            this.time_period = 'Tháng này';
            this.Indexstart = stylengaydauthangnay;
            this.IndexEnd = stylengaycuoithangnay;
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'last_fourteen_day') {                                                      // 14 ngày trước
            const ngaybatdau = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 14);
            const stylengaybatdau = Number(ngaybatdau);
            const ngayketthuc = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            const stylenngayketthuc = Number(ngayketthuc);
            if (!environment.production) {
                // console.log('a', ngaybatdau);
                // console.log('b', ngayketthuc);
            }
            this.time_period = '14 ngày trước';
            this.Indexstart = stylengaybatdau;
            this.IndexEnd = stylenngayketthuc;
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'this_year') {                                                      // 14 ngày trước
            const ngaybatdaun = new Date(ngayhomnay.getFullYear(), 0, 1);
            const stylengaybatdaun = Number(ngaybatdaun);
            const ngayketthucn = new Date(ngayhomnay.getFullYear(), 11, 31);
            const stylenngayketthucn = Number(ngayketthucn);
            if (!environment.production) {
                // console.log('a', ngaybatdaun);
                // console.log('b', ngayketthucn);
            }
            this.time_period = 'Năm nay';
            this.Indexstart = stylengaybatdaun;
            this.IndexEnd = stylenngayketthucn;
            this.siteSelectionDisplay2 = false;
        }
    }



    time_change() { // thay đổi nút áp dụng
        this.blockUI.start('Đang tải dữ liệu...');
        // tslint:disable-next-line:max-line-length
        this.start_date = this.appservice.convert_dateint_tostringdate((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
        // tslint:disable-next-line:max-line-length
        this.end_date = this.appservice.convert_dateint_tostringdate((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
        // tslint:disable-next-line:max-line-length
        this.style_start_date = this.appservice.convert_dateint_tostringdatemonth((document.getElementById('startDateReportTemp') as HTMLInputElement).value);  // định dạng hiển thị lên giao diện
        // tslint:disable-next-line:max-line-length
        this.style_end_date = this.appservice.convert_dateint_tostringdatemonth((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
        this.style_start_date_number = Number((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
        this.style_end_date_number = Number((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
        if (this.style_start_date_number !== this.Indexstart && this.style_end_date_number !== this.IndexEnd) {
            this.time_period = this.style_start_date + ' - ' + this.style_end_date; // show ngày từ ngày này đến ngày này
            this.title_time_period = ' Ngày';
        } else { this.title_time_period = this.time_period; }
        // console.log(' this.start_date', this.start_date);
        // console.log(' this.end_date', this.end_date);

        this.title_location = this.location;
        this.title_question_name = this.question_name;
        this.get_data();
    }
    /*----------  xuất excel  ----------*/
    exportExcel(): void {   // gọi tới api, api trả về data cần xuất !
        // this.appservice.exportAsExcelFile(this.datatable, 'sample');
        // const data = {
        //     organization_id: this.organization_id
        //     , site_id: this.site_id
        //     , question_id: this.question_id
        //     , start_hour: '\'' + this.startTime + '\''
        //     , end_hour: '\'' + this.endTime + '\''
        //     , start_date:  this.start_date
        //     , end_date: this.end_date
        //     // ,start_date: '\'2018-11-01\''
        //     // ,end_date:  '\'2018-11-30\''
        //     , view_by: this.viewDataBy
        // };
        // console.log('DATA', data);

        // this.appservice.post(data, environment.FBA.API.site_export_excel).subscribe(
        //     table => {
        // console.log('site_export_excel', table);
        //         this.table = table;
        //     },
        //     ); // fba_report_metrics_analytic
        // this.appservice.exportAsExcelFile(this.table, 'Phân tích chỉ số');
        this.appservice.exportAsExcelFile(this.data, 'Phân tích chỉ số');
    }

    /*----------  Data  ----------*/
    get_data() {
        const data = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , question_id: this.question_id
            , start_hour: '\'' + this.startTime + '\''
            , end_hour: '\'' + this.endTime + '\''
            , start_date: this.start_date
            , end_date: this.end_date
            // , end_hour: '\'23:59\''
            // ,start_date: '\'2018-11-01\''
            // ,end_date:  '\'2018-11-30\''
            , view_by: this.viewDataBy
        };
        // console.log('DATA', data);

        this.appservice.post(data, environment.FBA.API.fba_report_metrics_analytic).subscribe(
            respo => {
                // console.log('FBA_report_metrics_analytic', respo);
                this.data = respo; // data cho bảng
                this.total_total_response = 0;
                this.total_very_positive = 0;
                this.total_positive = 0;
                this.total_negative = 0;
                this.total_very_negative = 0;
                this.avg_very_positive_percent = 0;
                this.avg_positive_percent = 0;
                this.avg_negative_percent = 0;
                this.avg_very_negative_percent = 0;
                this.cxindex = 0;
                this.npsindex = 0;


                // Tính tổng đánh giá từng đánh giá
                respo.forEach(element => {
                    this.total_total_response += Number(element.total_response);
                    this.total_very_positive += Number(element.very_positive);
                    this.total_positive += Number(element.positive);
                    this.total_negative += Number(element.negative);
                    this.total_very_negative += Number(element.very_negative);
                });
                // Tính trung bình phần trăm các đánh giá
                this.avg_very_positive_percent = Number(((this.total_very_positive / this.total_total_response) * 100).toFixed(2));
                this.avg_positive_percent = Number(((this.total_positive / this.total_total_response) * 100).toFixed(2));
                this.avg_negative_percent = Number(((this.total_negative / this.total_total_response) * 100).toFixed(2));
                this.avg_very_negative_percent = Number(((this.total_very_negative / this.total_total_response) * 100).toFixed(2));
                // Tính CX Index
                // tslint:disable-next-line:max-line-length
                this.cxindex = Number((((this.total_very_positive * 100) + (this.total_positive * 66.66) + (this.total_negative * 33.33)) / (this.total_total_response)).toFixed(2));
                // tslint:disable-next-line:max-line-length
                this.npsindex = Number((this.avg_very_positive_percent - this.avg_negative_percent - this.avg_very_negative_percent).toFixed(2));
                if (this.indexOptionSelected === 'cx_index') {
                    // console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQ');
                    this.showchart();
                } else {
                    // console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
                    this.showchart2();
                }
            },
            (error) => {
                // console.log(error);
                this.blockUI.stop();
                // this.blockUI.start('Lỗi, không kết nối được máy chủ');
            },
            () => {
                this.blockUI.stop();
            }
        ); // fba_report_metrics_analytic

    } // Kết thúc get data
    // 22/11 thêm vào để test PDF
    generatePDF() {
        const data = document.querySelector('.fba-body-body');
        html2canvas(data).then(canvas => {
            // Few necessary setting options
            const imgWidth = 208;
            const imgHeight = canvas.height * imgWidth / canvas.width;

            const contentDataURL = canvas.toDataURL('image/png');
            const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
            const position = 0;
            pdf.setFontSize(20);
            pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
            pdf.save('MYPdf.pdf'); // Generated PDF
        });
    }
    // 22/11 kết thúc thêm test
    // 23/11/2018
    generate() {
        const pdf = new jspdf('p', 'pt', 'a4');
        pdf.setFontSize(18);
        pdf.fromHTML(document.getElementById('export-pdf'),
            this.margins.left, // x coord
            this.margins.top,
            {
                // y coord
                width: this.margins.width// max width of content on PDF
            },
            this.margins);

        // tslint:disable-next-line:prefer-const
        // let iframe = document.createElement('iframe');
        // iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:650px; padding:20px;');
        // document.body.appendChild(iframe);

        // iframe.src = pdf.output('datauristring');
        pdf.save('test.pdf');
    }


    /*----------   Biểu đồ Highchart  ----------*/
    showchart() {
        // Kí tự đầu chữ hoa : tên các đánh giá: Kém
        const very_negative_name = this.very_negative_name[0].toUpperCase() + this.very_negative_name.substr(1).toLowerCase();
        const negative_name = this.negative_name[0].toUpperCase() + this.negative_name.substr(1).toLowerCase();
        const very_positive_name = this.very_positive_name[0].toUpperCase() + this.very_positive_name.substr(1).toLowerCase();
        const positive_name = this.positive_name[0].toUpperCase() + this.positive_name.substr(1).toLowerCase();

        let i = 0;
        const chart_xAxis = [];
        const nps_index = [];
        const cx_index = [];
        this.data.forEach(element => {
            chart_xAxis[i] = element.time_period;
            nps_index[i] = Number(element.nps_index);
            cx_index[i] = Number(element.cx_index);
            i++;
        });
        // console.log('Nps_index +Cx_index:', nps_index, cx_index);
        // console.log('VIEW follow CX / NPS Index:', this.indexOptionSelected);
        /*----------  Phần trăm  ----------*/
        i = 0;
        const very_positive = [];
        const positive = [];
        const negative = [];
        const very_negative = [];
        this.data.forEach(element => {
            very_positive[i] = Number(element.very_positive_percen);
            positive[i] = Number(element.positive_percen);
            negative[i] = Number(element.negative_percen) * -1;
            very_negative[i] = Number(element.very_negative_percen) * -1;

            i++;
        });
        // console.log('PERCENT/Very_Po+ Po+ Ne+ Very_Ne:', very_positive, positive, negative, very_negative);
        /*----------Lượt đánh giá ----------*/
        i = 0;
        const very_positive_repon = [];
        const positive_repon = [];
        const negative_repon = [];
        const very_negative_repon = [];
        this.data.forEach(element => {
            very_positive_repon[i] = Number(element.very_positive);
            positive_repon[i] = Number(element.positive);
            negative_repon[i] = Number(element.negative);
            very_negative_repon[i] = Number(element.very_negative);

            i++;
        });
        // console.log('REPONSE/Very_Pos + Po + Ne + Very_Ne:', very_positive_repon, positive_repon, negative_repon, very_negative_repon);

        /*----------  Hai tọa độ 0  bằng nhau  ----------*/
        (function (H) {
            const Axis = H.Axis,
                inArray = H.inArray,
                wrap = H.wrap;

            wrap(Axis.prototype, 'adjustTickAmount', function (proceed) {
                // tslint:disable-next-line:prefer-const
                let chart = this.chart,
                    // tslint:disable-next-line:prefer-const
                    primaryAxis = chart[this.coll][0],
                    primaryThreshold,
                    primaryIndex,
                    index,
                    newTickPos,
                    threshold;

                // Find the index and return boolean result
                function isAligned(axis) {
                    index = inArray(threshold, axis.tickPositions); // used in while-loop
                    return axis.tickPositions.length === axis.tickAmount && index === primaryIndex;
                }

                if (chart.options.chart.alignThresholds && this !== primaryAxis) {
                    primaryThreshold = (primaryAxis.series[0] && primaryAxis.series[0].options.threshold) || 0;
                    threshold = (this.series[0] && this.series[0].options.threshold) || 0;

                    primaryIndex = primaryAxis.tickPositions && inArray(primaryThreshold, primaryAxis.tickPositions);

                    if (this.tickPositions && this.tickPositions.length &&
                        primaryIndex > 0 &&
                        primaryIndex < primaryAxis.tickPositions.length - 1 &&
                        this.tickAmount) {

                        // Add tick positions to the top or bottom in order to align the threshold
                        // to the primary axis threshold
                        while (!isAligned(this)) {

                            if (index < primaryIndex) {
                                newTickPos = this.tickPositions[0] - this.tickInterval;
                                this.tickPositions.unshift(newTickPos);
                                this.min = newTickPos;
                            } else {
                                newTickPos = this.tickPositions[this.tickPositions.length - 1] + this.tickInterval;
                                this.tickPositions.push(newTickPos);
                                this.max = newTickPos;
                            }
                            proceed.call(this);
                        }
                    }

                } else {
                    proceed.call(this);
                }
            });
        }(Highcharts));
        Highcharts.chart(this.container.nativeElement, {
            chart: {
                type: 'column',
                alignThresholds: true,
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: chart_xAxis,
                crosshair: true
            },
            plotOptions: {
                series: {
                    // pointWidth: 18,              // độ rộng cột
                    stacking: 'normal',
                    lineWidth: 1,                   // đường line
                    color: environment.POC.colors.fillColor, // màu đường line
                    states: {
                        hover: { enabled: false, } // hover line
                    },
                    marker: { radius: 3, }         // điểm line
                },
            },
            yAxis: [{
                labels: {                          // trục oy
                    format: '{value} lượt ',
                    style: {
                        color: environment.POC.colors.labels,
                    }
                },
                className: '',
                crosshair: true,                   // kẻ gióng ngang dọc hover
                title: {
                    text: 'Response',
                    enabled: this.indexOptionSelected === 'cx_index',
                },
                stackLabels: {                    // hiện tổng cột
                    style: { color: environment.POC.colors.stackLabels, fontSize: '10px', fontWeight: '400' },
                    rotation: -92,
                    y: -20,
                    x: 3,
                    enabled: this.indexOptionSelected === 'cx_index', // mặc định là true
                },
                gridLineWidth: 1,                  // đường gióng ngang
            },
            {
                labels: { // thanh oy
                    format: '{value} %',
                    style: {
                        color: environment.POC.colors.labels,
                    }
                },
                className: '',
                crosshair: true,                   // kẻ gióng ngang dọc hover
                title: { text: 'CX Index', },
                stackLabels: {                     // hiện tổng cột
                    style: { color: environment.POC.colors.stackLabels, fontSize: '10px', fontWeight: 'bold', },
                    rotation: -92,
                    y: -20,
                    x: 3,
                    enabled: this.indexOptionSelected === 'cx_index', //  định là true
                },
                gridLineWidth: 1,                  // đường gióng ngang
                maxPadding: 0,
                opposite: true,
                visible: this.indexOptionSelected === 'cx_index',
            }],
            series: [
                /*----------    CX Index  ----------*/
                {
                    name: very_positive_name,
                    showInLegend: false,
                    color: environment.POC.colors.very_positive,
                    data: very_positive_repon,
                    tooltip: {
                        valuePrefix: '',
                        valueSuffix: ' ',
                    },
                    visible: this.indexOptionSelected === 'cx_index',
                }, {
                    name: positive_name,
                    showInLegend: false,
                    color: environment.POC.colors.positive,
                    data: positive_repon,
                    tooltip: {
                        valuePrefix: '',
                        valueSuffix: ' ',
                    },
                    visible: this.indexOptionSelected === 'cx_index',
                }, {
                    name: negative_name,
                    showInLegend: false,
                    color: environment.POC.colors.negative,
                    data: negative_repon,
                    tooltip: {
                        valuePrefix: '',
                        valueSuffix: ' ',
                    },
                    visible: this.indexOptionSelected === 'cx_index',
                }, {
                    name: very_negative_name,
                    showInLegend: false,               // none legend
                    color: environment.POC.colors.very_negative,
                    data: very_negative_repon,
                    tooltip: {
                        valuePrefix: '',
                        valueSuffix: '  ',
                    },
                    visible: this.indexOptionSelected === 'cx_index',
                }, {
                    type: 'spline',
                    name: 'CX Index',
                    showInLegend: false,
                    data: cx_index,
                    marker: {
                        // lineWidth: 1,
                        fillColor: environment.POC.colors.fillColor, // màu các điểm
                    }
                    , yAxis: 1,
                    tooltip: {
                        valueDecimals: 0,
                        valuePrefix: '', // trước
                        valueSuffix: ' %'
                    },
                    visible: this.indexOptionSelected === 'cx_index',
                }],

            tooltip: {
                backgroundColor: environment.POC.colors.backgroundColor,
                shared: true,
                distance: 80,  // khoảng cách đến các tooltip
            }
        });
    } // End hightchart
    showchart2() {
        // Kí tự đầu chữ hoa : tên các đánh giá: Kém
        const very_negative_name = this.very_negative_name[0].toUpperCase() + this.very_negative_name.substr(1).toLowerCase();
        const negative_name = this.negative_name[0].toUpperCase() + this.negative_name.substr(1).toLowerCase();
        const very_positive_name = this.very_positive_name[0].toUpperCase() + this.very_positive_name.substr(1).toLowerCase();
        const positive_name = this.positive_name[0].toUpperCase() + this.positive_name.substr(1).toLowerCase();

        let i = 0;
        const chart_xAxis = [];
        const nps_index = [];
        const cx_index = [];
        this.data.forEach(element => {
            chart_xAxis[i] = element.time_period;
            nps_index[i] = Number(element.nps_index);
            cx_index[i] = Number(element.cx_index);
            i++;
        });
        // console.log('Nps_index +Cx_index:', nps_index, cx_index);
        // console.log('VIEW follow CX / NPS Index:', this.indexOptionSelected);
        /*----------  Phần trăm  ----------*/
        i = 0;
        const very_positive = [];
        const positive = [];
        const negative = [];
        const very_negative = [];
        this.data.forEach(element => {
            very_positive[i] = Number(element.very_positive_percen);
            positive[i] = Number(element.positive_percen);
            negative[i] = Number(element.negative_percen) * -1;
            very_negative[i] = Number(element.very_negative_percen) * -1;

            i++;
        });
        // console.log('PERCENT/Very_Po+ Po+ Ne+ Very_Ne:', very_positive, positive, negative, very_negative);
        /*----------Lượt đánh giá ----------*/
        i = 0;
        const very_positive_repon = [];
        const positive_repon = [];
        const negative_repon = [];
        const very_negative_repon = [];
        this.data.forEach(element => {
            very_positive_repon[i] = Number(element.very_positive);
            positive_repon[i] = Number(element.positive);
            negative_repon[i] = Number(element.negative);
            very_negative_repon[i] = Number(element.very_negative);

            i++;
        });
        // console.log('REPONSE/Very_Pos + Po + Ne + Very_Ne:', very_positive_repon, positive_repon, negative_repon, very_negative_repon);
        Highcharts.chart(this.container.nativeElement, {
            chart: {
                type: 'column',
                alignThresholds: true,
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: chart_xAxis,
                crosshair: true
            },
            plotOptions: {
                series: {
                    // pointWidth: 18,              // độ rộng cột
                    stacking: 'normal',
                    lineWidth: 1,                   // đường line
                    color: environment.POC.colors.fillColor, // màu đường line
                    states: {
                        hover: { enabled: false, } // hover line
                    },
                    marker: { radius: 3, }         // điểm line
                },
            },
            yAxis: [{
                labels: {                          // trục oy
                    format: '{value} %',
                    style: {
                        color: environment.POC.colors.labels,
                    }
                },
                className: '',
                crosshair: true,                   // kẻ gióng ngang dọc hover
                title: {
                    text: 'Response',
                    enabled: this.indexOptionSelected === 'nps_index',
                },
                stackLabels: {                    // hiện tổng cột
                    style: { color: environment.POC.colors.stackLabels, fontSize: '10px', fontWeight: '400' },
                    rotation: -92,
                    y: -20,
                    x: 3,
                    enabled: this.indexOptionSelected === 'nps_index', // mặc định là true
                },
                gridLineWidth: 1,                  // đường gióng ngang
                maxPadding: 0,
                minPadding: 0,
            },
            {
                labels: { // thanh oy
                    format: '{value} %',
                    style: {
                        color: environment.POC.colors.labels,
                    }
                },
                linkedTo: 0,   // 2 cột tương ứng
                className: '', // màu
                opposite: true,
                title: { text: 'NPS Index' },
                maxPadding: 0, // cột tới điểm max
            }
            ],


            series: [{
                name: very_positive_name,
                showInLegend: false,
                color: environment.POC.colors.very_positive,
                data: very_positive,
                tooltip: {
                    valuePrefix: '',
                    valueSuffix: ' % ',
                },
                visible: this.indexOptionSelected === 'nps_index',
            }, {
                name: positive_name,
                showInLegend: false,
                color: environment.POC.colors.positive,
                data: positive,
                tooltip: {
                    valuePrefix: '',
                    valueSuffix: ' %',
                },
                visible: this.indexOptionSelected === 'nps_index',
            }, {
                name: negative_name,
                showInLegend: false,
                color: environment.POC.colors.negative,
                data: negative,
                tooltip: {
                    valuePrefix: '',
                    valueSuffix: ' %',
                },
                visible: this.indexOptionSelected === 'nps_index',
            }, {
                name: very_negative_name,
                showInLegend: false,                // none legend
                color: environment.POC.colors.very_negative,
                data: very_negative,
                tooltip: {
                    valuePrefix: '',
                    valueSuffix: ' %',
                },
                visible: this.indexOptionSelected === 'nps_index',
            }, {
                type: 'spline',
                name: 'NPS Index',
                showInLegend: false,
                data: nps_index,
                marker: {
                    // lineWidth: 1,
                    fillColor: environment.POC.colors.fillColor, // màu các điểm
                },
                yAxis: 0,
                tooltip: {
                    valueDecimals: 0,
                    valuePrefix: '', // trước
                    valueSuffix: ' %'
                },
                visible: this.indexOptionSelected === 'nps_index',
            }
            ],

            tooltip: {
                backgroundColor: environment.POC.colors.backgroundColor,
                shared: true,
                distance: 120,  // khoảng cách đến các tooltip
            }
        });
    } // End hightchart
} // Kết thúc class






