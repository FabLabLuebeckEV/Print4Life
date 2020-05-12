import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

import { OrderService } from '../../services/order.service';
import { BlueprintService } from '../../services/blueprint.service';
import { UserService } from 'frontend/app/services/user.service';
import { User } from 'frontend/app/models/user.model';

@Component({
    selector: 'app-open-orders',
    templateUrl: './open-orders.component.html',
    styleUrls: ['./open-orders.component.css']
})
export class OpenOrdersComponent implements OnInit {

    orders: Array<any>;
    loggedInUser: User;

    constructor(
        public orderService: OrderService,
        public blueprintService: BlueprintService,
        public userService: UserService
    ) {

    }

    async ngOnInit() {
        this.init();
    }

    private async init() {
        this.loggedInUser = await this.userService.findOwn();
        this.loadOrders();
    }

    public async  loadOrders() {
        const query = {$and: []};
        query.$and.push({
            blueprintId: {
                $exists: true
            }
        });
        if (this.loggedInUser.role.role === 'user') {
            query.$and.push({
                owner: this.loggedInUser._id
            });
        }


        const ret = await this.orderService.getAllOrders(query);

        for (let i = 0; i < ret.orders.length; i++) {
            ret.orders[i].blueprint = (await this.blueprintService.getBlueprint(ret.orders[i].blueprintId)).blueprint;
        }

        if (this.loggedInUser.role.role === 'user') {
            ret.orders = ret.orders.filter(function (order) {
                const finished = order.batch.finished.reduce((total, batch) => {
                    return total + batch.number;
                }, 0);
                return order.batch.number > finished;
            });
        }

        this.orders = ret.orders;
    }
}
