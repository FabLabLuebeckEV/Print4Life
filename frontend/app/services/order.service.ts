import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private p: String;

  constructor(private http: HttpClient) {
    this.p = routes.backendUrl + '/' + routes.paths.backend.orders.root;
  }

  public getAllOrders(): Promise<any> {
    return this.http.get(`${this.p}`).toPromise();
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
}
