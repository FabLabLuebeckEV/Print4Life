import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import {
  Material
} from '../../models/machines.model';

import { Order } from '../../models/order.model';
import { ConfigService } from '../../config/config.service';
import { routes } from '../../config/routes';


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  config: any;
  backLink: String;
  backArrow: any;
  machineTypes: Array<String> = [];
  selectedType: String;
  editView: Boolean = false;
  routeChanged: Boolean;
  submitted: Boolean = false;
  order: Order = new Order(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  fablabs: Array<any>;
  materialsArr: Array<Material>;
  loadingFablabs: Boolean;
  loadingMaterials: Boolean;
  loadingStatus: Boolean;
  validStatus: Array<String> = [];
  orderId: String;

  constructor(
    private machineService: MachineService,
    private fablabService: FablabService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private modalService: NgbModal,
    private configService: ConfigService) {
    this.config = this.configService.getConfig();
    this.backArrow = this.config.icons.back;
    this.backLink = `/${routes.paths.frontend.orders.root}`;
    this.router.events.subscribe(() => {
      const route = location.path();
      this.editView = route.indexOf(`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}`) >= 0;
      if (this.editView) {
        const routeArr = route.split('/');
        this.orderId = routeArr[routeArr.length - 1];
      }
    });
  }

  private _openSuccessMsg() {
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    this._openMsgModal('Order successfully created', 'modal-header header-success',
    this.editView ? 'Order successfully updated!' : 'Order successfully created!', okButton, undefined).result.then((result) => {
        this.router.navigate([`/${routes.paths.frontend.orders.root}`]);
      });
  }

  private _openErrMsg(err) {
    let errorMsg = `Something went wrong while creating the new order.`;
    if (err) {
      errorMsg += ` Error: ${JSON.stringify(err, null, 2)}`;
    }
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');
    this._openMsgModal('Error', 'modal-header header-danger', errorMsg,
      okButton, undefined);
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

  ngOnInit() {
    this._initializeOrder(this.orderId);

    this._loadMachineTypes();
    this.loadingFablabs = true;
    this._loadFablabs();
    this.loadingStatus = true;
    this._loadStatus();
  }

  onSubmit() {
    if (this.editView) {
      this.orderService.updateOrder(this.order).then((result) => {
        if (result) {
          this._openSuccessMsg();
          this.submitted = true;
        } else {
          this._openErrMsg(undefined);
        }
      }).catch((err) => {
        this._openErrMsg(err);
      });
    } else {
      this.orderService.createOrder(this.order).then((result) => {
        if (result) {
          this._openSuccessMsg();
          this.submitted = true;
        } else {
          this._openErrMsg(undefined);
        }
      }).catch((err) => {
        this._openErrMsg(err);
      });
    }
  }

  private async _initializeOrder(id) {
    if (id !== undefined) {
      this.order = (await this.orderService.getOrderById(id)).order;
      if (this.order === undefined) {
        console.log('ERROR');
      }
    }
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
