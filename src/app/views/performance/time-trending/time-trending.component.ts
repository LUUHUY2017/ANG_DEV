import { IOption } from 'ng-select';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Hightcharts from 'highcharts';
import { TimeperiodComponent } from '../../viewchild/timeperiod/timeperiod.component';
import { MenutreeComponent } from '../../viewchild/menutree/menutree.component';
@Component({
    templateUrl: 'time-trending.component.html',
    styleUrls: ['time-trending.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FootfallTimeTrendingComponent implements OnInit {
    @ViewChild('TimeInput') TimeInput: TimeperiodComponent;
    @ViewChild('TimeInput_2') TimeInput_2: TimeperiodComponent;
    @ViewChild(MenutreeComponent) MenuInput: MenutreeComponent;
    page_id = environment.Pages.footfall.performance_time_trending;
    @BlockUI() blockUI: NgBlockUI;
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
    private changes: MutationObserver;
    public element: HTMLElement = document.body;
    public chart_data: any;
    public chart_data2: any;
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

    constructor(private router: Router, private appservice: AppService) {
        // thêm mới
        this.changes = new MutationObserver((mutations) => {
            this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
        });
        this.changes.observe(<Element>this.element, {
            attributes: true
        });
    }
    ngOnInit() {
        this.get_page_param();
    }
    get_page_param() {
        this.blockUI.start('Đang tải cấu hình...');
        this.appservice.get_user_page_parametter(this.page_id).subscribe(
            param => {
                if (!environment.production) {
                    console.log('get_user_page_parametter', param);
                }
                let para = null;
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
                this.indexOption = param.traffic_index;
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
                this.TimeInput_2.get_data(para, this.time_period_array);
            },
            (error) => {
                if (!environment.production) {
                    console.log(error);
                }
                this.blockUI.stop();
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
        return {
            organization_id: organization_id
            // , site_id: 0
            , start_time: '00:00'
            , end_time: '23:59'
            , time_value: 'today'
            , time_value_compare: 'yesterday'
            , view_by: 'Hour'
            , indexOptionSelected: 'Visits'
        };
    }
    reset_session() {
        const data = [];
        this.appservice.save_user_page_parametter_by_nghia(this.page_id, JSON.stringify(data)).subscribe(res => {
            this.get_page_param();
        });
    }

    get_sitetree() {
        this.blockUI.start('Đang tải dữ liệu...');
        const url = environment.API.sites + '_get_site_for_report';
        const data = {
            organization_id: this.organization_id
        };
        this.appservice.post(data, url).subscribe(res => {
            // console.log(res);
            this.menu_tree = res.site_array.slice(0);
            if (!this.site_id) {
                this.site_id = this.menu_tree.find(item => Number(item.enables) === 1).id;
            }
            this.MenuInput.get_data(this.menu_tree, this.site_id, this.organization_array, this.organization_id);
            this.blockUI.stop();
        }, (error) => {
            this.blockUI.stop();
            if (!environment.production) {
                console.log(error);
            }
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
                } else if (event[0].time_value) {
                    this.time_value = event[0].time_value;
                    this.get_date(this.time_value, 1);
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
    }
    get_emit_menu(event) {
        if (event.organization_id) {
            this.blockUI.start('Đang tải thông tin tổ chức...');
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
    // Huy thêm hàm lấy số dương
    get_number_int(number1, number2) {
        const chenhlech = number1 - number2;
        return Math.abs(chenhlech);
    }
    get_compar_per(number1: number, number2: number) {
        let per = 0;
        // if (Number(number1) >= Number(number2)) {
        //     per = (Number(number2) / Number(number1) * 100);
        // } else {
        per = (Number(number1) / Number(number2) * 100);
        // }
        return per.toFixed(2);
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
        this.blockUI.start('Đang tải dữ liệu...');
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
        this.starttime = this.startTimeOption.find(item => item.value === this.start_time).label;
        this.endtime = this.endTimeOption.find(item => item.value === this.end_time).label;
        this.title_index = this.indexOptionSelected;
        const chart_xAxis = [];
        this.appservice.post(data, environment.API.sp_footfall_time_comparison).subscribe(
            res => {
                if (!environment.production) {
                    console.log('res', res);
                }
                this.site_name = this.MenuInput.menu_tree.find(item => item.id === this.site_id).site_name;

                const start_d = new Date(this.start_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                const end_d = new Date(this.end_date.replace(/[']/g, '').replace(/[-]/g, '/'));
                this.title_start_date = this.appservice.convert_date_tostringdate_by_nghia(start_d, false);
                this.title_end_date = this.appservice.convert_date_tostringdate_by_nghia(end_d, false);
                if (this.start_date !== this.end_date) {
                    this.time_period = this.title_start_date + ' - ' + this.title_end_date;
                } else { this.time_period = this.title_start_date; }

                const start_d_compare = new Date(this.start_date_compare.replace(/[']/g, '').replace(/[-]/g, '/'));
                const end_d_compare = new Date(this.end_date_compare.replace(/[']/g, '').replace(/[-]/g, '/'));
                this.title_start_date_compare = this.appservice.convert_date_tostringdate_by_nghia(start_d_compare, false);
                this.title_end_date_compare = this.appservice.convert_date_tostringdate_by_nghia(end_d_compare, false);
                if (this.title_start_date_compare !== this.title_end_date_compare) {
                    this.time_period_compare = this.title_start_date_compare + ' - ' + this.title_end_date_compare;
                } else { this.time_period_compare = this.title_start_date_compare; }


                this.title_time_period_compare = this.title_time_period = 'Ngày';
                this.chart_data = [];
                // hiển thị giá trị vao biểu đồ bảng theo dữ liệu trả về của data
                let chart_data: { [k: string]: any } = {};
                if (res.data_compare.length >= res.data.length) {
                    res.data_compare.forEach((element, index) => {
                        chart_data = res.data[index];
                        chart_data.num_to_enter_compare = element.num_to_enter;
                        chart_data.traffic_compare = element.traffic;
                        chart_data.avg_time_string_compare = element.avg_time_string;
                        this.chart_data.push(chart_data);
                    });
                } else {
                    res.data.forEach((element, index) => {
                        chart_data = res.data_compare[index];
                        chart_data.num_to_enter = element.num_to_enter;
                        chart_data.traffic = element.traffic;
                        chart_data.avg_time_string = element.avg_time_string;
                        this.chart_data.push(chart_data);
                    });
                }
                // this.chart_data = res.data;
                this.chart_data2 = res.data_compare;
                if (!environment.production) {
                    console.log('chart_data', this.chart_data);
                }
                const num_to_enter = [];
                const num_to_enter_compare = [];
                const traffic = [];
                const traffic_compare = [];
                const avg_time = [];
                const avg_time_compare = [];
                // this.total_avgtime = Number((this.total_avgtime / this.total_num_to_enter).toFixed(2));
                // this.total_avgtime = (new Date(1970, 0, 0).setMinutes(this.total_avgtime));
                let i = 0;
                res.data.forEach(element => {
                    chart_xAxis[i] = element.time_period;
                    i++;
                });
                if (!environment.production) {
                    console.log('chart_xAxis', chart_xAxis);
                }

                // biểu đồ theo  lịch 1
                i = 0;
                this.total_num_to_enter = 0;
                this.total_num_to_traffic = 0;
                this.total_avgtime = 0;
                // this.total_num_to_exit = 0;


                res.data.forEach(element => {
                    num_to_enter[i] = Number(element.num_to_enter);
                    this.total_num_to_enter += Number(num_to_enter[i]);

                    traffic[i] = Number(element.traffic);
                    this.total_num_to_traffic += Number(traffic[i]);

                    avg_time[i] = Number(element.avg_time_seconds);
                    this.total_avgtime += Number(avg_time[i]);

                    // num_to_exit[i] = Number(element.num_to_exit);
                    // this.total_num_to_exit += num_to_exit[i];
                    i++;
                });

                if (!environment.production) {
                    console.log('num_to_enter', num_to_enter);
                    console.log('traffic', traffic);
                    console.log('avg_time', avg_time);
                    // console.log('num_to_exit', num_to_exit);
                }

                // // biểu đồ theo  lịch 2
                i = 0;
                this.total_num_to_enter_compare = 0;
                this.total_num_to_traffic_compare = 0;
                this.total_avgtime_compare = 0;
                // this.total_num_to_exit_compare = 0;

                res.data_compare.forEach(element => {
                    num_to_enter_compare[i] = Number(element.num_to_enter);
                    this.total_num_to_enter_compare += Number(num_to_enter_compare[i]);

                    traffic_compare[i] = Number(element.traffic);
                    this.total_num_to_traffic_compare += Number(traffic_compare[i]);

                    avg_time_compare[i] = Number(element.avg_time_seconds);
                    this.total_avgtime_compare += Number(avg_time_compare[i]);

                    // num_to_exit_compare[i] = Number(element.num_to_exit);
                    // this.total_num_to_exit_compare += num_to_exit_compare[i];
                    i++;
                });
                this.time_generate_report = new Date();
                if (!environment.production) {
                    console.log('hiển thị lấy số lượng visit được so sánh so với số lượng visit mốc');
                    console.log('num_to_enter_compare', num_to_enter_compare);
                    console.log('traffic_compare', traffic_compare);
                    console.log('avg_time_compare', avg_time_compare);
                    // console.log('num_to_exit_compare', num_to_exit_compare);
                }

                this.chart1(chart_xAxis, num_to_enter, num_to_enter_compare, avg_time, avg_time_compare, traffic, traffic_compare);
                let save_data;
                if (this.time_value !== '') {
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
            },
            (error) => {
                this.blockUI.stop();
                this.reset_session();
            },
            () => {
                this.blockUI.stop(); // Stop blocking
            }
        );
    }

    toHHMMSS(totalSeconds) {
        // totalSeconds = 28565;
        const hh = Math.floor(totalSeconds / 3600).toFixed(0);
        totalSeconds %= 3600;
        const mm = Math.floor(totalSeconds / 60).toFixed(0);
        const sc = (totalSeconds % 60).toFixed(0);
        // console.log('hours: ' + hh);
        // console.log('minutes: ' + mm);
        // console.log('seconds: ' + sc);
        // If you want strings with leading zeroes:  .toFixed(2)
        const m = String(mm).padStart(2, '00');
        const h = String(hh).padStart(2, '00');
        const s = String(sc).padStart(2, '00');
        return h + ':' + m + ':' + s;
    }
    toMM = (secs) => {
        // const sec_num = parseInt(secs, 10);
        // const hours = Math.floor(sec_num / 3600) % 24;
        const minutes = Math.floor(secs / 60);
        // const seconds = sec_num % 60;
        // return [hours, minutes, seconds]
        //     .map(v => v < 10 ? '0' + v : v)
        //     .filter((v, i) => v !== '00' || i > 0)
        //     .join(':');
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
        this.blockUI.start('Đang xuất báo cáo...');
        this.appservice.post(data, environment.API.sp_footfall_time_comparison + '_export_excel').subscribe(fileData => {
            window.open(this.url_api + fileData);
            this.name_of_excel = fileData;
            if (!environment.production) {
                console.log('Đã xuất file cả trong public export laravel');
            }
        }, (error) => {
            this.blockUI.stop();
        },
            () => {
                this.blockUI.stop();
                const data2 = {
                    name_of_excel: this.name_of_excel
                };
                const url = environment.FBA.API.export_metrics_analytic + '_delete_excel';
                this.appservice.post(data2, url).subscribe(res => {
                    if (!environment.production) {
                        console.log('Đã xóa file trong public export laravel');
                    }
                });
            }
        );
    }

    chart1(chart_xAxis, num_to_enter, num_to_enter_compare, avg_time, avg_time_compare, traffic, traffic_compare) {
        Hightcharts.chart(this.container1.nativeElement, {
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: [{
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '90%',
                        fontFamily: 'Roboto, sans-serif'
                    }
                },
                categories: chart_xAxis,

            },

            ],
            yAxis: [{ // Visits
                labels: {
                    format: '{value}',
                    style: {
                        color: environment.POC.colors.visits
                    }
                },
                allowDecimals: false,
                title: {
                    text: 'Visits',
                    style: {
                        color: environment.POC.colors.visits
                    }
                },
                visible: this.indexOptionSelected === 'Visits',
            },
            { // Traffic
                labels: {
                    format: '{value}',
                    style: {
                        color: environment.POC.colors.traffic_flow
                    }
                },
                allowDecimals: false,
                title: {
                    text: 'Traffic Flow',
                    style: {
                        color: environment.POC.colors.traffic_flow
                    }
                },
                visible: this.indexOptionSelected === 'Traffic Flow',
            },
            { // Avg time
                labels: {
                    format: '{value}',
                    style: {
                        color: environment.POC.colors.avg_time
                    }
                },
                allowDecimals: false,
                title: {
                    text: 'Avg time',
                    style: {
                        color: environment.POC.colors.avg_time
                    }
                },
                visible: this.indexOptionSelected === 'Avg time',
            }],
            tooltip: {
                shared: true,
                distance: 80,
                padding: 10,
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            legend: {
                enabled: false,
                itemStyle: {
                    fontSize: '80%',
                },
            },
            series: [{
                name: 'Visits',
                color: environment.POC.colors.visits,
                type: 'column',
                yAxis: 0,
                data: num_to_enter,
                tooltip: {
                    valueSuffix: ' lượt'
                },
                visible: this.indexOptionSelected === 'Visits',
            }, {
                name: 'Visits Compare',
                color: environment.POC.colors.compare,
                type: 'column',
                yAxis: 0,
                // data: num_to_enter,
                data: num_to_enter_compare,
                tooltip: {
                    valueSuffix: ' lượt'
                },
                visible: this.indexOptionSelected === 'Visits',
            },
            {
                name: 'Traffic flow',
                color: environment.POC.colors.traffic_flow,
                type: 'column',
                yAxis: 0,
                data: traffic,
                tooltip: {
                    valueSuffix: ' lượt'
                },
                visible: this.indexOptionSelected === 'Traffic Flow',
            },
            {
                name: 'Traffic flow Compare',
                color: environment.POC.colors.compare,
                type: 'column',
                yAxis: 0,
                data: traffic_compare,
                tooltip: {
                    valueSuffix: ' lượt'
                },
                visible: this.indexOptionSelected === 'Traffic Flow',
            },
            {
                name: 'Avg Time',
                color: environment.POC.colors.avg_time,
                type: 'spline',
                yAxis: 0,
                data: avg_time,
                tooltip: {
                    valueSuffix: 'phút'
                },
                visible: this.indexOptionSelected === 'Avg time',
            },
            {
                name: 'Avg Time Compare',
                color: environment.POC.colors.compare,
                type: 'spline',
                yAxis: 0,
                data: avg_time_compare,
                tooltip: {
                    valueSuffix: 'phút'
                },
                visible: this.indexOptionSelected === 'Avg time',
            },
            ]
        });
    }
    change_view() {
        this.get_data();
    }
}
