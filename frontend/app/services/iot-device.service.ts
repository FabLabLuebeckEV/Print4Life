import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { routes } from '../config/routes';

@Injectable({
  providedIn: 'root'
})
export class IotDeviceService {
  private rootPath: String;

  constructor(
    private http: HttpClient
  ) {
    this.rootPath = routes.backendUrl + '/' + routes.paths.backend.iotDevices.root;
  }

  public getAllIotDevices(): Promise<any> {
    return this.http.get(`${this.rootPath}/`).toPromise();
  }
}
