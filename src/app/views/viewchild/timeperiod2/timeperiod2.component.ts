import { Component, OnChanges, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { environment } from '../../../../environments/environment';
declare var $;
declare function intDateRangePicker_viewchild2(start_date, end_date): any;
@Component({
    selector: 'app-timeperiod2',
    templateUrl: './timeperiod2.component.html',
    styleUrls: ['./timeperiod2.component.css']
})

export class Timeperiod2Component implements OnInit {
    @Output() submit_date2 = new EventEmitter<any>();
    displaytime = false;
    Indexstart: any;
    Indexend: any;
    time_period_label: string;
    time_period_array: any;
    date_send: any;
    onchange = true;
    time_value: any;
    language = JSON.parse(localStorage.getItem(environment.language));
    _startdate: any;
    _enddate: any;
    constructor(private appservice: AppService) { }

    ngOnInit(): void {
        const self = this;
        // xử lý function jquery trong angular
        $(function () {
            $('#endDateReportTemp2').change(function () {
                self.date_ranger_event();
            });
            $('#reportrangefba2').on('apply.daterangepicker').click(function () {
                self.date_ranger_event();
            });
        });
    }
    get_data_compare(param, time_period_array) {
        // console.log(param);
        // console.log('time_array', time_period_array);
        let start_time: any;
        let end_time: any;
        this.time_period_array = time_period_array;
        if (param.time_value_compare) {
            this.time_period_label = this.time_period_array.filter(x => x.value === param.time_value_compare)[0].label;
            const time_array = this.get_time(param.time_value_compare);
            start_time = time_array.ngaybatdau;
            end_time = time_array.ngayketthuc;
        } else if (param.start_date_compare && param.end_date_compare) {
            start_time = new Date(param.start_date_compare.replace(/[']/g, ''));
            end_time = new Date(param.end_date_compare.replace(/[']/g, ''));
            this.time_period_label = this.appservice.convert_date_tostringdate_by_nghia(start_time, false)
                + ' - ' + this.appservice.convert_date_tostringdate_by_nghia(end_time, false);
        }
        this._startdate = this.appservice.convert_date_tostringdate(start_time);
        this._enddate = this.appservice.convert_date_tostringdate(end_time);
        console.log('  this._startdate2 ' + this._startdate, 'this._enddate2 ' + this._enddate);
        const start_time_number = Number(start_time);
        const end_time_number = Number(end_time);
        intDateRangePicker_viewchild2(start_time_number, end_time_number);
    }

    // Hàm chọn lịch
    date_ranger_event() {
        this.reset_default();
        const now = new Date();
        const start_date = (document.getElementById('startDateReportTemp2') as HTMLInputElement).value
            ? (document.getElementById('startDateReportTemp2') as HTMLInputElement).value
            : this._startdate;
        const end_date = (document.getElementById('endDateReportTemp2') as HTMLInputElement).value
            ? (document.getElementById('endDateReportTemp2') as HTMLInputElement).value
            : this._enddate;
        this.Indexstart = new Date(start_date.replace(/[']/g, ''));
        this.Indexend = new Date(end_date.replace(/[']/g, ''));
        this.time_period_label = this.appservice.convert_date_tostringdate_by_nghia(this.Indexstart, false)
            + ' - ' + this.appservice.convert_date_tostringdate_by_nghia(this.Indexend, false);
        this.emit_date();
    }

    // Hàm thay đổi thời gian
    chonthoigian(item) {
        this.reset_default();
        this.time_value = item.value;
        this.emit_date();
        this.time_period_label = item.label;
        this.displaytime = !this.displaytime;
    }
    get_time(value) {
        const ngayhomnay = new Date();
        let ngaybatdau: Date;
        let ngayketthuc: Date;
        let order: number;
        if (value === 'today') {
            ngaybatdau = ngayhomnay;
            ngayketthuc = ngayhomnay;
            order = 1;
        } else if (value === 'yesterday') {
            const ngayhomqua = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            ngaybatdau = ngayhomqua;
            ngayketthuc = ngayhomqua;
            order = 1;
        } else if (value === 'this_week') {
            const currentWeekDay = ngayhomnay.getDay();
            const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
            const wkStart = new Date(new Date(ngayhomnay).setDate(ngayhomnay.getDate() - lessDays));
            const wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
            ngaybatdau = wkStart;
            ngayketthuc = wkEnd;
            order = 2;
        } else if (value === 'last_week') {
            const beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000);
            const beforeOneWeek2 = new Date(beforeOneWeek);
            const day = beforeOneWeek.getDay();
            const diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
            const lastMonday = new Date(beforeOneWeek.setDate(diffToMonday));
            const lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));
            ngaybatdau = lastMonday;
            ngayketthuc = lastSunday;
            order = 2;
        } else if (value === 'this_month') {
            const ngaydauthangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), 1);
            const ngaycuoithangnay = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth() + 1, 0);
            ngaybatdau = ngaydauthangnay;
            ngayketthuc = ngaycuoithangnay;
            order = 4;
        } else if (value === 'last_month') {
            const thangtruocbatdau = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()) - 1, 1);
            const thangtruocketthuc = new Date(ngayhomnay.getFullYear(), Number(ngayhomnay.getMonth()), 0);
            ngaybatdau = thangtruocbatdau;
            ngayketthuc = thangtruocketthuc;
            order = 4;
        } else if (value === 'this_year') {
            const ngaybatdaun = new Date(ngayhomnay.getFullYear(), 0, 1);
            const ngayketthucn = new Date(ngayhomnay.getFullYear(), 11, 31);
            ngaybatdau = ngaybatdaun;
            ngayketthuc = ngayketthucn;
            order = 5;
        } else if (value === 'last_year') {
            const daunamtruoc = new Date(Number(ngayhomnay.getFullYear()) - 1, 0, 1);
            const cuoinamtruoc = new Date(Number(ngayhomnay.getFullYear()) - 1, 11, 31);
            ngaybatdau = daunamtruoc;
            ngayketthuc = cuoinamtruoc;
            order = 5;
        } else if (value === 'last_fourteen_day') {                                                      // 14 ngày trước
            ngaybatdau = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 14);
            ngayketthuc = new Date(ngayhomnay.getFullYear(), ngayhomnay.getMonth(), Number(ngayhomnay.getDate()) - 1);
            order = 3;
        }
        return {
            ngaybatdau: ngaybatdau
            , ngayketthuc: ngayketthuc
            , order: order
        };
    }

    // Hàm đẩy data cho parent.
    emit_date() {
        this.date_send = [];
        if (this.Indexstart !== null && this.Indexend !== null) {
            this.date_send.push({
                start_date: '\'' + this.appservice.convert_date_tostringdate_by_nghia(this.Indexstart) + '\''
                , end_date: '\'' + this.appservice.convert_date_tostringdate_by_nghia(this.Indexend) + '\''
            });
        } else if (this.time_value !== null) {
            this.date_send.push({
                time_value: this.time_value
            });
        }
        this.submit_date2.emit(this.date_send);
    }

    // Hàm reset giá trị ngày về null
    reset_default() {
        this.time_value = null;
        this.Indexstart = null;
        this.Indexend = null;
    }
    // end hàm
    // kết thúc hàm
}
