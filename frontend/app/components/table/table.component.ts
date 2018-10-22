import { Component, OnInit, Input, Output, EventEmitter, KeyValueDiffers, DoCheck } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class TableButton {
  icon: any = undefined;
  label: String = '';
  href: String = '';
  eventEmitter: Boolean = false;
  routerLink: Boolean = true;
  class: String = '';
  refId: String = '';
}

export class TableItem {
  obj: any = {
    label: String,
    href: String
  };
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
  visibleItems: Array<TableItem>;
  headers: Array<String> = [];
  button1Active: Boolean = false;
  button2Active: Boolean = false;
  differ: any;
  objDiffer: any;

  constructor(private differs: KeyValueDiffers, private translateService: TranslateService) {
    this.differ = differs.find([]).create();
  }

  emit(button) {
    this.buttonEvent.emit(button);
  }

  ngDoCheck() {
    let changes = false;
    if (this.items) {
      if (!this.objDiffer && this.items.length > 0) {
        this.objDiffer = {};
        this.items.forEach((elt, idx) => {
          this.objDiffer[idx] = this.differs.find(elt).create();
        });
      }
      this.items.forEach((elt, idx) => {
        const objDiffer = this.objDiffer[idx];
        if (objDiffer) {
          const objChanges = objDiffer.diff(elt);
          if (objChanges) {
            changes = true;
          }
        }
      });
      if (changes) {
        this._loadTable();
      }
    } else {
      this.items = [];
      this.visibleItems = [];
    }
  }

  ngOnInit() {
    this._loadTable();
  }

  private _loadTable() {
    if (this.items) {
      this._translate();
      this.headers = [];
      this.visibleItems.forEach((item) => {

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
    } else {
      this.items = [];
      this.visibleItems = [];
    }
  }

  private _translate() {
    this.visibleItems = [];
    this.translateService.get(['tableComponent', 'deviceTypes', 'status', 'roles']).subscribe((translations => {
      this.items.forEach((item) => {
        const itemCopy = JSON.parse(JSON.stringify(item));
        const visibleItem = new TableItem();
        visibleItem.button1 = itemCopy.button1;
        visibleItem.button2 = itemCopy.button2;
        visibleItem.obj = {};
        Object.keys(item.obj).forEach((key) => {
          const translatedKey = translations['tableComponent'][`${key}`];
          if (translatedKey) {
            if (key === 'Device Type') {
              const translatedType = translations['deviceTypes'][`${itemCopy.obj[`${key}`].label}`];
              visibleItem.obj[`${translatedKey}`] = itemCopy.obj[`${key}`];
              visibleItem.obj[`${translatedKey}`].label = translatedType;
            } else if (key === 'Status') {
              const translatedType = translations['status'][`${itemCopy.obj[`${key}`].label}`];
              visibleItem.obj[`${translatedKey}`] = itemCopy.obj[`${key}`];
              visibleItem.obj[`${translatedKey}`].label = translatedType;
            } else if (key === 'Role') {
              const translatedType = translations['roles'][`${itemCopy.obj[`${key}`].label}`];
              visibleItem.obj[`${translatedKey}`] = itemCopy.obj[`${key}`];
              visibleItem.obj[`${translatedKey}`].label = translatedType;
            } else {
              visibleItem.obj[`${translatedKey}`] = itemCopy.obj[`${key}`];
            }
          }
        });
        this.visibleItems.push(visibleItem);
      });
    }));
  }
}
