import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable()
export class SuperAdminGuard implements CanActivate {
  activeroute: any;
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user_info = JSON.parse(localStorage.getItem(environment.UserLoged));
    if (Number(user_info.lever) === 0) {
      return true;
    }
    this.router.navigate(['404']);
    return false;
  }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  // }
}
