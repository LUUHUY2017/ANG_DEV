import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLoggedIn = false;
  redirectUrl: string;

  constructor(private http: Http) { }

  login(username: string, password: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      // tslint:disable-next-line:max-line-length
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',

      'Accept': 'application/json',
    });

    const options = new RequestOptions({ headers: headers });
    const postData = {
      grant_type: environment.grant_type,
      client_id: environment.client_id,
      client_secret: environment.client_secret,
      username: username,
      password: password,
      scope: environment.scope,
    };
    const uri = environment.apiUrl + environment.API.oauth_token;
    return this.http.post(uri, postData, {
      headers: headers
    })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  getUser(): Observable<any> {
    const headers = new Headers({
      'Authorization': environment.Bearer + ' ' + localStorage.getItem(environment.access_token),
    });
    const uri = environment.apiUrl + environment.API.user;
    return this.http.get(uri, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  post(frmval, parth) {
    const headers = new Headers({
      'page-id': localStorage.getItem('page_id')
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Access-Control-Allow-Origin': '*',
    });
    const options = new RequestOptions({ headers: headers });
    const uri = environment.apiUrl + parth;
    return this.http.post(uri, frmval, {
      headers: headers
    })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.statusText || 'Server error'));
  }

  getPermission(): Observable<any> {
    const headers = new Headers({
      'Authorization': environment.Bearer + ' ' + localStorage.getItem(environment.access_token),
    });
    const uri = environment.apiUrl + environment.API.get_user_permission;
    return this.http.get(uri, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  logout() {
    localStorage.clear();
  }
}
