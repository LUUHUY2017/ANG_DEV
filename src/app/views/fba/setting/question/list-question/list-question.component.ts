import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { AppService } from '../../../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';

// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { language } from '../../../../../language';
import { language_en } from '../../../../../language_en';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FbaMenuComponent } from '../../../../viewchild/fbamenu/fbamenu.component';

@Component({
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class ListQuestionComponent implements OnInit {
  @ViewChild(FbaMenuComponent)
  @ViewChild('dataTable') table: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  page_id = '\'' + environment.Pages.fba.questions + '\'';
  can_delete = true;
  userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
  can_add = true;
  language: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private appservice: AppService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
  }
  // Khai báo kiểu dữ kiệu
  dataTable: any;
  hienkhung = true;
  data2: any = [];
  data: any;
  data_filter: any;
  status: number;
  status_question: Array<IOption>;              // option tình trạng câu hỏi
  status_question_selected: string;             // selected tình tạng
  deleted_question: Array<IOption>;             // option delted câu hỏi
  deleted_question_selected: string;            // selected delted  tình tạng
  campaign: Array<IOption>;                     // option chiến dịch
  campaign_name_selected: string;               // selected chiến dịch
  campaign_name: string;
  organization_id: number;
  viewby: number;
  deleted: number;
  organization_arr: Array<IOption>;
  org_selected: string;       // selected tổ chức
  image_very_negative_img: string;      // ảnh tức giận
  image_negative_img: string;           // ảnh bình thường
  image_very_positive_img: string;      // ảnh rất hài lòng
  image_positive_img: string;           // ảnh ảnh hài lòng
  hidden_select_organization = false;   // hiện select tổ chức
  messenger: any = [];
  show_alert = true;
  public modalRef: BsModalRef;
  delete_tablet_id: number;
  access_token: string;
  // phân trang bảng
  rowsOnPage = 15;
  filterQuery = '';
  is_admin_organization = JSON.parse(localStorage.getItem(environment.is_admin_organization));
  // get_expert_permission = JSON.parse(localStorage.getItem(environment.expert_page_permission));
  ngOnInit(): void {
    this.viewby = 2;  // đang diễn ra
    this.deleted = 0;  // tình đang hoạt động
    // this.is_admin();
    // this.get_crud_on_page();
    this.get_filter_question();
    this.get_page_param();
    this.show_select_organization();          // show select organization
  }
  is_admin() {
    if (!environment.production) {
      console.log(this.is_admin_organization);
    }
    if (this.is_admin_organization.length > 0 || Number(this.userInfo.lever) === 0) {
      this.can_delete = true;
      this.can_add = true;
    }
  }
  // get_crud_on_page() {
  //   const data = {
  //     page_id: this.page_id
  //   };
  //   const url = environment.FBA.ADMIN.get_crud_page;
  //   this.appservice.post(data, url).subscribe(res => {
  //     if (!environment.production) {
  //       console.log(res);
  //     }
  //     res.crud_page_array.forEach(element => {
  //       const permission_name = element.permission_name.toLowerCase();
  //       if (permission_name === 'delete') {
  //         this.can_delete = true;
  //       }
  //     });
  //   },
  //   (error) => {
  //   },
  //   () => {
  //   });
  // }
  // Lấy tình trạng câu hỏi
  get_filter_question() {
    this.appservice.get(environment.FBA.ADMIN.get_status_question_default).subscribe(
      para => {
        // console.log('get_status_question_default', para);
        if (this.type_language === 'vn') {
          this.status_question = para.status_question;
          this.deleted_question = para.deleted_question;
        } else {
          this.status_question = para.status_question_en;
          this.deleted_question = para.deleted_question_en;
        }
        this.status_question_selected = para.status_question[1].value;
        this.deleted_question_selected = para.deleted_question[0].value;
      },
      (error) => {
        if (!environment.production) {
          console.log(error);
        }
      },
      () => {
        this.blockUI.stop();
      }
    ); // get_user_page_parametter
  }
  // Lấy thông tin tổ chức
  get_page_param() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
    const url = environment.API.userGetOrg;
    this.appservice.get(url).subscribe(
      param => {

        this.organization_arr = param.organization_arr;
        this.org_selected = this.organization_id = param.organization_arr[0].value;
        if (userInfo.lever === '0') {
          this.organization_arr.unshift({
            label: this.language.mac_dinh, value: '0'
          });
        }
        if (!environment.production) {
          console.log('get_page_param', param);
          console.log('this.organization_arr', this.organization_arr);
        }
      },
      (error) => {
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
        this.getdata();
      }
    );
  }
  // thay đổi tổ chức
  show_select_organization() {                    // hiện select chọn tổ chức
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
  // filter thay đổi tổ chức
  thaydoitochuc(event) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.organization_id = event.value;
    if (!environment.production) {
      console.log(this.organization_id);
    }
    this.getdata();
  }
  // thay đổi tình trạng câu hỏi
  thaydoistatus(event) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.viewby = event.value;
    this.getdata();
  }
  // thay đổi đang chạy hay đã xóa  câu hỏi
  changedeted(event) {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.deleted = event.value;
    this.getdata();
  }
  // truyền dữ liệu popup
  dulieuthaydoi(item) {
    this.hienkhung = false;
    if (!environment.production) {
      console.log('a', item);
    }
    this.data2 = item;
  }
  // search table
  search_table(value: string) {
    // chuyển giá trị truyền vào về chữ thường để so sánh
    const string = value.toLowerCase();
    if (string === '') {
      this.data = this.data_filter;
    } else {
      this.data = this.data_filter.filter(x => x.question_name.toLowerCase().indexOf(string) !== -1
        || x.campaign_name.toLowerCase().indexOf(string) !== -1);
    }
  }
  getdata() {
    const data = {
      organization_id: this.organization_id,
      viewby: this.viewby,
      deleted: this.deleted,
      access_token: environment.Bearer + ' ' + localStorage.getItem(environment.access_token)
    };
    if (!environment.production) {
      console.log('data', data);
    }
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.post(data, environment.FBA.ADMIN.sp_ad_question).subscribe(
      param => {
        if (!environment.production) {
          console.log('sp_ad_question', param);
        }
        this.data = param.get_question;
        this.data_filter = param.get_question;
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
    ); // get_user_page_parametter
  }
  // hỏi xóa modal
  modal_question(item, dialog: TemplateRef<any>) {
    if (!environment.production) {
      console.log('data_item', item);
    }
    this.delete_tablet_id = item;
    this.modalRef = this.modalService.show(dialog, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  // hỏi khôi phục question
  modal_recycle_question(item, dialogs: TemplateRef<any>) {
    if (!environment.production) {
      console.log('data_item', item);
    }
    this.delete_tablet_id = item;
    this.modalRef = this.modalService.show(dialogs, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  // Xóa câu hỏi
  delete_question(id: number) {
    const data = {
      id: this.delete_tablet_id
      , deleted: 1
    };
    if (!environment.production) {
      console.log(data);
    }
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    this.appservice.post(data, environment.FBA.ADMIN.delete_question).subscribe(
      param => {
        this.modalRef.hide();
        this.getdata();
        // this.messenger.push([{id: 'Bạn đã xóa thành công', value: 'success'}]);
        // this.messenger = this.messenger[0];
        // this.show_alert = false;
      }
    );
  }
  // khôi phục câu hỏi
  recycle_question() {
    const data = {
      id: this.delete_tablet_id
      , deleted: 0
    };
    if (!environment.production) {
      console.log(data);
    }
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    this.appservice.post(data, environment.FBA.ADMIN.delete_question).subscribe(
      param => {
        this.modalRef.hide();
        this.getdata();
      }
    );
  }

}



