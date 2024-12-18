import { IOption } from 'ng-select';
import { DatePipe } from '@angular/common';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';

// highcharts
import Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import { language } from '../../../language';
import { language_en } from '../../../language_en';

import { ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
More(Highcharts);

// thêm mới dateranger
declare function intDateRangePicker(start_date, end_date): any;

// tree node
import { TreeNode } from 'primeng/components/common/treenode';

@Component({
    templateUrl: './fba-overview.component.html',
    styleUrls: ['./fba-overview.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FbaOverviewComponent implements OnInit {
    time: any;
    public modalRef: BsModalRef;
    type_language = JSON.parse(localStorage.getItem(environment.language));
    constructor(private router: Router,
        private appservice: AppService,
        private modalService: BsModalService) {
        this.type_language === 'vn' ? this.language = language : this.language = language_en;
    }
    page_id = environment.Pages.fba.overview;
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('content') public helloTemplate: ElementRef;
    @ViewChild('chart_reason_nagative', { read: ElementRef }) chart_reason_nagative: ElementRef;
    time_generate_report = new Date();

    // * organizations */
    organizations = [];
    organization_id = 0;
    organization_selected = ''; // chọn organization khi load hộp thoại

    // * end organizations */
    // biến phiên làm việc cũ
    old_session = {
        site_id: null,
        end_date: null,
        end_hour: null,
        organization_id: null,
        question_id: null,
        start_date: null,
        start_hour: null,
        time_label: null,
        viewDataBy: null,
        start_date_pre: null,
        end_date_pre: null,
        time: null
    };
    // * Site tree by organizations */
    site_cols = [
        { field: 'id', header: '#' },
        { field: 'site_name', header: 'Tên' },
    ];

    siteSelectionDisplay = false;
    displaylocation = false;
    displayperiod = false;

    siteTreeList: any; // khai báo site tree list
    site_name: any;
    site_id = 0;
    siteNodeSelected: TreeNode;

    very_negative_label: any;
    negative_label: any;
    // * Site tree by organizations */

    start_date: any;
    end_date: any;

    public startTimeOption: Array<IOption>;
    public endTimeOption: Array<IOption>;


    total_num_to_enter = 0;
    total_traffic = 0;
    total_avg_time = 0;
    // biến hiệu suất
    cx_performance = {
        title: null,
        content: null,
        image: null
    };
    nps_performance = {
        title: null,
        content: null,
        image: null
    };
    viewDataBy = 'CX Index';
    // ==================
    // Decorator wires up blockUI instance
    // Nghĩa thêm menu đệ quy

    menu: any;
    menudequy = [];
    location: string;
    // end menu đệ quy
    // biến trong biểu đồ
    total_reason: number;
    // Nghĩa thêm biến emotion_now
    public emotion_now: any = {
        very_positive: null,
        positive: null,
        negative: null,
        very_negative: null,
        total_response: null,
        very_positive_percen: null,
        positive_percen: null,
        negative_percen: null,
        very_negative_percen: null,
        cx_index: null,
        happy_index: null
    };

    public emotion_before: any = {
        very_positive: null,
        positive: null,
        negative: null,
        very_negative: null,
        total_response: null,
        very_positive_percen: null,
        positive_percen: null,
        negative_percen: null,
        very_negative_percen: null,
        cx_index: null,
        happy_index: null
    };
    public comparison_total_emotion: number;
    carret: string;
    topreason: any;
    // biến câu hỏi
    questions_ongoing: any;
    questions_ended: any;
    questions_upcoming: any;
    popuplocation = false;
    // biến ẩn menu chọn khu vực
    hidden_menu_location: boolean;
    // biến cx_index và nps_index
    total_response = [];
    cx_index_percent_now: number;
    cx_index_percent_comparison: number; // hiệu số của cx_index
    nps_index_percent_now: number;
    nps_index_percent_comparison: number; // hiệu số của nps_index
    carret_nps_index: string;
    carret_cx_index: string;
    // biến time period
    time_label: string;
    time_now: any;
    time_yesterday: string;
    time_now_pre: string;
    time_yesterday_pre: string;
    fba_time_period_overview: any;
    // Nghĩa thêm biến boolean menu
    toggle_menu = false;
    // biến tổ chức
    organization: any;
    // biến base 64 ảnh cảm xúc
    very_positive: string;
    positive: string;
    negative: string;
    very_negative: string;
    // biến bảng top kết quả
    top_result = [];
    top_result_nps_index = [];
    // biến trong bảng những điểm có kết quả tốt nhất
    public top_site_respon = [];
    public top_site_respon_pre = [];
    // public navItems = navItems;
    public sidebarMinimized = true;
    private changes: MutationObserver;
    public element: HTMLElement = document.body;


    // biến so với ...
    comparison_with: string;
    // biến menu_tree: any; dùng để lấy cấu trúc cấy của menu
    menu_tree: any;
    snap_menu_tree: any;

    // biến question
    question: string;
    // Index compare
    OrgOption = [];
    OrgOptionSelected = 'ACS Solutions';
    // Id câu hỏi
    question_id: number; language: any; show_error = false;

    ngOnInit() {
        this.menu_tree = [];
        this.show_menu_location();
        // lấy thông số của trang tương ứng với user
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

    // Hàm lấy thông số cấu hình
    get_page_param() {
        this.blockUI.start(this.language.dang_tai_cau_hinh);
        this.appservice.get_user_page_parametter_v2(this.page_id, this.type_language).subscribe(
            param => {
                try {
                    if (!environment.production) {
                        console.log(param);
                        console.log(param.organization_arr);
                    }
                    this.OrgOption = param.organization_arr; // Lấy tổ chức
                    this.fba_time_period_overview = param.fba_time_period_overview; // Lấy thời kì
                    // Nếu có phiên làm việc trước
                    if (param.user_page_parametter.organization_id !== undefined) {
                        this.organization_id = param.user_page_parametter.organization_id; // thông số tổ chức
                        // Lưu dữ liệu phiên làm việc trước
                        this.old_session = param.user_page_parametter;
                        this.time_label = param.fba_time_period_overview.find(e => e.value === param.user_page_parametter.time).label;
                        this.time = this.old_session.time;
                        this.time_change(this.time, this.time_label);
                        if (!environment.production) {
                            console.log('đã có dữ liệu phiên bản làm việc trước');
                        }
                        this.viewDataBy = this.old_session.viewDataBy; // thống số CX/NPS
                        // Nếu không có phiên làm việc trước
                    } else {
                        this.organization_id = param.organization_arr[0].value;
                        this.time_label = this.fba_time_period_overview[0].label;
                        this.time = this.fba_time_period_overview[0].value;
                        this.time_change(this.time, this.time_label);
                    }
                    // Hàm xử lý "So với ..."
                    this.compare_width_time();

                } catch (error) {
                    this.blockUI.stop();
                    this.show_error = true;
                }
            }, (error) => {
                this.blockUI.stop();
                // this.push_notification();
                this.show_error = true;
            }, () => {
                this.blockUI.stop();
                // Lấy menu theo tổ chức
                this.get_sitetree();
            }
        );
    }

    // So sánh với thời gian
    compare_width_time() {
        if (this.type_language === 'vn') {
            if (this.time_label.search('trước') !== -1) {
                this.comparison_with = this.time_label.replace(/trước/, 'trước nữa');
            }
            if (this.time_label.search('qua') !== -1) {
                this.comparison_with = this.time_label.replace(/qua/, 'kia');
            }
            if (this.time_label.search('nay') !== -1) {
                this.comparison_with = this.time_label.replace(/nay/, 'qua');
            }
            if (this.time_label.search('này') !== -1) {
                this.comparison_with = this.time_label.replace(/này/, 'trước');
            }
        } else {
            switch (this.time_label) {
                case 'Today':
                    this.comparison_with = 'Yesterday';
                    break;
                case 'Yesterday':
                    this.comparison_with = '2 days ago';
                    break;
                case 'This week':
                    this.comparison_with = 'Last week';
                    break;
                case 'Last week':
                    this.comparison_with = '2 weeks ago';
                    break;
                case 'This month':
                    this.comparison_with = 'Last month';
                    break;
                case 'Last month':
                    this.comparison_with = '2 months ago';
                    break;
                case 'This year':
                    this.comparison_with = 'Last year';
                    break;
                case 'Last year':
                    this.comparison_with = '2 years ago';
            }
        }
    }

    // Hàm lấy menu theo tổ chức
    get_sitetree() {
        this.blockUI.start(this.language.dang_tai_thong_tin_to_chuc);
        const url = environment.API.sites + '_get_site_for_report';
        const data = { organization_id: this.organization_id };
        this.appservice.post(data, url).subscribe(res => {
            try {
                // console.log(res);
                this.menu_tree = [];
                // this.menu_tree = res.site_array.slice(0);
                this.recusive_menu(res.site_array);
                this.snap_menu_tree = this.menu_tree.slice(0);
                // Nếu có phiên làm việc cũ thì lấy dữ liệu theo phiên làm việc cũ
                if (this.old_session.organization_id != null) {
                    if (!environment.production) {
                        console.log(this.old_session);
                    }
                    this.menu_tree.forEach(e => {
                        if (e.id === this.old_session.site_id) {
                            this.location = e.site_name;
                            this.site_id = e.id;
                        }
                    });
                } else { // Nếu không có phiên làm việc thì lấy dữ liệu mặc định
                    const first_array = this.menu_tree.find(item => Number(item.enables) === 1);
                    this.site_id = first_array.id;
                    this.location = first_array.site_name;
                }
                this.get_question();
            } catch (error) {
                this.blockUI.stop();
                // this.push_notification();
                this.show_error = true;
            }
        }, (error) => {
            this.blockUI.stop();
            this.show_error = true;
        }, () => {
            // this.blockUI.stop();
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
                    , organization_id: element.organization_id
                    , parent_id: element.parent_id
                    , alevel: space
                    , enables: element.enables
                });
                const scope = space + 1;
                this.recusive_menu(array, a_id, scope);
            }
        });
    }
    // End hàm lấy menu

    // Hàm lấy câu hỏi
    get_question() {
        this.blockUI.start(this.language.dang_tai_cau_hoi);
        const question = {
            organization_id: this.organization_id
        };
        if (!environment.production) {
            console.log(question);
        }
        this.appservice.post(question, environment.FBA.API.get_question_for_report).subscribe(
            res => {
                try {
                    if (!environment.production) {
                        console.log(res);
                    }
                    this.questions_ongoing = res.questions_ongoing;
                    this.questions_ended = res.questions_ended;
                    this.questions_upcoming = res.questions_upcoming;
                    // Nếu có phiên làm việc thì lấy giá trị theo phiên làm việc
                    if (this.old_session.organization_id != null) {
                        this.question_id = this.old_session.question_id;
                        this.question = this.language.fba_dang_cap_nhat;
                        this.questions_ongoing.forEach(e => {
                            if (!environment.production) {
                                console.log('ongoing', this.question_id);
                                console.log('e', e.question_id);
                            }
                            if (e.question_id === this.question_id) {
                                this.question = e.question_name;
                                this.very_positive = e.very_positive_img;
                                this.positive = e.positive_img;
                                this.negative = e.negative_img;
                                this.very_negative = e.very_negative_img;
                                this.very_negative_label = e.very_negative;
                                this.negative_label = e.negative;
                            }
                        });
                        this.questions_ended.forEach(e => {
                            if (!environment.production) {
                                console.log('ended');
                            }
                            if (e.question_id === this.question_id) {
                                this.question = e.question_name;
                                this.very_positive = e.very_positive_img;
                                this.positive = e.positive_img;
                                this.negative = e.negative_img;
                                this.very_negative = e.very_negative_img;
                                this.very_negative_label = e.very_negative;
                                this.negative_label = e.negative;
                            }
                        });
                        this.questions_upcoming.forEach(e => {
                            if (!environment.production) {
                                console.log('upcoming');
                            }
                            if (e.question_id === this.question_id) {
                                this.question = e.question_name;
                                this.very_positive = e.very_positive_img;
                                this.positive = e.positive_img;
                                this.negative = e.negative_img;
                                this.very_negative = e.very_negative_img;
                                this.very_negative_label = e.very_negative;
                                this.negative_label = e.negative;
                            }
                        });
                        // Nếu không có phiên làm việc thì lấy theo giá trị mặc định
                    } else {
                        if (!environment.production) {
                            console.log(this.old_session);
                        }
                        if (this.questions_ongoing.length > 0) {
                            this.question_id = this.questions_ongoing[0].question_id;
                            this.question = this.questions_ongoing[0].question_name;
                            this.very_positive = this.questions_ongoing[0].very_positive_img;
                            this.positive = this.questions_ongoing[0].positive_img;
                            this.negative = this.questions_ongoing[0].negative_img;
                            this.very_negative = this.questions_ongoing[0].very_negative_img;
                        } else if (this.questions_upcoming.length > 0) {
                            this.question_id = this.questions_upcoming[0].question_id;
                            this.question = this.questions_upcoming[0].question_name;
                            this.very_positive = this.questions_upcoming[0].very_positive_img;
                            this.positive = this.questions_upcoming[0].positive_img;
                            this.negative = this.questions_upcoming[0].negative_img;
                            this.very_negative = this.questions_upcoming[0].very_negative_img;
                        } else if (this.questions_ended.length > 0) {
                            this.question_id = this.questions_ended[0].question_id;
                            this.question = this.questions_ended[0].question_name;
                            this.very_positive = this.questions_ended[0].very_positive_img;
                            this.positive = this.questions_ended[0].positive_img;
                            this.negative = this.questions_ended[0].negative_img;
                            this.very_negative = this.questions_ended[0].very_negative_img;
                        } else {
                            this.question_id = 0;
                            this.question = this.language.fba_dang_cap_nhat;
                            this.very_positive = '';
                            this.positive = '';
                            this.negative = '';
                            this.very_negative = '';
                        }
                    }
                    // Sau khi lấy câu hỏi thì xóa phiên làm việc cũ.
                    this.old_session = {
                        site_id: null,
                        end_date: null,
                        end_hour: null,
                        organization_id: null,
                        question_id: null,
                        start_date: null,
                        start_hour: null,
                        time_label: null,
                        viewDataBy: null,
                        start_date_pre: null,
                        end_date_pre: null,
                        time: null
                    };
                } catch (error) {
                    this.blockUI.stop();
                }

            }, (error) => {
                this.blockUI.stop();
                this.show_error = true;
            }, () => {
                this.blockUI.stop();
                this.get_data();
            }
        );
    }
    // end hàm lấy câu hỏi

    // Hàm xử lý lấy dữ liệu từ server.
    get_data() {
        this.blockUI.start(this.language.dang_tai_du_lieu);
        const data = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , question_id: this.question_id
            , start_hour: '\'0:00\''
            , end_hour: '\'23:59\''
            , start_date: '\'' + this.time_yesterday + '\''
            , end_date: '\'' + this.time_now + '\''
            , start_date_pre: '\'' + this.time_yesterday_pre + '\''
            , end_date_pre: '\'' + this.time_now_pre + '\''
            , time_label: this.time_label
            , viewDataBy: this.viewDataBy
        };
        if (!environment.production) {
            console.log(data);
        }
        this.appservice.post(data, environment.FBA.API.sp_fba_overview_total).subscribe(
            res => {
                // try {
                if (!environment.production) {
                    console.log(res);
                }
                this.show_error = false;
                if (res.hasOwnProperty('status') && res.status === 0) {
                    // this.push_notification();
                    this.show_error = true;
                    this.blockUI.stop();
                }
                this.time_generate_report = new Date();
                // Xử lý dữ liệu biểu đồ
                const xAxis_category = [];
                this.total_reason = 0;
                const x_binhthuong = [];
                const x_tucgian = [];
                // tslint:disable-next-line:no-shadowed-variable
                res.top_reason.slice(-4).forEach(element => {
                    xAxis_category.push(element.reason_name);
                });
                // tslint:disable-next-line:no-shadowed-variable
                res.top_reason.slice(-4).forEach(element => {
                    x_binhthuong.push(+element.negative);
                    this.total_reason += Number(element.negative);
                });

                // tslint:disable-next-line:no-shadowed-variable
                res.top_reason.slice(-4).forEach(element => {
                    x_tucgian.push(+element.very_negative);
                    this.total_reason += Number(element.very_negative);
                });
                try {
                    const very_negative_name = this.very_negative_label[0].toUpperCase() + this.very_negative_label.substr(1).toLowerCase();
                    const negative_name = this.negative_label[0].toUpperCase() + this.negative_label.substr(1).toLowerCase();
                    this.load_chart_reason_negative(xAxis_category, x_binhthuong, x_tucgian, very_negative_name, negative_name);
                } catch (error) { }

                // Gọi hàm load biểu đồ
                // End hàm xử lý dữ liệu biểu đồ
                // Xử lý số liệu nhận được
                this.topreason = res.top_reason;
                this.emotion_now = res.data;
                this.emotion_before = res.data_pre;
                // số liệu nhóm các điểm có kết quả tốt nhất
                this.top_site_respon = [];
                this.top_site_respon_pre = [];
                this.top_result = [];
                this.total_response = [];
                this.top_site_respon = res.data_by_site;
                this.top_site_respon_pre = res.data_by_site_pre;
                // if (this.top_site_respon.length > 0 && this.top_site_respon_pre.length > 0) {
                this.sort_data_table(); // Sắp xếp dữ liệu theo CX_INDEX và NPS_INDEX
                const array = [];
                if (!environment.production) {
                    console.log('số liệu quá khứ', this.top_site_respon_pre);
                    console.log('số liệu hiện tại', this.top_site_respon);
                }
                // xử lý dữ liệu top các điểm đánh giá trước khi sắp xếp
                for (let i = 0; i < this.top_site_respon.length; i++) {
                    // tslint:disable-next-line:max-line-length
                    const a_response = this.top_site_respon[i] ? Number(this.top_site_respon[i].total_response) : 0;
                    const b_response = this.top_site_respon_pre[i] ? Number(this.top_site_respon_pre[i].total_response) : 0;
                    const total_caret = (a_response > b_response) ? 'caret-up' : (a_response === b_response) ? 'sort' : 'caret-down';
                    // tslint:disable-next-line:max-line-length
                    const total_comparison = (a_response - b_response) < 0 ? -(a_response - b_response) : (a_response - b_response);
                    array.push({
                        site_name: this.top_site_respon[i].site_name,
                        total_response: Number(a_response),
                        total_comparison: total_comparison,
                        total_caret: total_caret
                    });
                }
                // console.log('đây là array', array);
                // end xử lý
                // sắp xếp theo total response giảm dần
                for (let i = 0; i < array.length - 1; i++) {
                    for (let j = i + 1; j < array.length; j++) {
                        if (Number(array[i].total_response) < Number(array[j].total_response)) {
                            let temp = [];
                            temp = array[j];
                            array[j] = array[i];
                            array[i] = temp;
                        }
                    }
                }
                if (!environment.production) {
                    console.log(array);
                }
                if (array.length <= 10) {
                    for (let i = 0; i < array.length; i++) {
                        this.total_response.push({
                            site_name: array[i].site_name,
                            total_response: array[i].total_response,
                            total_comparison: array[i].total_comparison,
                            total_caret: array[i].total_caret
                        });
                    }
                }
                if (array.length > 10) {
                    for (let i = 0; i < 10; i++) {
                        this.total_response.push({
                            site_name: array[i].site_name,
                            total_response: array[i].total_response,
                            total_comparison: array[i].total_comparison,
                            total_caret: array[i].total_caret
                        });
                    }
                }
                // end sắp xếp
                // }
                if (!environment.production) {
                    console.log(this.total_response);
                }
                // so sánh kết quả cột cx index
                this.cx_index_percent_now = this.emotion_now.cx_index;
                this.cx_index_percent_comparison = this.emotion_now.cx_index - this.emotion_before.cx_index;
                if (this.cx_index_percent_comparison === 0) {
                    this.carret_cx_index = 'sort';
                } else {
                    if (this.emotion_now.cx_index > this.emotion_before.cx_index) {
                        this.carret_cx_index = 'caret-up';
                    }
                    if (this.emotion_now.cx_index < this.emotion_before.cx_index) {
                        this.carret_cx_index = 'caret-down';
                    }
                }
                // end so sánh
                // so sánh kết quả cột nps index
                this.nps_index_percent_now = this.emotion_now.nps_index;
                this.nps_index_percent_comparison = this.emotion_now.nps_index - this.emotion_before.nps_index;
                if (!environment.production) {
                    console.log(this.nps_index_percent_comparison);
                }
                if (this.nps_index_percent_comparison === 0) {
                    this.carret_nps_index = 'sort';
                } else {
                    if (this.emotion_now.nps_index > this.emotion_before.nps_index) {
                        this.carret_nps_index = 'caret-up';
                    }
                    if (this.emotion_now.nps_index < this.emotion_before.nps_index) {
                        this.carret_nps_index = 'caret-down';
                    }
                }
                // end so sánh
                // so sánh kết quả cột đánh giá
                if (this.emotion_before.total_response === 0) {
                    this.comparison_total_emotion = 0;
                    this.carret = 'sort';
                } else {
                    // tslint:disable-next-line:max-line-length
                    this.comparison_total_emotion = ((this.emotion_now.total_response - this.emotion_before.total_response) / this.emotion_before.total_response) * 100;
                    // tslint:disable-next-line:max-line-length
                    this.carret = this.comparison_total_emotion > 0 ? 'caret-up' : this.comparison_total_emotion === 0 ? 'sort' : 'caret-down';
                }
                // end so sánh
                this.get_perform(); // Xử lý đánh giá kết quả so sánh
                // Lưu phiên làm việc.
                const save_data = {
                    organization_id: this.organization_id
                    , site_id: this.site_id
                    , question_id: this.question_id
                    , start_hour: '\'0:00\''
                    , end_hour: '\'23:59\''
                    , time_label: this.time_label
                    , viewDataBy: this.viewDataBy
                    , time: this.time
                };
                this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(save_data));
                // } catch (error) {
                //     this.show_error = true;
                //     this.blockUI.stop();
                // }
            }, (error) => {
                if (!environment.production) {
                    console.log(error);
                }
                this.blockUI.stop();
                // this.push_notification();
                this.show_error = true;
            }, () => {
                this.blockUI.stop();
            }
        );
    }
    // End hàm get_data().


    // Hàm thay dổi menu
    changemenu(item, site_id, organization_id) {
        this.site_id = site_id;
        // this.organization_id = organization_id;
        this.location = item;
        this.displaylocation = false;
        this.get_question();
    }

    // thay đổi menu sẽ thay đổi dữ liệu

    // thay đổi question thì sẽ thay đổi dữ liệu
    change_question(question) {
        if (!environment.production) {
            console.log(question);
        }
        this.question = question.question_name;
        this.question_id = question.question_id;
        this.get_data();
        this.very_positive = question.very_positive_img;
        this.positive = question.positive_img;
        this.negative = question.negative_img;
        this.very_negative = question.very_negative_img;
    }

    // end thay đổi question
    // hiển thị menu chọn khu vực nếu người dùng có level lớn hơn 1
    show_menu_location() {
        const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
        if (userInfo.lever === '0') {
            this.hidden_menu_location = false;
        } else {
            this.hidden_menu_location = true;
        }
    }
    // end function

    // Hàm load biểu đồ
    load_chart_reason_negative(
        categories = null
        , negative = null
        , very_negative = null
        , very_negative_label = null
        , negative_label = null) {
        if (!environment.production) {
            console.log(this.total_reason);
        }
        const tong = this.total_reason;
        Highcharts.chart(this.chart_reason_nagative.nativeElement, {
            chart: { type: 'bar', },
            title: { text: '' },
            xAxis: {
                categories: categories,
                stackLabels: { enabled: true },
                labels: {
                    // mầu trục
                    lineColor: '#9a9a9a',
                    lineWidth: 1.5,
                    style: { color: 'dodgerblue', fontSize: '12px', fontFamily: 'Roboto,sans-serif !important', }
                }
            },
            yAxis: {
                min: 0,
                labels: { enabled: false },
                title: false,
                stackLabels: { // hiện tổng cột
                    style: { color: '#9b9b9b', fontSize: '10px', fontWeight: 'bold', },
                    x: 0,
                    enabled: true,
                    formatter: function () {
                        const pcnt = (this.total / tong) * 100 > 0 ? (this.total / tong) * 100 : 0;
                        // tslint:disable-next-line:max-line-length
                        return '<span  style="color:black;font-size:12px;font-weight:bold;font-family: Roboto,sans-serif;cursor:pointer" >' + this.total + '  <i style="color:gray;font-size:11px;font-weight:400;z-index:-1;font-style: italic;font-family: Roboto,sans-serif;"> (' + (pcnt.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '%)') + '</i><br></span>';
                    }
                }
            },
            legend: {
                reversed: true, enabled: false
            }, exporting: { enabled: false },
            tooltip: { shared: true, },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    pointWidth: 30,
                    dataLabels: {
                        enabled: true,
                        // useHTML: true,
                        formatter: function () {
                            const pcnt = (this.y / tong) * 100;
                            const y = this.y;
                            // tslint:disable-next-line:max-line-length
                            return '<span  style="font-size:11px;font-family: Roboto,sans-serif;cursor:pointer" >' + y + '</span><i style="font-size:11px;font-weight:400;z-index:-1;font-family: Roboto,sans-serif;font-style: italic;cursor:pointer"> (' + pcnt.toLocaleString('en-us', { maximumFractionDigits: 2 }) + '%' + ')</i>';
                        }
                    }
                }
            },
            series: [
                {
                    name: very_negative_label ? very_negative_label : '', data: very_negative,
                    color: environment.POC.colors.very_negative,
                },
                {
                    name: negative_label ? negative_label : '', data: negative,
                    color: environment.POC.colors.negative,
                }
            ]
        });
    }
    // End hàm load biểu đồ

    // Hàm xử lý khi người dùng chọn tổ chức
    OrgSelected(event) {
        if (!environment.production) {
            console.log(event);
        }
        // Gán giá trị hiển thị.
        this.organization_id = event.value;
        // Lấy Menu theo tổ chức
        this.get_sitetree();
        // Tắt popup
        this.popuplocation = false;
    }

    // Khi thời kì thay đổi
    time_change(time, time_label) {
        // Hàm lấy ngày hiện tại
        const time_on_now = new Date();
        if (time === 'today') {
            this.time_yesterday = this.appservice.convert_date_tostringdate_by_nghia(time_on_now);
            this.time_now = this.appservice.convert_date_tostringdate_by_nghia(time_on_now);
            const yesterday = new Date(time_on_now.getFullYear(), time_on_now.getMonth(), Number(time_on_now.getDate()) - 1);
            this.time_yesterday_pre = this.appservice.convert_date_tostringdate_by_nghia(yesterday);
            this.time_now_pre = this.appservice.convert_date_tostringdate_by_nghia(yesterday);
        }
        if (time === 'yesterday') {
            // lấy ngày hôm qua
            const yesterday = new Date(time_on_now.getFullYear(), time_on_now.getMonth(), Number(time_on_now.getDate()) - 1);
            this.time_yesterday = this.appservice.convert_date_tostringdate_by_nghia(yesterday);
            this.time_now = this.appservice.convert_date_tostringdate_by_nghia(yesterday);
            // lấy ngày hôm kia
            const lastday = new Date(time_on_now.getFullYear(), time_on_now.getMonth(), Number(time_on_now.getDate()) - 2);
            this.time_yesterday_pre = this.appservice.convert_date_tostringdate_by_nghia(lastday);
            this.time_now_pre = this.appservice.convert_date_tostringdate_by_nghia(lastday);
        }
        if (time === 'this_week') {
            // lấy ngày thứ mấy trong tuần
            const currentWeekDay = time_on_now.getDay();
            const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
            // lấy ngày đầu tiên trong tuần
            const wkStart = new Date(new Date(time_on_now).setDate(time_on_now.getDate() - lessDays));
            // lấy ngày cuối cùng trong tuần
            const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
            this.time_yesterday = this.appservice.convert_date_tostringdate_by_nghia(wkStart);
            this.time_now = this.appservice.convert_date_tostringdate_by_nghia(wkEnd);
            const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
            const beforeOneWeek2 = new Date(beforeOneWeek);
            const day = beforeOneWeek.getDay();
            const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
            const lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
            const lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));
            this.time_yesterday_pre = this.appservice.convert_date_tostringdate_by_nghia(lastMonday);
            this.time_now_pre = this.appservice.convert_date_tostringdate_by_nghia(lastSunday);
        }
        if (time === 'last_week') {
            // lấy thời gian theo tuần trước
            const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
            const beforeOneWeek2 = new Date(beforeOneWeek);
            const day = beforeOneWeek.getDay();
            const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
            const lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
            const lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));
            this.time_yesterday = this.appservice.convert_date_tostringdate_by_nghia(lastMonday);
            this.time_now = this.appservice.convert_date_tostringdate_by_nghia(lastSunday);
            const beforeTwoWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 14 * 1000);
            const beforeTwoWeek2 = new Date(beforeTwoWeek);
            const day2 = beforeTwoWeek.getDay();
            const diffToMonday2 = beforeTwoWeek.getDate() - day2 + (day2 === 0 ? -6 : 1);
            const lastMonday2 = new Date(beforeTwoWeek.setDate(diffToMonday2));
            const lastSunday2 = new Date(beforeTwoWeek2.setDate(diffToMonday2 + 6));
            this.time_yesterday_pre = this.appservice.convert_date_tostringdate_by_nghia(lastMonday2);
            this.time_now_pre = this.appservice.convert_date_tostringdate_by_nghia(lastSunday2);
        } else if (time === 'this_month') {
            // lấy thời gian theo tháng này
            const ngaydauthangnay = new Date(time_on_now.getFullYear(), time_on_now.getMonth(), 1);
            const ngaycuoithangnay = new Date(time_on_now.getFullYear(), time_on_now.getMonth() + 1, 0);
            this.time_yesterday = this.appservice.convert_date_tostringdate_by_nghia(ngaydauthangnay);
            this.time_now = this.appservice.convert_date_tostringdate_by_nghia(ngaycuoithangnay);
            // lấy thời gian theo tháng trước
            const yesterday_pre = new Date(time_on_now.getFullYear(), Number(time_on_now.getMonth()) - 1, 1);
            const month_now_pre = new Date(time_on_now.getFullYear(), time_on_now.getMonth(), 0);
            this.time_yesterday_pre = this.appservice.convert_date_tostringdate_by_nghia(yesterday_pre);
            this.time_now_pre = this.appservice.convert_date_tostringdate_by_nghia(month_now_pre);
            // end đoạn lấy thời gian
        } else if (time === 'last_month') {
            // lấy thời gian theo tháng trước
            const month_now = new Date(time_on_now.getFullYear(), time_on_now.getMonth(), 0);
            const yesterday = new Date(time_on_now.getFullYear(), Number(time_on_now.getMonth()) - 1, 1);
            this.time_yesterday = this.appservice.convert_date_tostringdate_by_nghia(yesterday);
            this.time_now = this.appservice.convert_date_tostringdate_by_nghia(month_now);
            // lấy thời gian theo tháng trước nữa
            const yesterday_pre = new Date(time_on_now.getFullYear(), Number(time_on_now.getMonth()) - 2, 1);
            const month_now_pre = new Date(time_on_now.getFullYear(), Number(time_on_now.getMonth()) - 1, 0);
            this.time_yesterday_pre = this.appservice.convert_date_tostringdate_by_nghia(yesterday_pre);
            this.time_now_pre = this.appservice.convert_date_tostringdate_by_nghia(month_now_pre);
        } else if (time === 'this_year') {
            // lấy thời gian theo năm nay
            const ngaybatdaun = new Date(time_on_now.getFullYear(), 0, 1);
            const ngayketthucn = new Date(time_on_now.getFullYear(), 11, 31);
            this.time_yesterday = this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun);
            this.time_now = this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn);
            // lấy thời gian theo năm trước
            const ngaybatdaun_pre = new Date(Number(time_on_now.getFullYear()) - 1, 0, 1);
            const ngayketthucn_pre = new Date(Number(time_on_now.getFullYear()) - 1, 11, 31);
            this.time_yesterday_pre = this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun_pre);
            this.time_now_pre = this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn_pre);
        } else if (time === 'last_year') {
            // lấy thời gian theo năm trước
            const ngaybatdaun = new Date(Number(time_on_now.getFullYear()) - 1, 0, 1);
            const ngayketthucn = new Date(Number(time_on_now.getFullYear()) - 1, 11, 31);
            this.time_yesterday = this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun);
            this.time_now = this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn);
            // lấy thời gian theo năm trước nữa
            const ngaybatdaun_pre = new Date(Number(time_on_now.getFullYear()) - 2, 0, 1);
            const ngayketthucn_pre = new Date(Number(time_on_now.getFullYear()) - 2, 11, 31);
            this.time_yesterday_pre = this.appservice.convert_date_tostringdate_by_nghia(ngaybatdaun_pre);
            this.time_now_pre = this.appservice.convert_date_tostringdate_by_nghia(ngayketthucn_pre);
        }
        // Hiển thị thời kì sau khi click
        this.time_label = time_label;
        this.time = time;
        // Hàm xử lý "So với ..."
        this.compare_width_time();
        // Tắt popup
        this.displayperiod = false;
        // Lấy dữ liệu
    }

    emit_time(time, time_label) {
        this.time_change(time, time_label);
        this.get_data();
    }
    // end hàm xử lý khi thời kì thay đổi

    // Hàm sắp xếp theo nhóm các điểm
    sort_data_table() {
        const array = this.top_site_respon;
        const array_pre = this.top_site_respon_pre;
        const general = [];
        // Khối tính toán dữ liệu NPS_INDEX và CX_INDEX trước khi sắp xếp và tạo ra một mảng GENERAL.
        for (let i = 0; i < array.length; i++) {
            // Chỉ số cx_index
            const a_cx = array[i] ? Number(array[i].cx_index) : 0;
            const b_cx = array_pre[i] ? Number(array_pre[i].cx_index) : 0;
            const carret_cx = a_cx > b_cx ? 'caret-up' : a_cx === b_cx ? 'sort' : 'caret-down';
            // Chỉ số nps_index
            const a_nps = array[i] ? array[i].nps_index : 0;
            const b_nps = array_pre[i] ? array_pre[i].nps_index : 0;
            const carret_nps = a_nps > b_nps ? 'caret-up' : a_nps === b_nps ? 'sort' : 'caret-down';
            // chỉ số so sánh
            const cx_index_comparison = (a_cx - b_cx) < 0 ? -(a_cx - b_cx) : (a_cx - b_cx);
            const nps_index_comparison = (a_nps - b_nps) < 0 ? -(a_nps - b_nps) : (a_nps - b_nps);
            general.push({
                site_name: array[i].site_name,
                cx_index: array[i].cx_index,
                nps_index: array[i].nps_index,
                cx_caret: carret_cx,
                cx_index_comparison: cx_index_comparison,
                nps_caret: carret_nps,
                nps_index_comparison: nps_index_comparison,
            });
        }
        // Test dữ liệu
        if (!environment.production) {
            console.log('test', general);
        }
        // Khi người dùng chọn là CX INDEX
        if (this.viewDataBy === 'CX Index') {
            // sắp xếp tăng dần theo cx_index
            for (let i = 0; i < general.length; i++) {
                for (let j = i + 1; j < general.length; j++) {
                    if (Number(general[i].cx_index) < Number(general[j].cx_index)) {
                        let temp = [];
                        temp = general[j];
                        general[j] = general[i];
                        general[i] = temp;
                    }
                }
            }
            // End sắp xếp
            this.top_result = [];
            const top_result_of_best_cx_index = []; // Top các điểm tốt nhất
            const top_result_of_fail_cx_index = []; // Top các điểm kém nhất
            // khối đẩy giữ liệu vào 2 mảng
            if (general.length === 1) {
                top_result_of_best_cx_index.push({
                    site_name: general[0].site_name,
                    cx_index: general[0].cx_index,
                    cx_index_comparison: general[0].cx_index_comparison,
                    cx_caret: general[0].cx_caret
                });
                top_result_of_fail_cx_index.push({
                    site_name: general[0].site_name,
                    cx_index: general[0].cx_index,
                    cx_index_comparison: general[0].cx_index_comparison,
                    cx_caret: general[0].cx_caret
                });
            }
            if (general.length >= 2 && general.length <= 10) {
                for (let i = 0; i < general.length; i++) {
                    top_result_of_best_cx_index.push({
                        site_name: general[i].site_name,
                        cx_index: general[i].cx_index,
                        cx_index_comparison: general[i].cx_index_comparison,
                        cx_caret: general[i].cx_caret
                    });
                }
                for (let i = general.length - 1; i >= 0; i--) {
                    top_result_of_fail_cx_index.push({
                        site_name: general[i].site_name,
                        cx_index: general[i].cx_index,
                        cx_index_comparison: general[i].cx_index_comparison,
                        cx_caret: general[i].cx_caret
                    });
                }
            }
            if (general.length > 10) {
                for (let i = 0; i < 10; i++) {
                    top_result_of_best_cx_index.push({
                        site_name: general[i].site_name,
                        cx_index: general[i].cx_index,
                        cx_index_comparison: general[i].cx_index_comparison,
                        cx_caret: general[i].cx_caret
                    });
                }
                for (let i = general.length - 1; i >= general.length - 10; i--) {
                    top_result_of_fail_cx_index.push({
                        site_name: general[i].site_name,
                        cx_index: general[i].cx_index,
                        cx_index_comparison: general[i].cx_index_comparison,
                        cx_caret: general[i].cx_caret
                    });
                }
            }
            // End khối
            // Khối ghép dữ liệu vào một mảng duy nhất
            this.top_result.push(top_result_of_best_cx_index);
            this.top_result.push(top_result_of_fail_cx_index);
            if (!environment.production) {
                console.log(this.top_result);
            }
            // End khối
        }
        // Nếu người dùng chọn là NPS INDEX
        if (this.viewDataBy === 'NPS Index') {
            // Sắp xếp theo NPS INDEX
            for (let i = 0; i < general.length; i++) {
                for (let j = i + 1; j < general.length; j++) {
                    if (Number(general[i].nps_index) < Number(general[j].nps_index)) {
                        let temp = [];
                        temp = general[j];
                        general[j] = general[i];
                        general[i] = temp;
                    }
                }
            }
            // End sắp xếp
            if (!environment.production) {
                console.log('general sorted', general);
            }
            this.top_result = [];
            const top_result_of_fail_nps_index = []; // Top kết quả tốt nhất
            const top_result_of_best_nps_index = []; // Top kết quả kém nhất
            // Khối đẩy dữ liệu vào 2 mảng
            if (general.length === 1) {
                top_result_of_best_nps_index.push({
                    site_name: general[0].site_name,
                    nps_index: general[0].nps_index,
                    nps_index_comparison: general[0].nps_index_comparison,
                    nps_caret: general[0].nps_caret
                });
                top_result_of_fail_nps_index.push({
                    site_name: general[0].site_name,
                    nps_index: general[0].nps_index,
                    nps_index_comparison: general[0].nps_index_comparison,
                    nps_caret: general[0].nps_caret
                });
            }
            if (general.length > 1 && general.length <= 10) {
                for (let i = 0; i < general.length; i++) {
                    top_result_of_best_nps_index.push({
                        site_name: general[i].site_name,
                        nps_index: general[i].nps_index,
                        nps_index_comparison: general[i].nps_index_comparison,
                        nps_caret: general[i].nps_caret
                    });
                }
                for (let i = general.length - 1; i >= 0; i--) {
                    top_result_of_fail_nps_index.push({
                        site_name: general[i].site_name,
                        nps_index: general[i].nps_index,
                        nps_index_comparison: general[i].nps_index_comparison,
                        nps_caret: general[i].nps_caret
                    });
                }
            }
            if (general.length > 10) {
                for (let i = 0; i < 10; i++) {
                    top_result_of_best_nps_index.push({
                        site_name: general[i].site_name,
                        nps_index: general[i].nps_index,
                        nps_index_comparison: general[i].nps_index_comparison,
                        nps_caret: general[i].nps_caret
                    });
                }
                for (let i = general.length - 1; i >= general.length - 10; i--) {
                    top_result_of_fail_nps_index.push({
                        site_name: general[i].site_name,
                        nps_index: general[i].nps_index,
                        nps_index_comparison: general[i].nps_index_comparison,
                        nps_caret: general[i].nps_caret
                    });
                }
            }
            // End khối
            // Ghép dữ liệu vào 1 mảng duy nhất
            this.top_result.push(top_result_of_best_nps_index);
            this.top_result.push(top_result_of_fail_nps_index);
            if (!environment.production) {
                console.log(this.top_result);
            }
            // End
        }
    }

    // Hàm xử lý sư kiện Người dùng chọn CX_INDEX hoặc NPS_INDEX.
    change_data_table() {
        // Hàm sắp xếp theo CX_INDEX hoặc NPS_INDEX
        this.sort_data_table();
        const data = {
            organization_id: this.organization_id
            , site_id: this.site_id
            , question_id: this.question_id
            , start_hour: '\'0:00\''
            , end_hour: '\'23:00\''
            , time_label: this.time_label
            , viewDataBy: this.viewDataBy
            , time: this.time
        };
        // Hàm lưu phiên làm việc của người dùng.
        this.appservice.save_user_page_parametter(this.page_id, JSON.stringify(data));
    }
    // End hàm.

    // Hàm tìm kiếm menu
    search_menu(value: string) {
        // chuyển giá trị truyền vào về chữ thường để so sánh
        const string = value.toLowerCase();
        if (string === '') {
            this.menu_tree = this.snap_menu_tree;
        } else {
            this.menu_tree = this.snap_menu_tree.filter(x => x.site_name.toLowerCase().indexOf(string) !== -1);
        }
    }
    // kết thúc hàm

    // Hàm đánh giá kết quả xử lý số liệu
    get_perform() {
        // cx_index_percent_comparison là kết quả so sánh CX_INDEX
        if (this.cx_index_percent_comparison <= -10) {
            this.cx_performance.title = this.language.can_no_luc;
            this.cx_performance.content = this.language.chat_luong_dich_vu_cua_ban_da_giam_xuong_dang_ke;
            this.cx_performance.image = this.very_negative;
        }
        if (this.cx_index_percent_comparison <= 0 && this.cx_index_percent_comparison >= -10) {
            this.cx_performance.title = this.language.can_co_gang;
            this.cx_performance.content = this.language.chat_luong_dich_vu_cua_ban_da_giam_xuong;
            this.cx_performance.image = this.negative;
        }
        if (this.cx_index_percent_comparison >= 0 && this.cx_index_percent_comparison <= 10) {
            this.cx_performance.title = this.language.tot;
            this.cx_performance.content = this.language.chat_luong_dich_vu_cua_ban_duoc_cai_thien;
            this.cx_performance.image = this.positive;
        }
        if (this.cx_index_percent_comparison > 10) {
            this.cx_performance.title = this.language.xuat_sac;
            this.cx_performance.content = this.language.chat_luong_dich_vu_cua_ban_duoc_cai_thien_dang_ke;
            this.cx_performance.image = this.very_positive;
        }
        // NPS_index_percent_comparison là kết quả so sánh NPS_INDEX
        if (this.nps_index_percent_comparison <= -10) {
            this.nps_performance.title = this.language.can_no_luc;
            this.nps_performance.content = this.language.luong_khach_hang_quang_ba_hinh_anh_giam;
            this.nps_performance.image = this.very_negative;
        }
        if (this.nps_index_percent_comparison <= 0 && this.nps_index_percent_comparison >= -10) {
            this.nps_performance.title = this.language.can_co_gang;
            this.nps_performance.content = this.language.luong_khach_hang_quang_ba_hinh_anh_da_giam;
            this.nps_performance.image = this.negative;
        }
        if (this.nps_index_percent_comparison >= 0 && this.nps_index_percent_comparison <= 10) {
            this.nps_performance.title = this.language.tot;
            this.nps_performance.content = this.language.luong_khach_hang_quang_ba_hinh_anh_tang;
            this.nps_performance.image = this.positive;
        }
        if (this.nps_index_percent_comparison > 10) {
            this.nps_performance.title = this.language.xuat_sac;
            this.nps_performance.content = this.language.luong_khach_hang_quang_ba_hinh_anh_tang_len_dang_ke;
            this.nps_performance.image = this.very_positive;
        }
    }

    reset_session() {
        const data = [];
        this.site_id = null;
        this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
            this.ngOnInit();
        });
        // this.modalRef.hide();
    }
    // end hàm.
}
