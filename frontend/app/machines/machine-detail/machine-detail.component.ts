import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';

@Component({
  selector: 'app-machine-detail',
  templateUrl: './machine-detail.component.html',
  styleUrls: ['./machine-detail.component.css']
})
export class MachineDetailComponent implements OnInit {
  objectKeys = Object.keys;
  machine: any;
  machineProps: Object = {
    title: 'Maschine Data',
    props: []
  };
  machineSubObjects: Array<Object> = [];
  machineSubArrays: Array<Object> = [];
  loading: Boolean = true;

  // TODO: Code aufräumen und rekursive Funktion für umbennen von keys schreiben?

  constructor(private route: ActivatedRoute, private machineService: MachineService,
  private fablabService: FablabService) {
    this.route.params.subscribe(params => {
      const type = params.type.substr(0, params.type.length - 1);
      this.machineService.get(type, params.id).then((result) => {
        this.machine = result[type];
        this.fablabService.getFablab(this.machine.fablabId).then((result) => {
          this.machine.fablab = result.fablab;
          const machineProps = Object.keys(this.machine).filter((key) => {
            return key !== '_id' && key !== 'fablabId' && key !== '__v';
          });
          machineProps.forEach((key, idx) => {
            let prop: any = this.machine[`${key}`];
            if (prop instanceof Object && !Array.isArray(prop)) {
              const tmp = Object.keys(prop).filter((e) => e !== '_id' && e !== '__v');
              const newObj = {};
              tmp.forEach((k) => {
                newObj[this._uncamelCase(k)] = prop[k];
              });
              this.machineSubObjects.push({title: this._uncamelCase(key), obj: newObj});
              machineProps.splice(idx, 1);
            } else if (prop instanceof Object && Array.isArray(prop)) {
              const arr = [];
              prop.forEach((elem) => {
                if (elem instanceof Object) {
                  const newObj = {};
                  const tmp = Object.keys(elem).filter((key) => key !== '_id' && key !== '__v');
                  tmp.forEach((k) => {
                    newObj[this._uncamelCase(k)] = elem[k];
                  });
                  arr.push(newObj);
                }
              });
              prop = prop.concat(prop);
              this.machineSubArrays.push({title: this._uncamelCase(key), array: arr});
              machineProps.splice(idx, 1);
            } else {
              this.machineProps['props'].push({key, label: this._uncamelCase(key)});
            }
          });
          this.loading = false;
        });
      });
    });
  }

  ngOnInit() {
  }

  private _uncamelCase(str: String) {
    const firstLetter = str.charAt(0);
    if (firstLetter.match(/[a-z]/)) {
      const split = str.split(/(?=[A-Z])/);
      let newStr = split[0].charAt(0).toUpperCase() + split[0].slice(1) + ' ';
      for (let i = 1; i < split.length; i++) {
        split[i].length > 1 ? newStr += split[i] + ' ' : newStr += split[i];
      }
      return newStr.trim();
    }
  }
}
