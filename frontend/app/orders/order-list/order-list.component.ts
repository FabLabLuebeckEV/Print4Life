import { Component, OnInit, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TableItem } from '../../components/table/table.component';
import { OrderService } from '../../services/order.service';
import { MachineService } from '../../services/machine.service';
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
  loadingOrders: Boolean = false;

  loadingStatus: Boolean;
  selectedStatus: Array<String> = [];
  validStatus: Array<String> = [];

  loadingMachineTypes: Boolean;
  machineTypes: Array<String> = [];
  selectedMachineTypes: Array<String> = [];

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
    private machineService: MachineService,
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
      this._loadMachineTypes();
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
    this.init();
  }

    // remove add change clear
  changeHandlerForMachineType(event: Array<String>) {
    this.visibleOrders = JSON.parse(JSON.stringify(this.orders));
    this.selectedMachineTypes = event;
    this.init();
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
                this.orders[orderIdx].obj['Machinetype'] = { label: result.machine.type };

              }
            });
            this.visibleOrders[orderIdx].obj = {};
            this.visibleOrders[orderIdx].obj['id'] = { label: result._id };
            this.visibleOrders[orderIdx].obj['Owner'] = { label: result.owner };
            this.visibleOrders[orderIdx].obj['Editor'] = { label: result.editor };
            this.visibleOrders[orderIdx].obj['Status'] = { label: result.status };
            this.visibleOrders[orderIdx].obj['Machinetype'] = { label: result.machine.type };
            if (this.selectedStatus && this.selectedStatus.length > 0) {
              this.init();
            }
            if (this.selectedMachineTypes && this.selectedMachineTypes.length > 0) {
              this.init();
            }
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
    this.orders = [];
    this.visibleOrders = undefined;
    this.visibleOrders = JSON.parse(JSON.stringify(this.orders));
    this.loadingOrders = true;
    this.spinner.show();
    let countObj;
    let totalItems = 0;
    let query;
    if (this.selectedStatus.length > 0 || this.selectedMachineTypes.length > 0) {
      query = {
        $and: [
          {$or: []},
          {$or: []}
        ]
      };
      this.selectedStatus.forEach((status) => {
        query.$and[0].$or.push({ status: status });
      });
      this.selectedMachineTypes.forEach((type) => {
        query.$and[1].$or.push({ 'machine.type': type});
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
        item.obj['Created at'] = { label: order.createdAt, isDate: true };
        item.obj['Projectname'] = { label: order.projectname,  href: `./${routes.paths.frontend.orders.detail}/${order._id}` };
        item.obj['Owner'] = { label: order.owner };
        item.obj['Editor'] = { label: order.editor };
        item.obj['Status'] = { label: order.status };
        item.obj['Machinetype'] = { label: order.machine.type };
        item.button1.label = 'Edit';
        item.button1.href = `./${routes.paths.frontend.orders.update}/${order._id}`;
        item.button1.class = 'btn btn-warning spacing';
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
    this.loadingStatus = true;
    this.validStatus = (await this.orderService.getStatus()).status;
    this.selectedStatus = this.validStatus;
    this.loadingStatus = false;
  }

  private async _loadMachineTypes() {
    this.loadingMachineTypes = true;
    this.machineTypes = (await this.machineService.getAllMachineTypes()).types;
    this.selectedMachineTypes = this.machineTypes;
    this.loadingMachineTypes = false;
  }
}
