import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { routes } from '../../config/routes';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, Comment } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  private config: any;
  backArrow: any;
  backLink: any;
  order: Order = new Order(undefined, undefined, [], undefined, undefined, [], undefined, undefined);

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private configService: ConfigService
  ) {
    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
    this.backLink = `/${routes.paths.frontend.orders.root}`;
    this.route.params.subscribe(params => {
      if (params.id) {
        this.orderService.getOrderById(params.id).then((result) => {
          this.order = result.order;
        });
      }
    });
  }

  ngOnInit() {
  }
}
