import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, Headers, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { environment } from '../environments/environment';
// xuất excel
import * as XLSX from 'xlsx';
import { AdminVnLanguage } from './languages/admin_language';
import { AdminEngLanguage } from './languages/admin_language_en';
import { AdminLanguage } from './languages/index';
import * as FileSaver from 'file-saver';
// xuất pdf
// import { saveAs } from '../../node_modules/file-saver/src/FileSaver';

export declare function saveAs(data: any, filename: string);

@Injectable({
    providedIn: 'root'
})
export class AppService {

    public uploadImageHeight = environment.uploadImageHeight;
    public uploadImageWidth = environment.uploadImageWidth;
    public fba_org_tree_menu = [];
    constructor(private http: Http) { }
    getLanguage(): AdminLanguage {
        const type_language = JSON.parse(localStorage.getItem(environment.language));
        if (type_language === null) {
            return new AdminVnLanguage;
        } else if (type_language === 'vn') {
            return new AdminVnLanguage;
        } else if (type_language === 'en') {
            return new AdminEngLanguage;
        }
    }
    User() {
        const us = localStorage.getItem(environment.UserLoged);
        if (us) {
            return JSON.parse(us);
        } else {
            return null;
        }
    }
    get(parth): Observable<any> {
        const headers = new Headers({
            'Authorization': environment.Bearer + ' ' + localStorage.getItem(environment.access_token),
        });
        const uri = environment.apiUrl + parth;
        return this.http.get(uri, { headers: headers })
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    post(frmval, parth) {
        const headers = new Headers({
            'Authorization': environment.Bearer + ' ' + localStorage.getItem(environment.access_token),
            'page-id': localStorage.getItem('page_id'),
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Access-Control-Allow-Origin': '*',
        });
        const options = new RequestOptions({ headers: headers });
        const uri = environment.apiUrl + parth;
        return this.http.post(uri, frmval, {
            headers: headers
        })
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    _get<T>(parth): Observable<T> {
        const headers = new Headers({
            Authorization: environment.Bearer + ' ' + localStorage.getItem(environment.access_token)
        });
        const uri = environment.apiUrl + parth;
        return this.http.get(uri, { headers: headers }).map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error + ""));
    }
    _netPost(frmval, parth) {
        // const headers = new Headers({
        //     // 'Authorization': environment.Bearer + ' ' + localStorage.getItem(environment.access_token),
        //     // 'Content-Type': 'application/json',
        //     // 'Access-Control-Allow-Origin': '*',
        // });
        // const options = new RequestOptions({ headers: headers });
        const uri = environment._netUrl + parth;
        return this.http.post(uri, frmval)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.statusText || 'Server error'));
    }

    softdelete(id, deleted, parth) {
        const headers = new Headers({
            'Authorization': environment.Bearer + ' ' + localStorage.getItem(environment.access_token),
        });
        const options = new RequestOptions({ headers: headers });
        const uri = environment.apiUrl + parth;
        return this.http.post(uri, { id: id, deleted: deleted }, {
            headers: headers
        })
            .map((res: Response) => {
                // console.log(res);
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    delete(id, parth) {
        const headers = new Headers({
            'Authorization': environment.Bearer + ' ' + localStorage.getItem(environment.access_token),
        });
        const options = new RequestOptions({ headers: headers });
        const uri = environment.apiUrl + parth;
        return this.http.post(uri, { id: id }, {
            headers: headers
        })
            .map((res: Response) => {
                // console.log(res);
            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    get_start_time(): Observable<any> {
        return this.get(environment.API.COMMON.get_start_time);
    }
    get_end_time(): Observable<any> {
        return this.get(environment.API.COMMON.get_end_time);
    }
    get_traffic_index(): Observable<any> {
        return this.get(environment.API.COMMON.get_traffic_index);
    }
    get_sites_tree(organization_id) {
        return new Promise(resolve => {
            this.get(environment.API.sites_tree + '?organization_id=' + organization_id)
                .subscribe(
                    (res: any) => {
                        resolve(res);
                    },
                );
        });
    }

    convert_sites_tree_ng_dropdown(site_arr) {
        const files2 = [];
        // lay node goc
        const parentid0 = site_arr.filter(x => x.alevel === '0');

        let i = 0;
        parentid0.forEach(element => {
            files2[i] = {
                data: this.create_site_data(element),
                // huy thêm mở rộng
                expanded: true,
                children: []
            };
            i++;
        });

        files2.forEach(element => {
            this.create_site_node(element, site_arr);
        });

        return files2;
    }

    get_sites_tree_ng_dropdown(organization_id) {
        return new Promise(resolve => {
            this.get(environment.API.sites_tree + '?organization_id=' + organization_id)
                .subscribe(
                    (res: any) => {
                        if (!environment.production) {
                            console.log('get_sites_tree_ng_dropdown res', res);
                        }
                        const files2 = [];
                        // lay node goc
                        const parentid0 = res.filter(x => x.alevel === '0');
                        // console.log('parentid0', parentid0);

                        let i = 0;
                        parentid0.forEach(element => {
                            files2[i] = {
                                data: this.create_site_data(element),
                                children: [],
                            };
                            i++;
                        });

                        files2.forEach(element => {
                            this.create_site_node(element, res);
                        });

                        resolve(files2);
                    },
                );
        });
    }

    create_site_data(element) {
        let item: { [k: string]: any } = {};
        item = {
            id: element.site_id,
            site_code: element.site_code,
            site_shortname: element.site_shortname,
            site_name: element.site_name,
            // site_description: element.site_description,
            parent_id: element.parent_id,
            // huy 26/12 thêm mới
            category_id: element.category_id,
            organization_id: element.organization_id,
            store: element.store,
            open_hour: element.open_hour,
            close_hour: element.close_hour,
            actived: element.actived
            // deleted: element.deleted,
        };
        if ('enables' in element) {
            item.enables = element.enables;
        }
        return item;
    }
    create_site_node(element, files_res) {
        const parentid1 = files_res.filter(x => Number(x.alevel) > 0 && x.parent_id === element.data.id);
        if (parentid1.length) {
            const dataTemp = [];
            let i = 0;
            parentid1.forEach(element1 => {
                dataTemp[i] = {
                    data: this.create_site_data(element1),
                    // huy thêm mở rộng cấp
                    expanded: false,
                    children: []
                };
                i++;
            });
            element.children = dataTemp;

            // de qui lay den noode cuoi cung
            element.children.forEach(element2 => {
                this.create_site_node(element2, files_res);
            });
        }
    }

    // tslint:disable-next-line:member-ordering
    public static toExportFileName(excelFileName: string): string {
        return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'Time_Period': worksheet }, SheetNames: ['Time_Period'] };
        // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        // const wb: XLSX.WorkBook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // // Chú thích từng ô
        // if (!worksheet.A1.c) { worksheet.A1.c = []; }
        // worksheet.A1.c.push({ a: 'SheetJS', t: 'Thời gian thực phân tích chỉ số' });
        XLSX.writeFile(workbook, AppService.toExportFileName(excelFileName));
    }

    /*----------  Convert theo dạng  19/11/2018 để hiển thị lên giao diện không lấy giờ  ----------*/
    convert_date_tostringdatemonth(date) {
        const dateint = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
        const monthint = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        return dateint + '/' + monthint + '/' + date.getFullYear();
    }

    convert_date_to_input_dd_mm_yyy(date) {
        const dateint = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
        const monthint = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        return date.getFullYear() + '-' + monthint + '-' + dateint;
    }
    convert_dateint_tostringdatemonth(date_time) {
        // 19/11/2018
        const date_int = Number(date_time);
        let date: any;
        if (date_int < 1) {
            date = new Date();
        } else {
            date = new Date(date_int);
        }
        return this.convert_date_tostringdatemonth(date);
    }

    /*----------  Convert theo dạng  2018/11/19 để lấy data không lấy giờ    ----------*/
    convert_date_tostringdate(date) {
        return '\'' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()) + '\'';
    }
    // Nghĩa thêm function dành cho FBA Overview và viewchild
    convert_date_tostringdate_by_nghia(date, type = true) {
        if (type) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        } else {
            const dateint = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
            const monthint = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
            return dateint + '/' + monthint + '/' + date.getFullYear();
        }
    }
    // Nghĩa thêm function check object rỗng
    isEmptyObject(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    // kết thúc hàm
    convert_dateint_tostringdate(date_time) {
        // 2018-09-019
        const date_int = Number(date_time);
        let date: any;
        if (date_int < 1) {
            date = new Date();
        } else {
            date = new Date(date_int);
        }
        return this.convert_date_tostringdate(date);
    }


    /*----------  Convert mac dinh  ----------*/
    convert_date_tostring(date) {
        return '\'' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate()) + ' 00:00:00\'';
    }
    convert_dateint_tostring(date_time) {
        // 2018-09-08 16:38:15.680
        const date_int = Number(date_time);
        let date: any;
        if (date_int < 1) {
            date = new Date();
        } else {
            date = new Date(date_int);
        }
        return this.convert_date_tostring(date);
    }
    get_user_page_parametter(page_id): Observable<any> {
        const data = {
            page_id: page_id
        };
        // console.log('get_user_page_parametter: ', data);
        return this.post(data, environment.API.COMMON.get_user_page_parametter);
    }

    get_user_page_parametter_v2(page_id, language): Observable<any> {
        const data = {
            page_id: page_id,
            language: language
        };
        // console.log('get_user_page_parametter: ', data);
        return this.post(data, environment.API.COMMON.get_user_page_parametter + '_v2');
    }
    save_user_page_parametter(page_id, parametter) {
        const data = {
            page_id: page_id,
            parametter: parametter
        };
        // if (!environment.production) {
        //     console.log('save_user_page_parametter', data);
        // }
        this.post(data, environment.API.COMMON.user_page_parametter).subscribe(res => {
            localStorage.setItem('page_id', res.page_id);
        });
    }
    save_user_page_parametter_by_nghia(page_id, parametter) {
        const data = {
            page_id: page_id,
            parametter: parametter
        };
        if (!environment.production) {
            console.log('save_user_page_parametter', data);
        }
        return this.post(data, environment.API.COMMON.user_page_parametter);
    }

    convert_parametter_json(param) {
        return {
            organization_id: (param != null && param.organization_id != null) ? param.organization_id : 0
            , site_id: (param != null && param.site_id != null) ? Number(param.site_id) : 0
            , start_time: (param != null && param.start_time != null) ? param.start_time : '\'' + '08:00' + '\''
            , end_time: (param != null && param.end_time != null) ? param.end_time : '\'' + '22:00' + '\''
            , start_date: (param != null && param.start_date != null) ? param.start_date : this.convert_date_tostring(new Date())
            , end_date: (param != null && param.end_date != null) ? param.end_date : this.convert_date_tostring(new Date())
            , start_date_int: (param != null && param.start_date_int != null) ? param.start_date_int : Number(new Date())
            , end_date_int: (param != null && param.end_date_int != null) ? param.end_date_int : Number(new Date())
            , view_by: '\'hour\''
            , organization_id_compare: (param != null && param.organization_id_compare != null) ? param.organization_id_compare : 0
            , site_id_compare: (param != null && param.site_id_compare != null) ? param.site_id_compare : 0

            // tslint:disable-next-line:max-line-length
            , start_date_compare: (param != null && param.start_date_compare != null) ? param.start_date_compare : this.convert_date_tostring(new Date())
            // tslint:disable-next-line:max-line-length
            , end_date_compare: (param != null && param.end_date_compare != null) ? param.end_date_compare : this.convert_date_tostring(new Date())
            // tslint:disable-next-line:max-line-length
            , start_date_int_compare: (param != null && param.start_date_int_compare != null) ? param.start_date_int_compare : Number(new Date())
            , end_date_int_compare: (param != null && param.end_date_int_compare != null) ? param.end_date_int_compare : Number(new Date())

            , operation: (param != null && param.operation != null) ? param.operation : 'sum'
        };
    }

    // Fba Lấy menu tree của org và site
    fba_get_org_tree(organization_id) {
        return new Promise(resolve => {
            this.get(environment.API.sites_tree + '?organization_id=' + organization_id).subscribe(
                res => {
                    this.fba_org_tree_menu = [];
                    // Lấy root_ids
                    const root_ids = res.filter(x => Number(x.alevel) === 0 && Number(x.parent_id) === 0);
                    root_ids.forEach(element => {
                        // Lấy root node của menu
                        this.fba_get_node_menu(element);
                        this.fba_dequy_menu(element, res);
                    });


                    this.fba_org_tree_menu.forEach(element => {
                        let khoangcach = '';
                        for (let i = 0; i < element.alevel; i++) {
                            khoangcach += '-';
                        }
                    });
                    resolve(this.fba_org_tree_menu);
                }
            );
        });
    }

    fba_dequy_menu(element, datas) {
        // Kiểm tra xem có node con của phần tử này hay không?
        // console.log('organization_id ', element.organization_id);
        const objs = datas.filter(x => x.organization_id === element.organization_id
            && x.parent_id === element.site_id
            && Number(x.alevel) > Number(element.alevel));

        // console.log('dequy_menu objs ', objs);

        // Nếu có phần tử con thì đệ quy
        // Nếu không có thì thoát đệ quy
        if (objs) {
            objs.forEach(element1 => {

                // Lấy node con của menu;
                this.fba_get_node_menu(element1);
                // Đệ qui để lấy đến node cuối cùng
                this.fba_dequy_menu(element1, datas);
            });
        }
    }
    fba_get_node_menu(element) {
        this.fba_org_tree_menu.push({
            id: Number(element.site_id),
            organization_id: Number(element.organization_id),
            parent_id: Number(element.parent_id),
            alevel: Number(element.alevel),
            site_name: element.site_name,
        });
    }

    // 02/12/2019 Sử  dụng menu Promise cho dashboarc để phân quyền địa điểm cho Users
    get_menu_tree_by_account(organization_id) {
        return new Promise(resolve => {
            const url = environment.API.sites + '_get_site_for_report';
            const data = { organization_id: organization_id };
            this.post(data, url).subscribe(res => {
                this.fba_org_tree_menu = [];
                console.log('res.site_array', res.site_array);
                this.recusive_menu(res.site_array);
                resolve(this.fba_org_tree_menu);
            }
            );
        });
    }

    // Hàm đệ quy menu
    recusive_menu(array: any[], id = null, space = 0) {
        array.forEach(element => {
            if (element.parent_id === id) {
                const a_id = element.id;
                this.fba_org_tree_menu.push({
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

    // Nghĩa thêm function return error API
    validate_error(error) {
        const errorNumber = error.code;
        // Nếu là validate thì trả về lỗi validate
        if (errorNumber === Number(environment.validation_code)) {
            return JSON.parse(error.message);
        } else { // Nếu không thì trả về lỗi mặc định
            return [environment.default_error_string];
        }
    }

    downloadPDF(url): any {
        return this.http.get(url, { responseType: ResponseContentType.Blob }).map(
            (res) => {
                return new Blob([res.blob()], { type: 'application/pdf' });
            });
    }

}
