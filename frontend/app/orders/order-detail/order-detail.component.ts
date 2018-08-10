import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { routes } from '../../config/routes';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, Comment } from '../../models/order.model';
import { MachineService } from '../../services/machine.service';
import { Machine } from '../../models/machines.model';
import { FablabService } from '../../services/fablab.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  private config: any;
  backArrow: any;
  backLink: any;
  fablab: any;
  order: Order = new Order(
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    undefined
  );
  machine: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private machineService: MachineService,
    private fablabService: FablabService,
    private configService: ConfigService
  ) {
    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
    this.backLink = `/${routes.paths.frontend.orders.root}`;
    this.route.params.subscribe(params => {
      if (params.id) {
        this.orderService.getOrderById(params.id).then((result) => {
          this.order = result.order;
          this.machineService.get(this.order.machine.type, this.order.machine._id).then(result => {
            const type = this.machineService.camelCaseTypes(this.order.machine.type);
            this.machine = result[`${type}`];
            this.machine['detailView'] = `/${routes.paths.frontend.machines.root}/${type}s/${this.machine._id}/`;
            this.fablabService.getFablab(this.machine.fablabId).then(result => {
              this.fablab = result.fablab;
            });
          });
        });
      }
    });
  }

  ngOnInit() {
  }
}
