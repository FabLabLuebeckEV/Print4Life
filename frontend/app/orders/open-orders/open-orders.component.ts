import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

import { OrderService } from '../../services/order.service';
import { BlueprintService } from '../../services/blueprint.service';

@Component({
    selector: 'app-open-orders',
    templateUrl: './open-orders.component.html',
    styleUrls: ['./open-orders.component.css']
})
export class OpenOrdersComponent implements OnInit {

    orders: Array<any>;

    constructor(public orderService: OrderService, public blueprintService: BlueprintService) {

    }

    async ngOnInit() {
        this.init();
    }

    private async init() {
        this.loadOrders();
    }

    public async  loadOrders() {
        console.log('openorders loadOrders called');
        const query = {
            $and: [
                {
                    blueprintId: {
                        $exists: true
                    }
                }
            ]
        };
        const ret = await this.orderService.getAllOrders(query);
        for (let i = 0; i < ret.orders.length; i++) {
            ret.orders[i].blueprint = (await this.blueprintService.getBlueprint(ret.orders[i].blueprintId)).blueprint;
        }
        this.orders = ret.orders;

        console.log('orders: ', JSON.parse(JSON.stringify(this.orders)));
    }
}
