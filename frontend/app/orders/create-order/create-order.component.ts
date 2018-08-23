import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { Machine, Material, Lasertype } from '../../models/machines.model';

import { Order, Comment, SimpleMachine } from '../../models/order.model';
import { ConfigService } from '../../config/config.service';
import { routes } from '../../config/routes';


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  config: any;
  publicIcon: any;
  publicHint: String = 'This will be visible for you and the world.';
  backArrow: any;
  selectedType: String;
  editView: Boolean = false;
  routeChanged: Boolean;

  sMachine: SimpleMachine = new SimpleMachine(undefined, undefined);
  order: Order = new Order(undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.sMachine, undefined);
  orderId: String;
  comment: Comment = new Comment(undefined, undefined, undefined);

  loadingMachineTypes: Boolean;
  machineTypes: Array<String> = [];

  loadingMachinesForType: Boolean;
  machines: Array<Machine> = [];

  loadingStatus: Boolean;
  validStatus: Array<String> = [];

  loadingLaserTypes = true;
  laserTypesArr: Array<Lasertype> = [];

  loadingMaterials: Boolean;
  materialsArr: Array<Material>;

  loadingFablabs: Boolean;
  fablabs: Array<any>;

  constructor(
    private machineService: MachineService,
    private fablabService: FablabService,
    private router: Router,
    private location: Location,
    private orderService: OrderService,
    private modalService: NgbModal,
    private configService: ConfigService) {
    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
    this.publicIcon = this.config.icons.public;
    this.router.events.subscribe(() => {
      const route = this.location.path();
      this.editView = route.indexOf(`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}`) >= 0;
      if (this.editView) {
        const routeArr = route.split('/');
        this.orderId = routeArr[routeArr.length - 1];
      }
    });
  }

  public back() {
    this.location.back();
  }

  private _openSuccessMsg() {
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    this._openMsgModal('Order successfully created', 'modal-header header-success',
      this.editView ? 'Order successfully updated!' : 'Order successfully created!', okButton, undefined).result.then((result) => {
        this.back();
      });
  }

  private _openMsgModal(title: String, titleClass: String, msg: String, button1: ModalButton, button2: ModalButton) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.titleClass = titleClass;
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
    return modalRef;
  }

  async machineTypeChanged(type) {
    let machineObj;
    this.loadingMachinesForType = true;
    this.order.machine._id = '';
    this.order.machine['detailView'] = '';
    this.order.machine['deviceName'] = '';
    machineObj = await this.machineService.getAll(type, undefined, undefined);
    machineObj = (machineObj && machineObj[`${this.machineService.camelCaseTypes(type)}s`]) ?
    machineObj[`${this.machineService.camelCaseTypes(type)}s`] : undefined;
    for (let i = 0; i < machineObj.length; i++) {
      const resFab = await this.fablabService.getFablab(machineObj[i].fablabId);
      const fablab = resFab.fablab;
      machineObj[i].fablab = fablab;
      machineObj[i].fablabName = fablab.name;
    }
    this.machines = machineObj;

    this.loadingMachinesForType = false;
  }

  ngOnInit() {
    this._loadMachineTypes();
    this._loadFablabs();
    this._loadStatus();
    this._initializeOrder(this.orderId);
  }

  onSubmitComment() {
    const errorMsg = `Something went wrong while adding the new comment.`;
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    this.orderService.createComment(this.orderId, this.comment).then((result) => {
      if (result) {
        this._openMsgModal('Comment successfully added', 'modal-header header-success',
          'Your comment was added and saved!', okButton, undefined).result.then((result) => {
            this.orderService.getOrderById(this.orderId).then((result) => {
              this.order = result.order;
            });
            this.router.navigate([`/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}/${this.orderId}`]);
          });
      }
    }).catch(() => {
      this._openMsgModal('Error', 'modal-header header-danger', errorMsg,
        okButton, undefined);
    });
  }

  onSubmit() {
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    let found = false;
    let orderCopy;
    if (this.comment.author && this.comment.content) {
      if (!this.order.comments) {
        this.order.comments = [];
      }
      this.order.comments.forEach((comment) => {
        if (this.comment.author === comment.author && this.comment.content === comment.content) {
          found = true;
        }
      });
      if (!found) {
        this.order.comments.push(this.comment);
      }
    }
    orderCopy = JSON.parse(JSON.stringify(this.order));
    orderCopy.machine.type = this.machineService.camelCaseTypes(orderCopy.machine.type);
    if (this.editView) {
      const errorMsg = 'Error while trying to update!';
      this.orderService.updateOrder(orderCopy).then((result) => {
        if (result) {
          this._openSuccessMsg();
        } else {
          this._openMsgModal('Error', 'modal-header header-danger', errorMsg, okButton, undefined);
        }
      }).catch(() => {
        this._openMsgModal('Error', 'modal-header header-danger', errorMsg, okButton, undefined);
      });
    } else {
      const errorMsg = 'Error while trying to create!';
      this.orderService.createOrder(orderCopy).then((result) => {
        if (result) {
          this._openSuccessMsg();
        } else {
          this._openMsgModal('Error', 'modal-header header-danger', errorMsg, okButton, undefined);
        }
      }).catch(() => {
        this._openMsgModal('Error', 'modal-header header-danger', errorMsg, okButton, undefined);
      });
    }
  }

  machineSelected() {
    this.machines.forEach(element => {
      if (element._id === this.order.machine._id) {
        this.order.machine['deviceName'] = element.deviceName;
        this.order.machine._id = element._id;
      }
    });
    const type = this.machineService.camelCaseTypes(this.order.machine.type);
    this.order.machine['detailView'] = `/${routes.paths.frontend.machines.root}/${type}s/${this.order.machine._id}/`;
  }

  private async _initializeOrder(id) {
    if (id !== undefined) {
      this.order = (await this.orderService.getOrderById(id)).order;
      this.order.machine.type = this.machineService.uncamelCase(this.order.machine.type);
      const machineId = this.order.machine._id;
      await this.machineTypeChanged(this.order.machine.type);
      this.order.machine._id = machineId;
      this.machineSelected();
      if (this.order === undefined) {
        console.log('ERROR');
      }
    }
  }

  private async _loadStatus() {
    this.loadingStatus = true;
    this.validStatus = (await this.orderService.getStatus()).status;
    this.loadingStatus = false;
  }

  private async _loadMachineTypes() {
    this.loadingMachineTypes = true;
    this.machineTypes = (await this.machineService.getAllMachineTypes()).types;
    this.loadingMachineTypes = false;
  }

  private async _loadFablabs() {
    this.loadingFablabs = true;
    this.fablabs = (await this.fablabService.getFablabs()).fablabs;
    this.loadingFablabs = false;
  }
}
