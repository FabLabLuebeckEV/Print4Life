import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { Machine } from '../../models/machines.model';
import { Order, Comment, SimpleMachine } from '../../models/order.model';
import { ConfigService } from '../../config/config.service';
import { routes } from '../../config/routes';
import { GenericService } from '../../services/generic.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { User } from 'frontend/app/models/user.model';
import { UserService } from 'frontend/app/services/user.service';
import { Subscription } from 'rxjs';
import { Address } from 'frontend/app/models/address.model';

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
  config: any;
  publicIcon: any;
  selectedType: String;
  editView: Boolean = false;
  routeChanged: Boolean;
  formSubscription: Subscription;

  sMachine: SimpleMachine = new SimpleMachine(undefined, undefined);
  shippingAddress: Address = new Address(undefined, undefined, undefined, undefined);
  order: Order = new Order(
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.sMachine, undefined, this.shippingAddress, undefined);
  orderId: String;
  comment: Comment = new Comment(undefined, undefined, undefined);

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

  loadingStatus: Boolean;
  validStatus: Array<String> = [];

  loadingFablabs: Boolean;
  fablabs: Array<any>;
  editors: Array<User>;
  loadingEditors: Boolean;
  loggedInUser: User = new User(
    undefined, undefined, '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

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
      error: ''
    },
    messages: {
      projectName: '',
      owner: '',
      status: '',
      machineType: '',
      selectedMachine: '',
      unnamedFablab: '',
      author: '',
      content: ''
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
    private userService: UserService) {
    this.config = this.configService.getConfig();
    this.publicIcon = this.config.icons.public;
    this.shippingAddressKeys = ['userAddress', 'fablabAddress', 'newAddress'];
    this._translate();
    this.router.events.subscribe(() => {
      const route = this.location.path();
      this.editView = route.indexOf(`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}`) >= 0;
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
    if (this.createOrderForm && !this.editView) {
      this.formSubscription = this.createOrderForm.form.valueChanges.subscribe(async (changes) => {
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
      });
    }
  }

  onSubmitComment(form) {
    const errorMsg = this.translationFields.modals.createCommentError;
    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.okReturnValue);
    this.comment.author = this.loggedInUser._id;
    this.comment['authorName'] = undefined;
    this.orderService.createComment(this.orderId, this.comment).then((result) => {
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
            this.router.navigate([`/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}/${this.orderId}`]);
          });
      }
    }).catch(() => {
      this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg,
        okButton, undefined);
    });
  }

  onSubmit() {
    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.ok);
    let found = false;
    let orderCopy;
    this.comment.author = this.loggedInUser._id;
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
      const errorMsg = this.translationFields.modals.error;
      this.orderService.updateOrder(orderCopy).then((result) => {
        if (result) {
          this._openSuccessMsg();
        } else {
          this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
        }
      }).catch(() => {
        this._openMsgModal(this.translationFields.modals.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
      });
    } else {
      const errorMsg = this.translationFields.modals.error;
      this.orderService.createOrder(orderCopy).then((result) => {
        if (result) {
          localStorage.removeItem(localStorageOrderKey);
          localStorage.removeItem(localStorageCommentKey);
          this._openSuccessMsg();
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

  machineSelected() {
    if (this.order.machine.type && this.order.machine._id) {
      this.machines.forEach(element => {
        if (element._id === this.order.machine._id) {
          this.order.machine['deviceName'] = element.deviceName;
        }
      });
      const type = this.machineService.camelCaseTypes(this.order.machine.type);
      this.order.machine['detailView'] = `/${routes.paths.frontend.machines.root}/${type}s/${this.order.machine._id}/`;
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
    this.loggedInUser = await this.userService.getUser();
    const order = localStorage.getItem(localStorageOrderKey);
    const comment = localStorage.getItem(localStorageCommentKey);
    if (comment) {
      this.comment = JSON.parse(comment) as Comment;
    }

    if (order) {
      this.order = JSON.parse(order) as Order;
    } else if (id !== undefined) {
      await this._loadEditors();
      this.order = (await this.orderService.getOrderById(id)).order;
    }

    if (order || id !== undefined) {
      this.order.editor = this.order.editor && this.order.editor.length === 24 ?
        (await this.userService.getNamesOfUser(this.order.editor)).user : undefined;
      this.order['shownStatus'] = await this._translateStatus(this.order.status);
      if (this.order.machine.hasOwnProperty('type') && this.order.machine.type) {
        this.order.machine['shownType'] = await this._translateMachineType(this.order.machine.type);
        this.order.machine.type = this.machineService.uncamelCase(this.order.machine.type);
        await this.machineTypeChanged(this.order.machine['shownType']);
      }
      if (this.order.comments) {
        this.order.comments.forEach(async (comment) => {
          const user = await this.userService.getNamesOfUser(comment.author);
          if (user) {
            comment['authorName'] = user.firstname + ' ' + user.lastname;
          }
        });
      }
      const machineId = this.order.machine._id;
      this.order.machine._id = machineId;
    } else {
      this.order.owner = this.loggedInUser._id;
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


  private _openSuccessMsg() {
    const okButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-primary', this.translationFields.modals.okReturnValue);
    this._openMsgModal(this.translationFields.modals.orderSuccessHeader, 'modal-header header-success',
      this.translationFields.modals.orderSuccess, okButton, undefined).result.then((result) => {
        this.genericService.back();
      });
  }

  private _selectAddress(address) {
    this.selectedAddressKey = address;
    this.order.shippingAddress = this.shippingAddresses[`${address}`];
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

  private _translate() {
    const currentLang = this.translateService.currentLang || this.translateService.getDefaultLang();
    this.translateService.get(['orderForm', 'deviceTypes', 'status', 'date', 'address']).subscribe((translations => {
      const shownMachineTypes = [];
      const shownStatus = [];
      const shownShippingAddresses = [];

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
            let createdAt = moment(comment.createdAt).locale(currentLang).format(translations['date'].dateTimeFormat);
            createdAt = currentLang === 'de' ? createdAt + ' Uhr' : createdAt;
            comment['shownCreatedAt'] = createdAt;
          }
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
        },
        messages: {
          projectName: translations['orderForm'].messages.projectName,
          owner: translations['orderForm'].messages.owner,
          status: translations['orderForm'].messages.status,
          machineType: translations['orderForm'].messages.machineType,
          selectedMachine: translations['orderForm'].messages.selectedMachine,
          unnamedFablab: translations['orderForm'].messages.unnamedFablab,
          author: translations['orderForm'].messages.author,
          content: translations['orderForm'].messages.content
        }
      };
    }));
  }
}
