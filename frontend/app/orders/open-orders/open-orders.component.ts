import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

import { OrderService } from '../../services/order.service';

@Component({
    selector: 'app-open-orders',
    templateUrl: './open-orders.component.html',
    styleUrls: ['./open-orders.component.css']
})
export class OpenOrdersComponent implements OnInit {

    orders: Array<any>;

    constructor(public orderService: OrderService) {

    }

    async ngOnInit() {
        this.init();
    }

    private async init() {
        this.orders = await this.orderService.getAllOrders();
    }
}
