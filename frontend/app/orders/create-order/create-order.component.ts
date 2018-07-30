import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import {
  Machine,
  Printer,
  MillingMachine,
  OtherMachine,
  Lasercutter,
  Material
} from '../../models/machines.model';

import { Order } from '../../models/order.model';


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

  machineTypes: Array<String> = [];
  selectedType: String;
  editView: Boolean;
  routeChanged: Boolean;
  submitted: Boolean = false;
  order: Order;
  fablabs: Array<any>;
  materialsArr: Array<Material>;
  loadingFablabs: Boolean;
  loadingMaterials: Boolean;
  loadingStatus: Boolean;
  validStatus: Array<String> = [];

  constructor(
    private machineService: MachineService,
    private fablabService: FablabService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private orderService: OrderService) {

    router.events.subscribe(() => {
      const route = location.path();
      this.editView = route.endsWith('edit');
    });
  }

  ngOnInit() {
    this._loadMachineTypes();
    this.loadingFablabs = true;
    this._loadFablabs();
    this.loadingStatus = true;
    this._loadStatus();
    this.order = new Order(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    // this._loadMaterials(this.selectedType);
  }

  onSubmit() {
    this.orderService.createOrder(this.order).then((result) => {
      console.log(result);
      this.submitted = true;
    }).catch((err) => {
      console.log(err);
    });
  }

  private async _loadMachineTypes() {
    this.machineTypes = (await this.machineService.getAllMachineTypes()).types;
  }

  private async _loadStatus() {
    this.validStatus = (await this.orderService.getStatus()).status;
    this.loadingStatus = false;
  }

  private async _loadFablabs() {
    this.fablabs = (await this.fablabService.getFablabs()).fablabs;
    this.loadingFablabs = false;
  }

  private async _loadMaterials(type) {
    if (type && type !== '') {
      this.materialsArr = (await this.machineService.getMaterialsByMachineType(this._camelCaseTypes(type))).materials;
      this.loadingMaterials = false;
    }
  }

  private _camelCaseTypes(type): String {
    const split = type.split(' ');
    split[0] = split[0].toLowerCase();
    let machine = '';
    for (let i = 0; i < split.length; i += 1) {
      machine += split[i];
    }
    return machine.trim();
  }
}
