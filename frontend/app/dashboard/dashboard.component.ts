import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'app';
  dropdownMenu = [
    { name: 'Tour of Heroes', href: 'https://angular.io/tutorial' },
    { name: 'CLI Documentation', href: 'https://github.com/angular/angular-cli/wiki' },
    { name: 'Angular blog', href: 'https://blog.angular.io/' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
