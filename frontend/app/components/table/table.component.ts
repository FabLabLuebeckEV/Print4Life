import { Component, OnInit, Input, Output, EventEmitter, KeyValueDiffers, DoCheck } from '@angular/core';

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
export class TableComponent implements OnInit, DoCheck {
  @Input() items: Array<TableItem>;
  @Output() buttonEvent: EventEmitter<TableButton> = new EventEmitter();
  headers: Array<String> = [];
  button1Active: Boolean = false;
  button2Active: Boolean = false;
  differ: any;
  objDiffer: any;

  constructor(private differs: KeyValueDiffers) {
    this.differ = differs.find([]).create();
   }

  emit(button) {
    this.buttonEvent.emit(button);
  }

  ngDoCheck () {
    if (!this.objDiffer && this.items.length > 0) {
      this.objDiffer = {};
      this.items.forEach((elt, idx) => {
        this.objDiffer[idx] = this.differs.find(elt).create();
      });
      this._loadTable();
    }
    this.items.forEach((elt, idx) => {
      const objDiffer = this.objDiffer[idx];
      if (objDiffer) {
        const objChanges = objDiffer.diff(elt);
        // if (objChanges) {
        //   objChanges.forEachChangedItem((elt) => {
        //     console.log(elt);
        //   });
        // }
      }
    });
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
        if (!found && key !== 'id') {
          this.headers.push(key);
        }
      });
    });
  }
}
