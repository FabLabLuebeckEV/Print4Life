import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config/config';

const rootPath = config.backendUrl + '/' + config.paths.machines.root;

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http: HttpClient) { }

  public camelCaseTypes(type): String {
    const split = type.split(' ');
    split[0] = split[0].charAt(0).toLowerCase() + split[0].slice(1);
    if (split.length === 2) {
      split[1] = split[1].charAt(0).toUpperCase() + split[1].slice(1);
    }
    let machine = '';
    for (let i = 0; i < split.length; i += 1) {
      machine += split[i];
    }
    return machine.trim();
  }

  public getAll(machineType) {
    return this.http.get(`${rootPath}/${machineType}s`).toPromise();
  }

  public create(machineType, obj) {
    return this.http.post(`${rootPath}/${machineType}s/${config.paths.machines.create}`, obj).toPromise();
  }

  public getAllMachines(): Promise<any> {
    return this.http.get(`${rootPath}/`).toPromise();
  }

  public getAllMachineTypes(): Promise<any> {
    return this.http.get(`${rootPath}/${config.paths.machines.machineTypes}`).toPromise();
  }

  public getMaterialsByMachineType(machineType): Promise<any> {
    return this.http.get(`${rootPath}/${config.paths.machines.materials}/${machineType}`).toPromise();
  }

  public getLaserTypes(): Promise<any> {
    return this.http.get(`${rootPath}/${config.paths.machines.laserTypes}`).toPromise();
  }

  public deleteMachine(machineType, id) {
    return this.http.delete(`${rootPath}/${machineType}s/${id}`).toPromise();
  }

  public get(machineType, id) {
    return this.http.get(`${rootPath}/${machineType}s/${id}`).toPromise();
  }

}
