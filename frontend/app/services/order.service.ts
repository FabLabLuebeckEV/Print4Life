import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { config } from '../config/config';

@Injectable({
  providedIn: 'root'
})

const p = config.paths.orders.root;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

export class OrderService {
  constructor(private http: HttpClient) { }

  public getAllOrders(): Promise < any > {
    return this.http.get(`${config.backendUrl}/${p}/`, httpOptions).toPromise();
  }

  public getOrderById(id): Promise < any > {
    return this.http.get(`${config.backendUrl}/${p}/${config.paths.orders.getAllOrders}/`, httpOptions).toPromise();
  }

  public createOrder(order): Promise < any > {
    return this.http.post(`${config.backendUrl}/${p}/${config.paths.orders.createOrder}/`, order, httpOptions).toPromise();
  }

  public updateOrder(order): Promise < any > {
    return this.http.post(`${config.backendUrl}/${p}/${config.paths.orders.updateOrder}/`, order, httpOptions).toPromise();
  }
}
