import { Component, Output, EventEmitter, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AppService } from '../../../app.service';
import { environment } from '../../../../environments/environment';
import { IOption } from 'ng-select';
import { language } from '../../../language';
import { language_en } from '../../../language_en';
@Component({
    selector: 'app-menutree',
    templateUrl: './menutree.component.html',
    styleUrls: ['./menutree.component.css']
})

export class MenutreeComponent implements OnInit {
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
    array_site_id = [];
    constructor(private appservice: AppService, private render2: Renderer2) { }
    @Output() submit_menu = new EventEmitter<any>();
    language: any;
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
        this.snap_menu_tree = this.menu_tree;
        this.site_id = site_id;
        this.location_label = this.menu_tree.filter(x => Number(x.id) === Number(this.site_id))[0].site_name;
        if (this.userInfo.lever === '0') {
            this.organization_array = organization_array;
            this.organization_id = String(organization_id);
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
    changemenu(item, event: ElementRef) {
        this.site_id = item.id;
        // this.render2.addClass(event, 'active');
        // this.array_site_id.push(this.site_id);
        // console.log('this.array_site_id', this.array_site_id);
        this.location_label = item.site_name;
        const data = { site_id: item.id };
        this.submit_menu.emit(data);
        this.search_key = '';
        this.displaylocation = !this.displaylocation;
    }


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
    OrgSelected(event) {
        const data = {
            organization_id: event.value
        };
        this.submit_menu.emit(data);
        this.popuplocation = false;
    }
}
