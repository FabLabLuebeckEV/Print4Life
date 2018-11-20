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
import { GenericService } from '../../services/generic.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import * as moment from 'moment';
import { User } from 'frontend/app/models/user.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  private config: any;
  private userIsLoggedIn: boolean;
  private loggedInUser: User;
  editIcon: any;
  deleteIcon: any;
  editLink: String;
  editor: User = new User(
    undefined, undefined, '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  editorLink: String;
  owner: User = new User(
    undefined, undefined, '', '', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
  ownerLink: String;
  order: Order = new Order(
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined
  );
  machine: any;
  fablab: any;

  translationFields = {
    labels: {
      owner: '',
      editor: '',
      status: '',
      createdAt: '',
      machine: '',
      fablab: '',
      comments: '',
      author: '',
      content: '',
      files: '',
      file: '',
      addressTitle: ''
    },
    modals: {
      ok: '',
      abort: '',
      deleteReturnValue: '',
      abortReturnValue: '',
      deleteHeader: '',
      deleteQuestion: '',
      deleteQuestion2: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private machineService: MachineService,
    private fablabService: FablabService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private genericService: GenericService,
    private translateService: TranslateService,
    private userService: UserService
  ) {
    this.config = this.configService.getConfig();
    this.editIcon = this.config.icons.edit;
    this.deleteIcon = this.config.icons.delete;
  }

  async ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });

    this.route.paramMap
      .subscribe((params) => {
        if (params && params.get('id')) {
          this.orderService.getOrderById(params.get('id')).then(async (result) => {
            this.order = result.order;
            result.order.comments.forEach(async comment => {
              const author = await this.userService.getNamesOfUser(comment.author);
              comment['link'] = `/${routes.paths.frontend.users.root}/${author._id}`;
            });
            result.order.files.forEach(async file => {
              const author = await this.userService.getNamesOfUser(file.author);
              file['link'] = `/${routes.paths.frontend.users.root}/${author._id}`;
            });
            this.owner = await this.userService.getNamesOfUser(this.order.owner);
            this.owner['fullname'] = this.owner.firstname + ' ' + this.owner.lastname;
            this.ownerLink = `/${routes.paths.frontend.users.root}/${this.owner._id}`;
            if (this.order.editor) {
              this.editor = await this.userService.getNamesOfUser(this.order.editor);
              this.editor['fullname'] = this.editor.firstname + ' ' + this.editor.lastname;
              this.editorLink = `/${routes.paths.frontend.users.root}/${this.editor._id}`;
            }
            this.order.comments.forEach(async (comment) => {
              const author = await this.userService.getNamesOfUser(comment.author);
              comment['authorName'] = author.firstname + ' ' + author.lastname;
            });
            this.editLink = `/${routes.paths.frontend.orders.root}/${routes.paths.frontend.orders.update}/${this.order._id}/`;
            this.machineService.get(this.order.machine.type, this.order.machine._id).then(result => {
              const type = this.machineService.camelCaseTypes(this.order.machine.type);
              this.machine = result[`${type}`];
              this.machine['detailView'] = `/${routes.paths.frontend.machines.root}/${type}s/${this.machine._id}/`;
              this.fablabService.getFablab(this.machine.fablabId).then(result => {
                this.fablab = result.fablab;
                this._translate();
              });
            });
          });
        }
      });
    this.userIsLoggedIn = this.userService.isLoggedIn();
    this.loggedInUser = await this.userService.getUser();
  }

  public delete() {
    const deleteButton = new ModalButton(this.translationFields.modals.ok, 'btn btn-danger',
      this.translationFields.modals.deleteReturnValue);
    const abortButton = new ModalButton(this.translationFields.modals.abort, 'btn btn-secondary',
      this.translationFields.modals.abortReturnValue);
    const modalRef = this._openMsgModal(this.translationFields.modals.deleteHeader,
      'modal-header header-danger',
      `${this.translationFields.modals.deleteQuestion} ${this.order.projectname} ${this.translationFields.modals.deleteQuestion2}`,
      deleteButton, abortButton);
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

  private _translateStatus(): Promise<String> {
    return new Promise((resolve) => {
      this.translateService.get(['status']).subscribe((translations) => {
        resolve(translations['status'][`${this.order.status}`]);
      });
    });
  }

  private _translateMachineType(): Promise<String> {
    return new Promise((resolve) => {
      this.translateService.get(['deviceTypes']).subscribe((translations => {
        resolve(translations['deviceTypes'][`${this.machine.type}`]);
      }));
    });
  }

  private _translate() {
    const currentLang = this.translateService.currentLang || this.translateService.getDefaultLang();
    this.translateService.get(['orderDetail', 'deviceTypes', 'status', 'date']).subscribe((translations => {
      if (this.order) {
        let createdAt = moment(this.order.createdAt).locale(currentLang).format(translations['date'].dateTimeFormat);
        createdAt = currentLang === 'de' ? createdAt + ' Uhr' : createdAt;
        this.order['shownCreatedAt'] = createdAt;
      }
      if (this.order && this.order.status) {
        this._translateStatus().then((shownStatus) => {
          this.order['shownStatus'] = shownStatus;
        });
      }

      if (this.machine && this.machine.type) {
        this._translateMachineType().then((shownType) => {
          this.machine['shownType'] = shownType;
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
        labels: {
          owner: translations['orderDetail'].labels.owner,
          editor: translations['orderDetail'].labels.editor,
          status: translations['orderDetail'].labels.status,
          createdAt: translations['orderDetail'].labels.createdAt,
          machine: translations['orderDetail'].labels.machine,
          fablab: translations['orderDetail'].labels.fablab,
          comments: translations['orderDetail'].labels.comments,
          author: translations['orderDetail'].labels.author,
          content: translations['orderDetail'].labels.content,
          files: translations['orderDetail'].labels.files,
          file: translations['orderDetail'].labels.file,
          addressTitle: translations['orderDetail'].labels.addressTitle
        },
        modals: {
          ok: translations['orderDetail'].modals.ok,
          abort: translations['orderDetail'].modals.abort,
          deleteReturnValue: translations['orderDetail'].modals.deleteReturnValue,
          abortReturnValue: translations['orderDetail'].modals.abortReturnValue,
          deleteHeader: translations['orderDetail'].modals.deleteHeader,
          deleteQuestion: translations['orderDetail'].modals.deleteQuestion,
          deleteQuestion2: translations['orderDetail'].modals.deleteQuestion2
        }
      };
    }));
  }
}
