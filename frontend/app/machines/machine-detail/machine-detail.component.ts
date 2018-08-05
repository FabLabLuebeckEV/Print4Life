import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { ConfigService } from '../../config/config.service';
import { routes } from '../../config/routes';

@Component({
  selector: 'app-machine-detail',
  templateUrl: './machine-detail.component.html',
  styleUrls: ['./machine-detail.component.css']
})
export class MachineDetailComponent implements OnInit {
  private config: any;
  backArrow: any;
  backLink: String;
  objectKeys = Object.keys;
  machine: any;
  machineProps: Object = {
    title: 'Maschine Data',
    props: []
  };
  machineSubObjects: Array<Object> = [];
  machineSubArrays: Array<Object> = [];
  loading: Boolean = true;

  constructor(private route: ActivatedRoute, private machineService: MachineService,
    private fablabService: FablabService,
    private configService: ConfigService) {
    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
    this.backLink = `/${routes.paths.machines.root}`;
    this.route.params.subscribe(params => {
      const type = params.type.substr(0, params.type.length - 1);
      this.machineService.get(type, params.id).then((result) => {
        this.machine = result[type];
        this.fablabService.getFablab(this.machine.fablabId).then((result) => {
          this.machine.fablab = result.fablab;
          this._splitMachineProps();
        });
      });
    });
  }

  ngOnInit() {
  }

  private _splitMachineProps() {
    const machineProps = Object.keys(this.machine).filter((key) => {
      return key !== '_id' && key !== 'fablabId' && key !== '__v';
    });
    machineProps.forEach((key, idx) => {
      const prop: any = this.machine[`${key}`];
      if (prop instanceof Object && !Array.isArray(prop)) {
        this.machineSubObjects.push({ title: this.machineService._uncamelCase(key), obj: this._cleanPropObject(prop) });
        machineProps.splice(idx, 1);
      } else if (prop instanceof Object && Array.isArray(prop)) {
        this.machineSubArrays.push({ title: this.machineService._uncamelCase(key), array: this._cleanPropObject(prop) });
        machineProps.splice(idx, 1);
      } else {
        this.machineProps['props'].push({ key, label: this.machineService._uncamelCase(key) });
      }
    });
    this.loading = false;
  }

  private _cleanPropObject(prop: any): Object {
    const newObj = {};
    if (prop instanceof Object && !Array.isArray(prop)) {
      const tmp = Object.keys(prop).filter((e) => e !== '_id' && e !== '__v');
      tmp.forEach((k) => {
        newObj[this.machineService._uncamelCase(k)] = prop[k];
      });
    } else if (Array.isArray(prop)) {
      const arr = [];
      prop.forEach((elem) => {
        arr.push(this._cleanPropObject(elem));
      });
      return arr;
    }
    return newObj;
  }


}
