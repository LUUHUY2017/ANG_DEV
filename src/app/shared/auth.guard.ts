import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  activeroute: any;
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const module_array = JSON.parse(localStorage.getItem(environment.module_array));
    // console.log(module_array);
    if (localStorage.getItem(environment.access_token) && module_array.length > 0) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const module_array = JSON.parse(localStorage.getItem(environment.module_array));
    // if (!environment.production) {
    //   console.log(module_array);
    // }
    if (localStorage.getItem(environment.access_token) && module_array.length > 0) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
