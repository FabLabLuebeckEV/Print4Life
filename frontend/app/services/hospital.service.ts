import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';
import { Hospital } from '../models/hospital.model';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private rootPath: String;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.rootPath = routes.backendUrl + '/' + routes.paths.backend.hospitals.root;
  }

  public async findOwn(): Promise<any> {
    const user = await this.userService.findOwn();
    console.log('user is ', user, ' now searching hospitals');
    const result = await this.http.post(`${this.rootPath}/search`, {
      query: {
        owner: user._id
      },
      limit: undefined,
      skip: undefined
    }).toPromise();
    if (result && result.hasOwnProperty('hospitals')) {
      return result['hospitals'][0];
    }
    return undefined;
  }

  public async getHospital(id): Promise<any> {
    const result = await this.http.get(`${this.rootPath}/${id}`).toPromise();
    if (result && result.hasOwnProperty('hospital')) {
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
  public updateHospital(hospital): Promise<any> {
    return this.http.put(`${this.rootPath}/${hospital._id}`, hospital)
      .toPromise();
    }

}
