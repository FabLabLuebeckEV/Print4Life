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

  public getAll(machineType: string, query?: any, limit?: number, skip?: number) {
    const type = this.camelCaseTypes(machineType);
    let params = new HttpParams();
    if (query) {
      return this.search(machineType, query, limit, skip);
    }
    if (limit >= 0 && skip >= 0) {
      params = params.append('limit', limit.toString());
      params = params.append('skip', skip.toString());
    }
    if (limit >= 0 && skip >= 0 || query) {
      return this.http.get(`${this.rootPath}/${type}s`, { params: params }).toPromise();
    } else {
      return this.http.get(`${this.rootPath}/${type}s`).toPromise();
    }
  }

  public search(type: string, query: any, limit?: number, skip?: number) {
    const body = {
      query: query,
      limit: undefined,
      skip: undefined
    };

    if (limit >= 0 && skip >= 0) {
      body.limit = limit;
      body.skip = skip;
    }
    return this.http.post(`${this.rootPath}/${type}s/${routes.paths.backend.machines.search}`, body).toPromise();
  }

  public count(machineType: string, query?: any) {
    const type = this.camelCaseTypes(machineType);
    return this.http.post(`${this.rootPath}/${type}s/${routes.paths.backend.machines.count}`, { query }).toPromise();
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
    if (id === '') {
      return new Promise((resolve, reject) => {
        const erg = {};
        erg[`${type}s`] = [];
        resolve(erg);
      });
    }
    return this.http.get(`${this.rootPath}/${type}s/${id}`).toPromise();
  }

  public getSchedules(machineType: string, id: string, query?: {
    startDay: { year: number, month: number, day: number },
    endDay: { year: number, month: number, day: number }
  }
  ): Promise<Object> {
    const type = this.camelCaseTypes(machineType);
    if (query) {
      if (!query.startDay || !query.startDay.year || !query.startDay.month || !query.startDay.day
      ) {
        query.startDay = { year: 1990, month: 1, day: 1 };
      }
      if (!query.endDay || !query.endDay.year || !query.endDay.month || !query.endDay.day) {
        query.endDay = { year: 9999, month: 12, day: 31 };
      }
      let params = new HttpParams();
      params = params.append('startDay', `${query.startDay.year}-${query.startDay.month}-${query.startDay.day}`);
      params = params.append('endDay', `${query.endDay.year}-${query.endDay.month}-${query.endDay.day}`);
      return this.http.get(`${this.rootPath}/${type}s/${id}/schedules`, { params: params }).toPromise();
    } else {
      return this.http.get(`${this.rootPath}/${type}s/${id}/schedules`).toPromise();
    }
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
