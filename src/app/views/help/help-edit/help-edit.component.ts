import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { language } from '../../../language';
import { language_en } from '../../../language_en';

@Component({
  templateUrl: 'help-edit.component.html',
  styleUrls: ['help-edit.component.scss', '../../../../../node_modules/quill/dist/quill.snow.css'],
  encapsulation: ViewEncapsulation.None
})
export class HelpEditComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public userinfo: any = JSON.parse(localStorage.getItem(environment.UserLoged));
  type_language = JSON.parse(localStorage.getItem(environment.language));
  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_label',
    selectAllText: 'Chọn tất cả',
    unSelectAllText: 'Bỏ chọn tất cả',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };
  selectedItems = [];
  ImageUrl: string | ArrayBuffer;
  img_source: File;
  tag_array: any;
  help_info: any;
  id_status: any;
  language: any;
  public options: Object = {
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false
    // Set the image upload parameter.
    imageUploadParam: 'image_param',

    // Set the image upload URL.
    imageUploadURL: environment.apiUrl + environment.API.sp_get_help_list + '_upload_image',

    // Additional upload params.
    //  imageUploadParams: {id: 'my_editor'},

    // Set request type.
    imageUploadMethod: 'POST',
    // Set max image size to 5MB.
    imageMaxSize: 5 * 1024 * 1024,

    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    events: {
      'froalaEditor.initialized': function () {
        console.log('initialized');
      },
      'froalaEditor.image.beforeUpload': function (e, editor, images) {
        if (images.length) {
          // Create a File Reader.
          const reader = new FileReader();
          // Set the reader to insert images when they are loaded.
          reader.onload = (ev) => {
            const result = ev.target['result'];
            editor.image.insert(result, null, null, editor.image.get());
            // console.log(ev, editor.image, ev.target['result']);
          };
          // Read image as base64.
          reader.readAsDataURL(images[0]);
        }
        // Stop default upload chain.
        return false;
      }
    }
  };
  constructor(private router: Router, private route: ActivatedRoute, private appservice: AppService) {
    this.type_language === 'vn' ? this.language = language : this.language = language_en;
  }
  ngOnInit() {
    this.get_data();
  }
  // handleFileInput(file: FileList) {
  //   this.ImageUrl = null;
  //   this.img_source = null;
  //   const fileload = file.item(0);
  //   this.img_source = fileload;
  //   // console.log(this.img_source);
  //   const reader = new FileReader();
  //   reader.onload = (e) => { this.ImageUrl = reader.result; };
  //   if (fileload) {
  //     reader.readAsDataURL(fileload);
  //   }
  // }
  get_data() {
    this.id_status = this.route.snapshot.params.id;
    this.selectedItems = [];
    const data = {
      id: this.route.snapshot.params.id
    };
    this.blockUI.start('Đang xử lý dữ liệu');
    const url = environment.API.sp_get_help_list + '_get_update';
    this.appservice.post(data, url).subscribe(res => {
      console.log(res);
      this.help_info = res.help_info;
      // array.forEach(element => {
      // });
      this.selectedItems = this.help_info[0].tag_array;
      this.tag_array = res.tag_array;
      if (res.message) {
        console.log('đã có sự cố');
      }
      this.blockUI.stop();
    }, (error) => {
      console.log(error);
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    });
  }

  update_data(item) {
    console.log(item);
    this.blockUI.start('Đang xử lý dữ liệu...');
    const data: FormData = new FormData();
    // if (this.img_source) {
    //   data.append('title_img', this.img_source, this.img_source.name);
    // }
    if (!item.value.tag_name) {
      delete item.value.tag_name;
    }
    if (!item.value.tag_select) {
      delete item.value.tag_select;
    }
    data.append('data', JSON.stringify(item.value));
    data.append('id', this.id_status);
    this.blockUI.start('Đang xử lý dữ liệu');
    const url = environment.API.sp_get_help_list + '_post_update';
    this.appservice.post(data, url).subscribe(res => {
      console.log(res);
      if (res.message === 1) {
        this.router.navigate(['/help']);
        // console.log('ok');
      } else {
        console.log('đã có sự cố');
      }
      this.blockUI.stop();
    }, (error) => {
      console.log(error);
      this.blockUI.stop();
    }, () => {
      this.blockUI.stop();
    });
  }
}

