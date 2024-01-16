import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class UserPermissionGuard implements CanActivateChild {
  activeroute: any;
  message: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.activeroute = route;
    if (this.is_admin()) {
      // this.message.next(0);
      return true;
    } else {
      this.router.navigate(['/404']);
      return false;
    }
  }
  is_admin() {
    const permission_array = JSON.parse(localStorage.getItem(environment.module_array));
    let status = false;
    //   console.log(permission_array);
    permission_array.forEach(element => {
      if (element.page_module.toUpperCase() === 'ALL') {
        status = true;
      }
    });
    return status;
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.activeroute = route;
    if (!environment.production) {
      console.log(this.activeroute);
    }
    if (this.Check_permission()) {
      return true;
    } else {
      this.router.navigate(['/404']);
      return false;
    }
  }
  Check_permission() {
    const permission_array = JSON.parse(localStorage.getItem(environment.module_array));
    const expect_page: Array<string> = JSON.parse(localStorage.getItem('expert_page'));
    // check xem cái route đó có trong module thuộc người dùng hay k
    let condition = permission_array.filter(item => item.page_module.toUpperCase()
      === this.activeroute.data.module_title.toUpperCase()).length > 0;
    if (!environment.production) {
      console.log(expect_page);
    }
    // check xem route đó có thuộc ngoại lệ hay không
    if (expect_page !== null) {
      if (!environment.production) {
        console.log(this.activeroute._routerState.url);
      }
      const a = !expect_page.includes(this.activeroute._routerState.url);
      condition = condition && a;
    }
    if (!environment.production) {
      console.log(condition);
    }
    return condition;
  }
}
