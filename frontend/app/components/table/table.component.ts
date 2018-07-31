import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

export class TableButton {
  icon: any = undefined;
  label: String = '';
  href: String = '';
  eventEmitter: Boolean = false;
  routerLink: Boolean = true;
  class: String = '';
}

export class TableItem {
  obj: any = {};
  button1: TableButton = new TableButton();
  button2: TableButton = new TableButton();
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() items: Array<TableItem>;
  @Output() buttonEvent: EventEmitter<TableButton> = new EventEmitter();
  headers: Array<String> = [];
  button1Active: Boolean = false;
  button2Active: Boolean = false;

  constructor() { }

  emit(button) {
    this.buttonEvent.emit(button);
  }

  ngOnChanges(changes) {
    if (changes.items) {
      this.items = changes.items.currentValue;
      this._loadTable();
    }
  }

  ngOnInit() {
    this._loadTable();
  }

  private _loadTable() {
    this.items.forEach((item) => {

      if (item.button1) {
        this.button1Active = true;
      }

      if (item.button2) {
        this.button2Active = true;
      }

      Object.keys(item.obj).forEach((key) => {
        let found = false;
        this.headers.forEach((header) => {
          if (header === key) {
            found = true;
          }
        });
        if (!found && key !== 'button1' && key !== 'button2') {
          this.headers.push(key);
        }
      });
    });
  }
}
