import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { TableItem } from '../../components/table/table.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { ConfigService } from '../../config/config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { routes } from '../../config/routes';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {
  private config: any;
  machineTypes: Array<String> = [];
  displayedMachines: Array<TableItem> = [];
  selectedMachineTypes: Array<String>;
  listView: Boolean;
  loadingMachineTypes: Boolean;
  plusIcon: any;
  newLink: String;
  spinnerConfig: Object = {};

  constructor(private machineService: MachineService,
    private fablabService: FablabService, private router: Router,
    private location: Location, private modalService: NgbModal,
    private spinner: NgxSpinnerService, private configService: ConfigService) {
    this.config = this.configService.getConfig();
    this.plusIcon = this.config.icons.add;
    this.spinnerConfig = { 'loadingText': 'Loading Machines', ...this.config.spinnerConfig };
    this.newLink = `./${routes.paths.machines.create}`;
    router.events.subscribe(() => {
      const route = location.path();
      if (!this.listView && route === `/${config.paths.machines.root}`) {
        this.listView = true;
        this.ngOnInit();
      } else if (route !== `/${config.paths.machines.root}`) {
        this.listView = false;
      }
    });
  }

  async ngOnInit() {
    if (this.listView) {
      await this._loadMachineTypes();
      this.selectedMachineTypes = this.machineTypes;
      this._init();
    }
  }

  async filterHandler(event) {
    this.selectedMachineTypes = event;
    this.displayedMachines = await this._loadMachinesByTypes(this.selectedMachineTypes);
  }

  eventHandler(event) {
    if (event.label === 'Delete') {
      let machine: TableItem;
      let machineIdx: number;
      this.displayedMachines.forEach((item, idx) => {
        if (event === item.button1 || event === item.button2) {
          machine = item;
          machineIdx = idx;
        }
      });
      const deleteButton = new ModalButton('Yes', 'btn btn-danger', 'Delete');
      const abortButton = new ModalButton('No', 'btn btn-secondary', 'Abort');
      const modalRef = this._openMsgModal('Do you really want to delete this machine?',
        'modal-header header-danger', `Are you sure you want to delete ${machine.obj['Device Name'].label} ?`, deleteButton, abortButton);
      modalRef.result.then((result) => {
        if (result === deleteButton.returnValue) {
          this.machineService.deleteMachine(machine.obj['Device Type'].label, machine.obj.id.label).then((result) => {
            this.displayedMachines.splice(machineIdx, 1);
          });
        }
      });
    }
  }

  private async _loadMachineTypes() {
    this.loadingMachineTypes = true;
    this.machineTypes = (await this.machineService.getAllMachineTypes()).types;
    this.loadingMachineTypes = false;
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


  private async _init() {
    const arr = await this._loadMachinesByTypes(this.machineTypes);
    this.displayedMachines = JSON.parse(JSON.stringify(arr));
  }

  private async _loadMachinesByTypes(machineTypes: Array<String>) {
    this.spinner.show();
    const machines = [];
    const arr = [];

    for (let i = 0; i < machineTypes.length; i++) {
      machineTypes[i] = this.machineService.camelCaseTypes(machineTypes[i]);
    }

    for (const type of machineTypes) {
      const resMach = await this.machineService.getAll(type);
      machines.push(resMach[`${type}s`]);
    }

    for (const type of Object.keys(machines)) {
      for (const elem of machines[type]) {
        const resFab = await this.fablabService.getFablab(elem.fablabId);
        const fablab = resFab.fablab;
        elem.fablab = fablab;
        const item = new TableItem();
        item.obj['id'] = { label: elem._id };
        item.obj['Device Type'] = { label: elem.type };
        item.obj['Device Name'] = { label: elem.deviceName, href: `./${elem.type}s/${elem._id}` };
        item.obj['Manufacturer'] = { label: elem.manufacturer };
        item.obj['Fablab'] = { label: fablab.name };
        item.obj['Description'] = { label: '' };
        item.button1.label = 'Update';
        item.button1.href = `./${routes.paths.machines.update}/${elem._id}`;
        item.button1.class = 'btn btn-primary spacing';
        item.button1.icon = this.config.icons.edit;
        item.button2.label = 'Delete';
        item.button2.eventEmitter = true;
        item.button2.class = 'btn btn-danger spacing';
        item.button2.icon = this.config.icons.delete;
        arr.push(item);
      }
    }
    this.spinner.hide();
    return arr;
  }
}
