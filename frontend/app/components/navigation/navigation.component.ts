import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  title = 'Order Management';
  dropdown =
    {
      name: 'Machines',
      elements: [
        { name: 'Get Machines', routerHref: 'machines' }
      ]
    };

  constructor() { }

  ngOnInit() {
  }
}
