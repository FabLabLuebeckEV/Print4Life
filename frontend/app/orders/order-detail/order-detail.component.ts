import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { routes } from '../../config/routes';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { GenericService } from '../../services/generic.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  private config: any;
  editIcon: any;
  deleteIcon: any;
  editLink: String;

  order: Order = new Order(
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    undefined
  );
  machine: any;
  fablab: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private machineService: MachineService,
    private fablabService: FablabService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private genericService: GenericService
  ) {
    this.config = this.configService.getConfig();
    this.editIcon = this.config.icons.edit;
    this.deleteIcon = this.config.icons.delete;
    this.route.params.subscribe(params => {
      if (params.id) {
        this.orderService.getOrderById(params.id).then((result) => {
          this.order = result.order;
          this.editLink = `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}/${this.order._id}/`;
          this.machineService.get(this.order.machine.type, this.order.machine._id).then(result => {
            const type = this.machineService.camelCaseTypes(this.order.machine.type);
            this.machine = result[`${type}`];
            this.machine['detailView'] = `/${routes.paths.frontend.machines.root}/${type}s/${this.machine._id}/`;
            this.fablabService.getFablab(this.machine.fablabId).then(result => {
              this.fablab = result.fablab;
            });
          });
        });
      }
    });
  }

  ngOnInit() {
  }

  public delete() {
    const deleteButton = new ModalButton('Yes', 'btn btn-danger', 'Delete');
    const abortButton = new ModalButton('No', 'btn btn-secondary', 'Abort');
    const modalRef = this._openMsgModal('Do you really want to delete this order?',
      'modal-header header-danger', `Are you sure you want to delete ${this.order.projectname} ?`, deleteButton, abortButton);
    modalRef.result.then((result) => {
      if (result === deleteButton.returnValue) {
        this.orderService.deleteOrder(this.order._id).then(() => {
          this.genericService.back();
        });
      }
    });
  }

  // Private Functions

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
}
