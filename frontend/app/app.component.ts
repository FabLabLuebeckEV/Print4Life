import { Component } from '@angular/core';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  dropdownMenu = [
    {name: 'Tour of Heroes', href: 'https://angular.io/tutorial'},
    {name: 'CLI Documentation', href: 'https://github.com/angular/angular-cli/wiki'},
    {name: 'Angular blog', href: 'https://blog.angular.io/'}
  ];
}
