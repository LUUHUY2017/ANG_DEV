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
import { ViewEncapsulation  } from '@angular/core';

More(Highcharts);
Tree(Highcharts);
Heatmap(Highcharts);

// thêm mới dateranger
declare function intDateRangePickerFBA(start_date, end_date): any;
// tree node
import { TreeNode } from 'primeng/components/common/treenode';

@Component({
    templateUrl: './reason.component.html',
    styleUrls: ['./reason.component.css'],
    // chỉnh css angular
    encapsulation: ViewEncapsulation.None
})
export class FbaReasonComponent implements OnInit {

    // **** kết thúc phần hiển thị popup ******

    constructor(private router: Router, private appservice: AppService) {
        // thêm mới
        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
        });
        this.changes.observe(<Element>this.element, {
            attributes: true
        });
        // kết thúc

    }
 page_id = '\'' + environment.Pages.fba.reason + '\'';
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('container', { read: ElementRef }) container: ElementRef;
    time_generate_report = new Date();

    // public navItems = navItems;
    public sidebarMinimized = true;
    private changes: MutationObserver;
    public element: HTMLElement = document.body;

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
    public total: any;
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
    very_negative_name: string;                       // tên đánh giá: kém
    negative_name: string;
    very_positive_name: string;
    positive_name: string;
    table_very_negative_name: string;
    table_negative_name: string;

    public title_time_period: string;
    public time_period2: string;
    public title_question_name: string;
    public title_location: string;


    /*----------  Giá trị mặc định  ----------*/
    viewDataBy = 'Hour';
    Viewhienthi = 'Số lượng';
    total_negative = 0;        // tổng lý do bình thường
    total_very_negative = 0;   // tổng lý do tức giận
    total_very_positive = 0;
    total_positive = 0;
    total_total_negative = 0;  // tổng 2 lý do không hài lòng
    total_total_negatives = 0;
    total_danh_gia = 0;
    num_very_negative = 0;
    num_negative = 0;
    tong = 0;
    tong_tieucuc_lydo = 0;
    tong_so_total_negative = 0;
    tong_danh_gia = 0;       // api total_reason
    tong_mat_hong: number;
    tong_mat_do: number ;
    tong_hai_mat = 0;
     /*----------  xuất excel  ----------*/
    datatable: any = [{
        eid: 'e101',
        ename: 'ravi',
        esal: 1000
    }, {
        eid: 'e102',
        ename: 'ram',
        esal: 2000
    }, {
        eid: 'e103',
        ename: 'rajesh',
        esal: 3000
    }];



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
                intDateRangePickerFBA( Number(new Date()), Number(new Date()));    // hàm cho ngày bắt đầu 2  input bắt đầu và kết thúc
                // tslint:disable-next-line:max-line-length
                this.start_date = this.appservice.convert_dateint_tostringdate((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
                // tslint:disable-next-line:max-line-length
                this.end_date = this.appservice.convert_dateint_tostringdate((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
                // console.log('this.start_date', this.start_date);
                // console.log(' this.end_date', this.end_date);
                /*----------  Định dạng hiển thị ngày lên giao diện ----------*/
                // tslint:disable-next-line:max-line-length
                this.style_start_date = this.appservice.convert_dateint_tostringdatemonth((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
                // tslint:disable-next-line:max-line-length
                this.style_end_date = this.appservice.convert_dateint_tostringdatemonth((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
                // this.time_period = this.style_start_date + ' - ' + this.style_end_date; // hiện khung giờ
                this.time_period = 'Hôm nay'; // hiện khung giờ
                this.title_time_period = this.time_period;
                this.indexOption = param.fba_index; // NPS INDEX
                this.indexOptionSelected = this.indexOption[0].value;        // NPS INDEX đầu tiên
                this.startTimeOption = param.start_time_list;                // Mảng thời gian bắt đầu
                this.startTime = this.startTimeOption[0].value.toString();   // thời gian bắt đầu hiện selected
                this.endTimeOption = param.end_time_list;                    // Mảng thời gian kết thúc
                this.endTime = this.endTimeOption[22].value.toString();      // thời gian kết thúc hiện selected
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
                // console.log('get_sitetree', res);
                this.menu_tree = res;
                this.location = this.menu_tree[0].site_name;
                this.title_location =  this.location;
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
                this.questions_ongoing = param.questions_ongoing;                      // 3 vòng lặp
                this.questions_upcoming = param.questions_upcoming;
                this.questions_ended = param.questions_ended;
                 if (param.questions_ongoing.length > 0) {
                     this.question_name = this.questions_ongoing[0].question_name;     // hiện trên giao diện
                     this.title_question_name = this.question_name;
                     this.question_id = this.questions_ongoing[0].question_id;         // gắn question_id mặc định khi load đầu tiên
                     this.image_very_negative_img = this.questions_ongoing[0].very_negative_img; // lấy ảnh mặc định
                     this.image_negative_img = this.questions_ongoing[0].negative_img;
                     this.image_very_positive_img = this.questions_ongoing[0].very_positive_img;
                     this.image_positive_img = this.questions_ongoing[0].positive_img;

                     this.very_negative_name = this.questions_ongoing[0].very_negative;      // lấy tên đánh giá: kém
                     this.negative_name = this.questions_ongoing[0].negative;
                     this.very_positive_name = this.questions_ongoing[0].very_positive;
                     this.positive_name = this.questions_ongoing[0].positive;
                     // tslint:disable-next-line:max-line-length
                     this.table_very_negative_name = this.very_negative_name[0].toUpperCase() + this.very_negative_name.substr(1).toLowerCase();
                     this.table_negative_name = this.negative_name[0].toUpperCase() + this.negative_name.substr(1).toLowerCase();
                } else if (param.questions_ended.length > 0) {
                    this.question_name = this.questions_ended[0].question_name;               // hiện trên giao diện
                    this.title_question_name = this.question_name;
                    this.question_id = this.questions_ended[0].question_id;                   // gắn question_id mặc định khi load đầu tiên
                    this.image_very_negative_img = this.questions_ended[0].very_negative_img; // lấy ảnh mặc định
                    this.image_negative_img = this.questions_ended[0].negative_img;
                    this.image_very_positive_img = this.questions_ended[0].very_positive_img;
                    this.image_positive_img = this.questions_ended[0].positive_img;

                    this.very_negative_name = this.questions_ended[0].very_negative;          // lấy tên đánh giá: kém
                    this.negative_name = this.questions_ended[0].negative;
                    this.very_positive_name = this.questions_ended[0].very_positive;
                    this.positive_name = this.questions_ended[0].positive;
                    // tslint:disable-next-line:max-line-length
                    this.table_very_negative_name = this.very_negative_name[0].toUpperCase() + this.very_negative_name.substr(1).toLowerCase();
                    this.table_negative_name = this.negative_name[0].toUpperCase() + this.negative_name.substr(1).toLowerCase();
                } else if (param.questions_upcoming.length > 0) {
                    this.question_name = this.questions_upcoming[0].question_name;                // hiện trên giao diện
                    // tslint:disable-next-line:max-line-length
                    this.title_question_name = this.question_name;
                    // tslint:disable-next-line:max-line-length
                    this.question_id = this.questions_upcoming[0].question_id;                    // gắn question_id mặc định khi load đầu tiên
                    this.image_very_negative_img = this.questions_upcoming[0].very_negative_img;  // lấy ảnh mặc định
                    this.image_negative_img = this.questions_upcoming[0].negative_img;
                    this.image_very_positive_img = this.questions_upcoming[0].very_positive_img;
                    this.image_positive_img = this.questions_upcoming[0].positive_img;

                    this.very_negative_name = this.questions_upcoming[0].very_negative;            // lấy tên đánh giá: kém
                    this.negative_name = this.questions_upcoming[0].negative;
                    this.very_positive_name = this.questions_upcoming[0].very_positive;
                    this.positive_name = this.questions_upcoming[0].positive;
                    // tslint:disable-next-line:max-line-length
                    this.table_very_negative_name = this.very_negative_name[0].toUpperCase() + this.very_negative_name.substr(1).toLowerCase();
                    this.table_negative_name = this.negative_name[0].toUpperCase() + this.negative_name.substr(1).toLowerCase();
                } else {
                    this.question_name = 'Đang cập nhật';          // hiện trên giao diện
                    this.question_id = null;                       // gắn question_id mặc định khi load đầu tiên
                    this.image_very_negative_img = '';             // lấy ảnh mặc định
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

    changeitem(organization_id, id, site_name) {  // thay đổi địa điểm khu vực
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
    // thaydoichart(event) {  // thay đổi chart khi chọn Index
    //     this.indexOptionSelected = event.value;
    //     this.get_data();
    // }
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
         this.style_start_date_number = Number((document.getElementById('startDateReportTemp') as HTMLInputElement).value);
        this.style_end_date_number = Number((document.getElementById('endDateReportTemp') as HTMLInputElement).value);
        // console.log('a', this.style_start_date_number);
        // console.log('b', this.style_end_date_number);
        if (this.style_start_date_number !==  this.Indexstart && this.style_end_date_number !==  this.IndexEnd ) {
            this.time_period = this.style_start_date + ' - ' + this.style_end_date; // show ngày từ ngày này đến ngày này
            this.title_time_period = ' Ngày';
        } else { this.title_time_period = this.time_period; }

        this.title_location = this.location;
        this.title_question_name = this.question_name;
        this.get_data();
    }

    exportExcel(event): void {
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
        //     (error) => {
                    // console.log(error);
            //         this.blockUI.stop();
            //         // this.blockUI.start('Lỗi, không kết nối được máy chủ');
            //     },
            //     () => {
                //         this.blockUI.stop();
                //     }
                // ); // fba_report_metrics_analytic
                // this.appservice.exportAsExcelFile(this.table, 'Phân tích chỉ số');
                this.appservice.exportAsExcelFile(this.data, 'Lý do không hài lòng');
            }

   get_data() {
        const data = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , question_id: this.question_id
            , start_hour: '\'' + this.startTime + '\''
            , end_hour: '\'' + this.endTime + '\''
            , start_date:  this.start_date
            , end_date: this.end_date
            // ,start_date: '\'2018-11-01\''
            // ,end_date:  '\'2018-11-30\''
            , view_by: this.viewDataBy
        };
        // console.log('DATA', data);

        this.appservice.post(data, environment.FBA.API.fba_report_reason).subscribe(
            respo => {
                // console.log('tất cả data gửi về', respo);

                this.data = respo.fba_reason_chart;          // data cho bảng chi tiết từng lý do
                this.total = respo.total_reason;              // data tổng lý do
                this.tong_danh_gia = respo.total_reason[0].total_response;
                this.tong_mat_hong = respo.total_reason[0].negative ;
                this.tong_mat_do = respo.total_reason[0].very_negative;
                this.tong_hai_mat = Number( this.tong_mat_do +  this.tong_mat_hong);
                // console.log('TĐG + TMH +TMĐ + THM', this.tong_danh_gia, this.tong_mat_hong, this.tong_mat_do, this.tong_hai_mat );

                this.total_negative = 0;
                this.total_very_negative = 0;
                this.total_very_positive = 0;
                this.total_positive = 0;
                this.total_danh_gia = 0;
                this.total_total_negative = 0;
                this.tong_tieucuc_lydo = 0;
                this.tong_so_total_negative = 0;

                /*----------  Tính tổng từng đánh giá ----------*/
                this.data.forEach(element => {
                    this.total_negative += Number(element.negative);              // tổng negative
                    this.total_very_negative += Number(element.very_negative);    // tổng very negative
                    this.total_very_positive += Number(element.very_positive);    // tổng đánh giá rất hài lòng
                    this.total_positive += Number(element.positive);              // tổng đánh giá hài lòng
                    this.tong_so_total_negative += Number(element.total_negative);        // tổng đánh giá tiêu cức
                });

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
        // Kí tự đầu chữ hoa : tên các đánh giá: Kém
        const tong_so_total_negative = this.tong_so_total_negative;
        const very_negative_name = this.very_negative_name[0].toUpperCase() + this.very_negative_name.substr(1).toLowerCase();
        const negative_name = this.negative_name[0].toUpperCase() + this.negative_name.substr(1).toLowerCase();

        let i = 0;
        const chart_xAxis = [];
        const negative = [];
        const very_negative = [];
        this.data.forEach(element => {
            chart_xAxis[i] = element.reason_name;
            negative[i] = Number(element.negative);
            very_negative[i] = Number(element.very_negative);
            i++;
        });
        // console.log('chart_xAxis:', chart_xAxis);


        Highcharts.chart(this.container.nativeElement, {
            chart: {
                type: 'bar'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: chart_xAxis,
            },
            yAxis: {
                endOnTick: true,
                maxPadding: 0.25,
                min: 0,
                title: {
                    text: ''
                },
                stackLabels: { // hiện tổng
                  style: {
                        color: '#23282c',
                        fontSize: '9px', fontWeight: 'bold'},
                    enabled: true,
                    useHTML: true,
                    formatter: function () {
                        const pcnt = (this.total / tong_so_total_negative) * 100;
                        const tong = this.total;
                       // tslint:disable-next-line:max-line-length
                       return '<span  style="font-size:12px;font-family: Roboto,sans-serif;cursor:pointer" >' + tong  + '  <i style="color:gray;font-size:11px;font-weight:400;z-index:-1;font-family: Roboto,sans-serif;"> (' + ( pcnt.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '%)') + '</i><br></span>' ;
                    }


                },
           },
            legend: {
                reversed: true,
                enabled: false,
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                      marker: {
                        radius: 4 // điểm line
                    },
                    dataLabels: {
                        enabled: true,
                        useHTML: true,
                        formatter: function () {
                            const pcnt = (this.y / tong_so_total_negative) * 100;
                            const y = this.y;
                            // tslint:disable-next-line:max-line-length
                            return '<span  style="font-size:11px;font-family: Roboto,sans-serif;cursor:pointer" >' + y  + '</span><i style="font-size:11px;font-weight:400;z-index:-1;font-family: Roboto,sans-serif;font-style: italic;cursor:pointer"> (' + pcnt.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '%' + ')</i>';
                        }
                    }
                }
            },
           series: [
            {
                name: very_negative_name,
                data: very_negative,
                tooltip: {
                    valuePrefix: '',
                    valueSuffix: ' ',
                },
                color: environment.POC.colors.very_negative,

            }, {
                name: negative_name,
                data: negative,
                tooltip: {
                    valuePrefix: '',
                    valueSuffix: ' ',
                },
                color:  environment.POC.colors.negative,
            }, ],
            tooltip: {
                backgroundColor: 'white',
                shared: true,
                distance: 50,  // khoảng cách đến các tooltip
            }
            });
    }
} /*Kết thúc class*/









