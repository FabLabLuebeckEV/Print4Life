import { Component, OnInit } from '@angular/core';
import { config } from '../../config/config';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  title = 'Order Management';
  dropdown =
    {
      name: 'Machine',
      elements: [
        { name: 'Get Machines', routerHref: 'machines' },
        { name: 'Get Orders', routerHref: config.paths.orders.root}
      ]
    };

  constructor() { }

  ngOnInit() {
  }
}
