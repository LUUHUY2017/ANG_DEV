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
More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);

// thêm mới dateranger
declare function intDateRangePickerFBA(start_date, end_date): any;
// tree node
import { TreeNode } from 'primeng/components/common/treenode';
@Component({
    templateUrl: './staff-performance.component.html',
    styleUrls: ['./staff-performance.component.css'],
    // chỉnh css angular
    encapsulation: ViewEncapsulation.None
})
export class FbaStaffPerformanceComponent implements OnInit {
    page_id = '\'' + environment.Pages.fba.staff_performance + '\'';
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    time_generate_report = new Date();

    // public navItems = navItems;
    public sidebarMinimized = true;
    private changes: MutationObserver;
    public element: HTMLElement = document.body;

    constructor(private router: Router, private appservice: AppService) {
        // thêm mới
        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
        });
        this.changes.observe(<Element>this.element, {
            attributes: true
        });
    }   // kết thúc

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
    public question_name: string;
    public question_id: number;
    public data: any;
    public questions_ongoing: any;
    public questions_upcoming: any;
    public questions_ended: any;
    public fba_time_period_overview: any;
    public organization_arr: any;
    public menu_tree: any;
    public image_very_negative_img: string; // ảnh tức giận
    public image_negative_img: string;      // ảnh bình thường
    public image_very_positive_img: string; // ảnh rất hài lòng
    public image_positive_img: string;      // ảnh ảnh hài lòng
    public time_now: string;
    public Indexstart: any;  // ngModel ngày bắt đầu
    public IndexEnd: any;    // ngModel ngày kế thúc
    public table: any;
    btnApplyValid = false;
    displaylocation = false;
    displayquestion = false;
    hidden_menu_location = false;
    indexOption: Array<IOption>;
    organization_arr_option: Array<IOption>;
    organization_arr_optionSelected: string;  // thay đổi theo kích
    indexOptionSelected: string;              // thay đổi theo kích
    location: string;

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
                // tslint:disable-next-line:max-line-length
                this.start_date = this.appservice.convert_dateint_tostringdate((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
                // tslint:disable-next-line:max-line-length
                this.end_date = this.appservice.convert_dateint_tostringdate((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
                // console.log('this.start_date', this.start_date);
                // console.log(' this.end_date', this.end_date);
                intDateRangePickerFBA(Number(new Date()), Number(new Date()));       // hàm cho ngày bắt đầu 2  input bắt đầu và kết thúc
                /*----------  Định dạng hiển thị ngày lên giao diện ----------*/
                // tslint:disable-next-line:max-line-length
                this.style_start_date = this.appservice.convert_dateint_tostringdatemonth((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
                // tslint:disable-next-line:max-line-length
                this.style_end_date = this.appservice.convert_dateint_tostringdatemonth((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
                // this.time_period = this.style_start_date + ' - ' + this.style_end_date; // hiện khung giờ
                this.time_period = 'Hôm nay'; // hiện khung giờ
                this.indexOption = param.fba_index;                        // NPS INDEX
                this.indexOptionSelected = this.indexOption[0].value;      // NPS INDEX đầu tiên
                this.startTimeOption = param.start_time_list;              // Mảng thời gian bắt đầu
                this.startTime = this.startTimeOption[0].value.toString(); // thời gian bắt đầu hiện selected
                this.endTimeOption = param.end_time_list;                  // Mảng thời gian kết thúc
                this.endTime = this.endTimeOption[22].value.toString();    // thời gian kết thúc hiện selected
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
        // this.blockUI.start('Đang tải thông tin tổ chức...');
        this.appservice.fba_get_org_tree(this.organization_id)
            .then(res => {
                // console.log('get_sitetree', res);
                this.menu_tree = res;
                this.location = this.menu_tree[0].site_name;
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
                // console.log('get_question', param);
                // console.log('ID organization tổ chức in get_question', organization);
                this.questions_ongoing = param.questions_ongoing; // 3 vòng lặp
                this.questions_upcoming = param.questions_upcoming;
                this.questions_ended = param.questions_ended;
                if (param.questions_ongoing.length > 0) {
                    this.question_name = this.questions_ongoing[0].question_name;              // hiện trên giao diện
                    this.question_id = this.questions_ongoing[0].question_id;                  // gắn question_id mặc định khi load đầu tiên
                    this.image_very_negative_img = this.questions_ongoing[0].very_negative_img; // lấy ảnh mặc định
                    this.image_negative_img = this.questions_ongoing[0].negative_img;
                    this.image_very_positive_img = this.questions_ongoing[0].very_positive_img;
                    this.image_positive_img = this.questions_ongoing[0].positive_img;
                } else if (param.questions_ended.length > 0) {
                    this.question_name = this.questions_ended[0].question_name;               // hiện trên giao diện
                    this.question_id = this.questions_ended[0].question_id;                   // gắn question_id mặc định khi load đầu tiên
                    this.image_very_negative_img = this.questions_ended[0].very_negative_img; // lấy ảnh mặc định
                    this.image_negative_img = this.questions_ended[0].negative_img;
                    this.image_very_positive_img = this.questions_ended[0].very_positive_img;
                    this.image_positive_img = this.questions_ended[0].positive_img;
                } else if (param.questions_upcoming.length > 0) {
                    this.question_name = this.questions_upcoming[0].question_name;              // hiện trên giao diện
                    this.question_id = this.questions_upcoming[0].question_id;                 // gắn question_id mặc định khi load đầu tiên
                    this.image_very_negative_img = this.questions_upcoming[0].very_negative_img; // lấy ảnh mặc định
                    this.image_negative_img = this.questions_upcoming[0].negative_img;
                    this.image_very_positive_img = this.questions_upcoming[0].very_positive_img;
                    this.image_positive_img = this.questions_upcoming[0].positive_img;
                } else {
                    this.question_name = 'Đang cập nhật'; // hiện trên giao diện
                    this.question_id = null;    // gắn question_id mặc định khi load đầu tiên
                    this.image_very_negative_img = ''; // lấy ảnh mặc định
                    this.image_negative_img = '';
                    this.image_very_positive_img = '';
                    this.image_positive_img = '';
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
    show_menu_location() {     // hiện menu tổ chức theo user
        const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
        // console.log('userInfo', userInfo);
        if (userInfo.lever === '0') {
            this.hidden_menu_location = false;
        } else {
            this.hidden_menu_location = true;
        }
    }
    changeorganization(event) { // thay đổi tổ chức
        this.organization_id = event.value;
        this.locationSelectionDisplay = false;
        this.get_sitetree();
    }
    changeitem(organization_id, id, site_name) {  //  chọn địa điểm
        this.organization_id = organization_id;
        this.site_id = id;
        this.location = site_name;
        this.siteSelectionDisplay = false;
        // this.get_data();
    }

    question_change(question_id, question_name, very_positive_img, positive_img, negative_img, very_negative_img) { // thay đổi câu hỏi
        this.question_id = question_id;
        this.question_name = question_name;
        this.image_very_negative_img = very_negative_img;
        this.image_negative_img = negative_img;
        this.image_very_positive_img = very_positive_img;
        this.image_positive_img = positive_img;
        // this.get_data();
    }
    change_view() { // thay đổi giờ ngày tuần d-lock
        this.blockUI.start('Đang tải dữ liệu...');
        this.get_data();
    }

    chonthoigian(item) {                               // thay đổi tuần tháng năm thời kỳ
        // khai báo ngày hiện tại
        const ngayhomnay = new Date();
        const stylehomnay = Number(ngayhomnay);       // đổi kiểu ngày sang number giống dateranker value
        if (item.value === 'yesterday') {
            const ngayhomqua = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            const stylehomqua =  Number(ngayhomqua);  //  đổi kiểu ngày sang number giống dateranker value
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
            const stylethangtruocketthuc =  Number(thangtruocketthuc);         // đổi kiểu ngày
            this.time_period = item.label;
            this.Indexstart = stylethangtruoc;
            this.IndexEnd = stylethangtruocketthuc;
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'last_year') {
            const daunamtruoc = new Date(Number(ngayhomnay.getFullYear()) - 1, 0, 1);
            const cuoinamtruoc = new Date(Number(ngayhomnay.getFullYear()) - 1, 11, 31);
            const styledaunamtruoc = Number(daunamtruoc);     // đổi kiểu ngày
            const stylecuoinamtruoc =  Number(cuoinamtruoc);  // đổi kiểu ngày
            this.time_period = item.label;
            this.Indexstart = styledaunamtruoc;
            this.IndexEnd = stylecuoinamtruoc;
            this.siteSelectionDisplay2 = false;
        } else  if (item.value === 'today') {                                    // hôm nay
            const ngayhomqua = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            const stylehomqua =  Number(ngayhomqua);       //  đổi kiểu ngày sang number giống dateranker value
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
            const stylengaydauthangnay =  Number(ngaydauthangnay);
            // console.log('a', ngaydauthangnay);
            const ngaycuoithangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth() + 1, 0);
            const stylengaycuoithangnay =  Number(ngaycuoithangnay);
            this.time_period = 'Tháng này';
            this.Indexstart = stylengaydauthangnay;
            this.IndexEnd = stylengaycuoithangnay;
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'last_fourteen_day') {                                                      // 14 ngày trước
            const ngaybatdau = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 14);
            const stylengaybatdau = Number(ngaybatdau);
            const ngayketthuc = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            const stylenngayketthuc = Number(ngayketthuc);
            // console.log('a', ngaybatdau);
            // console.log('b', ngayketthuc);
            this.time_period = '14 ngày trước';
            this.Indexstart = stylengaybatdau;
            this.IndexEnd = stylenngayketthuc;
            this.siteSelectionDisplay2 = false;
        } else if (item.value === 'this_year') {                                                      // 14 ngày trước
            const ngaybatdaun = new Date(ngayhomnay.getFullYear(), 0, 1);
            const stylengaybatdaun = Number(ngaybatdaun);
            const ngayketthucn = new Date(ngayhomnay.getFullYear(), 11, 31);
            const stylenngayketthucn = Number(ngayketthucn);
            // console.log('a', ngaybatdaun);
            // console.log('b', ngayketthucn);
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
        // tslint:disable-next-line:max-line-length
        this.style_end_date = this.appservice.convert_dateint_tostringdatemonth((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
        this.style_start_date_number = Number((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
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
            // ,start_date: '\'2018-11-01\''
            // ,end_date:  '\'2018-11-30\''
            , view_by: this.viewDataBy
        };
        // console.log('DATA', data);

        this.appservice.post(data, environment.FBA.API.fba_report_metrics_analytic).subscribe(
            respo => {
                // console.log('FBA_report_metrics_analytic', respo);
                this.data = respo; // data cho bảng
                this.showchart();
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
    showchart() {
        Highcharts.chart(this.container.nativeElement, {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                // tslint:disable-next-line:max-line-length
                categories: ['1/10', '2/10', '3/10', '4/10', '5/10', '6/10', '7/10', '8/10', '9/10', '10/10', '11/10', '12/10', '13/10', '14/10', '15/10', '16/10', '17/10', '18/10', '19/10', '20/10', '21/10', '22/10', '23/10', '24/10', '25/10', '26/10', '27/10', '28/10', '29/10', '30/10', '31/10']
            },

            plotOptions: {
                series: {
                    //  pointWidth: 18, // độ rộng cột
                    stacking: 'normal',
                    lineWidth: 1,      // đường line
                    color: 'blue',     // màu đường line
                    states: {          // hover line
                        hover: {
                            enabled: false
                        }
                    },
                    marker: {
                        radius: 4      // điểm line
                    }
                }
            },
            yAxis: [{
                className: '',
                title: {
                    text: ''
                },
                stackLabels: { // hiện tổng cột
                    style: {
                        color: '#4f0a0a',
                        fontSize: '10px', fontWeight: 'bold'
                    },
                    rotation: -92,
                    y: -20,
                    x: 3,
                    enabled: true
                }
            },
            {
                className: '', // màu
                opposite: true,
                title: {
                    text: 'NPS'
                }
            }],
            series: [{
                name: 'Rất hài lòng',
                showInLegend: false,
                color: '#069D30',
                // tslint:disable-next-line:max-line-length
                data: [54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 52, 62, 25, 82, 62, 90, 31, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4],
                tooltip: {
                    valuePrefix: '',
                },
            }, {
                name: 'Hài lòng',
                showInLegend: false,
                color: '#A0C883',
                // tslint:disable-next-line:max-line-length
                data: [54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 52, 62, 25, 82, 62, 90, 31, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4],
                tooltip: {
                    valuePrefix: '',
                },
            }, {
                name: 'Bình thường',
                showInLegend: false,
                color: '#e18889',
                // tslint:disable-next-line:max-line-length
                data: [54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 52, 62, 25, 82, 62, 90, 31, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4],
                tooltip: {
                    valuePrefix: '',
                },
            }, {
                name: 'Tức giận',
                showInLegend: false,  // none legend
                color: '#ED1E24',
                // tslint:disable-next-line:max-line-length
                data: [29.9, 71.5, 106.4, 92, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 52, 62, 25, 82, 62, 90],
                tooltip: {
                    valuePrefix: '',
                },
            }, {
                type: 'spline',
                name: 'NPS',
                showInLegend: false,
                // tslint:disable-next-line:max-line-length
                data: [80, 20, 50, 36, 54, 229, 71, 10, 12, 20, 50, 50, 9, 54, 52, 62, 25, 82, 62, 90, 31, 75, 70, 35, 48, 50, 80, 30, 50, 70, 10],
                marker: {
                    // lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[10],
                    fillColor: 'blue' // màu các điểm
                }, yAxis: 1,
                tooltip: {
                    valuePrefix: '',
                },
            }],

            tooltip: {
                backgroundColor: 'white',
                // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true,

            }
        });
    } // End hightchart
} /*Kết thúc class*/















