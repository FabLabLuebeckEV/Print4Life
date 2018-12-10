import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { Machine } from '../../models/machines.model';
import { Order, Comment, SimpleMachine } from '../../models/order.model';
import { ConfigService, SpinnerConfig } from '../../config/config.service';
import { routes } from '../../config/routes';
import { GenericService } from '../../services/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { User, Role, Language } from 'frontend/app/models/user.model';
import { UserService } from 'frontend/app/services/user.service';
import { Subscription } from 'rxjs';
import { Address } from 'frontend/app/models/address.model';
import { UploadComponent } from 'frontend/app/components/upload/upload.component';
import { isObject } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import { Schedule } from 'frontend/app/models/schedule.model';
import { ScheduleService } from 'frontend/app/services/schedule.service';
import { ValidationService } from 'frontend/app/services/validation.service';

const localStorageOrderKey = 'orderManagementOrderFormOrder';
const localStorageCommentKey = 'orderManagementOrderFormComment';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit, OnDestroy {
  @ViewChild('createOrderForm') createOrderForm;
  @ViewChild('commentContent') commentContentField;
  @ViewChild('fileUpload') fileUpload: UploadComponent;
  @ViewChild('spinnerContainer') spinnerContainerRef: ElementRef;
  config: any;
  spinnerConfig: SpinnerConfig;
  publicIcon: any;
  calendarIcon: any;
  toggleOnIcon: any;
  toggleOffIcon: any;
  selectedType: String;
  submitting: Boolean = false;
  editView: Boolean = false;
  isCollapsed = true;
  sharedView = false;
  routeChanged: Boolean;
  formSubscription: Subscription;
  datePickerError = false;
  timePickerError = false;

  sMachine: SimpleMachine = new SimpleMachine(undefined, undefined);
  shippingAddress: Address = new Address('', '', '', '');
  order: Order = new Order(
    undefined, undefined, undefined,
    undefined, undefined, undefined,
    undefined, this.sMachine, undefined,
    this.shippingAddress, false, undefined);
  orderId: String;
  comment: Comment = new Comment(undefined, undefined, undefined);
  schedule: Schedule = new Schedule('', undefined, undefined, '', { type: '', id: '' }, '');

  shippingAddresses: {
    userAddress: Address,
    fablabAddress: Address,
    newAddress: Address
  } = {
      userAddress: undefined,
      fablabAddress: undefined,
      newAddress: this.shippingAddress
    };
  shippingAddressKeys: Array<String> = [];
  selectedAddressKey = '';

  loadingMachineTypes: Boolean;
  machineTypes: Array<String> = [];

  loadingAddresses: Boolean;
  addresses: Array<Address> = [];

  loadingMachinesForType: Boolean;
  machines: Array<Machine> = [];
  machineSchedules: Array<Schedule> = [];

  loadingStatus: Boolean;
  validStatus: Array<String> = [];

  owner: User;

  loadingFablabs: Boolean;
  fablabs: Array<any>;
  editors: Array<User>;
  loadingEditors: Boolean;
  loggedInUser: User = new User(
    undefined, '', '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

  translationFields = {
    title: '',
    shownMachineTypes: [],
    shownStatus: [],
    shownShippingAddresses: [],
    shownAddress: '',
    publicHint: '',
    labels: {
      submit: '',
      sendComment: '',
      projectName: '',
      owner: '',
      editor: '',
      status: '',
      machineType: '',
      selectedMachine: '',
      selectedMachineInfo: '',
      comments: '',
      newComment: '',
      author: '',
      content: '',
      createdAt: '',
      street: '',
      zipCode: '',
      city: '',
      country: '',
      addressTitle: '',
      fileUpload: '',
      files: '',
      file: '',
      latestVersion: '',
      datePickerStart: '',
      datePickerEnd: '',
      timePickerStart: '',
      timePickerEnd: '',
      machineSchedule: '',
      startDate: '',
      endDate: ''
    },
    modals: {
      ok: '',
      okReturnValue: '',
      createCommentError: '',
      createCommentSuccessHeader: '',
      createCommentSuccess: '',
      orderSuccessHeader: '',
      orderSuccess: '',
      errorHeader: '',
      error: '',
      orderSharedLinkSuccessHeader: '',
      orderSharedLinkSuccess: ''
    },
    messages: {
      projectName: '',
      owner: '',
      status: '',
      machineType: '',
      selectedMachine: '',
      unnamedFablab: '',
      author: '',
      content: '',
      datePicker: '',
      timePicker: ''
    }
  };

  constructor(
    private machineService: MachineService,
    private fablabService: FablabService,
    private router: Router,
    private location: Location,
    private orderService: OrderService,
    private modalService: NgbModal,
    private configService: ConfigService,
    private genericService: GenericService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private scheduleService: ScheduleService,
    private validationService: ValidationService) {
    this.config = this.configService.getConfig();
    this.spinnerConfig = new SpinnerConfig(
      '', this.config.spinnerConfig.bdColor,
      this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);
    this.publicIcon = this.config.icons.public;
    this.calendarIcon = this.config.icons.calendar;
    this.shippingAddressKeys = ['userAddress', 'fablabAddress', 'newAddress'];
    this.toggleOnIcon = this.config.icons.toggleOn;
    this.toggleOffIcon = this.config.icons.toggleOff;
    this._translate();
    this.router.events.subscribe(() => {
      const route = this.location.path();
      this.editView =
        route.indexOf(`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}`) >= 0
        || route.indexOf(
          `${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.shared.root}/${routes.paths.frontend.orders.shared.update}`
        ) >= 0;
      this.sharedView = route.indexOf(`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.shared.root}`) >= 0;
    });
    this.route.params.subscribe(params => {
      if (params.id) {
        this.orderId = params.id;
      }
    });
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    await this._loadMachineTypes();
    await this._loadFablabs();
    await this._loadStatus();
    await this._initializeOrder(this.orderId);
    await this._loadAddresses();
    this.machineSelected();
    this._translate();

    this.formSubscription = this.createOrderForm.form.valueChanges.subscribe(async (changes) => {
      if (this.createOrderForm && !this.editView) {
        try {
          this.order.projectname = changes.projectname;
          this.order.machine._id = changes.selectedMachine;
          this.order.machine.type = await this._translateMachineType(this.order.machine['shownType']);
          this.comment.content = changes.content;
          localStorage.setItem(localStorageOrderKey, JSON.stringify(this.order));
          localStorage.setItem(localStorageCommentKey, JSON.stringify(this.comment));
        } catch (error) {
          console.log(error);
        }
      } else if (this.createOrderForm && this.editView) {
        const startDate = this.validationService.createCheckDate(changes.datePickerStart);
        const endDate = this.validationService.createCheckDate(changes.datePickerError);
        this.datePickerError = this.validationService.validateDate(changes.datePickerStart, changes.datePickerEnd);
        this.timePickerError = this.validationService.validateTime(startDate, endDate, changes.timePickerStart, changes.timePickerEnd);
      }
    });
  }

  onSubmitComment(form) {
    const url = this.sharedView
      ? `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.shared.root}/`
      + `${routes.paths.frontend.orders.update}/${this.orderId}`
      : `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}/${this.orderId}`;
    const errorMsg = this.translationFields.modals.createCommentError;
    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.okReturnValue);
    this.comment.author = this.loggedInUser._id;
    this.comment['authorName'] = undefined;
    this.orderService.createComment(this.orderId, this.comment, this.sharedView).then((result) => {
      if (result) {
        this._openMsgModal(this.translationFields.modals.createCommentSuccessHeader, 'modal-header header-success',
          this.translationFields.modals.createCommentSuccess, okButton, undefined).result.then((result) => {
            this.orderService.getOrderById(this.orderId).then((result) => {
              this.order.comments = result.order.comments;
              form.reset();
              this.order.comments.forEach(async (comment) => {
                const user = await this.userService.getNamesOfUser(comment.author);
                if (user) {
                  comment['authorName'] = user.firstname + ' ' + user.lastname;
                }
              });
              this._translate();
            });
            this.router.navigate([url]);
          });
      }
    }).catch(() => {
      this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg,
        okButton, undefined);
    });
  }

  async onSubmit() {
    if (this.sharedView && !this.editView && !this.userService.isLoggedIn()) {
      this.order.shared = true;
      const guestPassword = Math.random().toString(36).substr(2, 9);
      const resUser = await this.userService.createUser(
        new User(
          undefined, `${this.order.owner.trim().replace(' ', '')}-${Math.random().toString(36).substr(2, 9)}`,
          this.order.owner.trim().split(' ')[0],
          (this.order.owner.trim().split(' ')[1] ? (this.order.owner.trim().split(' ')[1] + ' ') : '') + '(Gast)',
          guestPassword, guestPassword,
          `${this.order.owner.trim().replace(' ', '')}-${Math.random().toString(36).substr(2, 9)}@gast.nutzer`,
          new Address(
            this.order.shippingAddress.street, this.order.shippingAddress.zipCode,
            this.order.shippingAddress.city, this.order.shippingAddress.country
          ),
          new Role('guest'),
          new Language(localStorage.getItem('orderManagementLang')), false, undefined));
      this.loggedInUser = resUser.user;
      this.order.owner = resUser.user._id;
      this.order.shippingAddress = resUser.user.address;
      this.comment.author = resUser.user._id;
    }

    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
    let found = false;
    let orderCopy;
    this.comment.author = this.comment.author ? this.comment.author : this.loggedInUser._id;
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
        this.comment['authorName'] = undefined;
        this.order.comments.push(this.comment);
      }
    }
    orderCopy = JSON.parse(JSON.stringify(this.order));
    orderCopy.machine.type = this.machineService.camelCaseTypes(orderCopy.machine.type);
    if (this.editView) {
      const promises = [];
      const errorMsg = this.translationFields.modals.error;
      this.orderService.updateOrder(orderCopy, this.sharedView).then((result) => {
        if (result) {
          const machine = this.machines.find((machine) => {
            return this.order.machine._id === machine._id;
          });
          if (this.schedule.startDate && this.schedule.endDate &&
            this.schedule.startDay && this.schedule.endDay &&
            this.schedule.startTime && this.schedule.endTime) {
            this.schedule.machine.type = machine.type as string;
            this.schedule.machine.id = machine._id as string;
            this.schedule.fablabId = machine.fablab._id;
            this.schedule.orderId = this.order._id as string;
            this.schedule.startDate = new Date(
              this.schedule.startDay.year,
              this.schedule.startDay.month - 1, // -1 to fix month index of javascript date object
              this.schedule.startDay.day,
              this.schedule.startTime.hour,
              this.schedule.startTime.minute);
            this.schedule.endDate = new Date(
              this.schedule.endDay.year,
              this.schedule.endDay.month - 1, // -1 to fix month index of javascript date object
              this.schedule.endDay.day,
              this.schedule.endTime.hour,
              this.schedule.endTime.minute);
            if (this.schedule._id) {
              promises.push(this.scheduleService.update(this.schedule));
            } else {
              promises.push(this.scheduleService.create(this.schedule));
            }
          }

          Promise.all(promises).then(() => {
            this.fileUpload.uploadFilesToOrder(result.order._id, () => {
              this._openSuccessMsg(result);
            }, this.sharedView);
          }).catch(() => {
            this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
          });
        } else {
          this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
        }
      }).catch((err) => {
        this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
      });
    } else {
      const errorMsg = this.translationFields.modals.error;
      this.orderService.createOrder(orderCopy, this.sharedView).then((result) => {
        if (result) {
          this.fileUpload.uploadFilesToOrder(result.order._id, () => {
            localStorage.removeItem(localStorageOrderKey);
            localStorage.removeItem(localStorageCommentKey);
            this._openSuccessMsg(result);
          }, this.sharedView);
        } else {
          this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
        }
      }).catch(() => {
        this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
      });
    }
  }

  // Events

  async statusChanged(status) {
    this.order['shownStatus'] = status;
    status = await this._translateStatus(this.order['shownStatus']);
    this.order.status = status;
  }

  async machineTypeChanged(type) {
    let machineObj;
    this.loadingMachinesForType = true;
    this.order.machine._id = '';
    this.order.machine['detailView'] = '';
    this.order.machine['deviceName'] = '';
    this.order.machine['shownType'] = type;
    type = await this._translateMachineType(this.order.machine['shownType']);
    this.order.machine.type = type;
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

  async machineSelected() {
    if (this.order.machine.type && this.order.machine._id) {
      this.machines.forEach(element => {
        if (element._id === this.order.machine._id) {
          this.order.machine['deviceName'] = element.deviceName;
        }
      });
      const type = this.machineService.camelCaseTypes(this.order.machine.type);
      this.order.machine['detailView'] = `/${routes.paths.frontend.machines.root}/${type}s/${this.order.machine._id}/`;
      try {
        const result: any =
          await this.machineService.getSchedules(this.order.machine.type as string, this.order.machine._id as string);
        if (result && result.schedules) {
          this.machineSchedules = this.machineService.sortSchedulesByStartDate(result.schedules);
          this._translate();
        }
      } catch (err) {
        this.machineSchedules = [];
      }
    }
  }

  // Private Functions
  private async _loadAddresses() {
    this.loadingAddresses = true;
    let user;
    let fablab;

    if (this.order && this.order.shippingAddress) {
      this.selectedAddressKey = 'newAddress';
    }

    try {
      user = await this.userService.getUser();
      this.shippingAddresses.userAddress = new Address(
        user.address.street, user.address.zipCode, user.address.city, user.address.country);
      if (this.shippingAddresses.userAddress.compare(this.order.shippingAddress)) {
        this._selectAddress('userAddress');
      }
    } catch (err) {
      this.shippingAddresses.userAddress = undefined;
    }

    try {
      fablab = (await this.fablabService.getFablab(user.fablabId)).fablab;
      this.shippingAddresses.fablabAddress = new Address(
        fablab.address.street, fablab.address.zipCode, fablab.address.city, fablab.address.country);
      if (this.shippingAddresses.fablabAddress.compare(this.order.shippingAddress)) {
        this._selectAddress('fablabAddress');
      }
    } catch (err) {
      this.shippingAddresses.fablabAddress = undefined;
    }
    this.loadingAddresses = false;
  }

  private async _loadEditors() {
    const promises = [];
    let editors = [];
    this.loadingEditors = true;
    try {
      const result = await this.userService.getAllUsers({ 'role.role': 'editor', activated: true }, 0, 0);
      if (result && result.users) {
        editors = result.users;
        editors.forEach(async (editor) => {
          if (editor.fablabId) {
            promises.push(this.fablabService.getFablab(editor.fablabId).then((res) => {
              editor['fablabName'] = res.fablab.name;
            }));
          } else {
            editor['fablabName'] = this.translationFields.messages.unnamedFablab;
          }
          editor['shownName'] = editor.firstname + ' ' + editor.lastname;
        });
      }
    }
    finally {
      // because the ng-select needs to get all finished editors to render groupBy
      Promise.all(promises).then(() => {
        this.editors = editors;
        this.loadingEditors = false;
      }).catch(() => {
        this.loadingEditors = false;
      });
    }
  }


  private async _initializeOrder(id) {
    if (!this.sharedView) {
      this.loggedInUser = await this.userService.getUser();
    }

    const order = this.editView ? undefined : localStorage.getItem(localStorageOrderKey);
    const comment = this.editView ? undefined : localStorage.getItem(localStorageCommentKey);
    if (comment) {
      this.comment = JSON.parse(comment) as Comment;
    }

    if (order) {
      if (!this.sharedView && !this.order.hasOwnProperty('owner')) {
        this.order.owner = this.loggedInUser._id;
      }
      this.order = JSON.parse(order) as Order;
    } else if (id !== undefined) {
      if (!this.sharedView) {
        await this._loadEditors();
      }
      this.order = (await this.orderService.getOrderById(id)).order;
      try {
        const result = await this.orderService.getSchedule(id);
        if (result) {
          const schedule: Schedule = result.schedule;
          this.schedule = this.scheduleService.decompressScheduleDates(schedule);
        }
      } catch (err) { }
    }

    if (order || id !== undefined) {
      if (this.sharedView && this.editView) {
        if (await this.userService.getUser()) {
          this.loggedInUser = await this.userService.getUser();
        } else {
          this.loggedInUser = await this.userService.getNamesOfUser(this.order.owner);
        }
      }

      if (this.order.editor && this.order.editor.length === 24) {
        try {
          const result = await this.userService.getNamesOfUser(this.order.editor);
          if (result && result.fullname) {
            this.order.editor = result._id;
          }
        } catch (err) {
          this.order.editor = undefined;
        }
      } else {
        this.order.editor = undefined;
      }

      this.order['shownStatus'] = await this._translateStatus(this.order.status);
      if (this.order.machine.hasOwnProperty('type') && this.order.machine.type) {
        this.order.machine['shownType'] = await this._translateMachineType(this.order.machine.type);
        this.order.machine.type = this.machineService.uncamelCase(this.order.machine.type);
        const machineId = this.order.machine._id;
        await this.machineTypeChanged(this.order.machine['shownType']);
        this.order.machine._id = machineId;
        try {
          const result: any =
            await this.machineService.getSchedules(this.order.machine.type as string, this.order.machine._id as string);
          if (result && result.schedules) {
            this.machineSchedules = this.machineService.sortSchedulesByStartDate(result.schedules);
          }
        } catch (err) {
          this.machineSchedules = [];
        }
      }

      if (this.order.comments) {
        this.order.comments.forEach(async (comment) => {
          const user = await this.userService.getNamesOfUser(comment.author);
          if (user) {
            comment['authorName'] = user.firstname + ' ' + user.lastname;
          }
        });
      }
      if (this.order.files) {
        this.translateService.get(['date']).subscribe((translations => {
          const currentLang = this.translateService.currentLang || this.translateService.getDefaultLang();
          this.order.files.forEach((file) => {
            file['link'] = `${routes.backendUrl} /` +
              `${routes.paths.backend.orders.root}/${this.order._id}/` +
              `${routes.paths.backend.orders.download}/${file.id}`;
            file['shownCreatedAt'] = this.genericService.translateDate(
              file.createdAt, currentLang, translations['date'].dateTimeFormat);
          });
          this.orderService.sortFilesByDeprecated(this.order.files);
        }));
      }
    } else {
      this.order.owner = this.loggedInUser._id;
    }
  }

  private async _loadStatus() {
    this.loadingStatus = true;
    this.validStatus = (await this.orderService.getStatus(false)).status;
    this.loadingStatus = false;
  }

  private async _loadMachineTypes() {
    this.loadingMachineTypes = true;
    this.machineTypes = (await this.machineService.getAllMachineTypes()).types;
    this.loadingMachineTypes = false;
  }

  private async _loadFablabs() {
    this.loadingFablabs = true;
    const result = await this.fablabService.getFablabs();
    if (result && result.fablabs) {
      this.fablabs = result.fablabs;
    }
    this.loadingFablabs = false;
  }


  private _translateStatus(status): Promise<String> {
    return new Promise((resolve) => {
      this.translateService.get(['status']).subscribe((translations) => {
        let retStatus;
        // translation to origin
        this.validStatus.forEach((vStatus) => {
          const s = translations['status'][`${vStatus}`];
          if (s) {
            if (status === s) {
              retStatus = vStatus;
            }
          }
        });
        // origin to translation
        if (!retStatus) {
          retStatus = translations['status'][`${status}`];
        }
        resolve(retStatus);
      });
    });
  }

  private _translateMachineType(type): Promise<String> {
    return new Promise((resolve) => {
      this.translateService.get(['deviceTypes']).subscribe((translations => {
        let mType;
        // translation to origin
        this.machineTypes.forEach((machineType) => {
          const t = translations['deviceTypes'][`${this.machineService.camelCaseTypes(machineType)}`];
          if (t) {
            if (type === t) {
              mType = machineType;
            }
          }
        });
        // origin to translation
        if (!mType) {
          mType = translations['deviceTypes'][`${this.machineService.camelCaseTypes(type)}`];
        }
        resolve(mType);
      }));
    });
  }

  public uploadingEventHandler(event) {
    if (event === true) {
      this.spinner.show();
      this.genericService.scrollIntoView(this.spinnerContainerRef);
    } else {
      this.spinner.hide();
    }
  }

  private _openSuccessMsg(resultOrder) {
    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.okReturnValue);
    this._openMsgModal(this.translationFields.modals.orderSuccessHeader, 'modal-header header-success',
      this.translationFields.modals.orderSuccess, okButton, undefined).result.then((result) => {
        if (resultOrder.order.shared) {
          this._openLinkMsg(resultOrder.order);
        } else {
          this.genericService.back();
        }
      });
  }

  private _openLinkMsg(order) {
    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.okReturnValue);
    this._openMsgModal(
      this.translationFields.modals.orderSharedLinkSuccessHeader, 'modal-header header-success',
      `${this.translationFields.modals.orderSharedLinkSuccess}`,
      okButton, undefined, `${routes.frontendUrl}/${routes.paths.frontend.orders.root}/` +
      `${routes.paths.frontend.orders.shared.root}/${routes.paths.frontend.orders.shared.detail}/` +
      `${order._id}`).result.then(() => {
        this.genericService.back();
      });
  }

  private _selectAddress(address) {
    this.createOrderForm.controls['street'].reset();
    this.createOrderForm.controls['city'].reset();
    this.createOrderForm.controls['zipCode'].reset();
    this.createOrderForm.controls['country'].reset();
    this.selectedAddressKey = address;
    this.order.shippingAddress = JSON.parse(JSON.stringify(this.shippingAddresses[`${address}`]));
  }

  private _openMsgModal(title: String, titleClass: String, msg: String, button1: ModalButton, button2: ModalButton, link?: String) {
    const modalRef = this.modalService.open(MessageModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.titleClass = titleClass;
    modalRef.componentInstance.msg = msg;
    modalRef.componentInstance.button1 = button1;
    modalRef.componentInstance.button2 = button2;
    if (link) {
      modalRef.componentInstance.link = link;
    }
    return modalRef;
  }



  private _translate() {
    const currentLang = this.translateService.currentLang || this.translateService.getDefaultLang();
    this.translateService.get(['orderForm', 'deviceTypes', 'status', 'date', 'address', 'upload']).subscribe((translations => {
      this.spinnerConfig = new SpinnerConfig(
        translations['upload'].spinnerLoadingText, this.config.spinnerConfig.bdColor,
        this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);
      if (translations.hasOwnProperty('orderForm') && isObject(translations.orderForm) &&
        translations.hasOwnProperty('deviceTypes') && isObject(translations.deviceTypes) &&
        translations.hasOwnProperty('status') && isObject(translations.status) &&
        translations.hasOwnProperty('date') && isObject(translations.date)) {
        const shownMachineTypes = [];
        const shownStatus = [];
        const shownShippingAddresses = [];

        this.machineSchedules.forEach((schedule) => {
          schedule['shownStartDate'] = this.genericService.translateDate(
            schedule.startDate, currentLang, translations['date'].dateTimeFormat);
          schedule['shownEndDate'] = this.genericService.translateDate(
            schedule.endDate, currentLang, translations['date'].dateTimeFormat);
        });

        this.machineTypes.forEach((mType) => {
          const camelType = this.machineService.camelCaseTypes(mType);
          const translated = translations['deviceTypes'][`${camelType}`];
          if (translated) {
            shownMachineTypes.push(translated);
          }
        });

        this.shippingAddressKeys.forEach((address) => {
          const translated = translations['orderForm']['labels']['shippingAddresses'][`${address}`];
          if (translated) {
            shownShippingAddresses.push(translated);
          }
        });

        this.validStatus.forEach((status) => {
          const translated = translations['status'][`${status}`];
          if (translated) {
            shownStatus.push(translated);
          }
        });
        if (this.order && this.order.machine && this.order.machine['shownType']) {
          this._translateMachineType(this.order.machine.type).then((shownType) => {
            this.order.machine['shownType'] = shownType;
          }).catch((error) => {
            console.log(error);
          });
        }

        this.validStatus.forEach((status) => {
          const translated = translations['status'][`${status}`];
          if (translated) {
            shownStatus.push(translated);
          }
        });
        if (this.order && this.order.machine && this.order.machine['shownType']) {
          this._translateMachineType(this.order.machine.type).then((shownType) => {
            this.order.machine['shownType'] = shownType;
          }).catch((error) => {
            console.log(error);
          });
        }

        if (this.order && this.order.status) {
          this._translateStatus(this.order.status).then((shownStatus) => {
            this.order['shownStatus'] = shownStatus;
          }).catch((error) => {
            console.log(error);
          });
        }

        if (this.order && this.order.comments) {
          this.order.comments.forEach((comment) => {
            if (comment.createdAt) {
              comment['shownCreatedAt'] = this.genericService.translateDate(
                comment.createdAt, currentLang, translations['date'].dateTimeFormat);
            }
          });
          this.order.files.forEach((file) => {
            file['shownCreatedAt'] = this.genericService.translateDate(
              file.createdAt, currentLang, translations['date'].dateTimeFormat);
          });
        }
        this.translationFields = {
          title: this.editView ? translations['orderForm'].editTitle : translations['orderForm'].createTitle,
          shownMachineTypes: shownMachineTypes,
          shownStatus: shownStatus,
          shownShippingAddresses: shownShippingAddresses,
          shownAddress: 'TBA',
          publicHint: translations['orderForm'].publicHint,
          labels: {
            submit: this.editView ? translations['orderForm'].labels.editSubmit : translations['orderForm'].labels.createSubmit,
            sendComment: translations['orderForm'].labels.sendComment,
            projectName: translations['orderForm'].labels.projectName,
            owner: translations['orderForm'].labels.owner,
            editor: translations['orderForm'].labels.editor,
            status: translations['orderForm'].labels.status,
            machineType: translations['orderForm'].labels.machineType,
            selectedMachine: translations['orderForm'].labels.selectedMachine,
            selectedMachineInfo: translations['orderForm'].labels.selectedMachineInfo,
            comments: translations['orderForm'].labels.comments,
            newComment: translations['orderForm'].labels.newComment,
            author: translations['orderForm'].labels.author,
            content: translations['orderForm'].labels.content,
            createdAt: translations['orderForm'].labels.createdAt,
            street: translations['address'].street,
            zipCode: translations['address'].zipCode,
            city: translations['address'].city,
            country: translations['address'].country,
            addressTitle: translations['orderForm'].addressTitle,
            fileUpload: translations['orderForm'].labels.fileUpload,
            files: translations['orderForm'].labels.files,
            file: translations['orderForm'].labels.file,
            latestVersion: translations['orderForm'].labels.latestVersion,
            datePickerStart: translations['orderForm'].labels.datePickerStart,
            datePickerEnd: translations['orderForm'].labels.datePickerEnd,
            timePickerStart: translations['orderForm'].labels.timePickerStart,
            timePickerEnd: translations['orderForm'].labels.timePickerEnd,
            machineSchedule: translations['orderForm'].labels.machineSchedule,
            startDate: translations['orderForm'].labels.startDate,
            endDate: translations['orderForm'].labels.endDate
          },
          modals: {
            ok: translations['orderForm'].modals.ok,
            okReturnValue: translations['orderForm'].modals.okReturnValue,
            createCommentError: translations['orderForm'].modals.createCommentError,
            createCommentSuccess: translations['orderForm'].modals.createCommentSuccess,
            createCommentSuccessHeader: translations['orderForm'].modals.createCommentSuccessHeader,
            orderSuccessHeader: this.editView
              ? translations['orderForm'].modals.updateOrderSuccessHeader
              : translations['orderForm'].modals.createOrderSuccessHeader,
            orderSuccess: this.editView
              ? translations['orderForm'].modals.updateOrderSuccess
              : translations['orderForm'].modals.createOrderSuccess,
            errorHeader: translations['orderForm'].modals.errorHeader,
            error: this.editView
              ? translations['orderForm'].modals.updateError
              : translations['orderForm'].modals.createError,
            orderSharedLinkSuccessHeader: translations['orderForm'].modals.orderSharedLinkSuccessHeader,
            orderSharedLinkSuccess: translations['orderForm'].modals.orderSharedLinkSuccess
          },
          messages: {
            projectName: translations['orderForm'].messages.projectName,
            owner: translations['orderForm'].messages.owner,
            status: translations['orderForm'].messages.status,
            machineType: translations['orderForm'].messages.machineType,
            selectedMachine: translations['orderForm'].messages.selectedMachine,
            unnamedFablab: translations['orderForm'].messages.unnamedFablab,
            author: translations['orderForm'].messages.author,
            content: translations['orderForm'].messages.content,
            datePicker: translations['orderForm'].messages.datePicker,
            timePicker: translations['orderForm'].messages.timePicker
          }
        };
      }
    }));
  }
}
