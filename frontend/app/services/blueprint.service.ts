import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';
import { Fablab } from '../models/fablab.model';

@Injectable({
  providedIn: 'root'
})
export class BlueprintService {
  private rootPath: String;

  constructor(
    public http: HttpClient
  ) {
    this.rootPath = routes.backendUrl + '/' + routes.paths.backend.blueprints.root;
  }

  public async getBlueprint(id): Promise<any> {
    const result = await this.http.get(`${this.rootPath}/${id}`).toPromise();
    if (result && result.hasOwnProperty('blueprint')) {
      return result;
    }
    return undefined;
  }

  public async getBlueprints(): Promise<any> {
    const result = await this.http.get(`${this.rootPath}`).toPromise();
    if (result && result.hasOwnProperty('blueprints')) {
      return result;
    }
    return undefined;
  }
}
