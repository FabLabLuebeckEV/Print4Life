import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { ConfigService } from '../../config/config.service';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { routes } from '../../config/routes';

@Component({
  selector: 'app-machine-detail',
  templateUrl: './machine-detail.component.html',
  styleUrls: ['./machine-detail.component.css']
})
export class MachineDetailComponent implements OnInit {
  private config: any;
  backArrow: any;
  editLink: String;
  deleteLink: String;
  editIcon: any;
  deleteIcon: any;
  objectKeys = Object.keys;
  machine: any;
  machineProps: Object = {
    title: 'Machine Data',
    props: []
  };
  machineSubObjects: Array<Object> = [];
  machineSubArrays: Array<Object> = [];
  loading: Boolean = true;

  constructor(
    private route: ActivatedRoute,
    private machineService: MachineService,
    private fablabService: FablabService,
    private configService: ConfigService,
    private location: Location,
    private modalService: NgbModal) {

    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
    this.editIcon = this.config.icons.edit;
    this.deleteIcon = this.config.icons.delete;
    this.route.params.subscribe(params => {
      if (params.type && params.id) {
        const type = params.type.substr(0, params.type.length - 1);
        this.machineService.get(type, params.id).then((result) => {
          this.machine = result[type];
          this.fablabService.getFablab(this.machine.fablabId).then((result) => {
            this.machine.fablab = result.fablab;
            this.editLink = `/${routes.paths.frontend.machines.root}/${routes.paths.frontend.machines.update}/` +
            `${this.machine.type}s/${this.machine._id}`;
            this._splitMachineProps();
          });
        });
      }
    });
  }

  public back() {
    this.location.back();
  }

  public delete() {
    const deleteButton = new ModalButton('Yes', 'btn btn-danger', 'Delete');
    const abortButton = new ModalButton('No', 'btn btn-secondary', 'Abort');
    const modalRef = this._openMsgModal('Do you really want to delete this machine?',
      'modal-header header-danger', `Are you sure you want to delete ${this.machine.deviceName} ?`, deleteButton, abortButton);
    modalRef.result.then((result) => {
      if (result === deleteButton.returnValue) {
        this.machineService.deleteMachine(this.machine.type, this.machine._id).then(() => {
          this.back();
        });
      }
    });
  }

  private _openMsgModal(title: String, titleClass: String, msg: String, button1: ModalButton, button2: ModalButton) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.title = title;
    if (titleClass) {
      modalRef.componentInstance.titleClass = titleClass;
    }
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
    return modalRef;
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
        newObj[`${this.machineService._uncamelCase(k)}`] = prop[k];
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
