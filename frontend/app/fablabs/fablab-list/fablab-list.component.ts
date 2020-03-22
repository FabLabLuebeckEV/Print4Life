import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { ConfigService } from '../../config/config.service';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { TableItem } from '../../components/table/table.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { routes } from '../../config/routes';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GenericService } from 'frontend/app/services/generic.service';
import { SpinnerConfig } from '../../config/config.service';
import { FablabService } from 'frontend/app/services/fablab.service';
import { ModalService } from '../../services/modal.service';
import { ModalButton } from '../../helper/modal.button';

@Component({
  selector: 'app-fablab-list',
  templateUrl: './fablab-list.component.html',
  styleUrls: ['./fablab-list.component.css']
})
export class FablabListComponent implements OnInit {
  @ViewChild('spinnerContainer', { static: false }) spinnerContainerRef: ElementRef;
  private userIsAdmin: Boolean;
  listView: Boolean = false;
  private loadingFablabs: Boolean;
  private fablabs: Array<TableItem> = [];
  private visibleFablabs: Array<TableItem> = [];
  headers: Array<String>;
  spinnerConfig: SpinnerConfig;
  jumpArrow: Icon;
  searchIcon: Icon;
  translationFields = {
    paginationLabel: '',
    filterLabel: {
      roles: '',
      fablabs: '',
      search: ''
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
    shownRoles: [],
    searchTerm: '',
    allFablabs: [],
    selectedFablabs: []
  };
  private config: any;
  paginationObj: any = {
    page: 1,
    totalItems: 0,
    perPage: 20,
    maxSize: 3,
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
    private modalService: ModalService,
    private genericService: GenericService,
    private fablabService: FablabService
  ) {
    this.config = this.configService.getConfig();
    this.jumpArrow = this.config.icons.forward;
    this.searchIcon = this.config.icons.search;
    this.headers = ['id', 'Name', 'City', 'FOwner', 'Active' ];
    this.router.events.subscribe(() => {
      const route = this.location.path();
      if (route === `/${routes.paths.frontend.fablabs.root}` && !this.listView) {
        this.listView = true;
        this.ngOnInit();
      } else if (route !== `/${routes.paths.frontend.fablabs.root}`) {
        this.listView = false;
      }
    });
    this.spinnerConfig = new SpinnerConfig(
      'Loading Fablabs', this.config.spinnerConfig.bdColor,
      this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);
    this.ngOnInit();
  }

  async ngOnInit() {
    if (this.listView && !this.loadingFablabs) {
      this.translateService.onLangChange.subscribe(() => {
        this._translate();
        this.paginationObj.page = 1;
        this.init();
      });
      this.loadingFablabs = true;
      this.visibleFablabs = [];
      this.fablabs = [];
      await this._loadFablabs();
      this.userIsAdmin = await this.userService.isAdmin();
      this._translate();
      await this.init();
    }
  }

  async init() {
    this.fablabs = new Array();
    this.visibleFablabs = undefined;
    await this._loadFablabs();
    console.log({visibleLabs: this.visibleFablabs,
    msg: 'TESTMESSAGE'});
  }

  searchInit() {
    this.paginationObj.page = 1;
    this.paginationObj.totalItems = 0;
    this.init();
  }

  private async _loadFablabs(): Promise<TableItem[]> {
    const arr = [];
    this.loadingFablabs = true;
    this.spinner.show();
    if ( this.spinnerContainerRef ) {
      this.genericService.scrollIntoView(this.spinnerContainerRef);
      this.genericService.scrollIntoView(this.spinnerContainerRef);
    }
    let countObj;
    let totalItems = 0;
    const query = {
      $and: []
    };

    if (this.filter.searchTerm) {
      query.$and.push({ $text: { $search: this.filter.searchTerm } });
    }

    countObj = await this.userService.count(query);
    totalItems = countObj.count;

    if (totalItems !== this.paginationObj.totalItems) {
      this.paginationObj.totalItems = totalItems;
    }

    let fablabs = await this.fablabService.getFablabs();
    if (fablabs && fablabs.fablabs) {
      fablabs = fablabs.fablabs;
      for (const fablab of fablabs) {
        const item = new TableItem();
        // const result = await this.userService.getProfile(fablab.owner);
        // if(result && result.user)
        // {
        //   fablab.owner = result.user;
        // }, href: `./${fablab._id}`
        item.obj['Name'] = { label: fablab.name};
        item.obj['City'] = { label: fablab.address.city };
        item.obj['Owner'] = { label: fablab.owner };
               item.obj['Active'] = {
          label: fablab.activated && fablab.activated === true ?
            this.translationFields.badges.active :
            this.translationFields.badges.inactive,
          badge: true,
          class: fablab.activated && fablab.activated === true ? 'badge badge-success' : 'badge badge-danger'
        };
        item.obj['id'] = { label: fablab._id };
        if (this.userIsAdmin) {
          item.button1.label = this.translationFields.buttons.updateLabel;
          item.button1.href = `./${routes.paths.frontend.fablabs.update}/${fablab._id}`;
          item.button1.class = 'btn btn-warning spacing';
          item.button1.icon = this.config.icons.edit;
          item.button1.tooltip = this.translationFields.buttons.updateLabel;
          item.button2.label = this.translationFields.buttons.deleteLabel;
          item.button2.eventEmitter = true;
          item.button2.class = 'btn btn-danger spacing';
          item.button2.icon = this.config.icons.delete;
          item.button2.refId = fablab._id;
          item.button2.tooltip = this.translationFields.buttons.deleteLabel;
        }
        arr.push(item);
      }

      this.fablabs = this.fablabs.concat(arr);
      console.log(this.fablabs);
      this.visibleFablabs = undefined;
      this.visibleFablabs = JSON.parse(JSON.stringify(this.fablabs));
    }
    this.loadingFablabs = false;
    this.spinner.hide();
    return arr;
  }

  async pageChanged() {
    try {
      const copy = await this._loadFablabs();
      if (copy.length > 0) {
        this.visibleFablabs = copy;
      }
    } catch (err) {
      this.visibleFablabs = undefined;
    }
  }

  eventHandler(event) {
    if (event.label === this.translationFields.buttons.deleteLabel) {
      let user: TableItem;
      let userIdx: number;
      this.visibleFablabs.forEach((item, idx) => {
        if (event.refId === item.button1.refId || event.refId === item.button2.refId) {
          user = item;
          userIdx = idx;
        }
      });

      const deleteButton = new ModalButton(this.translationFields.modals.yes, 'btn btn-danger', this.translationFields.modals.deleteValue);
      const abortButton = new ModalButton(this.translationFields.modals.abort, 'btn btn-secondary',
        this.translationFields.modals.abortValue);
      const modalRef = this.modalService.openMsgModal(this.translationFields.modals.deleteHeader,
        'modal-header header-danger', [`${this.translationFields.modals.deleteQuestion} ` +
          `${user.obj[`Name`].label} ${this.translationFields.modals.deleteQuestion2}`], deleteButton, abortButton);
      modalRef.result.then((result) => {
        if (result === deleteButton.returnValue) {
          this.userService.deleteUser(user.obj.id.label).then((result) => {
            result = result.user;
            const oldUser = this.visibleFablabs[userIdx];
            this.fablabs.forEach((item) => {
              if (oldUser.obj.id.label === item.obj.id.label) {
                this.fablabs[userIdx].obj = {};
                this.fablabs[userIdx].obj['id'] = { label: result._id };
                this.fablabs[userIdx].obj['Username'] = { label: result.username };
                this.fablabs[userIdx].obj['Firstname'] = { label: result.firstname };
                this.fablabs[userIdx].obj['Lastname'] = { label: result.lastname };
                this.fablabs[userIdx].obj['Fablab'] = {
                  label: result.fablab && result.fablab.name ? result.fablab.name : '-'
                };
                this.fablabs[userIdx].obj['Role'] = { label: result.role.role };
                this.fablabs[userIdx].obj['Active'] = {
                  label: result.activated && result.activated === true ?
                    this.translationFields.badges.active :
                    this.translationFields.badges.inactive,
                  badge: true,
                  class: result.activated && result.activated === true ? 'badge badge-success' : 'badge badge-danger'
                };
              }
            });
            this.fablabs[userIdx].obj = {};
            this.fablabs[userIdx].obj['id'] = { label: result._id };
            this.fablabs[userIdx].obj['Username'] = { label: result.username };
            this.fablabs[userIdx].obj['Firstname'] = { label: result.firstname };
            this.fablabs[userIdx].obj['Lastname'] = { label: result.lastname };
            this.fablabs[userIdx].obj['Fablab'] = {
              label: result.fablab && result.fablab.name ? result.fablab.name : '-'
            };
            this.fablabs[userIdx].obj['Role'] = { label: result.role.role };
            this.fablabs[userIdx].obj['Active'] = {
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
      this.spinnerConfig = new SpinnerConfig(
        translations['userList'].spinnerLoadingText, this.config.spinnerConfig.bdColor,
        this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);
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
          roles: translations['userList']['filterLabel'].roles,
          fablabs: translations['userList']['filterLabel'].fablabs,
          search: translations['userList']['filterLabel'].search
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


}
