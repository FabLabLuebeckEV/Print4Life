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
import { SimpleMachine } from 'frontend/app/models/order.model';

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
  machineProps: Object = {
    title: '',
    props: []
  };
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
    private userService: UserService) {

    this.config = this.configService.getConfig();
    this.editIcon = this.config.icons.edit;
    this.toggleOn = this.config.icons.toggleOn;
    this.toggleOff = this.config.icons.toggleOff;
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe((params) => {
        if (params && params.get('id') && params.get('type')) {
          this.params = {
            id: params.get('id'),
            type: params.get('type').substr(0, params.get('type').length - 1)
          };
          this._initMachine();
        }
      });
    this.translateService.onLangChange.subscribe(() => {
      this._initMachine();
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

  private _initMachine() {
    if (this.params && this.params.type && this.params.id) {
      this.machineService.get(this.params.type, this.params.id).then((result) => {
        this.machine = undefined;
        const machine = result[this.params.type];
        this.machine = machine;
        this.fablabService.getFablab(machine.fablabId).then(async (result) => {
          this.machine.fablab = result.fablab;
          this.machine.successfulOrders = await this.machineService.countSuccessfulOrders(this.params.type, this.params.id);
          this.machine.successfulOrders = this.machine.successfulOrders.orders;
          this.editLink = `/${routes.paths.frontend.machines.root}/${routes.paths.frontend.machines.update}/` +
            `${this.machine.type}s/${this.machine._id}`;
          this.machineProps = {
            title: '',
            props: []
          };
          this.machineSubObjects = [];
          this.machineSubArrays = [];
          this._splitMachineProps();
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

  private _splitMachineProps() {
    const machineProps = Object.keys(this.machine).filter((key) => {
      return key !== '_id' && key !== 'fablabId' && key !== '__v';
    });
    this.translateService.get(['machineDetail', 'deviceTypes']).subscribe((translations) => {
      machineProps.forEach((key) => {
        const prop: any = this.machine[`${key}`];
        if (prop) {
          if (prop.hasOwnProperty('address')) {
            prop.city = prop.address.city;
            prop.street = prop.address.street;
            prop.zipCode = prop.address.zipCode;
            prop.country = prop.address.country;
            delete prop.address;
          }
          if (prop.hasOwnProperty('activated')) {
            delete prop.activated;
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
            Object.keys(translations['machineDetail'].titles).forEach((k) => {
              if (k === key && key !== 'successfulOrders') {
                this.machineSubArrays.push({
                  originTitle: k,
                  title: translations['machineDetail'].titles[`${k}`], array: this._cleanPropObject(prop)
                });
              } else if (k === key && key === 'successfulOrders') {
                prop.forEach((order) => {
                  order.projectname = {
                    label: order.projectname,
                    href: `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.detail}/${order.id}`
                  };
                  delete order.id;
                });
                this.machineSubArrays.push({
                  originTitle: k,
                  title: translations['machineDetail'].titles[`${k}`], array: this._cleanPropObject(prop)
                });
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
