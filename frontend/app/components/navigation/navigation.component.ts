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
  userDropdown: Object;

  constructor() {
    this.machineDropdown = {
      name: 'Machine',
      elements: [
        { name: 'Get Machines', routerHref: routes.paths.frontend.machines.root }
      ]
    };

    this.orderDropdown = {
      name: 'Orders',
      elements: [
        { name: 'All orders', routerHref: routes.paths.frontend.orders.root }
      ]
    };

    this.userDropdown = {
      name: 'User',
      elements: [
        { name: 'SignUp', routerHref: `${routes.paths.frontend.users.root}/${routes.paths.frontend.users.create}` },
        { name: 'SignIn', routerHref: `${routes.paths.frontend.users.root}/${routes.paths.frontend.users.signin}` },
        { name: 'Info', routerHref: `${routes.paths.frontend.users.root}/:id` }
      ]
    };
  }

  ngOnInit() {
  }
}
