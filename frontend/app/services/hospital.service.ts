import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';
import { Hospital } from '../models/hospital.model';
@Injectable({
  providedIn: 'root'
})
export class FablabService {
  private rootPath: String;

  constructor(private http: HttpClient) {
    this.rootPath = routes.backendUrl + '/' + routes.paths.backend.fablabs.root;
  }

  public async getHospital(id): Promise<any> {
    const result = await this.http.get(`${this.rootPath}/${id}`).toPromise();
    if (result && result.hasOwnProperty('hopsital')) {
      return result;
    }
    return undefined;
  }
  public getHospitals(): Promise<any> {
    return this.http.get(`${this.rootPath}`).toPromise();
  }
  public createHospital(hospital: Hospital): Promise<any> {
    return this.http.post(`${this.rootPath}/`, hospital).toPromise();
  }
  public updateFablab(hospital): Promise<any> {
    return this.http.put(`${this.rootPath}/${hospital._id}`, hospital)
        .toPromise();
     }

}
