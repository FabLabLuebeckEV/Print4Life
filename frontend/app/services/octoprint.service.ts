import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';

@Injectable({
  providedIn: 'root'
})

export class OctoprintService {

  private p: String;

  constructor(private http: HttpClient) {
    this.p = routes.backendUrl + '/' + routes.paths.backend.octoprint.root;
  }

  public uploadFile(fileId: String, octoprintAddress: String, apiKey: String) {
    return this.http.post(`${this.p}/${routes.paths.backend.octoprint.uploadFile}/${fileId}`, { octoprintAddress, apiKey }).toPromise();
  }

  public printFile(fileId: String, octoprintAddress: String, apiKey: String) {
    return this.http.post(`${this.p}/${routes.paths.backend.octoprint.print}/${fileId}`, { octoprintAddress, apiKey }).toPromise();
  }
}
