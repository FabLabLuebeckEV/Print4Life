import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { GenericService } from 'frontend/app/services/generic.service';
import { SpinnerConfig } from '../../config/config.service';
import { FablabService } from 'frontend/app/services/fablab.service';
import { ValidationService } from 'frontend/app/services/validation.service';
import { isArray } from 'util';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  @ViewChild('spinnerContainer') spinnerContainerRef: ElementRef;
  private config: any;
  private userIsLoggedIn: boolean;
  private userIsAdmin: Boolean;
  publicIcon: Icon;
  calendarIcon: Icon;
  trashIcon: Icon;
  searchIcon: Icon;
  plusIcon: Icon;
  createLink: String;
  orders: Array<TableItem> = [];
  visibleOrders: Array<TableItem> = [];
  id: String;
  listView: Boolean = false;
  outstandingOrders: Boolean = false;
  unfinishedOrders: Boolean = false;
  loadingOrders: Boolean = false;
  loadingFablabs: Boolean = false;
  datePickerError: Boolean = false;

  loadingStatus: Boolean;
  filter: any = {
    selectedStatus: [],
    validStatus: [], // shown status after translation to select in filter
    originalValidStatus: [], // origin for backend containing all status
    shownStatus: [], // selected and translated status in filter
    originalMachineTypes: [], // origin for backend containing all machine types
    machineTypes: [], // shown machine types after translation to select in filter
    shownMachineTypes: [], // selected and translated machine types in filter
    selectedMachineTypes: [], // selected machine types but in origin backend language
    fablabs: [],
    selectedFablabs: [],
    schedule: { startDay: undefined, endDay: undefined },
    searchTerm: ''
  };

  loadingMachineTypes: Boolean;

  spinnerConfig: SpinnerConfig;
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
  translationFields = {
    paginationLabel: '',
    filterLabel: {
      machines: '',
      status: '',
      fablabs: '',
      startDay: '',
      endDay: '',
      search: ''
    },
    spinnerLoadingText: '',
    buttons: {
      deleteLabel: '',
      updateLabel: ''
    },
    modals: {
      yes: '',
      abort: '',
      deleteValue: '',
      abortValue: '',
      deleteHeader: '',
      deleteQuestion: '',
      deleteQuestion2: ''
    },
    messages: {
      datePicker: ''
    }
  };

  constructor(
    private orderService: OrderService,
    private machineService: MachineService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private configService: ConfigService,
    private spinner: NgxSpinnerService,
    private translateService: TranslateService,
    private userService: UserService,
    private genericService: GenericService,
    private fablabService: FablabService,
    private validationService: ValidationService) {
    this.config = this.configService.getConfig();
    this.publicIcon = this.config.icons.public;
    this.searchIcon = this.config.icons.search;
    this.spinnerConfig = new SpinnerConfig(
      'Loading Orders', this.config.spinnerConfig.bdColor,
      this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);
    this.createLink = `./${routes.paths.frontend.orders.create}`;
    this.plusIcon = this.config.icons.add;
    this.calendarIcon = this.config.icons.calendar;
    this.jumpArrow = this.config.icons.forward;
    this.trashIcon = this.config.icons.delete;

    this.router.events.subscribe(() => {
      const route = this.location.path();
      if (route === `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.outstandingOrders}` && !this.outstandingOrders) {
        this.outstandingOrders = true;
        this.listView = false;
        this.ngOnInit();
      } else if (route === `/${routes.paths.frontend.orders.root}` && !this.listView) {
        this.listView = true;
        this.outstandingOrders = false;
        this.ngOnInit();
      } else if (route === `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.unfinishedOrders}`
        && !this.unfinishedOrders) {
        this.unfinishedOrders = true;
        this.listView = false;
        this.outstandingOrders = false;
      } else if (route !== `/${routes.paths.frontend.orders.root}`) {
        this.listView = false;
      }
    });
  }

  async ngOnInit() {
    if ((this.listView || this.outstandingOrders || this.unfinishedOrders) && !this.loadingOrders) {
      this.translateService.onLangChange.subscribe(() => {
        this._translate();
        this.paginationObj.page = 1;
        this.init();
      });
      this.loadingOrders = true;
      this.visibleOrders = [];
      this.orders = [];
      if (this.unfinishedOrders) {
        await this._loadFablabs();
      }
      await this._loadStatus();
      await this._loadMachineTypes();
      this.userIsLoggedIn = await this.userService.isLoggedIn();
      this.userIsAdmin = await this.userService.isAdmin();
      this._translate();
      this.init();
    }
  }


  searchInit() {
    this.paginationObj.page = 1;
    this.paginationObj.totalItems = 0;
    this.init();
  }

  async init() {
    const promises = [];
    const loggedInUser = await this.userService.getUser();
    this.loadingOrders = true;
    const currentLang = this.translateService.currentLang || this.translateService.getDefaultLang();
    this.orders = new Array();
    this.visibleOrders = undefined;
    this.spinner.show();
    this.genericService.scrollIntoView(this.spinnerContainerRef);
    let countObj;
    let totalItems = 0;
    let query = { $and: [] };

    if (this.filter.selectedStatus.length > 0 && this.filter.selectedMachineTypes.length > 0) {
      query = {
        $and: [
          { $or: [] },
          { $or: [] },
        ]
      };
      this.filter.selectedStatus.forEach((status) => {
        query.$and[0].$or.push({ status: status });
      });
      this.filter.selectedMachineTypes.forEach((type) => {
        query.$and[1].$or.push({ 'machine.type': this.machineService.camelCaseTypes(type) });
      });
    } else if (this.filter.selectedStatus.length > 0 || this.filter.selectedMachineTypes.length > 0) {
      query = {
        $and: [
          { $or: [] },
          { $nor: [] }
        ]
      };
      if (this.filter.selectedStatus.length > 0) {
        this.filter.selectedStatus.forEach((status) => {
          query.$and[0].$or.push({ status: status });
        });
        this.filter.originalMachineTypes.forEach((type) => {
          query.$and[1].$nor.push({ 'machine.type': this.machineService.camelCaseTypes(type) });
        });
      } else if (this.filter.selectedMachineTypes.length > 0) {
        this.filter.selectedMachineTypes.forEach((type) => {
          query.$and[0].$or.push({ 'machine.type': this.machineService.camelCaseTypes(type) });
        });
        this.filter.originalValidStatus.forEach((status) => {
          query.$and[1].$nor.push({ status });
        });
      }
    } else if (this.filter.originalValidStatus.length && this.filter.originalMachineTypes.length) {
      query = {
        $and: [
          { $nor: [] }
        ]
      };
      this.filter.originalValidStatus.forEach((status) => {
        query.$and[0].$nor.push({ status });
      });
      this.filter.originalMachineTypes.forEach((type) => {
        query.$and[0].$nor.push({ 'machine.type': this.machineService.camelCaseTypes(type) });
      });
    }

    // filter only valid status and not one of the others
    if (this.outstandingOrders) {
      try {
        const result = await this.orderService.getStatus(false);
        if (result && result.status && this.filter.originalValidStatus.length) {
          query.$and.push({ $nor: [] });
          let statusArr = [];
          if (isArray(result.status)) {
            statusArr = result.status.filter((status) => {
              return !this.filter.originalValidStatus.includes(status);
            });
          } else {
            statusArr = this.filter.originalValidStatus.filter((status) => {
              return status !== result.status;
            });
          }
          statusArr.forEach((status) => {
            query.$and[query.$and.length - 1].$nor.push({ status });
          });
        }
      } catch (err) { }
    }


    if (!query.$and) {
      query.$and = [];
    } else if (query.$and && isArray(query.$and)) {
      // if search term is defined add to mongo query
      if (this.filter.searchTerm) {
        query.$and.push({ $text: { $search: this.filter.searchTerm } });
      }

      // if user is not editor, admin or logged in: do not show shared orders
      if (!loggedInUser
        || loggedInUser && loggedInUser.role
        && (loggedInUser.role.role !== 'admin' && loggedInUser.role.role !== 'editor')) {
        query.$and.push({ shared: false });
      }
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
      if (this.userIsLoggedIn && (this.userIsAdmin || loggedInUser.role.role === 'editor')) {
        orders.orders.forEach(async (order) => {
          const result = await this.orderService.getSchedule(order._id);
          if (result && result.schedule) {
            order.schedule = result.schedule;
          }
        });
      }

      if (this.unfinishedOrders && this.filter.selectedFablabs && this.filter.selectedFablabs.length) {
        orders.orders.forEach(async (order) => {
          promises.push(new Promise(async resolve => {
            const found = { fablab: false, schedule: false };
            let result;
            let resultSchedules;
            if (order.machine.type.toLowerCase() !== 'unknown') {
              result = await this.machineService.get(order.machine.type, order.machine._id);
              resultSchedules = await this.machineService.getSchedules(order.machine.type, order.machine._id,
                { startDay: this.filter.schedule.startDay, endDay: this.filter.schedule.endDay });
            }

            if ((!this.filter.schedule.startDay || !this.filter.schedule.startDay.year ||
              !this.filter.schedule.startDay.month || !this.filter.schedule.startDay.day) &&
              (!this.filter.schedule.endDay || !this.filter.schedule.endDay.year || !this.filter.schedule.endDay.month
                || !this.filter.schedule.endDay.day)) {
              found.schedule = true;
            }
            if (result && result[`${order.machine.type}`]) {
              if (resultSchedules && resultSchedules['schedules']) {
                resultSchedules['schedules'].forEach((schedule) => {
                  if (schedule.orderId === order._id) {
                    found.schedule = true;
                  }
                });
              }
              this.filter.selectedFablabs.forEach((fablab) => {
                if (fablab._id === result[`${order.machine.type}`].fablabId) {
                  found.fablab = true;
                }
              });

              if (found.fablab && found.schedule) {
                resolve(order);
              } else {
                resolve();
              }
            }
            resolve();
          }));
        });
      }
      const results = await Promise.all(promises);
      this.translateService.get(['date']).subscribe((async translations => {
        orders = this.unfinishedOrders && results && Array.isArray(results) ? results.filter((order) => order) : orders.orders;
        const arr = [];
        for (const order of orders) {
          let fablab;
          if (order.fablabId) {
            try {
              const result = await this.fablabService.getFablab(order.fablabId);
              if (result && result.fablab) {
                fablab = result.fablab;
              }
            } catch (err) { }
          }
          const item = new TableItem();
          const owner = await this.userService.getNamesOfUser(order.owner);
          const editor = order.editor ? await this.userService.getNamesOfUser(order.editor) : undefined;
          item.obj['id'] = { label: order._id };
          item.obj['Created at'] = {
            label: `${this.genericService.translateDate(order.createdAt, currentLang, translations['date'].dateTimeFormat)}`
          };
          if (this.userIsLoggedIn && (loggedInUser.role.role === 'editor' || this.userIsAdmin) || this.unfinishedOrders) {
            item.obj['Schedule Start Date'] = {
              label: order.schedule && order.schedule.startDate ?
                `${this.genericService.translateDate(order.schedule.startDate, currentLang, translations['date'].dateTimeFormat)}`
                : '-'
            };
            item.obj['Schedule End Date'] = {
              label: order.schedule && order.schedule.endDate ?
                `${this.genericService.translateDate(order.schedule.endDate, currentLang, translations['date'].dateTimeFormat)}`
                : '-'
            };
            item.obj['Fablab'] = {
              label: fablab ? fablab.name : '-'
            };
          }
          item.obj['Projectname'] = {
            label: order.projectname,
            href: (order.shared ? `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.shared.root}/`
              : `/${routes.paths.frontend.orders.root}/`) +
              `${routes.paths.frontend.orders.detail}/${order._id}`,
            icon: order.shared ? this.publicIcon : undefined
          };
          item.obj['Owner'] = {
            label: owner.firstname + ' ' + owner.lastname,
            href: this.userIsLoggedIn ? `/${routes.paths.frontend.users.root}/${owner._id}` : ''
          };
          item.obj['Editor'] = {
            label: editor ? editor.firstname + ' ' + editor.lastname : '',
            href: editor && this.userIsLoggedIn ? `/${routes.paths.frontend.users.root}/${editor._id}` : ''
          };
          item.obj['Status'] = { label: order.status };
          item.obj['Device Type'] = { label: order.machine.type };
          if (this.userIsLoggedIn &&
            (loggedInUser.role.role === 'editor' || this.userIsAdmin || loggedInUser._id === owner._id)) {
            item.button1.label = this.translationFields.buttons.updateLabel;
            item.button1.href = `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}/${order._id}`;
            item.button1.class = 'btn btn-warning spacing';
            item.button1.icon = this.config.icons.edit;
            item.button2.label = this.translationFields.buttons.deleteLabel;
            item.button2.eventEmitter = true;
            item.button2.class = 'btn btn-danger spacing';
            item.button2.icon = this.config.icons.delete;
            item.button2.refId = order._id;
          }
          arr.push(item);
        }

        this.orders = [].concat(arr);
        this.visibleOrders = undefined;
        this.visibleOrders = JSON.parse(JSON.stringify(this.orders));
      }));
    }
    this.loadingOrders = false;
    this.spinner.hide();
  }

  // Event Handler

  public pageChanged() {
    this.init();
  }

  // remove add change clear
  changeHandlerStatus(event: Array<String>) {
    this.filter.selectedStatus = [];
    this.filter.shownStatus = event;
    this.translateService.get(['status']).subscribe((translations => {
      this.filter.originalValidStatus.forEach((status) => {
        const translatedStatus = translations['status'][`${status}`];
        if (translatedStatus) {
          this.filter.shownStatus.forEach((selectedStatus) => {
            if (selectedStatus === translatedStatus) {
              this.filter.selectedStatus.push(status);
            }
          });
        }
      });
    }));
  }

  // remove add change clear
  changeHandlerMachineType(event: Array<String>) {
    this.filter.selectedMachineTypes = [];
    this.filter.shownMachineTypes = event;
    this.translateService.get(['deviceTypes']).subscribe((translations => {
      this.filter.originalMachineTypes.forEach((machineType) => {
        const type = translations['deviceTypes'][`${this.machineService.camelCaseTypes(machineType)}`];
        if (type) {
          this.filter.shownMachineTypes.forEach((selectedType) => {
            if (selectedType === type) {
              this.filter.selectedMachineTypes.push(machineType);
            }
          });
        }
      });
    }));
  }

  changeHandlerFablab(event: Array<String>) {
    this.filter.selectedFablabs = event;
  }

  changeHandlerStartDay(event: { year: number, month: number, day: number }) {
    this.datePickerError = this.validationService.validateDate(event, this.filter.schedule.endDay);
    if (!this.datePickerError) {
      this.filter.schedule.startDay = event;
      this.init();
    }
  }

  changeHandlerEndDay(event: { year: number, month: number, day: number }) {
    this.datePickerError = this.validationService.validateDate(this.filter.schedule.startDay, event);
    if (!this.datePickerError) {
      this.filter.schedule.endDay = event;
      this.init();
    }
  }

  eventHandler(event) {
    if (event.label === this.translationFields.buttons.deleteLabel) {
      let order: TableItem;
      let orderIdx: number;
      this.visibleOrders.forEach((item, idx) => {
        if (event.refId === item.button1.refId || event.refId === item.button2.refId) {
          order = item;
          orderIdx = idx;
        }
      });
      const deleteButton = new ModalButton(this.translationFields.modals.yes, 'btn btn-danger', this.translationFields.modals.deleteValue);
      const abortButton = new ModalButton(this.translationFields.modals.abort, 'btn btn-secondary',
        this.translationFields.modals.abortValue);
      const modalRef = this._openMsgModal(this.translationFields.modals.deleteHeader,
        'modal-header header-danger', `${this.translationFields.modals.deleteQuestion} ` +
        `${order.obj[`Projectname`].label} ${this.translationFields.modals.deleteQuestion2}`, deleteButton, abortButton);
      modalRef.result.then((result) => {
        if (result === deleteButton.returnValue) {
          this.orderService.deleteOrder(order.obj.id.label).then(async (result) => {
            result = result.order;
            const oldOrder = this.visibleOrders[orderIdx];
            const owner = await this.userService.getNamesOfUser(result.owner);
            const editor = result.editor ? await this.userService.getNamesOfUser(result.editor) : undefined;
            this.orders.forEach((item) => {
              if (oldOrder.obj.id.label === item.obj.id.label) {
                this.orders[orderIdx].obj = {};
                this.orders[orderIdx].obj['id'] = { label: result._id };
                this.orders[orderIdx].obj['Owner'] = {
                  label: owner.firstname + ' ' + owner.lastname,
                  href: this.userIsLoggedIn ? `/${routes.paths.frontend.users.root}/${owner._id}` : ''
                };
                this.orders[orderIdx].obj['Editor'] = {
                  label: editor ? editor.firstname + ' ' + editor.lastname : '',
                  href: this.userIsLoggedIn && editor ? `/${routes.paths.frontend.users.root}/${editor._id}` : ''
                };
                this.orders[orderIdx].obj['Status'] = { label: result.status };
                this.orders[orderIdx].obj['Device Type'] = { label: result.machine.type };

              }
            });
            this.visibleOrders[orderIdx].obj = {};
            this.visibleOrders[orderIdx].obj['id'] = { label: result._id };
            this.visibleOrders[orderIdx].obj['Owner'] = {
              label: owner.firstname + ' ' + owner.lastname,
              href: this.userIsLoggedIn ? `/${routes.paths.frontend.users.root}/${owner._id}` : ''
            };
            this.visibleOrders[orderIdx].obj['Editor'] = {
              label: editor ? editor.firstname + ' ' + editor.lastname : '',
              href: editor && this.userIsLoggedIn ? `/${routes.paths.frontend.users.root}/${editor._id}` : ''
            };
            this.visibleOrders[orderIdx].obj['Status'] = { label: result.status };
            this.visibleOrders[orderIdx].obj['Device Type'] = { label: result.machine.type };
            if ((this.filter.selectedStatus && this.filter.selectedStatus.length > 0) ||
              this.filter.selectedMachineTypes && this.filter.selectedMachineTypes.length > 0) {
              this.init();
            }
          });
        }
      });
    }
  }

  // Private Functions

  private _openMsgModal(title: String, titleClass: String, msg: String, button1: ModalButton, button2: ModalButton) {
    const modalRef = this.modalService.open(MessageModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.title = title;
    if (titleClass) {
      modalRef.componentInstance.titleClass = titleClass;
    }
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
    return modalRef;
  }

  private async _loadStatus() {
    let status = [];
    this.loadingStatus = true;
    try {
      status = (await this.orderService.getStatus(this.outstandingOrders)).status;

      if (Array.isArray(status)) {
        this.filter.originalValidStatus = status;
      } else {
        this.filter.originalValidStatus = [status];
      }
      if (this.unfinishedOrders) {
        this.filter.originalValidStatus = this.filter.originalValidStatus.filter((status) => {
          return !['archived', 'completed', 'representive', 'deleted'].includes(status);
        });
      }
    } catch (error) {
      this.filter.originalValidStatus = [];
    }

    this.translateService.get(['status']).subscribe((translations => {
      this.filter.validStatus.forEach((type, idx) => {
        const translated = translations['status'][`${type}`];
        this.filter.validStatus[idx] = translated;
      });
      this.filter.shownStatus.forEach((type, idx) => {
        const translated = translations['status'][`${type}`];
        this.filter.shownStatus[idx] = translated;
      });
    }));
    this.filter.selectedStatus = JSON.parse(JSON.stringify(this.filter.originalValidStatus));
    this.loadingStatus = false;
  }

  private async _loadFablabs() {
    this.loadingFablabs = true;
    try {
      const result = await this.fablabService.getFablabs();
      if (result && result.fablabs) {
        this.filter.fablabs = result.fablabs.filter((fablab) => {
          return fablab.activated;
        });
        this.filter.selectedFablabs = JSON.parse(JSON.stringify(this.filter.fablabs));
      }
    } catch (err) {
      this.filter.fablabs = [];
      this.filter.selectedFablabs = [];
    }
    this.loadingFablabs = false;
  }

  private async _loadMachineTypes() {
    this.loadingMachineTypes = true;
    this.filter.originalMachineTypes = (await this.machineService.getAllMachineTypes()).types;
    this.filter.originalMachineTypes.forEach((type, idx) => {
      this.filter.originalMachineTypes[idx] = this.machineService.camelCaseTypes(type);
    });
    this.filter.originalMachineTypes = this.filter.originalMachineTypes.concat(['unknown']);
    this.filter.machineTypes = JSON.parse(JSON.stringify(this.filter.originalMachineTypes));
    this.filter.shownMachineTypes = JSON.parse(JSON.stringify(this.filter.machineTypes));
    this.translateService.get(['deviceTypes']).subscribe((translations => {
      this.filter.machineTypes.forEach((type, idx) => {
        const translated = translations['deviceTypes'][`${type}`];
        this.filter.machineTypes[idx] = translated;
      });
      this.filter.shownMachineTypes.forEach((type, idx) => {
        const translated = translations['deviceTypes'][`${type}`];
        this.filter.shownMachineTypes[idx] = translated;
      });
    }));
    this.filter.selectedMachineTypes = JSON.parse(JSON.stringify(this.filter.originalMachineTypes));
    this.loadingMachineTypes = false;
  }

  private _translate() {
    this.translateService.get(['orderList', 'deviceTypes', 'status']).subscribe((translations => {
      this.spinnerConfig = new SpinnerConfig(
        translations['orderList'].spinnerLoadingText, this.config.spinnerConfig.bdColor,
        this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);
      this.filter.machineTypes = [];
      this.filter.shownMachineTypes = [];
      this.filter.originalMachineTypes.forEach((mType) => {
        const camelType = this.machineService.camelCaseTypes(mType);
        const translated = translations['deviceTypes'][`${camelType}`];
        if (translated) {
          this.filter.machineTypes.push(translated);
        }
      });
      this.filter.selectedMachineTypes.forEach((mType) => {
        const camelType = this.machineService.camelCaseTypes(mType);
        const translated = translations['deviceTypes'][`${camelType}`];
        if (translated) {
          this.filter.shownMachineTypes.push(translated);
        }
      });

      this.filter.validStatus = [];
      this.filter.shownStatus = [];
      this.filter.originalValidStatus.forEach((status) => {
        const translated = translations['status'][`${status}`];
        if (translated) {
          this.filter.validStatus.push(translated);
        }
      });
      this.filter.selectedStatus.forEach((status) => {
        const translated = translations['status'][`${status}`];
        if (translated) {
          this.filter.shownStatus.push(translated);
        }
      });

      this.translationFields = {
        paginationLabel: translations['orderList'].paginationLabel,
        filterLabel: {
          machines: translations['orderList']['filterLabel'].machines,
          status: translations['orderList']['filterLabel'].status,
          fablabs: translations['orderList']['filterLabel'].fablabs,
          startDay: translations['orderList']['filterLabel'].startDay,
          endDay: translations['orderList']['filterLabel'].endDay,
          search: translations['orderList']['filterLabel'].search
        },
        spinnerLoadingText: translations['orderList'].spinnerLoadingText,
        buttons: {
          deleteLabel: translations['orderList'].buttons.deleteLabel,
          updateLabel: translations['orderList'].buttons.updateLabel
        },
        modals: {
          yes: translations['orderList'].modals.yes,
          abort: translations['orderList'].modals.abort,
          deleteValue: translations['orderList'].modals.deleteValue,
          abortValue: translations['orderList'].modals.abortValue,
          deleteHeader: translations['orderList'].modals.deleteHeader,
          deleteQuestion: translations['orderList'].modals.deleteQuestion,
          deleteQuestion2: translations['orderList'].modals.deleteQuestion2
        },
        messages: {
          datePicker: translations['orderList'].messages.datePicker
        }
      };
    }));
  }
}
