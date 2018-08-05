import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private config: any;
  private rootPath: String;

  constructor(private http: HttpClient) {
    this.rootPath = routes.backendUrl + '/' + routes.paths.machines.root;
  }

  public _uncamelCase(str: String) {
    const firstLetter = str.charAt(0);
    if (firstLetter.match(/[a-z]/)) {
      const split = str.split(/(?=[A-Z])/);
      let newStr = split[0].charAt(0).toUpperCase() + split[0].slice(1) + ' ';
      for (let i = 1; i < split.length; i++) {
        split[i].length > 1 ? newStr += split[i] + ' ' : newStr += split[i];
      }
      return newStr.trim();
    }
  }

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
    return this.http.get(`${this.rootPath}/${machineType}s`).toPromise();
  }

  public create(machineType, obj) {
    return this.http.post(`${this.rootPath}/${machineType}s/${routes.paths.machines.create}`, obj).toPromise();
  }

  public update(machineType, id, machine) {
    return this.http.put(`${this.rootPath}/${machineType}s/${id}`, machine).toPromise();
  }

  public getAllMachines(): Promise<any> {
    return this.http.get(`${this.rootPath}/`).toPromise();
  }

  public getAllMachineTypes(): Promise<any> {
    return this.http.get(`${this.rootPath}/${routes.paths.machines.machineTypes}`).toPromise();
  }

  public getMaterialsByMachineType(machineType): Promise<any> {
    return this.http.get(`${this.rootPath}/${routes.paths.machines.materials}/${machineType}`).toPromise();
  }

  public getLaserTypes(): Promise<any> {
    return this.http.get(`${this.rootPath}/${routes.paths.machines.laserTypes}`).toPromise();
  }

  public deleteMachine(machineType, id) {
    return this.http.delete(`${this.rootPath}/${machineType}s/${id}`).toPromise();
  }

  public get(machineType, id) {
    return this.http.get(`${this.rootPath}/${machineType}s/${id}`).toPromise();
  }

}
