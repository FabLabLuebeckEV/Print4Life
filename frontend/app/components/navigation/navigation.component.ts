import { Component, OnInit } from '@angular/core';
import { routes } from '../../config/routes';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  title = 'Order Management';
  dropdown: Object;

  constructor() {
    this.dropdown = {
      name: 'Machine',
      elements: [
        { name: 'Get Machines', routerHref: routes.paths.machines.root },
        { name: 'Get Orders', routerHref: routes.paths.orders.root }
      ]
    };
  }

  ngOnInit() {
  }
}
