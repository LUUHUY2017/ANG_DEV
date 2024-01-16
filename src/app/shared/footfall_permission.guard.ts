import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class FootfallPermissionGuard implements CanActivate {
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
    let status = 0;
    // if (!environment.production) {
    //   console.log(permission_array);
    // }
    permission_array.forEach(element => {
      if (element.page_module.toUpperCase() === 'FOOTFALL') {
        status++;
      }
      if (element.page_module.toUpperCase() === 'ALL') {
        status++;
      }
    });
    return status === 2;
  }
}
