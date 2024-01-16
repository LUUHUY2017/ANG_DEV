import {
  Component, OnInit, ViewEncapsulation, Renderer2,
  ViewChildren, TemplateRef
} from '@angular/core';
// import { navItems } from '../../_nav';
import { AppService } from '../../app.service';
import { trigger, transition, style, animate } from '@angular/animations';

import { environment } from '../../../environments/environment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Highcharts from 'highcharts';
// import HC_exporting from 'highcharts/modules/exporting';
// HC_exporting(Highcharts);
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as io from 'socket.io-client';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { language } from '../../language';
import { language_en } from '../../language_en';
import { Version } from '../../../version';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: [
    '../../../scss/vendors/bs-datepicker/bs-datepicker.scss'
    , './default-layout.component.scss'
    , './heatmap-chiso-visit.component.css'
    , './vi-stor-time-head.component.css'
  ],
  animations: [
    trigger('routeAnimations', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('1s ease-out', style({ opacity: '1' })),
      ]),
      transition(':leave', [
        style({ opacity: '1' }),
        animate('1s ease-out', style({ opacity: '0' })),
      ]),
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class DefaultLayoutComponent implements OnInit {
  private socket: SocketIOClient.Socket;
  @ViewChildren('menu_li') menu_li;
  organization_name: any;
  public modalRef: BsModalRef;
  url = environment.apiUrl + 'images/';
  ImageUrl: string | ArrayBuffer;
  img_source: File;
  count_notification = 0;
  spinner = false;
  // Hiển thị popup để chọn site
  siteSelectionDisplay = false;
  // khai báo site tree list
  site_selected: any;
  siteTreeList: any;
  site_cols = [
    { field: 'id', header: '#' },
    { field: 'site_code', header: 'Mã' },
    { field: 'site_shortname', header: 'Tên viết tắt' },
    { field: 'site_name', header: 'Tên' },
  ];
  // end khai báo site tree list

  organizations = [];
  organizations_filter = [];
  organization_id = 0;
  organization_selected = '';
  language: any;
  status = 1;
  public items: any;

  navItems = JSON.parse(localStorage.getItem(environment.Left_menu_array));
  type_language = JSON.parse(localStorage.getItem(environment.language));
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  @BlockUI() blockUI: NgBlockUI;
  // Nghĩa 26/10
  public show_menu_left = '';
  public show = true;
  //  Huy 18/12
  username: string;
  email: string;
  created_at: string;
  show_menu: string;
  data_notification = [];
  error_message: string;
  message_status: string;
  tag_array: any;
  help_array: any;
  userLever: number;
  version = Version.version;
  version_api = Version.version_api;
  version_service = Version.version_service;
  version_socketio = Version.version_socketio;
  connectSocketIo = true;
  constructor(private appservice: AppService, private router: Router, private render2: Renderer2
    , private modalService: BsModalService, private sanitizer: DomSanitizer) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.socket = io(environment.UrlSocket);
    // Check xem nguoi dung co thay doi LocalStorage khong
    const self = this;
    // window.addEventListener('storage', function (e) {
    //   if (e.key === 'module_array'
    //     || e.key === 'is_admin_organization'
    //     || e.key === 'UserLoged'
    //     || e.key === 'access_token'
    //     || e.key === 'connectSocketIo'
    //     || e.key === 'Left_menu_array') {
    //     console.log('chuyển trang tại đây window.addEventListener');
    //     self.router.navigate(['/login']);
    //   }
    // });
    // this.appservice.get('api/check_auth').subscribe(res => {
    //   console.log(res);
    // }, (error) => {
    //   localStorage.clear();
    //   this.router.navigate(['/login']);
    // });
  }
  ngOnInit() {
    const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
    if (!environment.production) {
      console.log(this.navItems);
    }
    // khoi tao lich
    if (this.connectSocketIo) {
      // this.get_notification();
      this.socket.on('disconnect', function () {
        // if (!environment.production) {
        console.warn('WARRING!..................................');
        console.log('Giám sát thiết bị mất kết nối với máy chủ');
        console.log('Vui lòng kiểm tra lại kết nối!');
        // }
      });
      this.socket.on('connect', function () {
        // if (!environment.production) {
        console.log('INFO!......................................');
        console.log('Giám sát thiết bị đã kết nối với máy chủ');
        // }
      });
      // console.log('get_notifications_' + userInfo.id);
      this.socket.on('get_notifications_' + userInfo.id, (res: any) => {
        // console.log(res);
        this.playAudio();
        this.count_notification++;
        this.data_notification.unshift(res);
        // console.log(this.data_notification);
      });
      this.socket.emit('admin_staff_vip_backlist_send_snapshot_request_from_service_gender_age_to_server', {});
    }
    const version = Number(localStorage.getItem('version'));
    // console.log(version);
    if (!version || version < Number(environment.version)) {
      // console.log('chuyển trang tại đây version');
      this.router.navigate(['/login']);
    }
    // Huy: 18/12 show thông tin người dùng
    this.show_menu_location();
    // console.log('menu', this.navItems);
  }
  // lấy số lượng thông báo
  get_notification() {
    const url = environment.API.get_message_with_user;
    this.appservice.get(url).subscribe(res => {
      // console.log(res);
      this.data_notification = res.message_array;
      this.data_notification.forEach(element => {
        element.actived = Number(element.actived);
        if (element.actived === 0) {
          this.count_notification++;
        }
      });
    });
  }
  delete_item(item) {
    this.error_message = '';
    const id = Number(item.id);
    const url = environment.API.update_status_message + '_delete';
    const data = {
      message_id: id
    };
    this.appservice.post(data, url).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }

      if (res.message === 1) {
        this.data_notification.splice(this.data_notification.indexOf(id) + 1, 1);
      } else {
        this.error_message = 'Đã có lỗi xảy ra';
      }
    }, (error) => {
      this.error_message = 'Đã có lỗi xảy ra';
    });
  }
  truncate_all() {
    this.error_message = '';
    const url = environment.API.update_status_message + '_truncates';
    this.appservice.get(url).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }

      if (res.message === 1) {
        this.data_notification = [];
        this.count_notification = 0;
      } else {
        this.error_message = 'Đã có lỗi xảy ra';
      }
    }, (error) => {
      this.error_message = 'Đã có lỗi xảy ra';
    });
  }
  get_help(template) {
    this.status = 1;
    this.tag_array = [];
    this.message_status = 'Đang tải dữ liệu';
    this.openModal(template);
    const url = environment.API.sp_get_help_list + '_tag';
    this.appservice.get(url).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }

      if (!('message' in res)) {
        this.spinner = false;
        if (res.data.length === 0) {
          this.message_status = 'Chưa có trợ giúp';
        }
        this.tag_array = res.data;
      } else {
        this.message_status = 'Có lỗi xảy ra';
      }
    }, (error) => {
      if (!environment.production) {
        console.log(error);
      }
      this.spinner = false;
      this.message_status = 'Có lỗi xảy ra';
    });
  }
  get_detail_help(tag_id) {
    this.help_array = [];
    const data = {
      id: tag_id
    };
    this.spinner = true;
    const url = environment.API.sp_get_help_list + '_from_tag_id';
    this.appservice.post(data, url).subscribe(res => {
      this.spinner = false;
      if (!('message' in res)) {
        if (!environment.production) {
          console.log(res);
        }

        res.data.forEach(element => {
          element.tag_name = element.tag_name.split(',');
        });
        this.help_array = res.data;
        this.status = 2;
      } else {
        this.error_message = 'Đã có lỗi xảy ra';
      }
    }, (error) => {
      this.error_message = 'Đã có lỗi xảy ra';
    });
  }
  to_add_help() {
    this.spinner = true;
    this.router.navigate(['/help/add-help']);
    this.modalRef.hide();
  }
  // safe_url(url) {
  //   return this.sanitizer.bypassSecurityTrustHtml(url);
  // }
  notification_click(item) {
    if ('link_access' in item && item.link_access !== null) {
      const url = window.location.hostname + '/' + item.link_access;
      window.open(url, '_blank');
    }
    if (item.actived === 0) {
      item.actived = 1;
      this.count_notification--;
      const api_url = environment.API.update_status_message;
      const data = {
        message_id: item.id
      };
      this.appservice.post(data, api_url).subscribe(res => {
        if (!environment.production) {
          if (!environment.production) {
            console.log(res);
          }
        }
      });
    }
  }
  playAudio() {
    const audio = new Audio();
    audio.src = '../../../assets/wav/notifications.wav';
    audio.load();
    audio.play();
  }
  // click hiện modal
  openModal(templates: TemplateRef<any>) {
    this.spinner = true;
    this.error_message = '';
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'gray modal-md'
    });
  }
  handleFileInput(file: FileList) {
    this.ImageUrl = null;
    this.img_source = null;
    const fileload = file.item(0);
    this.img_source = fileload;
    // console.log(this.img_source);
    const reader = new FileReader();
    reader.onload = (e) => { this.ImageUrl = reader.result; };
    if (fileload) {
      reader.readAsDataURL(fileload);
    }
  }
  add_feedback(item: NgForm) {
    // console.log(item.value);
    this.blockUI.start('Đang xử lý dữ liệu...');
    const data: FormData = new FormData();
    if (this.img_source) {
      data.append('img_source', this.img_source, this.img_source.name);
    }
    data.append('data', JSON.stringify(item.value));
    // console.log(data);
    // return;
    const url = environment.API.sp_get_feedback_list + '_insert';
    this.appservice.post(data, url).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }
      if (res.message === 1) {
        alert('Gửi feedback thành công');
      } else {
        alert('Đã có lỗi xảy ra! Quá trình gửi feedback thất bại.');
      }
      item.reset();
      this.blockUI.stop();
    },
      (error) => {
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
        this.modalRef.hide();
      });
  }
  change_password(changepwd) {
    this.openModal(changepwd);
  }
  get_animation(menu_li, event: MouseEvent, has_children = false) {
    const li = menu_li;
    // menu_li.style.position = 'relative';
    const circle = this.render2.createElement('div');
    // console.log(menu_li);
    // console.log(event);
    this.render2.appendChild(li, circle);
    const d = Math.max(li.clientWidth, li.clientHeight);
    circle.style.width = circle.style.height = d + 'px';
    const rect = li.getBoundingClientRect();
    circle.style.left = event.clientX - rect.left - d / 2 + 'px';
    circle.style.top = event.clientY - rect.top - d / 2 + 'px';
    circle.classList.add('ripple');
    setTimeout(() => {
      circle.parentNode.removeChild(circle);
    }, 400);
    if (has_children) {
      li.parentNode.classList.toggle('show_sub_menu');
    }
  }
  // lấy element
  get_element(event) {
    // console.log(event);
    event.parentNode.classList.toggle('active');
  }
  // khai báo hàm show menu
  on_off_leftmenu() {
    if (this.show_menu_left === 'left') {
      this.show_menu_left = '';
      this.show = true;
    } else {
      this.show_menu_left = 'left';
      this.show = false;
    }
  }
  // End.
  // Huy:18/12/2018 Show thông tin người dùng
  show_menu_location() {                            // hiện menu tổ chức theo user
    const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
    if (!environment.production) {
      console.log('userInfo', userInfo);
    }
    this.userLever = Number(userInfo.lever);
    this.username = userInfo.name;
    this.email = userInfo.email;
    this.created_at = userInfo.created_at;
    this.organization_name = userInfo.organization_name;
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }
}
