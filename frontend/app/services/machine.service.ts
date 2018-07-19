import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http: HttpClient) { }

  public getAllPrinters(): any {
    this.http.get(config.backendUrl + '/machine/printer').subscribe(((res: any) => {
      return res.printers;
    }));
  }
}
