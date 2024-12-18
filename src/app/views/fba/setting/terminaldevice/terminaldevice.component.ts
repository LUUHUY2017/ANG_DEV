import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { language } from '../../../../language';
import { language_en } from '../../../../language_en';
// import viewchild
import { FbaMenuComponent } from '../../../viewchild/fbamenu/fbamenu.component';
@ViewChild(FbaMenuComponent)

@Component({
  templateUrl: './terminaldevice.component.html',
  styleUrls: ['./terminaldevice.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class FbaTerminalDeviceComponent implements OnInit {
  @ViewChild('dataTable') table: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  page_id = '\'' + environment.Pages.fba.terminals + '\'';
  can_add = false;
  can_update = false;
  can_delete = false;
  language: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(private router: Router, private route: ActivatedRoute, private appservice: AppService, private modalService: BsModalService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
  }
  // Khai báo kiểu dữ kiệu
  public data = [];
  data_filter = [];
  data2 = [];
  organization_id: string;
  organization_arr: Array<IOption>;
  organization_selected: string;
  site_id_selected: string;
  organization_add_id: string;
  org_selected: string;
  location_id: string;
  location_id2: string;
  site_id1: string; site_id2: string;
  modalRef: BsModalRef;
  location_arr: Array<IOption>;
  site_update_name: string;
  site_add_name: string;
  delete_tablet_id: string;
  // phân trang bảng
  rowsOnPage = 15;
  filterQuery = '';
  SelectionDisplay = false;
  show_icon = false;
  url_img = 'http://i.imgur.com/Z4eQKYZ.gif';
  menu_tree1: any; snap_menu_tree1: any;
  menu_tree2: any; snap_menu_tree2: any;
  siteSelectionDisplay = false;
  userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));

  ngOnInit(): void {
    this.get_crud_on_page();
    this.get_page_param();
  }

  // lấy quyền
  get_crud_on_page() {
    const data = {
      page_id: this.page_id
    };
    const url = environment.FBA.ADMIN.get_crud_page;
    this.appservice.post(data, url).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }
      res.crud_page_array.forEach(element => {
        const permission_name = element.permission_name.toLowerCase();
        if (permission_name === 'add') {
          this.can_add = true;
        }
        if (permission_name === 'update') {
          this.can_update = true;
        }
        if (permission_name === 'delete') {
          this.can_delete = true;
        }
      });
    }, (error) => {
    }, () => {
    });
  }

  // Lấy thông tin tổ chức
  get_page_param() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.get_user_page_parametter(this.page_id).subscribe(
      param => {
        if (!environment.production) {
          console.log('get_page_param', param);
        }
        const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
        this.organization_arr = param.organization_arr;
        this.organization_selected = this.organization_add_id = this.org_selected = this.organization_id = param.organization_arr[0].value;
        if (userInfo.lever === '0') {
          this.organization_arr.push({
            label: this.language.khong_xac_dinh, value: '0'
          });
        }
        this.getdata();
      }, (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
      }
    );
  }

  // Thay đổi tổ chức header của bảng
  changeorganization_table(event) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    if (!environment.production) {
      console.log('id_or', event);
    }
    this.organization_id = event;
    this.getdata();
  }

  // Modal hỏi xóa
  modal_question(item, dialog: TemplateRef<any>) {
    if (!environment.production) {
      console.log('dữ liệu từng bản ghi', item);
    }
    this.delete_tablet_id = item;
    this.modalRef = this.modalService.show(dialog, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  // Open Modal thêm mới
  open_modal_them_moi(templates: TemplateRef<any>) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.org_selected = this.organization_id;
    this.get_menutree_by_or(this.org_selected);
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  //  Hành động click chọn site ở menu tree thêm mới
  change_site_seleted(organization_id, id, site_name) {
    if (!environment.production) {
      console.log('id', id);
    }
    this.get_location_by_site(id);
    this.site_add_name = site_name;
    this.site_update_name = site_name;
    this.siteSelectionDisplay = false;
  }

  // Lấy menutree theo tổ chức đã chọn phần thêm mới
  get_menutree_by_or(organization_id) {
    this.show_icon = true;
    this.site_add_name = '';
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.get_menu_tree_by_account(organization_id)
      .then(res => {
        try {
          if (!environment.production) {
            console.log('get_sitetree', res);
          }
          this.show_icon = false;
          this.menu_tree1 = res;
          this.snap_menu_tree1 = res;
          if (this.menu_tree1.length > 1) {
            this.site_add_name = this.menu_tree1[1].site_name;
            this.site_id1 = this.menu_tree1[1].id;
            this.get_location_by_site(this.site_id1);
          } else {
            this.site_add_name = this.menu_tree1.length > 0 ? this.menu_tree1[0].site_name : '';
            this.site_id1 = this.menu_tree1.length > 0 ? this.menu_tree1[0].id : 0;
            this.blockUI.stop();
          }
        } catch (ex) {
          this.blockUI.stop();
        }
      });
  }

  //  Lấy location theo site đã chọn ở menutree
  get_location_by_site(site_id) {
    const data = { site_id: site_id, module: 2 };
    if (!environment.production) {
      console.log('id', data);
    }
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.location_id = this.location_id2 = '';
    this.show_icon = true;
    this.appservice.post(data, environment.FBA.ADMIN.get_location_tablets).subscribe(
      respo => {
        try {
          this.show_icon = false;
          if (!environment.production) {
            console.log('dữ liệu vị trí', respo);
          }
          this.location_arr = respo.location_tablet;
          if (this.location_arr.length > 0) {
            this.location_id = this.location_id2 = respo.location_tablet[0].value;
          } else {
            this.location_id = this.location_id2 = '';
          }
          this.blockUI.stop();
        } catch (ex) {
          this.blockUI.stop();
        }
      });
  }

  // Open modal update từng thiết bị
  open_modal_update(item, template: TemplateRef<any>) {
    // this.blockUI.start(this.language.dang_tai_du_lieu);
    if (!environment.production) {
      console.log('dữ liệu từng bản ghi', item);
    }
    this.data2 = Object.assign({}, item);
    this.site_update_name = item.site_name;
    this.location_id2 = item.location_id;
    this.get_menutree_by_or2(item.organization_id, 2);
    this.get_location_by_site2(item.site_id);
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
    // this.blockUI.stop();
  }

  // Lấy menutree theo tổ chức đã chọn phần update
  get_menutree_by_or2(organization_id, e: number) {
    this.show_icon = true;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.fba_get_org_tree(organization_id)
      .then(res => {
        try {
          if (!environment.production) {
            console.log('get_sitetree', res);
          }
          this.show_icon = false;
          this.menu_tree2 = res;
          this.snap_menu_tree2 = res;
          if (this.menu_tree2 > 0) {
            this.site_id2 = this.menu_tree2[1].id;
          }
          if (e === 1) {
            this.site_update_name = '';
            if (this.menu_tree2.length > 1) {
              this.site_update_name = this.menu_tree2[1].site_name;
            }
            this.get_location_by_site2(this.site_id2);
          }
        } catch (ex) {
          this.blockUI.stop();
        }

      });
    // this.blockUI.stop();
  }

  //  Lấy location theo site đã chọn ở menutree
  get_location_by_site2(site_id) {
    const data = { site_id: site_id, module: 2 };
    if (!environment.production) {
      console.log('id', data);
    }
    this.show_icon = true;
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.post(data, environment.FBA.ADMIN.get_location_tablets).subscribe(
      respo => {
        try {
          this.show_icon = false;
          if (!environment.production) {
            console.log('dữ liệu vị trí', respo);
          }
          this.location_arr = respo.location_tablet;
          if (this.location_arr.length > 0) {
            this.location_id2 = respo.location_tablet[0].value;
          } else {
            this.location_id2 = '';
          }
          this.blockUI.stop();
        } catch (ex) {
          this.blockUI.stop();
        }
      });
  }

  getdata() {
    const data = {
      organization_id: this.organization_id,
      // access_token: environment.Bearer + ' ' + localStorage.getItem(environment.access_token)
    };
    if (!environment.production) {
      console.log('data', data);
    }
    this.appservice.post(data, environment.FBA.Administration.fba_get_terminals).subscribe(
      param => {
        if (!environment.production) {
          console.log('data gửi về', param);
        }
        this.data = param;
        this.data_filter = param;
      }, (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
      }, () => {
        this.blockUI.stop();
      }
    );
  }

  // thêm vị trí cho thiết bị
  insert_location(item) {
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    if (!environment.production) {
      console.log('dữ liệu gửi đi', item.value);
    }
    const data: FormData = new FormData();
    data.append('data', JSON.stringify(item.value));
    this.appservice.post(data, environment.FBA.Administration.insert_location).subscribe(
      para => {
        if (!environment.production) {
          console.log('dữ liệu gửi về', para);
        }
        this.get_location_by_site(this.site_id_selected);
        this.site_add_name = '';
      }, (error) => {
        this.blockUI.stop();
      }, () => {
        this.blockUI.stop();
        this.SelectionDisplay = false;
      });
  }

  // thêm thiết bị
  insert_tablet(item) {
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    if (!environment.production) {
      console.log('dữ liệu gửi đi', item.value);
    }
    const data: FormData = new FormData();
    data.append('data', JSON.stringify(item.value));
    this.appservice.post(data, environment.FBA.Administration.fba_get_terminals + '_insert').subscribe(
      para => {
        if (!environment.production) {
          console.log('dữ liệu gửi về', para);
        }
      }, (error) => {
        this.blockUI.stop();
      }, () => {
        this.blockUI.stop();
        this.getdata();
      });
  }

  // cập nhật thiết bị
  update_tablet(item) {
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    if (!environment.production) {
      console.log('dữ liệu gửi đi', item.value);
    }
    const data: FormData = new FormData();
    data.append('data', JSON.stringify(item.value));
    data.append('token', localStorage.getItem(environment.access_token));
    this.appservice.post(data, environment.FBA.Administration.fba_get_terminals + '_update').subscribe(
      para => {
        if (!environment.production) {
          console.log('dữ liệu gửi về', para);
        }
      }, (error) => {
        this.blockUI.stop();
      }, () => {
        this.blockUI.stop();
        this.getdata();
      });
  }

  // Tìm kiếm input trong menutree add
  search_menu(value: string) {
    // chuyển giá trị truyền vào về chữ thường để so sánh
    const string = value.toLowerCase();
    if (string === '') {
      this.menu_tree1 = this.snap_menu_tree1;
    } else {
      this.menu_tree1 = this.snap_menu_tree1.filter(x => x.site_name.toLowerCase().indexOf(string) !== -1);
    }
  }

  // Tìm kiếm input trong menutree update
  search_menu2(value: string) {
    // chuyển giá trị truyền vào về chữ thường để so sánh
    const string = value.toLowerCase();
    if (string === '') {
      this.menu_tree2 = this.snap_menu_tree2;
    } else {
      this.menu_tree2 = this.snap_menu_tree2.filter(x => x.site_name.toLowerCase().indexOf(string) !== -1);
    }
  }

  // tìm kiếm bảng thiết bị
  search_table(value: string) {
    const string = value.toLowerCase();
    if (string === '') {
      this.data = this.data_filter;
    } else {
      this.data = this.data_filter.filter(x =>
        x.tablet_name.toLowerCase().indexOf(string) !== -1
        || x.serial_number.toLowerCase().indexOf(string) !== -1
        || x.site_name.toLowerCase().indexOf(string) !== -1
        || x.location_name.toLowerCase().indexOf(string) !== -1
      );
    }
  }

  // xóa thiết bị: chuyển trạng thái
  delete_tablets() {
    const data = {
      serial_number: this.delete_tablet_id
    };
    this.appservice.post(data, environment.FBA.Administration.fba_get_terminals + '_delete').subscribe(
      param => {
        this.modalRef.hide();
        this.getdata();
      }
    );
  }









}
