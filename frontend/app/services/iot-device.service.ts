import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { routes } from '../config/routes';
import { IotDevice } from '../models/iot-device.model';

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

  public getDeviceTypes(): Promise<any> {
    return this.http.get(`${this.rootPath}/${routes.paths.backend.iotDevices.deviceTypes}`).toPromise();
  }

  public addDevice(device: IotDevice): Promise<any> {
    return this.http.post(`${this.rootPath}/${routes.paths.backend.iotDevices.create}`, device).toPromise();
  }

  public getDeviceById(id: String): Promise<any> {
    return this.http.get(`${this.rootPath}/${id}`).toPromise();
  }

  public deleteDevice(id: String): Promise<any> {
    return this.http.delete(`${this.rootPath}/${id}`).toPromise();
  }
}
