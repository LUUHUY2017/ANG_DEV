import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralMenuComponent } from '../../../viewchild/generalmenu/generalmenu.component';
@Component({
  templateUrl: './adminfeedback.component.html',
  styleUrls: ['./adminfeedback.component.css'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})
@ViewChild(GeneralMenuComponent)
export class AdminFeedbackComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  feedback_list: any;
  data_update: any;
  public modalRef: BsModalRef;
  user_info = JSON.parse(localStorage.getItem(environment.UserLoged));
  url_img = environment.apiUrl + 'images/';
  constructor(private router: Router, private route: ActivatedRoute, private appservice: AppService, private modalService: BsModalService) {
  }
  ngOnInit(): void {
    this.get_data();
  }
  get_detail_img(url) {
    window.open(url);
  }
  // click hiện modal
  openModal(templates: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  // truyền dữ liệu popup
  dulieuthaydoi(item, template: TemplateRef<any>) {
    this.data_update = Object.assign({}, item);
    this.openModal(template);
  }
  // suibmit form thêm data
  get_data() {
    this.blockUI.start('Đang tải dữ liệu...');
    this.appservice.get(environment.API.sp_get_feedback_list).subscribe(
      para => {
        if (!environment.production) {
          console.log('dữ liệu gửi về', para);
        }
        this.feedback_list = para.data;
      },
      (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      });
  }
  updateform(item) {
  }

  delete_item(id: number) {
    const c = confirm('Bạn đồng ý xóa?');
    const data = {
      id: id
      // , deleted: 1
    };
    if (c) {
      if (!environment.production) {
        console.log(data);
      }
      this.blockUI.start('Đang xử lý dữ liệu...');
      const url = environment.API.sp_get_feedback_list + '_delete';
      this.appservice.post(data, url).subscribe(
        param => {
          if (param.message === 1) {
            this.get_data();
          }
        },
        (error) => {
          if (!environment.production) {
            console.log(error);
          }
          this.blockUI.start('Lỗi, không kết nối được máy chủ');
          this.blockUI.stop();
        },
        () => {
          this.blockUI.stop();
        }
      );
    }
  }

}



