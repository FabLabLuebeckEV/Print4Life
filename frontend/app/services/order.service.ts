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

  public createOrder(order, shared?: boolean): Promise<any> {
    if (shared) {
      return this.http.post(`${this.p}/${routes.paths.backend.orders.shared}`, order).toPromise();
    } else {
      return this.http.post(`${this.p}`, order).toPromise();
    }
  }
  public updateOrder(order, shared?: boolean): Promise<any> {
    if (shared) {
      return this.http.put(`${this.p}/${routes.paths.backend.orders.shared}/${order._id}`, order).toPromise();
    } else {
      return this.http.put(`${this.p}/${order._id}`, order).toPromise();
    }
  }

  public deleteOrder(id): Promise<any> {
    return this.http.delete(`${this.p}/${id}`).toPromise();
  }

  public getOrderById(id): Promise<any> {
    return this.http.get(`${this.p}/${id}`).toPromise();
  }

  public getStatus(outstanding: Boolean): Promise<any> {
    if (outstanding) {
      return this.http.get(
        `${this.p}/${routes.paths.backend.orders.getStatus}/${routes.paths.backend.orders.getOutstandingStatus}`
      ).toPromise();
    }
    return this.http.get(`${this.p}/${routes.paths.backend.orders.getStatus}`).toPromise();
  }

  public createComment(id, comment, shared?: boolean): Promise<any> {
    if (shared) {
      return this.http.post(
        `${this.p}/${routes.paths.backend.orders.shared}/${id}/${routes.paths.backend.orders.comment}`, comment).toPromise();
    } else {
      return this.http.post(`${this.p}/${id}/${routes.paths.backend.orders.comment}`, comment).toPromise();
    }
  }

  public getSchedule(id: string): Promise<any> {
    return this.http.get(`${this.p}/${id}/schedule`).toPromise();
  }

  public deleteFile(orderId: string, fileId: string, token: string, shared?: boolean): Promise<any> {
    if (!shared) {
      return this.http.delete(`${this.p}/${orderId}/files/${fileId}?token=${token}`).toPromise();
    } else {
      return this.http.delete(`${this.p}/${routes.paths.backend.orders.shared}/${orderId}/files/${fileId}`).toPromise();
    }
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
