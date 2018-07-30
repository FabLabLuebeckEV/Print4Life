import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http: HttpClient) { }

  public getAll(machineType) {
    return this.http.get(config.backendUrl + `/machines/${machineType}s`).toPromise();
  }

  public create(machineType, obj) {
    return this.http.post(`${config.backendUrl}/machines/${machineType}s/create`, obj).toPromise();
  }

  public getAllMachines(): Promise<any> {
    return this.http.get(config.backendUrl + '/machines/').toPromise();
  }

  public getAllMachineTypes(): Promise<any> {
    return this.http.get(config.backendUrl + '/machines/types').toPromise();
  }

  public getMaterialsByMachineType(machineType): Promise<any> {
    return this.http.get(`${config.backendUrl}/machines/materials/${machineType}`).toPromise();
  }

  public getLaserTypes(): Promise<any> {
    return this.http.get(`${config.backendUrl}/machines/laserTypes`).toPromise();
  }

}
