import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private p: String;
  private token: String = '';
  private user: Object;
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('jwtToken');
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
    this.user = user;
    return new Promise((resolve, reject) => {
      this.http.post(`${this.p}/${routes.paths.backend.users.login}`, user).toPromise().then((result: any) => {
        const login = result.login;
        if (login && login['success']) {
          this.token = login['token'];
          localStorage.setItem('jwtToken', this.token.toString());
          resolve(login);
        } else {
          reject(login ? login : { error: 'No login message received' });
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem('jwtToken');
        this.token = '';
        resolve();
      } catch (err) {
        reject({ error: 'Logout failed', stack: err });
      }
    });
  }

  public isLoggedIn(): Boolean {
    return this.token.length > 0;
  }

  public getToken(): String {
    return this.token;
  }

  public getUser() {
    return this.user;
  }
}
