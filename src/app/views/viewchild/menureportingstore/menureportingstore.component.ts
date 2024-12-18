import { Component, Output, EventEmitter, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AppService } from '../../../app.service';
import { environment } from '../../../../environments/environment';
import { IOption } from 'ng-select';
import { language } from '../../../language';
import { language_en } from '../../../language_en';

@Component({
    selector: 'app-menureportingstore',
    templateUrl: './menureportingstore.component.html',
    styleUrls: ['./menureportingstore.component.scss']
})

export class MenuTreeReportingStoreComponent implements OnInit {
    menu_tree: any;
    snap_menu_tree: any;
    site_id: any;
    location_label: string;
    displaylocation = false;
    search_key: string;
    show_menu_parent: boolean;
    organization_array: Array<IOption>;
    organization_id: string;
    userInfo: any;
    popuplocation = false;
    show_hide_select_head: boolean;
    constructor(private appservice: AppService, private render2: Renderer2) { }
    language: any;
    // Nghia sua tu day
    newSiteArray: Array<any>;
    @Output() submit_menu = new EventEmitter<any>();

    ngOnInit() {
        this.show_menu_location();
        const type_language = JSON.parse(localStorage.getItem(environment.language));
        type_language === 'vn' ? this.language = language : this.language = language_en;
    }

    get_data(menutree, site_id, organization_array, organization_id: string) {
        const new_tree_menu = menutree.slice(0);
        this.menu_tree = [];
        this.recusive_menu(new_tree_menu);
        this.snap_menu_tree = this.menu_tree.slice(0);
        this.site_id = [];
        this.newSiteArray = [];
        if (this.menu_tree.length > 0) {
            if (site_id.includes('0')) {
                for (const value of this.menu_tree) {
                    if (value.enables === '1') {
                        this.newSiteArray.push(value);
                        this.site_id.push(value.id);
                        value.show = '1';
                    }
                }
                const data_send = { site_id: this.site_id, show_hide_select_head: true };
                // if (site_id.length === 1) {
                this.submit_menu.emit(data_send);
                // }
            }
            for (const value of this.menu_tree) {
                for (const value1 of site_id) {
                    if (value.id === value1) {
                        value.show = '1';
                    }
                }
            }
        }
        this.snap_menu_tree = this.menu_tree;
        this.site_id = site_id;
        this.newSiteArray = site_id.slice(0);
        console.log('this.newSiteArray 111', this.newSiteArray);
        this.location_label = this.menu_tree.filter(x => Number(x.id) === Number(this.site_id[0]))[0].site_name;
        if (this.userInfo.lever === '0') {
            this.organization_array = organization_array;
            this.organization_id = String(organization_id);
        }
        if (!environment.production) {
            console.log('  this.menu_tree', this.menu_tree);
            // console.log(' this.site_id', this.site_id);
            // console.log('   this.location_label', this.location_label);
        }
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
                    , show: 0
                });
                const scope = space + 1;
                this.recusive_menu(array, a_id, scope);
            }
        });
    }

    // Hàm đệ quy menu
    recusive_menu_store(array: any[], id = null, space = 0) {
        array.forEach(element => {
            if (element.parent_id === id) {
                const a_id = element.id;
                this.menu_tree.push({
                    id: element.id
                    , site_name: element.site_name
                    , parent_id: element.parent_id
                    , alevel: space
                    , enables: element.enables
                    , parent_name: element.parent_name
                });
                const scope = space + 1;
                this.recusive_menu_store(array, a_id, scope);
            }
        });
    }

    // Hàm thay đổi menu
    // changemenu(item, event: ElementRef) {
    //     this.site_id = item.id;
    //     if (!environment.production) {
    //         console.log('item', item);
    //         console.log('item.site_name', item.site_name);
    //     }
    //     this.location_label = item.site_name;
    //     const data = { site_id: item.id };
    //     this.submit_menu.emit(data);
    //     this.search_key = '';
    //     this.displaylocation = !this.displaylocation;
    // }

    // Hàm tìm kiếm menu
    search_menu() {
        // chuyển giá trị truyền vào về chữ thường để so sánh
        const string = this.search_key !== undefined ? this.search_key.toLowerCase() : '';
        if (string === '') {
            this.menu_tree = this.snap_menu_tree;
        } else {
            this.menu_tree = this.snap_menu_tree.filter(x => x.site_name.toLowerCase().indexOf(string) !== -1);
        }
    }

    // Hàm khi click ngoài menu tree
    set_value_empty() {
        this.displaylocation = false;
        this.search_key = '';
        this.menu_tree = this.snap_menu_tree;
    }


    // hiển thị menu chọn khu vực nếu người dùng có level lớn hơn 1
    show_menu_location() {
        this.userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
        this.show_menu_parent = false;
        if (this.userInfo.lever === '0') {
            this.show_menu_parent = true;
        }
    }

    // Chọn tổ chức
    org_selected(event) {
        const data = {
            organization_id: event.value
        };
        this.submit_menu.emit(data);
        this.popuplocation = false;
    }
    // bắt đầu sự kiện cho menu
    event_click_menu(item: any) {
        console.log('item.show', item.show);

        this.search_key = '';
        const checkbox = item.show === '1' ? null : '1';
        item.show = checkbox;
        if (checkbox === null) {
            this.event_cancel_parent(item.parent_id);
        } else {
            this.event_change_parent(item);
        }

        this.event_change_child(item, checkbox);
        this.site_id = [];
        if (!environment.production) {
            console.log('item', item);
            console.log('this.menu_tree', this.menu_tree);
        }
        for (let i = 0; i < this.menu_tree.length; i++) {
            if (this.menu_tree[i].show === '1') {
                this.site_id.push(this.menu_tree[i].id);
            }
        }
        if (!environment.production) {
            console.log(' this.site_id', this.site_id);
        }
        this.location_label = this.site_id.length > 0 ? this.menu_tree.filter(e => e.show === '1')[0].site_name : '';
        const found = this.site_id.length > 0 ? this.site_id.filter(element => element === '0') : 0;
        this.show_hide_select_head = found.length > 0 ? true : false;
        // console.log(' this.show_hide_select_head', this.show_hide_select_head);
        const data_send = { site_id: this.site_id, show_hide_select_head: this.show_hide_select_head };
        this.submit_menu.emit(data_send);
    }

    event_change_child(item: any, checkbox: string) {
        for (let i = 0; i < this.menu_tree.length; i++) {
            if (this.menu_tree[i].parent_id === item.id) {
                this.menu_tree[i].show = checkbox;
                this.event_change_child(this.menu_tree[i], checkbox);
            }
        }
    }

    event_cancel_parent(id: number) {
        this.menu_tree.forEach(element => {
            if (element.id === id) {
                element.show = null;
                const a_id = element.parent_id;
                this.event_cancel_parent(a_id);
            }
        });
    }

    event_change_parent(index: any) {
        let checker = true;
        const check_array = this.menu_tree.filter(item2 => item2.parent_id === index.parent_id);
        if (check_array.length > 0) {
            check_array.forEach(element2 => {
                if (element2.show === null) {
                    checker = false;
                }
            });
            if (checker) {
                const data = this.menu_tree.find(item3 => item3.id === index.parent_id);
                if (data) {
                    data.show = '1';
                    const a_index = {
                        id: data.id,
                        parent_id: data.parent_id
                    };
                    this.event_change_parent(a_index);
                }
            }
        }
        // console.log(check_array);
    }
}
