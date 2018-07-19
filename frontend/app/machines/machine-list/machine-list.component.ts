import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../services/machine.service';


@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {

  machines: Array<Object>;

  constructor(private machineService: MachineService) {
  }

  ngOnInit() {
    this.machines = this.machineService.getAllPrinters();
  }
}
