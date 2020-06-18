import { OnInit, Component } from '@angular/core';
import { User } from 'frontend/app/models/user.model';
import { OrderService } from 'frontend/app/services/order.service';
import { BlueprintService } from 'frontend/app/services/blueprint.service';
import { UserService } from 'frontend/app/services/user.service';


@Component({
    selector: 'app-all-orders',
    templateUrl: './all-orders.component.html',
    styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
    orders: Array<any> = [];
    loggedInUser: User;
    filterValue: String = '';

    constructor(
        public orderService: OrderService,
        public blueprintService: BlueprintService,
        public userService: UserService
    ) {

    }

    async ngOnInit() {
        this.loadOrders();
    }

    private async loadOrders() {
        this.loggedInUser = await this.userService.getUser();
        const query = {
            $and: [
            ]
        };
        query.$and.push({
            blueprintId: {
                $exists: true
            }
        });
        if (this.loggedInUser.role.role === 'editor') {
            if (this.filterValue === 'started') {
                query.$and.push({
                    $or: [
                        {
                            'batch.accepted': {
                                $elemMatch: {
                                    user: this.loggedInUser._id
                                }
                            }
                        }
                    ]
                });
            }
        }

        const ret = await this.orderService.getAllOrders(query);

        if (this.loggedInUser.role.role === 'editor') {
            if (this.filterValue !== '') {
                if (this.filterValue === 'open') {
                    ret.orders = ret.orders.filter(function (order) {
                        const finished = order.batch.finished.reduce((total, batch) => {
                            return total + batch.number;
                        }, 0);
                        return order.batch.number > finished;
                    });
                } else if (this.filterValue === 'started') {

                } else if (this.filterValue === 'finished') {
                    ret.orders = ret.orders.filter(function (order) {
                        const finished = order.batch.finished.reduce((total, batch) => {
                            return total + batch.number;
                        }, 0);
                        return order.batch.number ===  finished;
                    });
                }
            }
        }
        if (ret && ret !== null) {
            for (let i = 0; i < ret.orders.length; i++) {
                ret.orders[i].blueprint = (await this.blueprintService.getBlueprint(ret.orders[i].blueprintId)).blueprint;
            }
            this.orders = ret.orders;

            console.log('orders: ', JSON.parse(JSON.stringify(this.orders)));
        } else {
            this.orders = undefined;
            return;
        }
    }

    private filter(filterStatus) {
        this.filterValue = filterStatus;
        this.loadOrders();
    }
}
