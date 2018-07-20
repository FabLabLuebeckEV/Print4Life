import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class FablabService {

  constructor(private http: HttpClient) { }

  public getFablab(id): Promise<any> {
    const params = new HttpParams().set('id', id);
    return this.http.get(config.backendUrl + '/fablab/', { params: params }).toPromise();
  }
}
