import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
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


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  config: any;
  publicIcon: any;
  selectedType: String;
  editView: Boolean = false;
  routeChanged: Boolean;

  sMachine: SimpleMachine = new SimpleMachine(undefined, undefined);
  order: Order = new Order(undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.sMachine, undefined);
  orderId: String;
  comment: Comment = new Comment(undefined, undefined, undefined);

  loadingMachineTypes: Boolean;
  machineTypes: Array<String> = [];

  loadingMachinesForType: Boolean;
  machines: Array<Machine> = [];

  loadingStatus: Boolean;
  validStatus: Array<String> = [];

  loadingFablabs: Boolean;
  fablabs: Array<any>;

  translationFields = {
    title: '',
    shownMachineTypes: [],
    shownStatus: [],
    publicHint: '',
    labels: {
      ok: '',
      okReturnValue: '',
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
      timestamp: '',
    },
    messages: {
      createCommentError: '',
      createCommentSuccessHeader: '',
      createCommentSuccess: '',
      orderSuccessHeader: '',
      orderSuccess: '',
      errorHeader: '',
      error: '',
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
    private translateService: TranslateService) {
    this.config = this.configService.getConfig();
    this.publicIcon = this.config.icons.public;
    this.router.events.subscribe(() => {
      const route = this.location.path();
      this.editView = route.indexOf(`${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}`) >= 0;
      if (this.editView) {
        const routeArr = route.split('/');
        this.orderId = routeArr[routeArr.length - 1];
      }
    });
  }

  async ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    await this._loadMachineTypes();
    await this._loadFablabs();
    await this._loadStatus();
    this._initializeOrder(this.orderId);
    this._translate();
  }

  onSubmitComment(form) {
    const errorMsg = this.translationFields.messages.createCommentError;
    const okButton = new ModalButton(this.translationFields.labels.ok, 'btn btn-primary', this.translationFields.labels.okReturnValue);

    this.orderService.createComment(this.orderId, this.comment).then((result) => {
      if (result) {
        this._openMsgModal(this.translationFields.messages.createCommentSuccessHeader, 'modal-header header-success',
          this.translationFields.messages.createCommentSuccess, okButton, undefined).result.then((result) => {
            this.orderService.getOrderById(this.orderId).then((result) => {
              this.order = result.order;
              const author = JSON.parse(JSON.stringify(this.comment.author));
              form.reset();
              form.controls['author'].setValue(author);
              this._translateMachineType(this.order.machine.type).then((shownType) => {
                this.order.machine['shownType'] = shownType;
                this._translateStatus(this.order.status).then((shownStatus) => {
                  this.order['shownStatus'] = shownStatus;
                }).catch((error) => {
                  console.log(error);
                });
              }).catch((error) => {
                console.log(error);
              });
            });
            this.router.navigate([`/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}/${this.orderId}`]);
          });
      }
    }).catch(() => {
      this._openMsgModal(this.translationFields.messages.errorHeader, 'modal-header header-danger', errorMsg,
        okButton, undefined);
    });
  }

  onSubmit() {
    const okButton = new ModalButton(this.translationFields.labels.ok, 'btn btn-primary', this.translationFields.labels.ok);
    let found = false;
    let orderCopy;
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
        this.order.comments.push(this.comment);
      }
    }
    orderCopy = JSON.parse(JSON.stringify(this.order));
    orderCopy.machine.type = this.machineService.camelCaseTypes(orderCopy.machine.type);
    if (this.editView) {
      const errorMsg = this.translationFields.messages.error;
      this.orderService.updateOrder(orderCopy).then((result) => {
        if (result) {
          this._openSuccessMsg();
        } else {
          this._openMsgModal(this.translationFields.messages.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
        }
      }).catch(() => {
        this._openMsgModal(this.translationFields.messages.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
      });
    } else {
      const errorMsg = this.translationFields.messages.error;
      this.orderService.createOrder(orderCopy).then((result) => {
        if (result) {
          this._openSuccessMsg();
        } else {
          this._openMsgModal(this.translationFields.messages.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
        }
      }).catch(() => {
        this._openMsgModal(this.translationFields.messages.errorHeader, 'modal-header header-danger', errorMsg, okButton, undefined);
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
    this.machines.forEach(element => {
      if (element._id === this.order.machine._id) {
        this.order.machine['deviceName'] = element.deviceName;
      }
    });
    const type = this.machineService.camelCaseTypes(this.order.machine.type);
    this.order.machine['detailView'] = `/${routes.paths.frontend.machines.root}/${type}s/${this.order.machine._id}/`;
  }

  // Private Functions

  private async _initializeOrder(id) {
    if (id !== undefined) {
      this.order = (await this.orderService.getOrderById(id)).order;
      this.order.machine['shownType'] = await this._translateMachineType(this.order.machine.type);
      this.order['shownStatus'] = await this._translateStatus(this.order.status);
      this.order.machine.type = this.machineService.uncamelCase(this.order.machine.type);
      const machineId = this.order.machine._id;
      await this.machineTypeChanged(this.order.machine['shownType']);
      this.order.machine._id = machineId;
      this.machineSelected();
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
    this.fablabs = (await this.fablabService.getFablabs()).fablabs;
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
    const okButton = new ModalButton(this.translationFields.labels.ok, 'btn btn-primary', this.translationFields.labels.okReturnValue);
    this._openMsgModal(this.translationFields.messages.orderSuccessHeader, 'modal-header header-success',
      this.translationFields.messages.orderSuccess, okButton, undefined).result.then((result) => {
        this.genericService.back();
      });
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
    this.translateService.get(['orderForm', 'deviceTypes', 'status']).subscribe((translations => {
      const shownMachineTypes = [];
      const shownStatus = [];
      this.machineTypes.forEach((mType) => {
        const camelType = this.machineService.camelCaseTypes(mType);
        const translated = translations['deviceTypes'][`${camelType}`];
        if (translated) {
          shownMachineTypes.push(translated);
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
      this.translationFields = {
        title: this.editView ? translations['orderForm'].editTitle : translations['orderForm'].createTitle,
        shownMachineTypes: shownMachineTypes,
        shownStatus: shownStatus,
        publicHint: translations['orderForm'].publicHint,
        labels: {
          submit: this.editView ? translations['orderForm'].labels.editSubmit : translations['orderForm'].labels.editSubmit,
          sendComment: translations['orderForm'].labels.sendComment,
          ok: translations['orderForm'].labels.ok,
          okReturnValue: translations['orderForm'].labels.okReturnValue,
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
          timestamp: translations['orderForm'].labels.timestamp
        },
        messages: {
          createCommentError: translations['orderForm'].messages.createCommentError,
          createCommentSuccess: translations['orderForm'].messages.createCommentSuccess,
          createCommentSuccessHeader: translations['orderForm'].messages.createCommentSuccessHeader,
          orderSuccessHeader: this.editView
            ? translations['orderForm'].messages.updateOrderSuccessHeader
            : translations['orderForm'].messages.createOrderSuccessHeader,
          orderSuccess: this.editView
            ? translations['orderForm'].messages.updateOrderSuccess
            : translations['orderForm'].messages.createOrderSuccess,
          errorHeader: translations['orderForm'].messages.errorHeader,
          error: this.editView
            ? translations['orderForm'].messages.updateError
            : translations['orderForm'].messages.createError,
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
