import { IOption } from 'ng-select';   // select option <option>

import { Component, OnInit, ViewChild, ElementRef, TemplateRef, OnDestroy, } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { FormGroup } from '@angular/forms';

// Import BlockUI decorator & optional NgBlockUI type
import { BlockUI, NgBlockUI } from 'ng-block-ui';
// import Modal
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// chỉnh css angular
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import viewchild
import { UserMenuComponent } from '../../viewchild/usermenu/usermenu.component';
// import notification
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
// import * as io from 'socket.io-client';
@ViewChild(UserMenuComponent)

@Component({
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss'],
  // chỉnh css angular
  encapsulation: ViewEncapsulation.None
})

export class UserInfoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  private readonly notifier: NotifierService;
  data: any;
  dataFilter: Array<any>;
  modalRef: BsModalRef;
  // phân trang bảng
  webState: BehaviorSubject<any>;
  subcription: any;
  oldState: string;
  errorArray: any[];
  language: any;
  recordDate: string;
  canUpdate: boolean;
  username: string;
  organization_name: string;
  created_at: string;
  email: string;
  userLever: string;
  constructor(
    notifierService: NotifierService,
    private appservice: AppService,
    private modalService: BsModalService) {
    this.notifier = notifierService;
    // this.socket = io(environment.UrlSocket);
    this.language = this.appservice.getLanguage();
  }
  ngOnInit(): void {
    const userInfo = JSON.parse(localStorage.getItem(environment.UserLoged));
    console.log(userInfo);
    this.userLever = Number(userInfo.lever) === 0 ? this.language.quyen_quan_tri_he_thong : this.language.quyen_xem_bao_cao;
    this.username = userInfo.name;
    this.email = userInfo.email;
    this.created_at = userInfo.created_at;
    this.organization_name = userInfo.organization_name;

  }

}
