import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable()
export class ExpertGuard implements CanActivate {
  activeroute: any;
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const page_permission_array = JSON.parse(localStorage.getItem(environment.expert_page_permission));
    // console.log(page_permission_array);
    if (page_permission_array.length > 0) {
      return true;
    }
    this.router.navigate(['404']);
    return false;
  }
}
