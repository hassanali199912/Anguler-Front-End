import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _HttpClient:HttpClient) { }

  GetCategories():Observable<any>
  {
    return this._HttpClient.get(`${environment.baseURL}/api/Category?page=1`)
  }

}
