import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { Machine, Printer, MillingMachine, OtherMachine, Lasercutter, Material, Lasertype } from '../../models/machines.model';

@Component({
  selector: 'app-machine-form',
  templateUrl: './machine-form.component.html',
  styleUrls: ['./machine-form.component.css']
})
export class MachineFormComponent implements OnInit {
  machineTypes: Array<String> = [];
  selectedType: String;
  editView: Boolean;
  routeChanged: Boolean;
  submitted: Boolean = false;
  model: Machine;
  fablabs: Array<any>;
  materialsArr: Array<Material>;
  laserTypesArr: Array<Lasertype>;
  loadingFablabs: Boolean;
  loadingMaterials: Boolean;
  loadingLaserTypes: Boolean;

  constructor(private machineService: MachineService, private fablabService: FablabService,
    private router: Router, private location: Location, private route: ActivatedRoute) {
    this.route.params.subscribe(params => console.log(params));
    router.events.subscribe(() => {
      const route = location.path();
      this.routeChanged = false;
      if (route.startsWith('/machines/edit') && !this.editView) {
        this.routeChanged = true;
        this.editView = true;
      } else {
        if (this.editView) {
          this.routeChanged = true;
        }
        this.editView = false;
      }
      this._loadMachineTypes();
    });
  }

  ngOnInit() {
    this._selectType('');
    this.loadingFablabs = true;
    this._loadFablabs();
    this._loadMaterials(this.selectedType);
    this._loadLaserTypes();
  }

  onSubmit() {
    this.machineService.create(this._camelCaseTypes(this.selectedType), this.model).then((result) => {
      console.log(result);
      this.submitted = true;
    }).catch((err) => {
      console.log(err);
    });
  }

  private async _loadLaserTypes() {
    this.loadingLaserTypes = true;
    this.laserTypesArr = (await this.machineService.getLaserTypes()).laserTypes;
    this.loadingLaserTypes = false;
  }

  private _selectType(type) {
    this.selectedType = type;
    this.model = this._initModel(this.selectedType);
    this.loadingMaterials = true;
    this._loadMaterials(this.selectedType);
  }

  private async _loadMachineTypes() {
    this.machineTypes = (await this.machineService.getAllMachineTypes()).types;
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

  private _initModel(type) {
    switch (type) {
      case 'Printer':
        return new Printer(undefined, undefined, undefined,
          this._camelCaseTypes(type), undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined);
      case 'Milling Machine':
        return new MillingMachine(undefined, undefined, undefined, this._camelCaseTypes(type),
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined);
      case 'Other Machine':
        return new OtherMachine(undefined, undefined, undefined, this._camelCaseTypes(type),
          undefined, undefined, undefined, undefined);
      case 'Lasercutter':
        return new Lasercutter(undefined, undefined, undefined, this._camelCaseTypes(type),
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined);
      default:
        return new Machine(undefined, undefined, undefined, this._camelCaseTypes(type), undefined);
    }
  }

}
