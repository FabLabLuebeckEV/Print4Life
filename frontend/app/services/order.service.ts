import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { routes } from '../config/routes';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private p: String;

  constructor(private http: HttpClient) {
    this.p = routes.backendUrl + '/' + routes.paths.orders.root;
  }

  public getAllOrders(): Promise<any> {
    return this.http.get(`${this.p}`).toPromise();
  }

  public createOrder(order): Promise<any> {
    return this.http.post(`${this.p}/${routes.paths.orders.createOrder}`, order).toPromise();
  }
  public updateOrder(order): Promise<any> {
    return this.http.post(`${this.p}/${routes.paths.orders.updateOrder}`, order).toPromise();
  }

  public deleteOrder(id): Promise<any> {
    return this.http.delete(`${this.p}/${routes.paths.orders.deleteOrder}/${id}`).toPromise();
  }

  public getOrderById(id): Promise<any> {
    return this.http.get(`${this.p}/${id}`).toPromise();
  }

  public getStatus(): Promise<any> {
    return this.http.get(`${this.p}/${routes.paths.orders.getStatus}`).toPromise();
  }
}
