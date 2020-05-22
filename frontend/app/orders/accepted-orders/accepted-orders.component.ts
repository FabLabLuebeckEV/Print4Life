import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

import { OrderService } from '../../services/order.service';
import { BlueprintService } from '../../services/blueprint.service';
import { User } from 'frontend/app/models/user.model';
import { UserService } from 'frontend/app/services/user.service';

@Component({
    selector: 'app-accepted-orders',
    templateUrl: './accepted-orders.component.html',
    styleUrls: ['./accepted-orders.component.css']
})
export class AcceptedOrdersComponent implements OnInit {

    orders: Array<any> = [];
    loggedInUser: User;

    constructor(
        public orderService: OrderService,
        public blueprintService: BlueprintService,
        public userService: UserService) {

    }

    async ngOnInit() {
        this.init();
    }

    private async init() {
        this.loggedInUser = await this.userService.getUser();
        this.loadOrders();
    }

    public async loadOrders() {
        const query = {
            $and: [
                {
                    blueprintId: {
                        $exists: true
                    }
                },
                {
                    $or: [
                        {
                            'batch.accepted': {
                                $elemMatch: {
                                    user: this.loggedInUser._id
                                }
                            }
                        },
                        {
                            'batch.finished': {
                                $elemMatch: {
                                    user: this.loggedInUser._id
                                }
                            }
                        }
                    ]
                }
            ]
        };
        const ret = await this.orderService.getAllOrders(query);
        if (!ret || ret === null) {
            this.orders = undefined;
            return;
        }
        for (let i = 0; i < ret.orders.length; i++) {
            ret.orders[i].blueprint = (await this.blueprintService.getBlueprint(ret.orders[i].blueprintId)).blueprint;
        }
        this.orders = ret.orders;

        console.log('orders: ', JSON.parse(JSON.stringify(this.orders)));
    }
}
