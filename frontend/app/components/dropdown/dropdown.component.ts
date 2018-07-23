import { Component, OnInit, Input } from '@angular/core';

export interface Dropdown {
  name: string;
  elements: Array<Object>;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})

export class DropdownComponent implements OnInit {
  @Input() dropdown: Dropdown;
  constructor() { }

  ngOnInit() {
  }

}
