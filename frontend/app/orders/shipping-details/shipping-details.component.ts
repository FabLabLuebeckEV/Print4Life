import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HospitalService } from 'frontend/app/services/hospital.service';
import { OrderService } from 'frontend/app/services/order.service';
import { BlueprintService } from 'frontend/app/services/blueprint.service';

import { routes } from '../../config/routes';

@Component({
  selector: 'app-shipping-details',
  templateUrl: './shipping-details.component.html',
  styleUrls: ['./shipping-details.component.css']
})
export class ShippingDetailsComponent implements OnInit {

  order: any;
  hospital: any;

  myOrdersRoute = '/' + routes.paths.frontend.orders.root + '/' + routes.paths.frontend.orders.acceptedOrders;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private hospitalService: HospitalService,
    private orderService: OrderService,
    private blueprintService: BlueprintService
  ) {
    this.router.events.subscribe(async () => {
      const route = this.location.path();
    });
    this.route.params.subscribe(async params => {
      if (params.id) {
        this.order = (await this.orderService.getOrderById(params.id)).order;
        this.hospital = await this.hospitalService.findByOwner(this.order.owner);
        this.order.blueprint = (await this.blueprintService.getBlueprint(this.order.blueprintId)).blueprint;
        console.log(this.order, this.hospital, this.order.blueprint);
      }
    });
  }

  async ngOnInit() {

  }
}
