import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { routes } from '../config/routes';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private p: String;

  constructor(private http: HttpClient) {
    this.p = routes.backendUrl + '/' + routes.paths.backend.orders.root;
  }

  public getAllOrders(query?, limit?, skip?): Promise<any> {
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
    return this.http.post(`${this.p}/${routes.paths.backend.orders.search}`, body).toPromise();
  }

  public count(query) {
    return this.http.post(`${this.p}/${routes.paths.backend.orders.count}`, { query: query }).toPromise();
  }

  public createOrder(order): Promise<any> {
    return this.http.post(`${this.p}`, order).toPromise();
  }
  public updateOrder(order): Promise<any> {
    return this.http.put(`${this.p}/${order._id}`, order).toPromise();
  }

  public deleteOrder(id): Promise<any> {
    return this.http.delete(`${this.p}/${id}`).toPromise();
  }

  public getOrderById(id): Promise<any> {
    return this.http.get(`${this.p}/${id}`).toPromise();
  }

  public getStatus(): Promise<any> {
    return this.http.get(`${this.p}/${routes.paths.backend.orders.getStatus}`).toPromise();
  }

  public createComment(id, comment): Promise<any> {
    return this.http.post(`${this.p}/${id}/${routes.paths.backend.orders.comment}`, comment).toPromise();
  }

  public sortFilesByDeprecated(files) {
    files.sort((a: { deprecated: boolean }, b: { deprecated: boolean }) => {
      if (!a.hasOwnProperty('deprecated') || !b.hasOwnProperty('deprecated')
        && a.deprecated === b.deprecated) {
        return 0;
      } else if (a.deprecated === true) {
        return 1;
      } else {
        return -1;
      }
    });
  }
}
