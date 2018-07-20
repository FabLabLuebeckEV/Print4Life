import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { CardItem } from '../../components/card/card.component';


@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {

  machines: Array<Array<Object>> = [];
  cardItems: Array<CardItem>;
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
        const cardItem = new CardItem();
        cardItem.id = elem._id;
        cardItem.title = elem.deviceName;
        cardItem.subtitle = elem.manufacturer;
        cardItem.subsubtitle = fablab.name;
        cardItem.editHref = 'machine/edit/' + cardItem.id;
        cardItem.deleteHref = 'machine/delete/' + cardItem.id;
        arr.push(cardItem);
      }
      this.machines[type] = arr;
    }
    this.objectKeys = Object.keys(this.machines);
  }
}
