import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';

// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
// import socket
import * as io from 'socket.io-client';
// import notification
import { NotifierService } from 'angular-notifier';
import { FbaMenuComponent } from '../../../viewchild/fbamenu/fbamenu.component';
import { language } from '../../../../language';
import { language_en } from '../../../../language_en';

@Component({
  templateUrl: './tabletmonitor.component.html',
  styleUrls: ['./tabletmonitor.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class TabletMonitorComponent implements OnInit {
  @ViewChild(FbaMenuComponent)
  @ViewChild('dataTable') table: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  page_id = '\'' + environment.Pages.admin.listtablets + '\'';

  // khai báo socket
  private socket: SocketIOClient.Socket;
  private readonly notifier: NotifierService;
  language: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  errorMess: any;
  isOnload: boolean;
  isSuperAdmin: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    notifierService: NotifierService,
    private appservice: AppService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    // khai báo server kết nối
    // this.socket = io(environment.UrlSocket + '?data=1');
    // this.socket = io(environment.UrlSocket);
    this.notifier = notifierService;
  }
  // Khai báo kiểu dữ kiệu
  public data = [];
  public tablets = [];
  public tablets_dis = [];
  public tablets_warn = [];
  public tablets_conn = [];
  dataTable: any;
  data_filter = [];
  hienkhung = true;
  data2 = [];
  status: number;
  campaign_name: string;
  organization_id: number;
  actived: number;
  viewby: number;
  deleted: number;
  orgArray: Array<IOption>;
  data_list_organization_arr = [];
  org_selected: string;
  hidden_select_organization = false;
  messenger: any = [];
  show_alert = true;
  access_token: string;
  tablet_name_socket: string;
  tablet_name_connect: string;
  tablet_seri_connect: string;
  tablet_name_dis: string;
  tablet_seri_dis: string;
  tablet_seri_pin: string;
  tablet_seri_warn: string;
  tablet_seri_network: string;
  tablet_seri_charge1: string;
  tablet_seri_charge0: string;
  green = false;
  organizationId: string;
  warning = false;
  red = false;
  // phân trang bảng
  rowsOnPage = 15;
  filterQuery = '';

  ngOnInit(): void {
    this.actived = 1;

    this.getConfig();
    this.show_select_organization();
    /*----------Check  kết nối client----------*/
    this.socket.on('disconnect', function () {
      console.warn('WARRING!..................................');
      console.log('Giám sát thiết bị mất kết nối với máy chủ');
      console.log('Vui lòng kiểm tra lại kết nối!');
    });
    this.socket.on('connect', function () {
      console.log('INFO!......................................');
      console.log('Giám sát thiết bị đã kết nối với máy chủ');
    });
    /*-----------Check thiết bị có kết nối-------------*/
    this.socket.on('fba_tablet_connect', (res: any) => {
      if (!environment.production) {
        console.log('Thông tin tablet gửi về', res);
      }
      this.tablets.forEach(element => {
        if (element.serial_number === `${res.serial_number}`) {
          this.tablet_seri_connect = element.serial_number;
          this.red = false;
          this.green = true;
          this.warning = false;
          this.update_to_databse_by_socket(element.serial_number, 2);
          this.notifier.notify('success',
            (element.tablet_name ? this.language.thiet_bi + element.tablet_name : this.language.mot_thiet_bi) + ' đang online');
          const index = this.tablets.findIndex(ex => ex.serial_number === this.tablet_seri_connect);
          const a = this.tablets[index];
          this.tablets.splice(index + 1, 1);
          this.delete_element_old(`${res.serial_number}`);
          // Thực hiện dữ liệu lại vào bảng
          this.tablets_conn.unshift(a);
          this.tablets = [];
          this.tablets.push.apply(this.tablets, this.tablets_dis);
          this.tablets.push.apply(this.tablets, this.tablets_warn);
          this.tablets.push.apply(this.tablets, this.tablets_conn);
        }
      });
      this.reload_page();
    });
    /*-------------Check thiết bị thay đổi status-----------*/
    this.socket.on('fba_tablet_status_web', (res: any) => {
      if (!environment.production) {
        console.log('Dữ liệu socket trả về', res);
      }
      this.tablets.forEach(element => {
        if (element.serial_number === res.data.serial_number) {
          /*------Thông báo cắm sạc-------*/
          if (element.charge !== `${res.data.charge}` && `${res.data.charge}` === '1') {
            // tslint:disable-next-line: max-line-length
            this.notifier.notify('warning', (element.tablet_name ? this.language.thiet_bi + element.tablet_name : this.language.mot_thiet_bi) + this.language.vua_cam_sac);
            // Lấy phần tử trong tablets, để thực hiện đẩy vào cảnh báo
            this.tablets.forEach(eee => {
              if (eee.serial_number === res.data.serial_number) {
                this.tablet_seri_charge1 = eee.serial_number;
                this.red = false;
                this.green = true;
                this.warning = false;
                this.update_to_databse_by_socket(eee.serial_number, 2);
                // Tìm vị trí thiết bị trong bảng -> lấy thông tin -> xóa đi trong bảng
                const index = this.tablets.findIndex(ex => ex.serial_number === this.tablet_seri_charge1);
                const a = this.tablets[index];
                this.tablets.splice(index + 1, 1);
                this.delete_element_old(res.data.serial_number);
                // Xóa hết thiết bị cũ còn lưu và đẩy mới vào
                this.tablets_conn.unshift(a);
                this.tablets = [];
                this.tablets.push.apply(this.tablets, this.tablets_dis);
                this.tablets.push.apply(this.tablets, this.tablets_warn);
                this.tablets.push.apply(this.tablets, this.tablets_conn);
              }
            });
            this.reload_page();
          }
          /*------ Thông báo thay đổi kết nối-------*/
          if (element.network !== res.data.network) {
            // tslint:disable-next-line: max-line-length
            this.notifier.notify('warning', (element.tablet_name ? this.language.thiet_bi + element.tablet_name : this.language.mot_thiet_bi) + this.language.thay_doi_ket_noi);
          }
          // Thay đổi nguồn => cảnh báo
          if (element.charge !== `${res.data.charge}` && `${res.data.charge}` === '0') {
            this.tablet_seri_charge0 = element.serial_number;
            this.update_to_databse_by_socket(element.serial_number, 1);
            // this.notifier.notify('warning',(element.tablet_name ?
            //  this.language.thiet_bi + element.tablet_name : this.language.mot_thiet_bi) + ' vừa rút sạc');
            // Lấy phần tử trong tablets, để thực hiện đẩy vào cảnh báo
            this.tablets.forEach(eee => {
              if (eee.serial_number === res.data.serial_number) {
                this.red = false;
                this.green = false;
                this.warning = true;
                this.update_to_databse_by_socket(eee.serial_number, 2);
                // Tìm vị trí thiết bị trong bảng -> lấy thông tin -> xóa đi trong bảng
                const index = this.tablets.findIndex(ex => ex.serial_number === this.tablet_seri_charge0);
                const a = this.tablets[index];
                this.tablets.splice(index + 1, 1);
                this.delete_element_old(res.data.serial_number);
                // Xóa hết thiết bị cũ còn lưu và đẩy mới vào
                this.tablets_warn.unshift(a);
                this.tablets = [];
                this.tablets.push.apply(this.tablets, this.tablets_dis);
                this.tablets.push.apply(this.tablets, this.tablets_warn);
                this.tablets.push.apply(this.tablets, this.tablets_conn);
              }
            });
            this.reload_page();
          }
          /*-------Hết pin => cảnh báo----------*/
          if ((element.pin !== `${res.data.pin}`) && element.pin < 30) {
            this.red = false;
            this.green = false;
            this.warning = true;
            this.update_to_databse_by_socket(element.serial_number, 1);
            // tslint:disable-next-line:max-line-length
            // this.notifier.notify('warning', (element.tablet_name ? this.language.thiet_bi + element.tablet_name : this.language.mot_thiet_bi) + ' sắp hết pin');
            // Lấy phần tử trong tablets, để thực hiện đẩy vào cảnh báo
            this.tablets.forEach(eee => {
              if (eee.serial_number === res.data.serial_number) {
                this.tablet_seri_pin = eee.serial_number;
                // Tìm vị trí thiết bị trong bảng -> lấy thông tin -> xóa đi trong bảng
                const index = this.tablets.findIndex(ex => ex.serial_number === this.tablet_seri_pin);
                const a = this.tablets[index];
                this.tablets.splice(index + 1, 1);
                this.delete_element_old(res.data.serial_number);
                // Xóa hết thiết bị cũ còn lưu và đẩy mới vào
                this.tablets_warn.unshift(a);
                this.tablets = [];
                this.tablets.push.apply(this.tablets, this.tablets_dis);
                this.tablets.push.apply(this.tablets, this.tablets_warn);
                this.tablets.push.apply(this.tablets, this.tablets_conn);
              }
            });
            this.reload_page();
          }
          element.pin = `${res.data.pin}`;
          element.charge = `${res.data.charge}`;
          element.network = res.data.network;
          element.app_version = res.data.app_version;
          element.tablet_name_socket = res.data.serial_number;
          element.storage_free = res.data.storage_free;
          element.question_name_check = res.data.question_name_check;
        }
      });
    });  // kết nối thay đổi status

    /*-----------Check thiết bị mất kết nối-------------*/
    this.socket.on('fba_tablet_disconnect', (res: any) => {
      if (!environment.production) {
        console.log('Seri thiết bị mất kết nối trả về:', `${res}`);
      }
      // Tìm thiết bị trong bảng
      this.tablets.forEach(element => {
        if (element.serial_number === `${res}`) {
          this.tablet_name_dis = element.tablet_name;
          this.tablet_seri_dis = element.serial_number;
          this.red = true;
          this.green = false;
          this.warning = false;
          this.update_to_databse_by_socket(element.serial_number, 0);
          // tslint:disable-next-line: max-line-length
          this.notifier.notify('error', (element.tablet_name ? this.language.thiet_bi + element.tablet_name : this.language.mot_thiet_bi) + this.language.da_tat);
          // Tìm vị trí thiết bị trong bảng
          const index = this.tablets.findIndex(e => e.serial_number === this.tablet_seri_dis);
          // Lấy thông tin thiết bị đó -> xóa đi -> đẩy vào đầu mảng mất kết nối
          const a = this.tablets[index];
          this.tablets.splice(index + 1, 1);
          this.delete_element_old(`${res}`);

          // Thực hiện đẩy dữ liệu lại vào bảng
          this.tablets_dis.unshift(a);
          this.tablets = [];
          this.tablets.push.apply(this.tablets, this.tablets_dis);
          this.tablets.push.apply(this.tablets, this.tablets_warn);
          this.tablets.push.apply(this.tablets, this.tablets_conn);
        }
      });
      this.reload_page();
    });

  }  // kết thúc OnInit
  // Cập nhật monitor thiết bị vào database
  update_to_databse_by_socket(serial_number: string, num: number) {
    const data = { serial_number: serial_number, monitor: num };
    this.appservice.post(data, environment.FBA.Administration.update_tablet + '_monitor').subscribe(
      param => {
        // if (!environment.production) {
        //   console.log('Thay đổi monitor', param);
        // }
      });
  }
  // Xóa bỏ phần tử cũ
  delete_element_old(item: string) {
    // Loại bỏ thiết bị trong mất kết nối
    this.tablets_dis.forEach(e3 => {
      if (e3.serial_number === item) {
        const index3 = this.tablets_dis.findIndex(exx => exx.serial_number === e3.serial_number);
        this.tablets_dis.splice(index3, 1);
      }
    });
    // Loại bỏ thiết bị còn trong kết nối
    this.tablets_conn.forEach(e1 => {
      if (e1.serial_number === item) {
        const index1 = this.tablets_conn.findIndex(ee => ee.serial_number === e1.serial_number);
        this.tablets_conn.splice(index1, 1);
      }
    });
    // Loại bỏ thiết bị còn trong cảnh báo
    this.tablets_warn.forEach(e2 => {
      if (e2.serial_number === item) {
        const index2 = this.tablets_warn.findIndex(ex => ex.serial_number === e2.serial_number);
        this.tablets_warn.splice(index2, 1);
      }
    });
  }
  reload_page() {
    setTimeout(() => {
      this.getdata_realtime();
    }, 800);
  }
  // Lấy thông tin tổ chức
  // get_page_param() {
  //   this.blockUI.start(this.language.dang_tai_du_lieu);
  //   this.appservice.get_user_page_parametter(this.page_id).subscribe(
  //     param => {
  //       if (!environment.production) {
  //         console.log('get_page_param', param);
  //       }
  //       this.organization_arr = param.organization_arr;
  //       this.data_list_organization_arr = param.organization_arr;
  //       this.organization_id = param.organization_arr[0].value;
  //     },
  //     (error) => {
  //       this.blockUI.stop();
  //     },
  //     () => {
  //       this.blockUI.stop();
  //       this.getdata();
  //     }
  //   );
  // }
  // done
  getConfig() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.userGetOrg;
    this.appservice.get(url).subscribe(
      param => {
        // console.log('get_user_page_parametter', param);
        if (param.status !== 1) {
          this.errorMess = this.language.co_loi_xay_ra;
          this.blockUI.stop();
          this.isOnload = false;
          return;
        }
        this.orgArray = param.organization_arr;
        this.isSuperAdmin = param.isSuperAdmin;
        this.organizationId = this.orgArray[0].value;
        this.getdata();
      },
      (error) => {
        // console.log(error);
        this.errorMess = this.language.khong_the_ket_noi_may_chu;
        this.blockUI.stop();
        this.isOnload = false;
      });
  }
  // thay đổi tổ chức
  show_select_organization() {
    const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
    if (!environment.production) {
      console.log('userInfo', userInfo);
    }
    if (userInfo.lever === '0') {
      this.hidden_select_organization = false;
    } else {
      this.hidden_select_organization = true;
    }
  }
  // thay đổi tổ chức bảng
  changeorganization_table(event) {
    if (!environment.production) {
      console.log('id_or', event);
    }
    this.organizationId = event.value;
    this.getdata();
  }

  getdata() {
    const data = {
      organization_id: this.organizationId,
      actived: this.actived,
      access_token: environment.Bearer + ' ' + localStorage.getItem(environment.access_token)
    };
    if (!environment.production) {
      console.log('data', data);
    }
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.post(data, environment.FBA.ADMIN.fba_get_tablet_follow).subscribe(
      param => {
        if (!environment.production) {
          console.log('fba_get_tablet', param);
        }
        this.data = param;
        this.tablets = [];
        this.data_filter = param;
        // Mất kết nối
        this.tablets_dis = this.data.filter(x => x.monitor === '0');
        // cảnh báo
        this.tablets_warn = this.data.filter(x => x.monitor === '1');
        // bình thường
        this.tablets_conn = this.data.filter(x => x.monitor === '2');
        // Thực hiện đẩy -> cảnh báo -> bình bình thường == data show bảng theo thứ tự
        this.tablets.push.apply(this.tablets, this.tablets_dis);
        this.tablets.push.apply(this.tablets, this.tablets_warn);
        this.tablets.push.apply(this.tablets, this.tablets_conn);
        if (!environment.production) {
          console.log('MKN', 'CB, KN', this.tablets_dis, this.tablets_warn, this.tablets_conn);
        }
      },
      (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      }
    );
  }
  getdata_realtime() {
    const data = {
      organization_id: this.organizationId,
      actived: this.actived,
    };
    this.appservice.post(data, environment.FBA.ADMIN.fba_get_tablet_follow).subscribe(
      param => {
        this.data = param;
        this.tablets = [];
        this.data_filter = param;
        // Mất kết nối
        this.tablets_dis = this.data.filter(x => x.monitor === '0');
        // cảnh báo
        this.tablets_warn = this.data.filter(x => x.monitor === '1');
        // bình thường
        this.tablets_conn = this.data.filter(x => x.monitor === '2');
        // Thực hiện đẩy -> cảnh báo -> bình bình thường == data show bảng theo thứ tự
        this.tablets.push.apply(this.tablets, this.tablets_dis);
        this.tablets.push.apply(this.tablets, this.tablets_warn);
        this.tablets.push.apply(this.tablets, this.tablets_conn);
        if (!environment.production) {
          console.log(1);
        }
      },
      (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      }
    );
  }
  clone_array(array) {
    return array.slice(0);
  }
  // search table
  search_table(value: string) {
    const string = value.toLowerCase();
    if (string === '') {
      this.tablets = this.clone_array(this.data_filter);
    } else {
      this.tablets = this.data_filter.filter(x => {
        const exp =
          x.tablet_name.toLowerCase().indexOf(string) !== -1
          || x.serial_number.toLowerCase().indexOf(string) !== -1
          || x.question_name_check.toLowerCase().indexOf(string) !== -1
          || x.site_name.toLowerCase().indexOf(string) !== -1
          || x.network.toLowerCase().indexOf(string) !== -1
          || x.location_name.toLowerCase().indexOf(string) !== -1;
        return exp;
      }
      );
    }
  }
}
