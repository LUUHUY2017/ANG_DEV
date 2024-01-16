import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { AppService } from '../../../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
// import notification
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { AdminLanguage } from '../../../../../languages';

@Component({
    selector: 'app-oaconfig',
    templateUrl: './oaconfig.component.html',
    // styleUrls: ['./zalosender.component.css'],
    // chỉnh css angular
    encapsulation: ViewEncapsulation.None
})
export class OAZaloConfigComponent implements OnInit, OnChanges {
    @Input() organizationId: string;
    @Output() showPage = new EventEmitter<boolean>();
    @ViewChild('dataTable') table: ElementRef;
    @BlockUI() blockUI: NgBlockUI;
    private readonly notifier: NotifierService;
    imageViewBase64: any;
    imageUpload: any;
    // Khai báo kiểu dữ kiệu
    dataUpdate: any;
    organization_id: string;
    modalRef: BsModalRef;
    webState: BehaviorSubject<any>;
    oldState: string;
    errorArray: Array<string>;
    optionDelete: any;
    language: AdminLanguage;
    defaultModel = environment.API.oaZalo;
    errorMess: string;
    isOnload: boolean;
    constructor(private router: Router,
        private route: ActivatedRoute,
        notifierService: NotifierService,
        private appservice: AppService,
        private modalService: BsModalService) {
        this.language = this.appservice.getLanguage();
        this.notifier = notifierService;
    }
    ngOnInit(): void {
        this.setDefaultValue();
        if (this.organizationId) {
            this.getData();
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        console.log('aaaaaaaaa', changes);
        if (!changes.organizationId.firstChange) {
            this.getData();
        }
    }
    resetChange() {
        this.setDefaultValue();
        this.getData();
    }
    setDefaultValue() {
        this.dataUpdate = null;
        this.optionDelete = 0;
        this.errorMess = null;
        this.isOnload = true;
    }
    // lấy data thông thường
    getData() {
        this.blockUI.start(this.language.dang_tai_du_lieu);
        const data = {
            organization_id: this.organizationId
            , deleted: this.optionDelete
        };
        console.log('data gửi đi', data);
        const url = this.defaultModel.getData;
        this.appservice.post(data, url).subscribe(res => {
            console.log(res);
            if (res.status !== 1) {
                this.errorMess = this.language.co_loi_xay_ra;
                return;
            }
            this.dataUpdate = res.retrieveData;
            this.imageViewBase64 = this.dataUpdate.qrcode_image;
            if (this.dataUpdate) {
                this.showPage.emit(true);
            } else {
                this.showPage.emit(false);
            }
        },
            (error) => {
                console.log(error);
                this.errorMess = this.language.khong_the_ket_noi_may_chu;
            }).add(() => {
                this.isOnload = false;
                this.blockUI.stop();
            });
    }
    // cập nhật thiết bị
    updateCurrentItem(item) {
        this.errorArray = [];
        if (item.invalid) {
            this.errorArray.push(this.language.du_lieu_khong_phu_hop);
            return;
        }
        if (this.dataUpdate && item.value.invite_code === this.dataUpdate.invite_code) {
            delete item.value.invite_code;
        }
        const formData = new FormData();
        formData.append('organization_id', this.organizationId);
        // tslint:disable-next-line: forin
        for (const property in item.value) {
            formData.append(property, item.value[property]);
        }
        if (this.imageUpload) {
            formData.append('qrcode_image', this.imageUpload);
        }
        this.blockUI.start(this.language.dang_xu_ly_du_lieu);
        const url = this.defaultModel.update;
        // const data = {
        //     organization_id: this.organizationId
        //     , ...item.value
        // };
        this.appservice.post(formData, url).subscribe(
            res => {
                console.log('dữ liệu gửi về', res);
                if (res.status === 1) {
                    this.dataUpdate = res.updatedData;
                    this.notifier.notify('success', this.language.cap_nhat_du_lieu_thanh_cong);
                    this.showPage.emit(true);
                } else {
                    this.errorArray = this.appservice.validate_error(res);
                }
            },
            (error) => {
                this.errorArray.push(this.language.khong_the_ket_noi_may_chu);
            }).add(() => {
                this.blockUI.stop();
            });
    }
    // done
  uploadimagequality(target: any) {
    this.errorArray = [];
    const file = target.files;
    const fileload = file[0];
    const reader = new FileReader();
    const newImage = new Image();
    // hiện ảnh
    console.log(newImage);
    newImage.onload = e => {
      if (newImage.height <= this.appservice.uploadImageHeight && newImage.width <= this.appservice.uploadImageWidth) {
        reader.readAsDataURL(fileload);
      } else {
        this.errorArray = ['Kích thước ảnh không hợp lệ'];
        this.imageUpload = null;
        this.imageViewBase64 = null;
        target.value = '';
      }
    };
    newImage.src = window.URL.createObjectURL(fileload);
    // hiện ảnh
    reader.onload = e => {
      this.imageUpload = file.item(0);
      this.imageViewBase64 = reader.result;
      console.log('this.imageUpload', this.imageUpload);
      console.log('this.imageViewBase64', this.imageViewBase64);
    };
  }
}
