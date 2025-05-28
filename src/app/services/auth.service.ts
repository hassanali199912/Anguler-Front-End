import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient);
  userData: any;

  SetRegisterForm(data: object): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/api/Auth/register`, data);
  }

  SetLoginForm(data: object): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/api/Auth/login`, data);
  }

  saveUserData(): void {
    if (localStorage.getItem('userToken') !== null) {
      this.userData = jwtDecode(localStorage.getItem('userToken')!);
      console.log('userData', this.userData);
    }
  }
}