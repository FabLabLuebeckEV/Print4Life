import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { ConfigService } from '../../config/config.service';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { routes } from '../../config/routes';
import { GenericService } from '../../services/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { OrderService } from 'frontend/app/services/order.service';

@Component({
  selector: 'app-machine-detail',
  templateUrl: './machine-detail.component.html',
  styleUrls: ['./machine-detail.component.css']
})
export class MachineDetailComponent implements OnInit {
  private config: any;
  private userIsLoggedIn: boolean;
  editLink: String;
  deleteLink: String;
  editIcon: any;
  toggleOn: any;
  toggleOff: any;
  objectKeys = Object.keys;
  machine: any;
  machineActive: boolean;
  machineProps: Object = {
    title: '',
    props: []
  };
  machineSchedules: Array<Object>;
  machineSubObjects: Array<Object> = [];
  machineSubArrays: Array<Object> = [];
  loading: Boolean = true;
  translationFields = {
    modals: {
      yes: '',
      no: '',
      deleteReturnValue: '',
      abortReturnValue: '',
      deleteHeader: '',
      deleteMessage: '',
      deleteMessage2: ''
    }
  };
  params: any = {
  };

  constructor(
    private route: ActivatedRoute,
    private machineService: MachineService,
    private fablabService: FablabService,
    private configService: ConfigService,
    private genericService: GenericService,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private userService: UserService,
    private orderService: OrderService) {

    this.config = this.configService.getConfig();
    this.editIcon = this.config.icons.edit;
    this.toggleOn = this.config.icons.toggleOn;
    this.toggleOff = this.config.icons.toggleOff;
  }

  async ngOnInit() {
    this.route.paramMap
      .subscribe(async (params) => {
        if (params && params.get('id') && params.get('type')) {
          this.params = {
            id: params.get('id'),
            type: params.get('type').substr(0, params.get('type').length - 1)
          };
          await this._initMachine();
        }
      });
    this.translateService.onLangChange.subscribe(async () => {
      if (!this.loading) {
        await this._initMachine();
      }
    });
    this.userIsLoggedIn = this.userService.isLoggedIn();
  }

  public delete() {
    const deleteButton = new ModalButton(this.translationFields.modals.yes, 'btn btn-danger',
      this.translationFields.modals.deleteReturnValue);
    const abortButton = new ModalButton(this.translationFields.modals.no, 'btn btn-secondary',
      this.translationFields.modals.abortReturnValue);
    const modalRef = this._openMsgModal(this.translationFields.modals.deleteHeader,
      'modal-header header-warning',
      `${this.translationFields.modals.deleteMessage} ${this.machine.deviceName} ${this.translationFields.modals.deleteMessage2}`,
      deleteButton, abortButton);
    modalRef.result.then((result) => {
      if (result === deleteButton.returnValue) {
        this.machineService.deleteMachine(this.machine.originType, this.machine._id).then((result) => {
          this.params = {};
          this.machine.activated = result[this.machine.originType].activated;
        });
      }
    });
  }

  // Private Functions

