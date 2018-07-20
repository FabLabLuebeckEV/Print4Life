import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http: HttpClient) { }

  public getAllPrinters(): Promise<any> {
    return this.http.get(config.backendUrl + '/machine/printer').toPromise();
  }

  public getAllLasercutters(): Promise<any> {
    return this.http.get(config.backendUrl + '/machine/lasercutter').toPromise();
  }

  public getAllMillingMachines(): Promise<any> {
    return this.http.get(config.backendUrl + '/machine/millingMachine').toPromise();
  }

  public getAllOtherMachines(): Promise<any> {
    return this.http.get(config.backendUrl + '/machine/otherMachine').toPromise();
  }

  public getAllMachines(): Promise<any> {
    return this.http.get(config.backendUrl + '/machine/').toPromise();
  }
}
