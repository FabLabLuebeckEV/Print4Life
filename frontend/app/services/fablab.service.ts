import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class FablabService {

  constructor(private http: HttpClient) { }

  public getFablab(id): Promise<any> {
    return this.http.get(config.backendUrl + '/fablabs/' + id).toPromise();
  }

  public getFablabs(): Promise<any> {
    return this.http.get(config.backendUrl + '/fablabs/').toPromise();
  }
}
