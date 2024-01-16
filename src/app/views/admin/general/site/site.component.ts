import { IOption } from 'ng-select';   // select option <option>
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
import { language } from '../../admin_language';
import { language_en } from '../../admin_language_en';
import { NotifierService } from 'angular-notifier';
import { AdminLanguage } from '../../../../languages';
@Component({
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})
@ViewChild(GeneralMenuComponent)
export class SiteComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  modalRef: BsModalRef;
  language: AdminLanguage;
  defaultModel = environment.API.site;
  // mặc định này
  dataSource: Array<any>;
  siteArray: Array<any>;
  siteFilterArray: Array<any>;
  canAdd: boolean;
  categoryArray: Array<any>;
  dataUpdate: any;
  siteSelectionDisplay: boolean;
  isStore: boolean;
  errorArray: Array<any>;
  optionDelete: number;
  siteSelected: any;
  isOnload: boolean;
  errorMess: string;
  orgArray: Array<any>;
  isSuperAdmin: boolean;
  organizationId: string;
  isOrgAdmin: boolean;
  newDate = new Date();
  constructor(private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private appservice: AppService,
    private notifier: NotifierService) {
    this.language = this.appservice.getLanguage();
  }
  ngOnInit(): void {
    this.setDefaultValue();
    this.getConfig();
  }
  // done
  setDefaultValue() {
    this.dataSource = [];
    this.siteArray = [];
    this.siteFilterArray = [];
    this.categoryArray = [];
    this.canAdd = false;
    this.dataUpdate = null;
    this.siteSelectionDisplay = false;
    this.isStore = false;
    this.errorArray = [];
    this.optionDelete = 0;
    this.siteSelected = null;
    this.isOnload = true;
    this.errorMess = null;
    this.orgArray = [];
    this.isSuperAdmin = false;
    this.organizationId = null;
    this.isOrgAdmin = false;
  }
  // done
  getConfig() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = environment.API.userGetOrg;
    this.appservice.get(url).subscribe(
      param => {
        console.log('get_user_page_parametter', param);
        if (param.status !== 1) {
          this.errorMess = this.language.co_loi_xay_ra;
          this.blockUI.stop();
          this.isOnload = false;
          return;
        }
        this.orgArray = param.organization_arr;
        this.isSuperAdmin = param.isSuperAdmin;
        this.isOrgAdmin = param.isOrgAdmin;
        this.organizationId = this.orgArray[0].value;
        this.getData();
      },
      (error) => {
        console.log(error);
        this.errorMess = this.language.khong_the_ket_noi_may_chu_vui_long;
        this.blockUI.stop();
        this.isOnload = false;
      });
  }
  // done
  changeOrg(event) {
    console.log('new Org Id', event);
    this.organizationId = event.value;
    this.getData();
  }
  // done
  setDefaultPermission(bool: boolean) {
    this.canAdd = bool;
  }
  // done
  preventChange() {
    this.modalRef.hide();
    this.notifier.notify('error', this.language.loi_du_lieu_khong_the_thay_doi);
  }
  // done
  recusiveMenu(array: any[], id = null, space = 0) {
    array.forEach(element => {
      if (element.parent_id === id) {
        const a_id = element.id;
        this.siteFilterArray.push({
          id: element.id
          , site_name: element.site_name
          , parent_id: element.parent_id
          , alevel: space
          , enables: element.enables
          , store: element.store
        });
        const scope = space + 1;
        this.recusiveMenu(array, a_id, scope);
      }
    });
  }
  // done
  getData() {
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = this.defaultModel.getData;
    const data = {
      organization_id: this.organizationId
      , deleted: this.optionDelete
    };
    this.siteArray = [];
    this.siteFilterArray = [];
    this.appservice.post(data, url).subscribe(res => {
      console.log('response', res);
      if (res.status !== 1) {
        this.errorMess = this.language.co_loi_xay_ra;
      }
      this.setDefaultPermission(true);
      console.log('condition', !(this.isOrgAdmin && this.canAdd));
      this.categoryArray = res.categoryData.map(function(e) {
        return {
          value: e.id.toString()
          , label: e.category_name
        };
      });
      const retrieveData = res.retrieveData;
      for (let i = 0; i < retrieveData.length; i++) {
        retrieveData[i].open_hour = this.timeToStringFormat(retrieveData[i].open_hour);
        retrieveData[i].close_hour = this.timeToStringFormat(retrieveData[i].close_hour);
      }
      this.ham_dequy(retrieveData);
      this.recusiveMenu(res.siteData);
      this.dataSource = this.appservice.convert_sites_tree_ng_dropdown(this.siteArray);
      console.log('this.dataSource', this.dataSource);
    },
      (error) => {
        this.errorMess = this.language.khong_the_ket_noi_may_chu;
      }).add(() => {
        this.isOnload = false;
        this.blockUI.stop();
      });
  }
  // done
  ham_dequy(array: any[], id = 0, space = 0) {
    array.forEach(element => {
      if (Number(element.parent_id) === id) {
        const a_id = Number(element.id);
        const string = String(space);
        this.siteArray.push({
          id: element.id,
          site_id: element.id,
          site_name: element.site_name,
          site_code: element.site_code,
          site_shortname: element.site_shortname,
          alevel: string,
          site_description: element.site_description,
          parent_id: element.parent_id,
          enables: element.enables,
          category_id: element.category_id,
          organization_id: element.organization_id,
          store: Number(element.store) === 1,
          open_hour: element.open_hour,
          close_hour: element.close_hour,
          actived: element.actived
        });
        const scope = space + 1;
        this.ham_dequy(array, a_id, scope);
      }
    });
  }
  // done
  openPopupAddNewParentNode(modal_default: TemplateRef<any>) {
    if (this.canAdd && (this.isOrgAdmin || this.isSuperAdmin)) {
      this.isStore = false;
      this.errorArray = [];
      this.modalRef = this.modalService.show(modal_default, {
        backdrop: true,
        ignoreBackdropClick: true
      });
    }
  }

  // done
  openPopupUpdateCurrentItem(item, templates: TemplateRef<any>) {
    console.log('a', item);
    this.dataUpdate = Object.assign({}, item);
    this.isStore = item.store;
    this.errorArray = [];
    this.siteSelectionDisplay = false;
    this.siteSelected = this.siteFilterArray.find(e => e.id === item.parent_id);
    this.modalRef = this.modalService.show(templates, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  // done
  changeSite(item: any) {
    console.log('id', item.id);
    if (item.enables === '1') {
      this.siteSelected = item;
    } else {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
    }
    this.siteSelectionDisplay = false; // tắt đi
  }
  // done
  updateCurrentItem(item) {
    console.log('dữ liệu gửi đi', item.value);
    if (item.invalid || !this.siteSelected) {
      this.modalRef.hide();
      this.notifier.notify('error', this.language.du_lieu_khong_phu_hop);
      return;
    }
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const url = this.defaultModel.update;
    const data = {
      ...item.value
      , id: this.dataUpdate.id
      , parent_id: this.siteSelected.id
    };
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          this.modalRef.hide();
          this.notifier.notify('success', this.language.cap_nhat_du_lieu_thanh_cong);
          this.getData();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      }, (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  openPopupAddNewChildrenNode(item, template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
    this.dataUpdate = item;
    this.isStore = false;
    this.errorArray = [];
  }
  timeToStringFormat(str: string) {
    try {
      const newArray = str.split(':');
      if (newArray.length > 1) {
        const newStr = newArray[0] + ':' + newArray[1];
        return newStr;
      }
    } catch (error) {
      // console.log(error);
    }
    return null;
  }
  // done
  addNewParentItem(item) {
    console.log('dữ liệu gửi đi', item.value);
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const data = {
      ...item.value
      , parent_id: 0
      , organization_id: this.organizationId
    };
    const url = this.defaultModel.insert;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          this.modalRef.hide();
          this.notifier.notify('success', this.language.them_moi_thanh_cong);
          this.getData();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  addNewChildrenItem(item) {
    console.log('dữ liệu gửi đi', item.value);
    this.errorArray = [];
    this.blockUI.start(this.language.dang_xu_ly_du_lieu);
    const data = {
      ...item.value
      , parent_id: this.dataUpdate.id
      , organization_id: this.organizationId
    };
    const url = this.defaultModel.insert;
    this.appservice.post(data, url).subscribe(
      res => {
        console.log('dữ liệu gửi về', res);
        if (res.status === 1) {
          this.modalRef.hide();
          this.notifier.notify('success', this.language.them_moi_thanh_cong);
          this.getData();
        } else {
          this.errorArray = this.appservice.validate_error(res);
        }
      },
      (error) => {
        this.errorArray.push(this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
  // done
  openPopupDeleteItem(template: TemplateRef<any>, item: any): void {
    this.dataUpdate = item;
    this.modalRef = this.modalService.show(template, {
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  // done
  deleteCurrentItem() {
    const data = {
      id: this.dataUpdate.id
      , deleted: this.optionDelete
    };
    this.blockUI.start(this.language.dang_tai_du_lieu);
    const url = this.defaultModel.softDelete;
    this.appservice.post(data, url).subscribe(
      res => {
        if (res.status === 1) {
          this.notifier.notify('success', this.language.xoa_thanh_cong);
          this.modalRef.hide();
          this.getData();
        } else {
          this.notifier.notify('error', this.language.co_loi_xay_ra);
        }
      },
      (error) => {
        this.notifier.notify('error', this.language.khong_the_ket_noi_may_chu_vui_long);
      }).add(() => {
        this.blockUI.stop();
      });
  }
}
