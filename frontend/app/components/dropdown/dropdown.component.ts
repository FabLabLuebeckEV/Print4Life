import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() switchLanguageEvent: EventEmitter<String> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  emit(language) {
    this.switchLanguageEvent.emit(language);
  }

}
