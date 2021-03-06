import { OnInit, Component } from '@angular/core';
import { User } from 'frontend/app/models/user.model';
import { OrderService } from 'frontend/app/services/order.service';
import { BlueprintService } from 'frontend/app/services/blueprint.service';
import { UserService } from 'frontend/app/services/user.service';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: Array<any> = [];
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
    this.loggedInUser = await this.userService.getUser();
    const query = {
      $and: [
        {
          blueprintId: {
            $exists: true
          }
        },
        {
          owner: this.loggedInUser._id
        }
      ]
    };
    const ret = await this.orderService.getAllOrders(query);
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
}
