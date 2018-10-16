import { Component, OnInit } from '@angular/core';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { ConfigService } from '../../config/config.service';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { User } from '../../models/user.model';
import { TableItem } from '../../components/table/table.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { routes } from '../../config/routes';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private userIsAdmin: Boolean;
  private listView: Boolean = false;
  private loadingRoles: Boolean;
  private loadingUsers: Boolean;
  private users: Array<TableItem> = [];
  private visibleUsers: Array<TableItem> = [];
  spinnerConfig: Object;
  jumpArrow: Icon;
  translationFields = {
    paginationLabel: '',
    filterLabel: {
      roles: ''
    },
    spinnerLoadingText: '',
    buttons: {
      activateLabel: '',
      updateLabel: '',
      deleteLabel: ''
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
    badges: {
      active: '',
      inactive: ''
    }
  };
  private filter = {
    validRoles: [],
    originalRoles: [],
    selectedRoles: [],
    shownRoles: []
  };
  private config: any;
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
    private userService: UserService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private configService: ConfigService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal
  ) {
    this.config = this.configService.getConfig();
    this.jumpArrow = this.config.icons.forward;
    this.router.events.subscribe(() => {
      const route = this.location.path();
      if (route === `/${routes.paths.frontend.users.root}` && !this.listView) {
        this.listView = true;
        this.ngOnInit();
      } else if (route !== `/${routes.paths.frontend.users.root}`) {
        this.listView = false;
      }
    });
    this.spinnerConfig = { 'loadingText': 'Loading Users', ...this.config.spinnerConfig };
    this.ngOnInit();
  }

  async ngOnInit() {
    if (this.listView && !this.loadingUsers) {
      this.translateService.onLangChange.subscribe(() => {
        this._translate();
        this.paginationObj.page = 1;
        this.init();
      });
      this.loadingUsers = true;
      this.visibleUsers = [];
      this.users = [];
      await this._loadRoles();
      this.userIsAdmin = await this.userService.isAdmin();
      this._translate();
      this.init();
    }
  }

  async init() {
    this.loadingUsers = true;
    this.users = new Array();
    this.visibleUsers = undefined;
    this.spinner.show();
    let countObj;
    let totalItems = 0;
    let query;
    if (this.filter.selectedRoles.length > 0) {
      query = {
        $or: []
      };
      this.filter.selectedRoles.forEach((role) => {
        query.$or.push({ 'role.role': role });
      });
    } else {
      query = {
        $nor: []
      };
      this.filter.originalRoles.forEach((role) => {
        query.$nor.push({ role: { role } }); /// role role im backend
      });
    }

    countObj = await this.userService.count(query);
    totalItems = countObj.count;

    if (totalItems !== this.paginationObj.totalItems) {
      this.paginationObj.totalItems = totalItems;
    }

    let users = await this.userService.getAllUsers(
      query, this.paginationObj.perPage,
      (this.paginationObj.page - 1) * this.paginationObj.perPage);
    if (users && users.users) {
      users = users.users;
      const arr = [];
      for (const user of users) {
        const item = new TableItem();
        item.obj['Username'] = { label: user.username, href: `./${routes.paths.frontend.users.update}/${user._id}` };
        item.obj['Firstname'] = { label: user.firstname };
        item.obj['Lastname'] = { label: user.lastname };
        item.obj['Role'] = { label: user.role.role };
        item.obj['Active'] = {
          label: user.activated && user.activated === true ?
            this.translationFields.badges.active :
            this.translationFields.badges.inactive,
          badge: true,
          class: user.activated && user.activated === true ? 'badge badge-success' : 'badge badge-danger'
        };
        item.obj['id'] = { label: user._id };
        if (this.userIsAdmin) {
          item.button1.label = this.translationFields.buttons.updateLabel;
          item.button1.href = `./${routes.paths.frontend.users.update}/${user._id}`;
          item.button1.class = 'btn btn-warning spacing';
          item.button1.icon = this.config.icons.edit;
          item.button2.label = this.translationFields.buttons.deleteLabel;
          item.button2.eventEmitter = true;
          item.button2.class = 'btn btn-danger spacing';
          item.button2.icon = this.config.icons.delete;
          item.button2.refId = user._id;
        }
        arr.push(item);
      }

      this.users = this.users.concat(arr);
      this.visibleUsers = undefined;
      this.visibleUsers = JSON.parse(JSON.stringify(this.users));
    }
    this.loadingUsers = false;
    this.spinner.hide();
  }

  private async _loadRoles() {
    this.loadingRoles = true;
    this.filter.originalRoles = (await this.userService.getRoles()).roles;
    this.translateService.get(['roles']).subscribe((translations => {
      this.filter.validRoles.forEach((type, idx) => {
        const translated = translations['roles'][`${type}`];
        this.filter.validRoles[idx] = translated;
      });
      this.filter.shownRoles = JSON.parse(JSON.stringify(this.filter.validRoles));
    }));
    this.filter.selectedRoles = JSON.parse(JSON.stringify(this.filter.originalRoles));
    this.loadingRoles = false;
  }

  eventHandler(event) {
    if (event.label === this.translationFields.buttons.deleteLabel) {
      let user: TableItem;
      let userIdx: number;
      this.visibleUsers.forEach((item, idx) => {
        if (event.refId === item.button1.refId || event.refId === item.button2.refId) {
          user = item;
          userIdx = idx;
        }
      });

      const deleteButton = new ModalButton(this.translationFields.modals.yes, 'btn btn-danger', this.translationFields.modals.deleteValue);
      const abortButton = new ModalButton(this.translationFields.modals.abort, 'btn btn-secondary',
        this.translationFields.modals.abortValue);
      const modalRef = this._openMsgModal(this.translationFields.modals.deleteHeader,
        'modal-header header-danger', `${this.translationFields.modals.deleteQuestion} ` +
        `${user.obj[`Username`].label} ${this.translationFields.modals.deleteQuestion2}`, deleteButton, abortButton);
      modalRef.result.then((result) => {
        if (result === deleteButton.returnValue) {
          this.userService.deleteUser(user.obj.id.label).then((result) => {
            result = result.user;
            const oldUser = this.visibleUsers[userIdx];
            this.users.forEach((item) => {
              if (oldUser.obj.id.label === item.obj.id.label) {
                this.users[userIdx].obj = {};
                this.users[userIdx].obj['id'] = { label: result._id };
                this.users[userIdx].obj['Username'] = { label: result.username };
                this.users[userIdx].obj['Firstname'] = { label: result.firstname };
                this.users[userIdx].obj['Lastname'] = { label: result.lastname };
                this.users[userIdx].obj['Role'] = { label: result.role.role };
                this.users[userIdx].obj['Active'] = {
                  label: result.activated && result.activated === true ?
                    this.translationFields.badges.active :
                    this.translationFields.badges.inactive,
                  badge: true,
                  class: result.activated && result.activated === true ? 'badge badge-success' : 'badge badge-danger'
                };
              }
            });
            this.users[userIdx].obj = {};
            this.users[userIdx].obj['id'] = { label: result._id };
            this.users[userIdx].obj['Username'] = { label: result.username };
            this.users[userIdx].obj['Firstname'] = { label: result.firstname };
            this.users[userIdx].obj['Lastname'] = { label: result.lastname };
            this.users[userIdx].obj['Role'] = { label: result.role.role };
            this.users[userIdx].obj['Active'] = {
              label: result.activated && result.activated === true ?
                this.translationFields.badges.active :
                this.translationFields.badges.inactive,
              badge: true,
              class: result.activated && result.activated === true ? 'badge badge-success' : 'badge badge-danger'
            };
            if ((this.filter.selectedRoles && this.filter.selectedRoles.length > 0)) {
              this.init();
            }
          });
        }
      });
    }
  }

  private _translate() {
    this.translateService.get(['roles', 'userList']).subscribe((translations => {
      this.spinnerConfig = { 'loadingText': translations['userList'].spinnerLoadingText, ...this.config.spinnerConfig };
      this.filter.validRoles = [];
      this.filter.shownRoles = [];
      this.filter.originalRoles.forEach((role) => {
        const translated = translations['roles'][`${role}`];
        if (translated) {
          this.filter.validRoles.push(translated);
        }
      });

      this.filter.selectedRoles.forEach((role) => {
        const translated = translations['roles'][`${role}`];
        if (translated) {
          this.filter.shownRoles.push(translated);
        }
      });

      this.translationFields = {
        paginationLabel: translations['userList'].paginationLabel,
        filterLabel: {
          roles: translations['userList']['filterLabel'].roles
        },
        spinnerLoadingText: translations['userList'].spinnerLoadingText,
        buttons: {
          deleteLabel: translations['userList'].buttons.deleteLabel,
          updateLabel: translations['userList'].buttons.updateLabel,
          activateLabel: translations['userList'].buttons.activateLabel
        },
        modals: {
          yes: translations['userList'].modals.yes,
          abort: translations['userList'].modals.abort,
          deleteValue: translations['userList'].modals.deleteValue,
          abortValue: translations['userList'].modals.abortValue,
          deleteHeader: translations['userList'].modals.deleteHeader,
          deleteQuestion: translations['userList'].modals.deleteQuestion,
          deleteQuestion2: translations['userList'].modals.deleteQuestion2
        },
        badges: {
          active: translations['userList'].badges.active,
          inactive: translations['userList'].badges.inactive
        }
      };
    }));
  }
  private _changeHandlerRoles(event: Array<String>) {
    this.filter.selectedRoles = [];
    this.filter.shownRoles = event;
    this.translateService.get(['roles']).subscribe((translations => {
      this.filter.originalRoles.forEach((roles) => {
        const translatedRoles = translations['roles'][`${roles}`];
        if (translatedRoles) {
          this.filter.shownRoles.forEach((selectedRoles) => {
            if (selectedRoles === translatedRoles) {
              this.filter.selectedRoles.push(roles);
            }
          });
        }
      });
    }));
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
}
