import { Component, OnInit } from '@angular/core';
import { TableItem } from '../../components/table/table.component';
import { OrderService } from '../../services/order.service';
import { faWrench, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { config } from '../../config/config';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orders: Array<Object> = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    const resOrders = await this.orderService.getAllOrders();
    const orders = resOrders.orders;
    const arr = [];
    for (const order of orders) {
      const item = new TableItem();
      item.obj['DB ID'] = order._id;
      item.obj['Owner'] = order.owner;
      item.obj['Editor'] = order.editor;
      item.obj['Status'] = order.status;
      item.button1.label = 'Edit';
      item.button1.href = `./${config.paths.orders.updateOrder}`;
      item.button1.routerLink = true;
      item.button1.class = 'btn btn-primary spacing';
      item.button1.icon = faWrench;
      item.button2.label = 'Delete';
      item.button2.href = `./${config.paths.orders.deleteOrder}/${order._id}`;
      item.button2.routerLink = true;
      item.button2.class = 'btn btn-danger spacing';
      item.button2.icon = faTrashAlt;
      arr.push(item);
    }
    this.orders = this.orders.concat(arr);
  }
}
