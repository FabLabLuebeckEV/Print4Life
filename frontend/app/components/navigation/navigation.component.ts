import { Component, OnInit } from '@angular/core';
import { routes } from '../../config/routes';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  title = 'Order Management';
  isNavbarCollapsed: Boolean = false;
  machineDropdown: Object;
  orderDropdown: Object;

  constructor() {
    this.machineDropdown = {
      name: 'Machine',
      elements: [
        { name: 'Get Machines', routerHref: routes.paths.machines.root }
      ]
    };

    this.orderDropdown = {
      name: 'Orders',
      elements: [
        { name: 'All orders', routerHref: routes.paths.orders.root }
      ]
    };
  }

  ngOnInit() {
  }
}
