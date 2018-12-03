import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { routes } from '../config/routes';
import { Schedule } from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private rootPath: String;

  constructor(private http: HttpClient) {
    this.rootPath = routes.backendUrl + '/' + routes.paths.backend.machines.root;
  }

  public uncamelCase(str: String): String {
    const firstLetter = str.charAt(0);
    if (firstLetter.match(/[a-z]/)) {
      const split = str.split(/(?=[A-Z])/);
      let newStr = split[0].charAt(0).toUpperCase() + split[0].slice(1) + ' ';
      for (let i = 1; i < split.length; i++) {
        split[i].length > 1 ? newStr += split[i] + ' ' : newStr += split[i];
      }
      return newStr.trim();
    } else {
      return str;
    }
  }

  public camelCaseTypes(type): String {
    const split = type ? type.split(' ') : '';
    if (!split) {
      return type;
    }
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

  public getAll(machineType, limit?, skip?) {
    const type = this.camelCaseTypes(machineType);
    if (limit >= 0 && skip >= 0) {
      let params = new HttpParams();
      params = params.append('limit', limit);
      params = params.append('skip', skip);
      return this.http.get(`${this.rootPath}/${type}s`, { params: params }).toPromise();
    } else {
      return this.http.get(`${this.rootPath}/${type}s`).toPromise();
    }
  }

  public count(machineType) {
    const type = this.camelCaseTypes(machineType);
    return this.http.get(`${this.rootPath}/${type}s/${routes.paths.backend.machines.count}`).toPromise();
  }

  public async countSuccessfulOrders(machineType: string, id: string): Promise<any> {
    const type = this.camelCaseTypes(machineType);
    return this.http.get(`${this.rootPath}/${type}s/${id}/${routes.paths.backend.machines.countSuccessfulOrders}`).toPromise();
  }

  public create(machineType, obj) {
    const type = this.camelCaseTypes(machineType);
    return this.http.post(`${this.rootPath}/${type}s/`, obj).toPromise();
  }

  public update(machineType, id, machine) {
    const type = this.camelCaseTypes(machineType);
    return this.http.put(`${this.rootPath}/${type}s/${id}`, machine).toPromise();
  }

  public getAllMachines(): Promise<any> {
    return this.http.get(`${this.rootPath}/`).toPromise();
  }

  public getAllMachineTypes(): Promise<any> {
    return this.http.get(`${this.rootPath}/${routes.paths.backend.machines.machineTypes}`).toPromise();
  }

  public getMaterialsByMachineType(machineType): Promise<any> {
    const type = this.camelCaseTypes(machineType);
    return this.http.get(`${this.rootPath}/${routes.paths.backend.machines.materials}/${type}`).toPromise();
  }

  public getLaserTypes(): Promise<any> {
    return this.http.get(`${this.rootPath}/lasercutters/${routes.paths.backend.machines.laserTypes}`).toPromise();
  }

  public deleteMachine(machineType, id) {
    const type = this.camelCaseTypes(machineType);
    return this.http.delete(`${this.rootPath}/${type}s/${id}`).toPromise();
  }

  public get(machineType, id) {
    const type = this.camelCaseTypes(machineType);
    return this.http.get(`${this.rootPath}/${type}s/${id}`).toPromise();
  }

  public getSchedules(machineType: string, id: string): Promise<Object> {
    const type = this.camelCaseTypes(machineType);
    return this.http.get(`${this.rootPath}/${type}s/${id}/schedules`).toPromise();
  }

  public sortSchedulesByStartDate(schedules: Array<Schedule>) {
    return schedules.sort((a: Schedule, b: Schedule) => {
      if (a.startDate >= b.startDate) {
        return 1;
      } else {
        return -1;
      }
    });
  }

}
