import { OnInit, Component } from '@angular/core';
import { User } from 'frontend/app/models/user.model';
import { OrderService } from 'frontend/app/services/order.service';
import { BlueprintService } from 'frontend/app/services/blueprint.service';
import { UserService } from 'frontend/app/services/user.service';
import { HospitalService } from 'frontend/app/services/hospital.service';


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
        public userService: UserService,
        public hospitalService: HospitalService
    ) {

    }

    async ngOnInit() {
        this.loadOrders();
    }

    private async loadOrders() {
        console.log("loadOrders")
        this.loggedInUser = await this.userService.getUser();
        const query = {
            $and: [
            ]
        };
        const statusQuery = [{
            status: this.filterValue
        }];
        query.$and.push({
            blueprintId: {
                $exists: true
            },
            $or: statusQuery
            
        });

        if (this.loggedInUser.role.role === 'editor') {
            if (this.filterValue === 'in progress') {
                query.$and.push(
                    {
                        'batch.accepted': {
                            $elemMatch: {
                                user: this.loggedInUser._id
                            }
                        }
                    }
                );
            }
            if (this.filterValue === 'closed') {
                query.$and.push(
                    {
                        'batch.finished': {
                            $elemMatch: {
                                user: this.loggedInUser._id
                            }
                        }
                    },
                    {
                        'batch.accepted': {
                            $not: {
                                $elemMatch: {
                                    user: this.loggedInUser._id
                                }
                            }
                        }
                    }
                );
                statusQuery.push({
                    status: 'in progress'
                });
            }
        }

        const ret = await this.orderService.getAllOrders(query);


        if (ret && ret !== null) {
            for (let i = 0; i < ret.orders.length; i++) {
                ret.orders[i].blueprint = (await this.blueprintService.getBlueprint(ret.orders[i].blueprintId)).blueprint;

                ret.orders[i].hospital = await this.hospitalService.findByOwner(ret.orders[i].owner);
            }
            this.orders = ret.orders;

            console.log('orders: ', JSON.parse(JSON.stringify(this.orders)));
        } else {
            this.orders = undefined;
            return;
        }
    }

    private filter(filterStatus) {
        console.log("filter called");
        this.filterValue = filterStatus;
        this.loadOrders();
    }
}
