import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TableItem } from '../../components/table/table.component';
import { OrderService } from '../../services/order.service';
import { faWrench, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { config } from '../../config/config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orders: Array<TableItem> = [];
  id: String;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal) {
    router.events.subscribe(() => {
      const route = location.path();
    });
  }

  ngOnInit() {
    const route = this.router.url;
    if (route === '/orders') {
      this.init();
    }
    if (route.includes('deleteOrder')) {
      const path = route.split('/');
      console.log(this.id);
      this.orderService.deleteOrder(this.id);
    }
  }

  eventHandler(event) {
    if (event.label === 'Delete') {
      let order: TableItem;
      let orderIdx: number;
      this.orders.forEach((item, idx) => {
        if (event === item.button1 || event === item.button2) {
          order = item;
          orderIdx = idx;
        }
      });
      const deleteButton = new ModalButton('Yes', 'btn btn-danger', 'Delete');
      const abortButton = new ModalButton('No', 'btn btn-secondary', 'Abort');
      const modalRef = this._openMsgModal('Do you really want to delete this order?',
      'modal-header header-danger', 'Are you sure you want to delete the order?', deleteButton, abortButton);
      modalRef.result.then((result) => {
        if (result === deleteButton.returnValue) {
          this.orderService.deleteOrder(order.obj.id).then((result) => {
            result = result.order;
            this.orders[orderIdx].obj = {};
            this.orders[orderIdx].obj['id'] = result._id;
            this.orders[orderIdx].obj['Owner'] = result.owner;
            this.orders[orderIdx].obj['Editor'] = result.editor;
            this.orders[orderIdx].obj['Status'] = result.status;
          });
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

  async init() {
    const resOrders = await this.orderService.getAllOrders();
    const orders = resOrders.orders;
    const arr = [];
    for (const order of orders) {
      const item = new TableItem();
      item.obj['id'] = order._id;
      item.obj['Owner'] = order.owner;
      item.obj['Editor'] = order.editor;
      item.obj['Status'] = order.status;
      item.button1.label = 'Edit';
      item.button1.href = `./${config.paths.orders.updateOrder}`;
      item.button1.class = 'btn btn-primary spacing';
      item.button1.icon = faWrench;
      item.button2.label = 'Delete';
      item.button2.eventEmitter = true;
      item.button2.class = 'btn btn-danger spacing';
      item.button2.icon = faTrashAlt;
      arr.push(item);
    }
    this.orders = this.orders.concat(arr);
  }
}
