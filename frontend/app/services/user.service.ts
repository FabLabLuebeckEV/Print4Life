import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private tokenStorageName = 'orderManagementJWTToken';
  private p: String;
  private token: String = '';
  private user: User;
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem(this.tokenStorageName);
    this.p = routes.backendUrl + '/' + routes.paths.backend.users.root;
    this.getUser().then((user) => {
      this.user = user;
    }).catch(() => {
      this.user = undefined;
    });
  }

  public getRoles(): Promise<any> {
    return this.http.get(`${this.p}/${routes.paths.backend.users.getRoles}`).toPromise();
  }

  public createUser(user): Promise<any> {
    return this.http.post(`${this.p}/`, user).toPromise();
  }

  public async getProfile(id: String): Promise<any> {
    const result = await this.http.get(`${this.p}/${id}`).toPromise();
    if (result && result.hasOwnProperty('user')) {
      return result['user'];
    }
    return undefined;
  }

  public async findOwn(): Promise<any> {
    const result = await this.http.get(`${this.p}/${routes.paths.backend.users.findown}`).toPromise();
    if (result && result.hasOwnProperty('user')) {
      return result['user'];
    }
    return undefined;
  }

  public login(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.p}/${routes.paths.backend.users.login}`, user).toPromise().then((result: any) => {
        const login = result && result.login ? result.login : undefined;
        if (login && login['success']) {
          this.token = login['token'];
          localStorage.setItem(this.tokenStorageName, this.token.toString());
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
        localStorage.removeItem(this.tokenStorageName);
        this.token = '';
        this.user = undefined;
        resolve();
      } catch (err) {
        reject({ error: 'Logout failed', stack: err });
      }
    });
  }

  public isLoggedIn(): boolean {
    return !!this.token && this.token.length > 0;
  }

  public getToken(): String {
    return this.token;
  }

  public async getUser(): Promise<User> {
    if (this.user) {
      return this.user;
    } else if (this.token) {
      const user = await this.findOwn();
      if (user) {
        this.user = user;
        return this.user;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  public async isAdmin(): Promise<Boolean> {
    let isAdmin = false;
    if (this.user) {
      isAdmin = this.user.role && this.user.role.role === 'admin';
    } else {
      this.user = await this.getUser();
      isAdmin = this.user && this.user.role && this.user.role.role === 'admin';
    }
    return isAdmin;
  }

  public claimActivation(userId): void {
    this.http.put(`${this.p}/activationRequest/${userId}`, undefined).toPromise();
  }

  public getLocalStorageTokenName(): string {
    return this.tokenStorageName;
  }
}
