import { Component, OnInit, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TableItem } from '../../components/table/table.component';
import { OrderService } from '../../services/order.service';
import { ConfigService } from '../../config/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { routes } from '../../config/routes';
import { NgxSpinnerService } from 'ngx-spinner';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { query } from '../../../../node_modules/@angular/core/src/render3/query';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  private config: any;
  createLink: String;
  orders: Array<TableItem> = [];
  visibleOrders: Array<TableItem> = [];
  id: String;
  listView: Boolean = false;
  plusIcon: any;
  loadingStatus: Boolean;
  loadingOrders: Boolean = false;
  selectedStatus: Array<String> = [];
  validStatus: Array<String> = [];
  spinnerConfig: Object;
  jumpArrow: Icon;
  paginationObj: any = {
    page: 1,
    totalItems: 0,
    perPage: 20,
    maxSize: 10,
    boundaryLinks: true,
    rotate: true,
    maxPages: 0,
    jumpToPage: undefined
  };

  constructor(
    private orderService: OrderService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private configService: ConfigService,
    private spinner: NgxSpinnerService) {
    this.config = this.configService.getConfig();
    this.spinnerConfig = { 'loadingText': 'Loading Orders', ...this.config.spinnerConfig };
    this.createLink = `./${routes.paths.frontend.orders.create}`;
    this.plusIcon = this.config.icons.add;
    this.jumpArrow = this.config.icons.forward;
    this.router.events.subscribe(() => {
      const route = this.location.path();
      if (route === '/orders') {
        this.listView = true;
        this.ngOnInit();
      } else {
        this.listView = false;
      }
    });
  }

  async ngOnInit() {
    if (this.listView && !this.loadingOrders) {
      this.visibleOrders = [];
      this.orders = [];
      this._loadStatus();
      this.init();
    }
  }

  public pageChanged() {
    this.init();
  }

  // remove add change clear
  changeHandler(event: Array<String>) {
    this.visibleOrders = JSON.parse(JSON.stringify(this.orders));
    this.selectedStatus = event;
    this._filterOrdersByStatus();
  }

  eventHandler(event) {
    if (event.label === 'Delete') {
      let order: TableItem;
      let orderIdx: number;
      this.visibleOrders.forEach((item, idx) => {
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
          this.orderService.deleteOrder(order.obj.id.label).then((result) => {
            result = result.order;
            const oldOrder = this.visibleOrders[orderIdx];
            this.orders.forEach((item) => {
              if (oldOrder.obj.id.label === item.obj.id.label) {
                this.orders[orderIdx].obj = {};
                this.orders[orderIdx].obj['id'] = { label: result._id };
                this.orders[orderIdx].obj['Owner'] = { label: result.owner };
                this.orders[orderIdx].obj['Editor'] = { label: result.editor };
                this.orders[orderIdx].obj['Status'] = { label: result.status };
              }
            });
            this.visibleOrders[orderIdx].obj = {};
            this.visibleOrders[orderIdx].obj['id'] = { label: result._id };
            this.visibleOrders[orderIdx].obj['Owner'] = { label: result.owner };
            this.visibleOrders[orderIdx].obj['Editor'] = { label: result.editor };
            this.visibleOrders[orderIdx].obj['Status'] = { label: result.status };
            if (this.selectedStatus && this.selectedStatus.length > 0) {
              this._filterOrdersByStatus();
            }
          });
        }
      });
    }
  }

  private _filterOrdersByStatus() {
    this.init();
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
    this.orders = [];
    this.loadingOrders = true;
    this.spinner.show();
    let countObj;
    let totalItems = 0;
    let query;
    if (this.selectedStatus.length > 0) {
      query = {
        $or: []
      };
      this.selectedStatus.forEach((status) => {
        query.$or.push({ status: status });
      });
    }

    countObj = await this.orderService.count(query);
    totalItems = countObj.count;

    if (totalItems !== this.paginationObj.totalItems) {
      this.paginationObj.totalItems = totalItems;
    }

    let orders = await this.orderService.getAllOrders(
      query, this.paginationObj.perPage,
      (this.paginationObj.page - 1) * this.paginationObj.perPage);
    if (orders && orders.orders) {
      orders = orders.orders;
      const arr = [];
      for (const order of orders) {
        const item = new TableItem();
        item.obj['id'] = { label: order._id };
        item.obj['Created'] = { label: order.created, isDate: true };
        item.obj['Projectname'] = { label: order.projectname };
        item.obj['Owner'] = { label: order.owner };
        item.obj['Editor'] = { label: order.editor };
        item.obj['Status'] = { label: order.status };
        item.button1.label = 'Edit';
        item.button1.href = `./${routes.paths.frontend.orders.update}/${order._id}`;
        item.button1.class = 'btn btn-primary spacing';
        item.button1.icon = this.config.icons.edit;
        item.button2.label = 'Delete';
        item.button2.eventEmitter = true;
        item.button2.class = 'btn btn-danger spacing';
        item.button2.icon = this.config.icons.delete;
        arr.push(item);
      }

      this.orders = this.orders.concat(arr);
      this.visibleOrders = undefined;
      this.visibleOrders = JSON.parse(JSON.stringify(this.orders));
    }
    this.loadingOrders = false;
    this.spinner.hide();
  }

  private async _loadStatus() {
    this.validStatus = (await this.orderService.getStatus()).status;
    this.selectedStatus = this.validStatus;
    this.loadingStatus = false;
  }
}
