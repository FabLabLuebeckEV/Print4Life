import { Component, OnInit } from '@angular/core';
import { config } from '../../config/config';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  title = 'Order Management';
  maschineDropdown =
    {
      name: 'Machine',
      elements: [
        { name: 'Get Machines', routerHref: 'machines' }
      ]
    };

    orderDropdown =
    {
      name: 'Orders',
      elements: [
        { name: 'All orders', routerHref: config.paths.orders.root }
      ]
    };

  constructor() { }

  ngOnInit() {
  }
}
