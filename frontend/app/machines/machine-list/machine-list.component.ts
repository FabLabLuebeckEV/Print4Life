import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { TableItem } from '../../components/table/table.component';
import { faWrench, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { config } from '../../config/config';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {

  machines: Array<TableItem> = [];
  listView: Boolean;
  plusIcon = faPlus;
  newLink: String = `./${config.paths.machines.create}`;

  constructor(private machineService: MachineService,
    private fablabService: FablabService, private router: Router,
    private location: Location, private modalService: NgbModal) {
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
    if (event.label === 'Delete') {
      let machine: TableItem;
      this.machines.forEach((item) => {
        if (event === item.button1 || event === item.button2) {
          machine = item;
        }
      });
      const deleteButton = new ModalButton('Yes', 'btn btn-danger', 'Delete');
      const abortButton = new ModalButton('No', 'btn btn-secondary', 'Abort');
      const modalRef = this._openMsgModal('Do you really want to delete this machine?',
        'modal-header header-danger', 'Are you sure you want to delete the machine?', deleteButton, abortButton);
      modalRef.result.then((result) => {
        if (result === deleteButton.returnValue) {
          this.machineService.deleteMachine(machine.obj['Device Type'], machine.obj.id);
        }
      });
    }
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
    const resMach = await this.machineService.getAllMachines();
    const machines = resMach.machines;
    for (const type of Object.keys(machines)) {
      const arr = [];
      for (const elem of machines[type]) {
        const resFab = await this.fablabService.getFablab(elem.fablabId);
        const fablab = resFab.fablab;
        const item = new TableItem();
        item.obj['id'] = elem._id;
        item.obj['Device Type'] = elem.type;
        item.obj['Device Name'] = elem.deviceName;
        item.obj['Manufacturer'] = elem.manufacturer;
        item.obj['Fablab'] = fablab.name;
        item.obj['Description'] = '';
        item.button1.label = 'Update';
        item.button1.href = `./${config.paths.machines.update}/${elem._id}`;
        item.button1.class = 'btn btn-primary spacing';
        item.button1.icon = faWrench;
        item.button2.label = 'Delete';
        item.button2.eventEmitter = true;
        item.button2.class = 'btn btn-danger spacing';
        item.button2.icon = faTrashAlt;
        arr.push(item);
      }
      this.machines = this.machines.concat(arr);
    }
  }
}
