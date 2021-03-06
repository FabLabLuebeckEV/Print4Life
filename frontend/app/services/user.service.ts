import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { routes } from '../config/routes';
import { User } from '../models/user.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private tokenStorageName = 'orderManagementJWTToken';
  private p: String;
  private token: String = '';
  private user: User;
  constructor(
    private http: HttpClient,
    private translateService: TranslateService
  ) {
    this.token = localStorage.getItem(this.tokenStorageName);
    this.p = routes.backendUrl + '/' + routes.paths.backend.users.root;
    this.getUser()
      .then(user => {
        this.user = user;
        this._setUserLanguage();
      })
      .catch(() => {
        this.user = undefined;
      });
  }

  public getRoles(): Promise<any> {
    return this.http
      .get(`${this.p}/${routes.paths.backend.users.getRoles}`)
      .toPromise();
  }

  public createUser(user): Promise<any> {
    return this.http.post(`${this.p}/`, user).toPromise();
  }

  public updateUser(user): Promise<any> {
    return this.http.put(`${this.p}/${user._id}`, user).toPromise();
  }

  public changePassword(id, oldPassword, newPassword): Promise<any> {
    return this.http
      .put(`${this.p}/${id}/${routes.paths.backend.users.changePassword}`, {
        oldPassword,
        newPassword
      })
      .toPromise();
  }

  public deleteUser(id): Promise<any> {
    return this.http.delete(`${this.p}/${id}`).toPromise();
  }

  public async getProfile(id: String): Promise<any> {
    const result = await this.http.get(`${this.p}/${id}`).toPromise();
    if (result && result.hasOwnProperty('user')) {
      return result['user'];
    }
    return undefined;
  }

  public async getNamesOfUser(id: String): Promise<any> {
    const result = await this.http
      .get(`${this.p}/${id}/${routes.paths.backend.users.getNames}`)
      .toPromise();
    if (result && result.hasOwnProperty('user')) {
      return result['user'];
    }
    return undefined;
  }

  public async findOwn(): Promise<any> {
    const result = await this.http
      .get(`${this.p}/${routes.paths.backend.users.findown}`)
      .toPromise();
    if (result && result.hasOwnProperty('user')) {
      return result['user'];
    }
    return undefined;
  }

  public login(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.p}/${routes.paths.backend.users.login}`, user)
        .toPromise()
        .then((result: any) => {
          const login = result && result.login ? result.login : undefined;
          if (login && login['success']) {
            this.token = login['token'];
            localStorage.setItem(this.tokenStorageName, this.token.toString());
            resolve(login);
          } else {
            reject(login ? login : { error: 'No login message received' });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public getAllUsers(query?, limit?, skip?): Promise<any> {
    let params = new HttpParams();
    if (query) {
      return this.search(query, limit, skip);
    }
    if (limit >= 0 && skip >= 0) {
      params = params.append('limit', limit);
      params = params.append('skip', skip);
    }
    return this.http.get(`${this.p}`, { params: params }).toPromise();
  }

  public count(query) {
    return this.http
      .post(`${this.p}/${routes.paths.backend.users.count}`, { query: query })
      .toPromise();
  }

  public search(query, limit?, skip?) {
    const body = {
      query: query,
      limit: undefined,
      skip: undefined
    };

    if (limit >= 0 && skip >= 0) {
      body.limit = limit;
      body.skip = skip;
    }
    return this.http
      .post(`${this.p}/${routes.paths.backend.users.search}`, body)
      .toPromise();
  }

  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.token = '';
        localStorage.removeItem(this.tokenStorageName);
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
        this._setUserLanguage();
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

  public claimActivation(userId) {
    return this.http
      .put(
        `${this.p}/${userId}/${routes.paths.backend.users.activationRequest}`,
        undefined
      )
      .toPromise();
  }

  public activateUser(userId) {
    return this.http
      .put(
        `${this.p}/${userId}/${routes.paths.backend.users.activate}`,
        undefined
      )
      .toPromise();
  }

  public async resetPassword(email) {
    return this.http
      .post(`${this.p}/${routes.paths.backend.users.resetPassword}/`, email)
      .toPromise();
  }

  public getLocalStorageTokenName(): string {
    return this.tokenStorageName;
  }

  public async resetLocalUser() {
    this.user = undefined;
    this.user = await this.getUser();
  }

  private _setUserLanguage() {
    if (
      this.user.preferredLanguage &&
      this.user.preferredLanguage.hasOwnProperty('language')
    ) {
      this.translateService.use(this.user.preferredLanguage.language + '');
    }
  }
}
