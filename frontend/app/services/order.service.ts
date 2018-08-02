import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config/config';

const p = config.backendUrl + '/' + config.paths.orders.root;

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  public getAllOrders(): Promise < any > {
    return this.http.get(`${p}`).toPromise();
  }

  public createOrder(order): Promise < any > {
      return this.http.post(`${p}/${config.paths.orders.createOrder}`, order).toPromise();
  }
  public updateOrder(order): Promise < any > {
    return this.http.post(`${p}/${config.paths.orders.updateOrder}`, order).toPromise();
  }

  public deleteOrder(id): Promise < any > {
    return this.http.delete(`${p}/${config.paths.orders.deleteOrder}/${id}`).toPromise();
  }

  public getOrderById(id): Promise < any > {
    return this.http.get(`${p}/${config.paths.orders.getAllOrders}`).toPromise();
  }

  public getOrderById(id): Promise < any > {
    return this.http.get(`${p}/${id}`).toPromise();
  }

  public getStatus(): Promise < any > {
    return this.http.get(`${p}/${config.paths.orders.getStatus}`).toPromise();
  }
}
