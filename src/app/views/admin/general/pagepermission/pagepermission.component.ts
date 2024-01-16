import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AppService } from '../../../../app.service';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import validate form
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { GeneralMenuComponent } from '../../../viewchild/generalmenu/generalmenu.component';

@Component({
  templateUrl: './pagepermission.component.html',
  styleUrls: ['./pagepermission.component.scss'],
  // chỉnh css angular
  // encapsulation: ViewEncapsulation.None
})
@ViewChild(GeneralMenuComponent)
export class PagePermissionComponent implements OnInit {
  page_id = '\'' + environment.Pages.administration.users + '\'';
  @ViewChild('dataTable') table: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  id_deleted: number;
  modalRef: BsModalRef;
  data: any;
  page_array: Array<IOption>;
  page_selectedform: string;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  page_id_update: number;
  permission_array: any;
  permission_selected: string;
  page_array_2 = [];
  page_arr: Array<IOption>;
  page_selected: string;
  // dropdownList2 = [];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private appservice: AppService,
    private modalService: BsModalService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.get_data();
  }
  // lấy data thông thường
  get_data() {
    const data: {[k: string]: any} = {};
    if (this.page_selected) {
      data.id = this.page_selected;
    }
    this.blockUI.start('Đang tải dữ liệu...');
    this.appservice.post(data, environment.API.page_permission).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }
      this.data = res.data;
      this.page_arr = res.page_arr;
      this.page_selected = this.page_selected ? this.page_selected : this.page_arr[0].value;
    },
      (error) => {
        this.blockUI.start('Lỗi không tải được dữ liệu');
        this.blockUI.stop();
        if (!environment.production) {
          console.log(error);
        }
      },
      () => {
        this.blockUI.stop();
      });
  }
  thaydoipage(event) {
    const data = {
      id: event.value
    };
    this.blockUI.start('Đang tải dữ liệu...');
    const url = environment.API.page_permission + '_get_id';
    this.appservice.post(data, url).subscribe(res => {
      if (!environment.production) {
        console.log(res);
      }
      this.data = res.data;
    },
      (error) => {
        this.blockUI.start('Lỗi không tải được dữ liệu');
        this.blockUI.stop();
        if (!environment.production) {
          console.log(error);
        }
      },
      () => {
        this.blockUI.stop();
    });
  }
  empty_model() {
    this.page_array = [];
    this.page_selectedform = '';
    this.dropdownList = [];
    this.selectedItems = [];
  }
  // click hiện popup
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  // hiện popup xóa
  show_dialog(dialog: TemplateRef<any>, id: number) {
    this.id_deleted = id;
    this.openModal(dialog);
  }
  show_insert(template: TemplateRef<any>) {
    this.blockUI.start('Đang xử lý dữ liệu...');
    this.empty_model();
    const url = environment.API.page_permission + '_get_insert';
    this.appservice.get(url).subscribe(
      param => {
        if (!environment.production) {
          console.log(param);
        }
        this.page_array = param.pages;
        this.page_selectedform = this.page_array[0].value;
        param.permissions.forEach(element => {
        this.dropdownList.push({
            item_id: element.id
            , item_text: element.permission_name
          });
        });
        // this.selectedItems = [
        //   { item_id: 3, item_text: 'Update' }
        // ];
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Chọn tất cả',
          unSelectAllText: 'Bỏ chọn tất cả',
          itemsShowLimit: 3,
          allowSearchFilter: true
        };
        this.openModal(template);
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
  // Thêm mới
  insertform(item: NgForm) {
    // console.log(item.value);
    this.blockUI.start('Đang xử lý dữ liệu...');
    const url = environment.API.page_permission + '_post_insert';
    this.appservice.post(item.value, url).subscribe(
      param => {
        // console.log(param);
        if (param.message === 1) {
          this.get_data();
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
        item.controls['page_id'].reset();
        item.controls['permission_array'].reset();
        this.modalRef.hide();
      }
    );
  }
  // xóa
  delete_group() {
    const data = {
      id: this.id_deleted
    };
    if (!environment.production) {
      console.log(data);
    }
    this.blockUI.start('Đang xử lý dữ liệu...');
    const url = environment.API.page_permission + '_delete';
    this.appservice.post(data, url).subscribe(
      param => {
        this.modalRef.hide();
        if (param.message === 1) {
          this.get_data();
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

}



