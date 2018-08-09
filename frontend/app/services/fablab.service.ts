import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';
@Injectable({
  providedIn: 'root'
})
export class FablabService {
  private rootPath: String;

  constructor(private http: HttpClient) {
    this.rootPath = routes.backendUrl + '/' + routes.paths.backend.fablabs.root;
  }

  public getFablab(id): Promise<any> {
    return this.http.get(`${this.rootPath}/${id}`).toPromise();
  }

  public getFablabs(): Promise<any> {
    return this.http.get(`${this.rootPath}`).toPromise();
  }
}
