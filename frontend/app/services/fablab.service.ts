import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';
import { Fablab } from '../models/fablab.model';
@Injectable({
  providedIn: 'root'
})
export class FablabService {
  private rootPath: String;

  constructor(private http: HttpClient) {
    this.rootPath = routes.backendUrl + '/' + routes.paths.backend.fablabs.root;
  }

  public async getFablab(id): Promise<any> {
    const result = await this.http.get(`${this.rootPath}/${id}`).toPromise();
    if (result && result.hasOwnProperty('fablab')) {
      return result;
    }
    return undefined;
  }
  public getFablabs(): Promise<any> {
    return this.http.get(`${this.rootPath}`).toPromise();
  }
  public createFablab(fablab: Fablab): Promise<any> {
    return this.http.post(`${this.rootPath}/`, fablab).toPromise();
  }
  public updateFablab(fablab): Promise<any> {
     return this.http.put(`${this.rootPath}/${fablab._id}`, fablab).toPromise();
     }

}
