import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private p: String;
  constructor(private http: HttpClient) {
    this.p = routes.backendUrl + '/' + routes.paths.backend.users.root;
  }

  public getRoles(): Promise<any> {
    return this.http.get(`${this.p}/${routes.paths.backend.users.getRoles}`).toPromise();
  }

  public createUser(user): Promise<any> {
    return this.http.post(`${this.p}/`, user).toPromise();
  }

  public getProfile(id): Promise<any> {
    return this.http.get(`${this.p}/${id}`).toPromise();
  }

  public login(user): Promise<any> {
    return this.http.post(`${this.p}/${routes.paths.backend.users.login}`, user).toPromise();
  }
}
