import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
// import { navItems } from '../../_nav';
import { AppService } from '../../app.service';
import { Location } from '@angular/common';
import { language } from '../../language';
import { language_en } from '../../language_en';
import * as MenuObject from '../../menuObject';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginError = false;
  errMes = '';
  url = environment.apiUrl + 'images/';
  @BlockUI() blockUI: NgBlockUI;
  logo_source: any;
  language: any;
  language_bi = 'vn';
  statusPage: number;
  msgArray: any;
  constructor(private router: Router, private service: LoginService, private appservice: AppService, private loc: Location) {
  }
  setDefaultValue() {
    this.msgArray = null;
    this.statusPage = 1;
  }
  changeStatusPage(id: number) {
    this.statusPage = id;
  }
  ngOnInit() {
    this.setDefaultValue();
    // Lấy logo với điều kiện là trên server
    if (environment.production) {
      this.get_logo();
    }
    this.language_bi === 'vn' ? this.language = language : this.language = language_en;
    // Nếu có localstorage
    const access_token = localStorage.getItem(environment.access_token);
    if (access_token) {
      // Gửi thông tin để thực hiện xóa access_token cũ
      this.appservice.get(environment.API.logout).subscribe(res => {
        console.log('Đăng xuất thành công');
      }, (error) => {
        console.log('Không thể kết nối tới máy chủ');
      });
      // Xóa tại client.
      this.service.logout();
    }
  }

  get_logo() {
    const source = window.location.hostname; // Lấy tên miền ví dụ: bi.acs.vn
    // Gửi thông tin để lấy logo
    this.blockUI.start('Đang tải thông tin cấu hình...');
    const url = environment.API.get_organization_for_login;
    const data = {
      name: source
    };
    this.appservice.post(data, url).subscribe(res => {
      console.log(res);
      this.logo_source = res.data;
    }, (error) => {
      // nothing to do
    }).add(() => {
      this.blockUI.stop();
    });
  }

  change_language(event) {
    if (!environment.production) {
      console.log(event.target.value);
    }
    this.language_bi = event.target.value;
    this.language_bi === 'vn' ? this.language = language : this.language = language_en;

    localStorage.setItem(environment.language, event.target.value);
  }

  OnSubmit(email, password) {
    this.isLoginError = false;
    this.blockUI.start('Loading...'); // Start blocking
    this.service.login(email, password).subscribe(
      res => {
        localStorage.setItem(environment.language, JSON.stringify(this.language_bi));
        localStorage.setItem(environment.oauth_token, res);
        localStorage.setItem(environment.access_token, res.access_token);
        this.getInfoUser();
      },
      (error) => {
        if (error === 'Server error') {
          this.errMes = 'Máy chủ không trả lời, kiểm tra máy chủ hoặc đường truyền internet';
        } else if (error === 'invalid_credentials') {
          this.errMes = 'Tên đăng nhập hoặc mật khẩu không đúng';
        } else {
          this.errMes = 'Lỗi không rõ nguyên nhân';
        }
        this.isLoginError = true;
        this.blockUI.stop();
      });
  }
  getInfoUser() {
    this.service.getUser().subscribe(res => {
      const userInfo = res.userInfo;
      // lưu thông tin người dùng vào localStorage
      localStorage.setItem(environment.UserLoged, JSON.stringify(userInfo));
      if (res.status === 0) {
        this.errMes = res.code === 770 ? res.message : 'Đã có lỗi xảy ra';
        this.isLoginError = true;
        this.service.logout();
        return;
      }
      // Lưu module vào client storage
      localStorage.setItem(environment.module_array, JSON.stringify(res.page_module_array));
      // Lưu menu vào client storage
      const menu_item = res.invisible_menu_item.map(e => e.url);
      const ListMenuItem = this.Get_module(res.page_module_array, menu_item);
      if (!environment.production) {
        console.log('menu_item', menu_item);
        console.log('ListMenuItem', ListMenuItem);
        console.log('res.page_module_array', res.page_module_array);
      }



      localStorage.setItem(environment.Left_menu_array, JSON.stringify(ListMenuItem));
      // Check xem là quản trị hệ thống không
      // localStorage.setItem(environment.is_admin_organization, JSON.stringify(res.is_admin));
      // Lấy các page thành viên có quyền truy cập
      // const expert_page = res.invisible_menu_item.map(e => e.url);
      // localStorage.setItem('expert_page', JSON.stringify(expert_page));
      // check xem có được kết nối socket io không
      localStorage.setItem('connectSocketIo', environment.connectSocketIo);
      // lấy version
      console.log('environment.version', environment.version);
      localStorage.setItem('version', String(environment.version));
       this.router.navigate(['/dashboard']);
      //this.router.navigate(['/footfall/overview']);
      // this.get_data_necessary();
    }, (error) => {
      this.isLoginError = true;
      this.errMes = 'Máy chủ không trả lời, kiểm tra máy chủ hoặc đường truyền internet';
      // Nếu không hợp lệ
      this.service.logout();
    }).add(() => {
      this.blockUI.stop();
    });
  }
  forgotPwdSubmit(forgotPwd: FormGroup) {
    this.msgArray = null;
    this.blockUI.start('Loading...'); // Start blocking
    const data = { ...forgotPwd.value };
    const url = environment.API.userInfo.forgotPassword;
    forgotPwd.reset();
    this.service.post(data, url).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }
      if (res.status === 1) {
        // this.updateState(environment.STATE.insert, res.insertedData);
        // this.modalRef.hide();
        // alert('Gửi email thành công');
        this.msgArray = {
          isError: false,
          _msg: ['Success! Please check the registration email.']
        };
      } else {
        this.msgArray = {
          isError: true,
          _msg: this.appservice.validate_error(res)
        };
        // console.log(this.error_array);
      }
    }, (error) => {
      this.msgArray = {
        isError: true,
        _msg: ['Đã có lỗi xảy ra']
      };
    }).add(() => {
      this.blockUI.stop();
    });
  }
  createSpecificInstance(key: string, page_module_array: Array<any>): MenuObject.MenuItemNameSpace.MenuItem {
    let instance = null;
    const toLowerKey = key.toLocaleLowerCase();
    switch (toLowerKey) {
      case 'footfall': {
        instance = new MenuObject.MenuItemNameSpace.FootfallMenuItem();
        break;
      }
      case 'fba': {
        instance = new MenuObject.MenuItemNameSpace.FbaMenuItem();
        break;
      }
      case 'genderage': {
        instance = new MenuObject.MenuItemNameSpace.GenderAgeMenuItem();
        break;
      }
      case 'performance': {
        instance = new MenuObject.MenuItemNameSpace.PerformanceMenuItem();
        break;
      }
      case 'all': {
        const pageArrayString = page_module_array.map(e => e.page_module);
        instance = new MenuObject.MenuItemNameSpace.GeneralMenuItem(pageArrayString);
        break;
      }
      default: {
        break;
      }
    }
    return instance;
  }
  Get_module(page_module_array: Array<any>, invisible_menu_item: Array<any>) {
    const pushData: Array<MenuObject.MenuItemNameSpace.MenuItem> = [
      // new MenuObject.MenuItemNameSpace.DefaultMenuItem()
    ];
    for (let i = 0; i < page_module_array.length; i++) {
      // tạo ra các object cụ thể
      const element = page_module_array[i];
      const newInstance = this.createSpecificInstance(element.page_module, page_module_array);
      // Nếu như có loại bỏ 1 số menu con
      if (invisible_menu_item.length > 0 && newInstance !== null && newInstance.module_title !== 'all') {
        for (let j = 0; j < newInstance.children.length; j++) {
          const el = newInstance.children[j];
          if (invisible_menu_item.includes(el.url)) {
            newInstance.children.splice(j, 1);
          }
        }
      }
      if (newInstance !== null) {
        pushData.push(newInstance);
      }
    }
    pushData.push(new MenuObject.MenuItemNameSpace.AboutMenuItem());
    pushData.push(new MenuObject.MenuItemNameSpace.NotificationMenuItem());
    return pushData;
  }
}
