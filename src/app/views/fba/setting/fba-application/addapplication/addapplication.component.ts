import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { AppService } from '../../../../../app.service';
import { Router } from '@angular/router';
import { IOption } from 'ng-select';
import { FbaMenuComponent } from '../../../../viewchild/fbamenu/fbamenu.component';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  // selector: 'app-addsetting',
  templateUrl: './addapplication.component.html',
  styleUrls: ['./addapplication.component.scss']
})
export class FbaAddApplicationComponent implements OnInit {
  status = 1;
  @ViewChild(FbaMenuComponent)
  fileToUpload_1: File = null;
  fileToUpload_2: File = null;
  org_selected: string;
  page_id = '\'' + environment.Pages.fba.fba_application_settings + '\'';
  organization_selected: Array<any>;
  any_require = '0';
  actived_cancel = '1';
  @BlockUI() blockUI: NgBlockUI;
  public organization_array: Array<IOption>;
  language: any;
  type_language = JSON.parse(localStorage.getItem(environment.language));
  constructor(public appservice: AppService, private router: Router) {
    this.language = this.appservice.getLanguage();
  }
  ngOnInit() {
    this.get_organization();
  }
  get_organization() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    this.appservice.get_user_page_parametter(this.page_id).subscribe(res => {
      this.organization_array = res.organization_arr;
      if (!environment.production) {
        console.log(this.organization_array);
      }
      this.org_selected = res.organization_arr[0].value;
    },
      (error) => {
        this.blockUI.stop();
        // this.blockUI.start('Lỗi không tải được dữ liệu');
      },
      () => {
        this.blockUI.stop();
      });
  }
  change_status(value) {
    this.status = value;
  }
  readURL(event, number: number) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this['imageSrc_' + number] = reader.result;
      reader.readAsDataURL(file);
    }
  }
  handleFileInput(target: any, number: Number) {
    const file: FileList = target.files;
    const fileload = file[0];
    const imgType = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!imgType.includes(fileload.type)) {
      alert('Kiểu ảnh không phù hợp');
      target.value = '';
      return;
    }
    const reader = new FileReader();
    const newImage = new Image();
    // hiện ảnh
    reader.onload = (event: any) => {
      this['fileToUpload_' + number] = file.item(0);
    };
    //
    newImage.onload = e => {
      if (newImage.height <= this.appservice.uploadImageHeight && newImage.width <= this.appservice.uploadImageWidth) {
        reader.readAsDataURL(fileload);
      } else {
        alert('Kích thước ảnh không phù hợp');
        this['fileToUpload_' + number] = null;
        target.value = '';
      }
    };
    newImage.src = window.URL.createObjectURL(fileload);
  }
  add_setting(item) {
    if (!environment.production) {
      console.log(item.value);
    }
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const data: FormData = new FormData();
    if (this.fileToUpload_1 !== null) {
      data.append('company_logo', this.fileToUpload_1, this.fileToUpload_1.name);
    }
    if (this.fileToUpload_2 !== null) {
      data.append('application_logo', this.fileToUpload_2, this.fileToUpload_2.name);
    }
    data.append('data', JSON.stringify(item.value));
    this.appservice.post(data, environment.FBA.API.fba_application_settings).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }
      this.blockUI.stop();
      if (res.message === 1) {
        this.router.navigate(['/fba/setting/setting']);
      } else {
        this.router.navigate(['/fba/setting/setting']);
      }
    },
      (error) => {
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      });
  }
}
