import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '../../../../../../environments/environment';
import { AppService } from '../../../../../app.service';
import { MessageService } from '../../../../../../../node_modules/primeng/api';
import { FbaMenuComponent } from '../../../../viewchild/fbamenu/fbamenu.component';
import { language } from '../../../../../language';
import { language_en } from '../../../../../language_en';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-listapplication',
  templateUrl: './listapplication.component.html',
  styleUrls: ['./listapplication.component.scss'],
  providers: [MessageService]
})
export class FbaListApplicationComponent implements OnInit, OnDestroy {
  @ViewChild('searchForm') searchForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  private subcription: any;
  canAdd: boolean;
  // Khai báo kiểu dữ kiệu
  data: Array<any>;
  dataFilter: Array<any>;
  rowsOnPage = 15;
  webState: BehaviorSubject<any>;
  oldState: string;
  optionDelete: any;
  siteArray: any;
  siteSelected: any;
  language: any;
  isSuperAdmin: boolean;
  errorMess: string;
  isOnload: boolean;
  defaultModel = environment.API.fbaAppSetting;
  constructor(private appservice: AppService) {
  }
  ngOnInit(): void {
    const firstState = {
      data: null
      , state: null
    };
    this.webState = new BehaviorSubject(firstState);
    this.language = this.appservice.getLanguage();
    console.log(this.language);
    this.setDefaultPermission(false);
    this.setDefaultValue();
    this.watchStateChange();
    this.getData();
  }
  setDefaultValue() {
    this.isSuperAdmin = false;
    this.dataFilter = [];
    this.data = [];
    this.optionDelete = 0;
    this.errorMess = null;
    this.isOnload = true;
  }
  // lấy data thông thường
  getData() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const data = {
      deleted: this.optionDelete
    };
    const url = this.defaultModel.getData;
    this.appservice.post(data, url).subscribe(res => {
      if (res.status !== 1) {
        this.errorMess = this.language.co_loi_xay_ra;
        return;
      }
      const retrieveData = res.retrieveData;
      console.log('retrieveData', retrieveData);
      for (let i = 0; i < retrieveData.length; i++) {
        retrieveData[i].organization_name = retrieveData[i].organization_name !== null ? retrieveData[i].organization_name : 'Mặc định';
      }
      this.setDefaultPermission(true);
      this.isSuperAdmin = res.isSuperAdmin;
      this.updateState('retrieve', retrieveData);
    },
      (error) => {
        // console.log(error);
        this.errorMess = this.language.khong_the_ket_noi_may_chu;
      }).add(() => {
        this.isOnload = false;
        this.blockUI.stop();
      });
  }
  watchStateChange() {
    this.subcription = this.webState.asObservable();
    this.subcription.subscribe(res => {
      const currentState = res.state;
      const item = res.data;
      // Đây là sự kiện khi vừa load trang get data về
      if (currentState === environment.STATE.retrieve) {
        // Sự kiện nhận dữ liệu về thì bỏ hành động tìm kiếm trước đó
        this.data = item;
        this.dataFilter = this.data;
        // Nếu là sự kiện thêm mới
      } else if (currentState === environment.STATE.search) {
        let oldData = this.data;
        const inputData = this.searchForm.value;
        // tslint:disable-next-line: forin
        for (const key in inputData) {
          if (inputData[key]) {
            const lowerStr = inputData[key] !== null ? inputData[key].toLowerCase() : null;
            oldData = oldData.filter((e: any) => e.hasOwnProperty(key) && (inputData[key] === ''
              || e[key].toLowerCase().indexOf(lowerStr) !== -1));
          }
        }
        // console.log('oldData', oldData);
        this.dataFilter = oldData;
      }
    });
  }
  updateState(stateString: string, data = null) {
    const stateWithData = {
      state: stateString
      , data: data
    };
    const oldStateObj = this.webState.getValue();
    this.oldState = oldStateObj.state;
    this.webState.next(stateWithData);
  }
  setDefaultPermission(bool: boolean) {
    this.canAdd = bool;
  }
  submitToSearch(form: any) {
    const inputData = form.value; // Where
    console.log(inputData);
    this.updateState(environment.STATE.search, inputData);
  }
  ngOnDestroy() {
    this.webState.complete();
  }
}
