import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { TableItem } from '../../components/table/table.component';
import { faWrench, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {

  machines: Array<Array<Object>> = [];
  objectKeys: Array<String>;

  constructor(private machineService: MachineService, private fablabService: FablabService) {
  }

  ngOnInit() {
    this.init();
  }

  async init() {
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
        item.button1.href = 'machine/edit/' + elem._id;
        item.button1.routerLink = true;
        item.button1.class = 'btn btn-primary spacing';
        item.button1.icon = faWrench;
        item.button2.label = 'Delete';
        item.button2.href = 'machine/delete/' + elem._id;
        item.button2.routerLink = true;
        item.button2.class = 'btn btn-danger spacing';
        item.button2.icon = faTrashAlt;
        arr.push(item);
      }
      this.machines = this.machines.concat(arr);
    }
    this.objectKeys = Object.keys(this.machines);
  }
}
