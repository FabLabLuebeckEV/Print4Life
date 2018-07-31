import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { TableItem } from '../../components/table/table.component';
import { faWrench, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {

  machines: Array<Array<Object>> = [];
  objectKeys: Array<String>;
  listView: Boolean;
  plusIcon = faPlus;

  constructor(private machineService: MachineService,
    private fablabService: FablabService, private router: Router,
    private location: Location) {
    router.events.subscribe(() => {
      const route = location.path();
      if (route === '/machines') {
        this.listView = true;
      } else {
        this.listView = false;
      }
    });
  }

  ngOnInit() {
    if (this.listView) {
      this._init();
    }
  }

  eventHandler(event) {
    console.log(event);
  }

  private async _init() {
    const resMach = await this.machineService.getAllMachines();
    const machines = resMach.machines;
    for (const type of Object.keys(machines)) {
      const arr = [];
      for (const elem of machines[type]) {
        const resFab = await this.fablabService.getFablab(elem.fablabId);
        const fablab = resFab.fablab;
        const item = new TableItem();
        item.obj['Device Type'] = elem.type;
        item.obj['Device Name'] = elem.deviceName;
        item.obj['Manufacturer'] = elem.manufacturer;
        item.obj['Fablab'] = fablab.name;
        item.obj['Description'] = '';
        item.button1.label = 'Edit';
        item.button1.href = './edit/' + elem._id;
        item.button1.class = 'btn btn-primary spacing';
        item.button1.icon = faWrench;
        item.button2.label = 'Delete';
        item.button2.href = './delete/' + elem._id;
        item.button2.eventEmitter = true;
        item.button2.class = 'btn btn-danger spacing';
        item.button2.icon = faTrashAlt;
        arr.push(item);
      }
      this.machines = this.machines.concat(arr);
    }
    this.objectKeys = Object.keys(this.machines);
  }
}
