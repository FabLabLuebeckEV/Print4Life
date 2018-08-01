import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config/config';

const rootPath = config.backendUrl + '/' + config.paths.fablabs.root;

@Injectable({
  providedIn: 'root'
})
export class FablabService {

  constructor(private http: HttpClient) { }

  public getFablab(id): Promise<any> {
    return this.http.get(`${rootPath}/${id}`).toPromise();
  }

  public getFablabs(): Promise<any> {
    return this.http.get(`${rootPath}`).toPromise();
  }
}
