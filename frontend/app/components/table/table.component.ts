import { Component, OnInit, Input, OnChanges } from '@angular/core';

export class TableItem {
  obj: any = {};
  button1: any = {
    label: String,
    href: String,
    routerLink: Boolean,
    class: String
  };
  button2: any = {
    label: String,
    href: String,
    routerLink: Boolean,
    class: String
  };
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() items: Array<any>;
  headers: Array<String> = [];
  button1Active: Boolean = false;
  button2Active: Boolean = false;

  constructor() { }

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
        if (key === 'button1') {
          this.button1Active = true;
        }
        if (key === 'button2') {
          this.button2Active = true;
        }
      });
    });
  }
}
