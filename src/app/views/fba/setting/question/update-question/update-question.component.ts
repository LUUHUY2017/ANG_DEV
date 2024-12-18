import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../../../../../environments/environment';
import { AppService } from '../../../../../app.service';
// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
// import notification
import { NotifierService } from 'angular-notifier';
import { language } from '../../../../../language';
import { language_en } from '../../../../../language_en';

@Component({
  templateUrl: './update-question.component.html',
  styleUrls: ['./update-question.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateQuestionComponent implements OnInit {
  page_id = environment.Pages.admin.updatequestion;
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  language: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(private router: Router,
    private route: ActivatedRoute,
    notifierService: NotifierService,
    public appservice: AppService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
    this.notifier = notifierService;
  }
  userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
  is_admin_organization = JSON.parse(localStorage.getItem(environment.is_admin_organization));
  can_update = false;
  // Khai báo
  test: any;
  showdelete = true;
  data: any = [];
  status = 1;
  organization_arr: Array<IOption>;
  organization_arr_slected: string;
  organization_id: number;
  exam_question: any;     // dữ liệu câu hỏi mẫu
  exam_reason: any;       // dữ liệu lý do mẫu
  reason_img: string;
  data_reasons: any;
  data_reasons1: any;
  start_time: string; end_time: string;
  actived = false;
  // data ảnh Form câu hỏi
  ImageUrl1: File = null; ImageUrl2: File = null; ImageUrl3: File = null; ImageUrl4: File = null;
  // data ảnh lý do Form
  ImageUrl_reason1: File = null; ImageUrl_reason2: File = null; ImageUrl_reason3: File = null;
  ImageUrl_reason4: File = null; ImageUrl_reason5: File = null; ImageUrl_reason6: File = null;
  ImageUrl_reason7: File = null; ImageUrl_reason8: File = null; ImageUrl_reason9: File = null;
  // ảnh chất lượng serve gửi về
  very_negative_img: string; negative_img: string; very_positive_img: string; positive_img: string;
  // tên  chất lượng
  very_negative: string; negative: string; very_positive: string; positive: string;
  campaign_name: string; question_name: string;
  // tên lý do
  reason_name1: string;
  reason_name2: string; reason_name3: string; reason_name4: string; reason_name5: string;
  reason_name6: string; reason_name7: string; reason_name8: string; reason_name9: string;
  // ảnh lý do serve gửi về
  reason_img1: string;
  reason_img2: string; reason_img3: string; reason_img4: string; reason_img5: string;
  reason_img6: string; reason_img7: string; reason_img8: string; reason_img9: string;
  // actived lý do
  actived_reason1 = false;
  actived_reason2 = false; actived_reason3 = false; actived_reason4 = false; actived_reason5 = false;
  actived_reason6 = false; actived_reason7 = false; actived_reason8 = false; actived_reason9 = false;
  // url ảng lý do
  ImageUrl_reasonl1: string; ImageUrl_reasonl2: string; ImageUrl_reasonl3: string;
  ImageUrl_reasonl4: string; ImageUrl_reasonl5: string; ImageUrl_reasonl6: string;
  ImageUrl_reasonl7: string; ImageUrl_reasonl8: string; ImageUrl_reasonl9: string;
  // url ảnh câu hỏi
  ImageUrll1: string; ImageUrll2: string; ImageUrll3: string; ImageUrll4: string;
  // active timeout
  actived_smile1 = false; actived_smile2 = false; actived_smile3 = false; actived_smile4 = false;
  actived_smile5 = false; actived_smile6 = false; actived_smile7 = false; actived_smile8 = false;
  actived_smile9 = false; actived_smile10 = false; actived_smile11 = false; actived_smile12 = false;
  token: string;
  checked = true;

  ngOnInit() {
    // this.is_admin();
    this.get_data();
    this.get_page_param();       // lấy option tổ chức
  }

  // is_admin() {
  //   if (!environment.production) {
  //     console.log(this.is_admin_organization);
  //   }
  //   // Nếu là quản lý hệ thống hoặc lever = 0
  //   if (this.is_admin_organization.length > 0 || Number(this.userInfo.lever) === 0) {
  //     this.can_update = true;
  //   }
  // }

  get_page_param() {
    // this.blockUI.start('Đang tải cấu hình...');
    this.appservice.get_user_page_parametter(this.page_id).subscribe(
      param => {
        // console.log('get_page_param', param);
        this.organization_arr = param.organization_arr;                       // lấy option tổ chức
        this.organization_arr_slected = param.organization_arr[0].value;      // lấy option tổ chức
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

  // Lấy dữ liệu câu hỏi cần sửa
  get_data() {
    const data = {
      id: this.route.snapshot.params.id
    };
    if (!environment.production) {
      console.log('data cấu hình', data);
    }
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.post(data, environment.FBA.ADMIN.get_question_edit).subscribe(
      para => {
        if (!environment.production) {
          console.log('Dữ liệu cũ', para);
        }
        this.data = para.get_question[0];
        // Lấy dữ liệu câu hỏi
        this.very_negative_img = para.get_question[0].very_negative_img;
        this.negative_img = para.get_question[0].negative_img;
        this.very_positive_img = para.get_question[0].very_positive_img;
        this.positive_img = para.get_question[0].positive_img;
        // Lấy dữ liệu lý do
        for (let i = 0; i < 12; i++) {
          if (para.get_question[0].reasons[i]) {
            this['reason_img' + (i + 1)] = para.get_question[0].reasons[i].reason_img;
            this['actived_reason' + (i + 1)] = para.get_question[0].reasons[i].actived;
            this['reason_name' + (i + 1)] = para.get_question[0].reasons[i].reason_name;
          }
          if (para.get_question[0].smile_answer_touch_layout_arr[i]) {
            this['actived_smile' + (i + 1)] = para.get_question[0].smile_answer_touch_layout_arr[i].actived;
          }
        }
      }, (error) => {
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

  // upload ảnh chất lượng đánh giá
  uploadimagequality(file: FileList, number: Number) {
    const fileload = file[0];
    const reader = new FileReader();
    const newImage = new Image();
    const imgType = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!imgType.includes(fileload.type)) {
      alert('Kiểu ảnh không phù hợp');
      return;
    }
    reader.onload = e => {
      this['ImageUrll' + number] = reader.result;
      this['ImageUrl' + number] = file.item(0);
    };
    newImage.onload = e => {
      if (newImage.height <= this.appservice.uploadImageHeight && newImage.width <= this.appservice.uploadImageWidth) {
        reader.readAsDataURL(fileload);
      } else {
        alert('Kích thước ảnh không phù hợp');
        this['ImageUrll' + number] = null;
        this['ImageUrl' + number] = null;
      }
    };
    newImage.src = window.URL.createObjectURL(fileload);
  }

  // upload ảnh lý do bảng
  uploadimage_reason(file: FileList, number: Number) {
    const fileload = file[0];
    const imgType = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!imgType.includes(fileload.type)) {
      alert('Kiểu ảnh không phù hợp');
      return;
    }
    const reader = new FileReader();
    const newImage = new Image();
    // hiện ảnh
    reader.onload = (event: any) => {
      this['ImageUrl_reasonl' + number] = reader.result;
      this['ImageUrl_reason' + number] = file.item(0);
    };
    //
    newImage.onload = e => {
      if (newImage.height <= this.appservice.uploadImageHeight && newImage.width <= this.appservice.uploadImageWidth) {
        reader.readAsDataURL(fileload);
      } else {
        alert('Kích thước ảnh không phù hợp');
        this['ImageUrl_reasonl' + number] = null;
        this['ImageUrl_reason' + number] = null;
      }
    };
    newImage.src = window.URL.createObjectURL(fileload);
  }

  // suibmit form  data
  submitform(item) {
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    if (!environment.production) {
      console.log('data gửi lên', item.value);
    }
    const data: FormData = new FormData();
    if (this.ImageUrl1) { data.append('very_positive_img', this.ImageUrl1, this.ImageUrl1.name); }
    if (this.ImageUrl2) { data.append('positive_img', this.ImageUrl2, this.ImageUrl2.name); }
    if (this.ImageUrl3) { data.append('negative_img', this.ImageUrl3, this.ImageUrl3.name); }
    if (this.ImageUrl4) { data.append('very_negative_img', this.ImageUrl4, this.ImageUrl4.name); }

    for (let i = 1; i < 10; i++) {
      if (this['ImageUrl_reason' + i]) {
        data.append('reason_img' + i, this['ImageUrl_reason' + i], this['ImageUrl_reason' + i].name);
      }
    }
    data.append('data', JSON.stringify(item.value));
    data.append('token', localStorage.getItem(environment.access_token));
    if (!environment.production) {
      console.log('data gửi lên', data);
    }
    this.appservice.post(data, environment.FBA.ADMIN.update_question).subscribe(
      para => {
        if (!environment.production) {
          console.log('data trả về', para);
        }
        if (para.status === 1) {
          this.router.navigate(['/fba/setting/question/list-question']);
          // this.notifier.notify('success', this.language.da_cap_nhat);
        } else {
          this.notifier.notify('error', this.language.co_loi_xay_ra);
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
        // this.router.navigate(['fba/question/list-question']);
      });
  }

  changetab(e) {   // đổi số status
    this.status = e;
  }

  delete(id: number) {
    if (!environment.production) {
      console.log(id);
    }
    for (let i = 0; i < this.data.length; i++) {
      if (this.data.length > 2) {
        if (this.data[i]['id'] === id) {
          this.data.splice(i, 1);
        }
      }
    }
  }

  // check number +
  checknumber(event: any) {
    const pattern = /[0-9\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