  private async _initMachine() {
    if (this.params && this.params.type && this.params.id) {
      this.machineService.get(this.params.type, this.params.id).then((result) => {
        this.machine = undefined;
        const machine = result[this.params.type];
        this.machine = machine;
        this.machineActive = this.machine.activated;
        this.fablabService.getFablab(machine.fablabId).then(async (result) => {
          this.machine.fablab = result.fablab;
          this.editLink = `/${routes.paths.frontend.machines.root}/${routes.paths.frontend.machines.update}/` +
            `${this.machine.type}s/${this.machine._id}`;
          this.machineProps = {
            title: '',
            props: []
          };

          try {
            const result: any = await this.machineService.getSchedules(this.params.type, this.params.id);
            if (result && result.schedules) {
              this.machine.schedules = this.machineService.sortSchedulesByStartDate(result.schedules);
            }
          } catch (err) {
            delete this.machine.schedules;
          }

          try {
            const result = await this.machineService.countSuccessfulOrders(this.params.type, this.params.id);
            if (result && result.orders && result.orders.length) {
              this.machine.successfulOrders = result.orders;
            } else {
              delete this.machine.successfulOrders;
            }
          } catch (err) {
            delete this.machine.successfulOrders;
          }

          await this._splitMachineProps();
          this._translate();
        });
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

  private async _splitMachineProps() {
    this.machineSubObjects = [];
    this.machineSubArrays = [];
    const machineProps = Object.keys(this.machine).filter((key) => {
      return key !== '_id' && key !== 'fablabId' && key !== '__v';
    });
    this.translateService.get(['machineDetail', 'deviceTypes', 'labels']).subscribe((translations) => {
      this.machine.activated = this.machineActive === true
        ? translations['machineDetail'].labels.active
        : translations['machineDetail'].labels.inactive;
      machineProps.forEach((key) => {
        const prop: any = this.machine[`${key}`];
        if (prop || key === 'activated') {
          if (prop.hasOwnProperty('address')) {
            prop.city = prop.address.city;
            prop.street = prop.address.street;
            prop.zipCode = prop.address.zipCode;
            prop.country = prop.address.country;
            delete prop.address;
          }
          if (prop.hasOwnProperty('activated')) {
            prop.activated = prop.activated === true
              ? translations['machineDetail'].labels.active
              : translations['machineDetail'].labels.inactive;
            // delete prop.activated;
          }
          if (prop instanceof Object && !Array.isArray(prop)) {
            Object.keys(translations['machineDetail'].titles).forEach((k) => {
              if (k === key) {
                this.machineSubObjects.push({
                  originTitle: k,
                  title: translations['machineDetail'].titles[`${k}`], obj: this._cleanPropObject(prop)
                });
              }
            });
          } else if (prop instanceof Object && Array.isArray(prop)) {
            Object.keys(translations['machineDetail'].titles).forEach(async (k) => {
              if (k === key && key !== 'successfulOrders' && key !== 'schedules') {
                this.machineSubArrays.push({
                  originTitle: k,
                  title: translations['machineDetail'].titles[`${k}`], array: this._cleanPropObject(prop)
                });
              } else if (k === key && key === 'successfulOrders') {
                prop.forEach((order) => {
                  order.projectname = {
                    label: order.projectname,
                    href: `/${routes.paths.frontend.orders.root}/` +
                      (order.shared ? `${routes.paths.backend.orders.shared}/` : ``) +
                      `${routes.paths.frontend.orders.detail}/${order.id}`
                  };
                  delete order.id;
                });
                this.machineSubArrays.push({
                  originTitle: k,
                  title: translations['machineDetail'].titles[`${k}`], array: this._cleanPropObject(prop)
                });
              } else if (k === key && key === 'schedules') {
                await this._prepareScheduleProp(prop, key);
              }
            });
          } else {
            if (key === 'type') {
              Object.keys(translations['deviceTypes']).forEach((t) => {
                if (prop === t) {
                  this.machine.originType = JSON.parse(JSON.stringify(this.machine.type));
                  this.machine.type = translations['deviceTypes'][`${prop}`];
                  this.machineProps['props'].push({ key, label: translations['machineDetail']['props'][`${key}`] });
                }
              });
            } else {
              this.machineProps['props'].push({ key, label: translations['machineDetail']['props'][`${key}`] });
            }
          }
        }
      });
      this.loading = false;
    });
  }

  private _prepareScheduleProp(schedules, k) {
    let updated = false;
    const promises = [];
    const currentLang = this.translateService.currentLang || this.translateService.getDefaultLang();
    this.translateService.get(['machineDetail', 'date']).subscribe((translations) => {
      if ((!this.machineSchedules || !this.machineSchedules.length) && schedules && schedules.length) {
        const scheduleCopy = [];
        schedules.forEach(async (schedule) => {
          const s = {
            projectname: { label: '', href: '' }, startDate: new Date(), endDate: new Date(),
            shownStartDate: '', shownEndDate: ''
          };
          promises.push(new Promise(resolve => {
            this.orderService.getOrderById(schedule.orderId).then((result) => {
              if (result && result.order) {
                if (this.userIsLoggedIn) {
                  s.projectname = {
                    label: result.order.projectname,
                    href: `/${routes.paths.frontend.orders.root}/` +
                      (result.order.shared ? `${routes.paths.backend.orders.shared}/` : ``) +
                      `${routes.paths.frontend.orders.detail}/${schedule.orderId}`
                  };
                } else {
                  s.projectname = result.order.projectname;
                }

                s.startDate = new Date(schedule.startDate);
                s.endDate = new Date(schedule.endDate);
                scheduleCopy.push(s);
                resolve(s);
              }
            });
          }));
        });

      }
      Promise.all(promises).then((results) => {
        if (results && results.length) {
          this.machineSchedules = results;
        }
        if (this.machineSchedules && this.machineSchedules.length) {
          const props = JSON.parse(JSON.stringify(this.machineSchedules));
          props.forEach((prop) => {
            delete prop.startDate;
            delete prop.endDate;
            prop.shownStartDate = this.genericService.translateDate(
              prop.startDate, currentLang, translations['date'].dateTimeFormat);
            prop.shownEndDate = this.genericService.translateDate(
              prop.endDate, currentLang, translations['date'].dateTimeFormat);
          });
          this.machineSubArrays.forEach((subArray: { originTitle: string, title: string, array: Object }) => {
            if (subArray.originTitle === k) {
              subArray.array = this._cleanPropObject(props);
              subArray.title = translations['machineDetail'].titles[`${k}`];
              updated = true;
            }
          });

          if (!updated) {
            this.machineSubArrays.push({
              originTitle: k,
              title: translations['machineDetail'].titles[`${k}`], array: this._cleanPropObject(props)
            });
          }
        }
      });
    });

  }

  private _cleanPropObject(prop: any): Object {
    const newObj = {};
    if (prop instanceof Object && !Array.isArray(prop)) {
      const tmp = Object.keys(prop).filter((e) => e !== '_id' && e !== '__v');
      this.translateService.get(['machineDetail', 'deviceTypes', 'materialTypes']).subscribe((translations) => {
        tmp.forEach((k) => {
          if (k === 'type') {
            let changed = false;
            Object.keys(translations['deviceTypes']).forEach((t) => {
              if (prop[`${k}`] === t) {
                changed = true;
                prop[k] = translations['deviceTypes'][`${prop[`${k}`]}`];
              }
            });

            if (!changed) {
              Object.keys(translations['materialTypes']).forEach((t) => {
                if (prop[`${k}`] === t) {
                  changed = true;
                  prop[k] = translations['materialTypes'][`${prop[`${k}`]}`];
                }
              });
            }
          }
          newObj[`${translations['machineDetail']['props'][`${k}`]}`] = prop[k];
        });
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

  private _translate() {
    this.translateService.get(['machineDetail', 'deviceTypes']).subscribe((translations => {
      this._prepareScheduleProp(this.machineSchedules, 'schedules');

      this.translationFields = {
        modals: {
          deleteHeader: translations['machineDetail'].modals.deleteHeader,
          deleteMessage: translations['machineDetail'].modals.deleteMessage,
          deleteMessage2: translations['machineDetail'].modals.deleteMessage2,
          yes: translations['machineDetail'].modals.yes,
          no: translations['machineDetail'].modals.no,
          deleteReturnValue: translations['machineDetail'].modals.deleteReturnValue,
          abortReturnValue: translations['machineDetail'].modals.abortReturnValue,
        }
      };

      this.machineProps['title'] = translations['machineDetail'].titles.machineProps;
    }));
  }

}
