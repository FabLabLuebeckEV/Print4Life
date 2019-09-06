import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { TableItem } from '../../components/table/table.component';
import { Router } from '@angular/router';
import { ConfigService, SpinnerConfig } from '../../config/config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { routes } from '../../config/routes';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'frontend/app/services/user.service';
import { GenericService } from 'frontend/app/services/generic.service';
import { User } from 'frontend/app/models/user.model';
import { ModalService } from '../../services/modal.service';
import { ModalButton } from '../../helper/modal.button';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {
  @ViewChild('spinnerContainer') spinnerContainerRef: ElementRef;
  private config: any;
  filter: any = {
    originMachineTypes: [], // origin for backend containing all machine types
    machineTypes: [], // shown machine types after translation to select in filter
    shownMachineTypes: [], // selected and translated machine types in filter
    selectedMachineTypes: [], // selected machine types but in origin backend language
    fablabs: [], // origin for backend containing all fablabs
    selectedFablabs: [], // contains only selected fablabs
    selectedActivated: [], // show only activated machines
    shownActivated: [],
    translatedActivated: [],
    originActivated: ['active', 'inactive'],
    searchTerm: ''
  };
  displayedMachines: Array<TableItem> = [];
  listView: Boolean;
  successList: Boolean;
  loadingMachineTypes: Boolean;
  loadingFablabs: Boolean;
  loadingMachines: Boolean;
  plusIcon: Icon;
  toggleOnIcon: Icon;
  toggleOffIcon: Icon;
  jumpArrow: Icon;
  searchIcon: Icon;
  newLink: String;
  spinnerConfig: SpinnerConfig;
  userIsAdmin: Boolean;
  user: User;
  paginationObj: any = {
    page: 1,
    totalItems: 0,
    perPage: 20,
    maxSize: 10,
    boundaryLinks: true,
    rotate: true,
    maxPages: 0,
    jumpToPage: undefined,
    machines: {
      lasercutter: {
        selected: true,
        total: 0,
        lastItem: 0
      },
      otherMachine: {
        selected: true,
        total: 0,
        lastItem: 0
      },
      millingMachine: {
        selected: true,
        total: 0,
        lastItem: 0
      },
      '3d-printer': {
        selected: true,
        total: 0,
        lastItem: 0
      }
    }
  };
  translationFields = {
    paginationLabel: '',
    filterLabel: {
      type: '',
      search: '',
      fablab: '',
      activation: ''
    },
    spinnerLoadingText: '',
    buttons: {
      deleteLabel: '',
      toggleLabel: '',
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
    }
  };
  headers: Array<String> = [];


  constructor(private machineService: MachineService,
    private fablabService: FablabService, private router: Router,
    private location: Location, private modalService: ModalService,
    private spinner: NgxSpinnerService, private configService: ConfigService,
    private translateService: TranslateService, private userService: UserService,
    private genericService: GenericService) {
    this.config = this.configService.getConfig();
    this.spinnerConfig = new SpinnerConfig(
      'Loading Machines', this.config.spinnerConfig.bdColor,
      this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);
    this.plusIcon = this.config.icons.add;
    this.toggleOnIcon = this.config.icons.toggleOn;
    this.toggleOffIcon = this.config.icons.toggleOff;
    this.jumpArrow = this.config.icons.forward;
    this.searchIcon = this.config.icons.search;
    this.newLink = `./${routes.paths.frontend.machines.create}`;
    this.router.events.subscribe(() => {
      this.headers = this._initHeaders();
      const route = this.location.path();
      if (route === `/${routes.paths.frontend.machines.root}/${routes.paths.frontend.machines.successfulOrders}` && !this.successList) {
        this.successList = true;
        this.listView = false;
        this.headers.push('Successful Orders');
      } else if (!this.listView && route === `/${routes.paths.frontend.machines.root}`) {
        this.listView = true;
        this.successList = false;
      } else if (route !== `/${routes.paths.frontend.machines.root}`) {
        this.listView = false;
      }
    });
  }

  private _initHeaders(): Array<String> {
    return ['id', 'Device Type', 'Device Name', 'Manufacturer', 'Fablab', 'Comment'];
  }

  async ngOnInit() {
    this.userIsAdmin = await this.userService.isAdmin();
    this.user = await this.userService.getUser();
    if ((this.listView || this.successList) && !this.loadingMachineTypes) {
      this.translateService.onLangChange.subscribe(() => {
        this._translate();
        this.changeFilterHandler(this.filter.shownMachineTypes);
        this.changeActivationFilterHandler(this.filter.shownActivated);
        this.paginationObj.page = 1;
        this.filterHandler();
      });
      await this._loadMachineTypes();
      await this._loadFablabs();
      this.filter.selectedActivated = JSON.parse(JSON.stringify(["active"]));
      this.filter.translatedActivated = JSON.parse(JSON.stringify(this.filter.originActivated));
      this._translate();
      this.init();
    }
  }

  // Event handler

  searchInit() {
    this.changeFilterHandler(this.filter.shownMachineTypes);
    this.paginationObj.page = 1;
    this.paginationObj.totalItems = 0;
    this.filterHandler();
    this.init();
  }

  changeFilterHandler(event) {
    this.filter.selectedMachineTypes = [];
    this.filter.shownMachineTypes = event;
    this.translateService.get(['deviceTypes']).subscribe((translations => {
      this.filter.originMachineTypes.forEach((machineType) => {
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
    Object.keys(this.paginationObj.machines).forEach((key) => {
      this.paginationObj.machines[`${key}`].selected = false;
    });
    this.filter.selectedMachineTypes.forEach((type) => {
      this.paginationObj.machines[`${this.machineService.camelCaseTypes(type)}`].selected = true;
    });
  }

  async filterHandler() {
    this.paginationObj.page = 1;
    this.paginationObj.totalItems = 0;
    this.init();
  }

  eventHandler(event) {
    if (event.label === this.translationFields.buttons.deleteLabel) {
      let machine: TableItem;
      let machineIdx: number;
      this.displayedMachines.forEach((item, idx) => {
        if (event.refId === item.button1.refId || event.refId === item.button2.refId) {
          machine = item;
          machineIdx = idx;
        }
      });
      const deleteButton = new ModalButton(this.translationFields.modals.yes, 'btn btn-danger', this.translationFields.modals.deleteValue);
      const abortButton = new ModalButton(this.translationFields.modals.abort,
        'btn btn-secondary', this.translationFields.modals.abortValue);
      const modalRef = this.modalService.openMsgModal(this.translationFields.modals.deleteHeader,
        'modal-header header-warning',
        [`${this.translationFields.modals.deleteQuestion} ` +
          `${machine.obj[`Device Name`].label} ${this.translationFields.modals.deleteQuestion2}`]
        , deleteButton, abortButton);
      modalRef.result.then((result) => {
        if (result === deleteButton.returnValue) {
          this.machineService.deleteMachine(
            machine.obj[`Device Type`].label, machine.obj.id.label).then(async (elem) => {
              // this.displayedMachines.splice(machineIdx, 1);
              // XXX: Ugly Hack to trigger update of table component
              this.displayedMachines[machineIdx] = await this._createTableItem(elem[machine.obj[`Device Type`].label]) as TableItem;
              const copy = JSON.parse(JSON.stringify(this.displayedMachines));
              this.displayedMachines = copy;
            });
        }
      });
    }
  }

  changeActivationFilterHandler(event) {
    this.filter.selectedActivated = [];
    this.filter.shownActivated = event;
    this.translateService.get(['machineList']).subscribe((translations => {
      this.filter.originActivated.forEach((activation) => {
        const translated = translations['machineList'].activations[activation];
        if (translated) {
          this.filter.shownActivated.forEach((selectedActivation) => {
            if (selectedActivation === translated) {
              this.filter.selectedActivated.push(activation);
            }
          });
        }
      });
    }));
  }

  private async _createTableItem(elem): Promise<TableItem> {
    let fablab;
    let item;
    try {
      const resFab = await this.fablabService.getFablab(elem.fablabId);
      fablab = resFab.fablab;
      elem.fablab = fablab;
    } finally {
      item = new TableItem();
      item.obj['id'] = { label: elem._id };
      item.obj[`Device Type`] = { label: elem.type };
      item.obj[`Device Name`] = {
        label: elem.deviceName,
        href: this.user ? `/${routes.paths.frontend.machines.root}/${elem.type}s/${elem._id}` : undefined
      };
      item.obj[`Manufacturer`] = { label: elem.manufacturer };
      item.obj[`Fablab`] = { label: fablab.hasOwnProperty('name') ? fablab.name : '' };
      item.obj[`Comment`] = { label: elem.comment };
      if (this.successList) {
        const successfulOrders: { machineId: string, successfulOrders: number }
          = await this.machineService.countSuccessfulOrders(elem.type, elem._id);
        item.obj['Successful Orders'] = { label: successfulOrders.successfulOrders };
        if (this.headers.findIndex(e => e === 'Successful Orders') < 0) {
          this.headers.push('Successful Orders');
        }
      }
      if (this.userIsAdmin) {
        item.button1.label = this.translationFields.buttons.updateLabel;
        item.button1.href = `/${routes.paths.frontend.machines.root}/${routes.paths.frontend.machines.update}/${elem.type}s/${elem._id}`;
        item.button1.class = 'btn btn-warning spacing';
        item.button1.icon = this.config.icons.edit;
        item.button1.tooltip = this.translationFields.buttons.updateLabel;
        item.button2.label = this.translationFields.buttons.deleteLabel;
        item.button2.eventEmitter = true;
        item.button2.class = elem.activated ? 'btn btn-success spacing' : 'btn btn-danger spacing';
        item.button2.icon = elem.activated ? this.config.icons.toggleOn : this.config.icons.toggleOff;
        item.button2.refId = elem._id;
        item.button2.tooltip = this.translationFields.buttons.toggleLabel;
      }
      return item;
    }
  }

  // Private Functions
  private async _loadMachineTypes() {
    this.loadingMachineTypes = true;
    const machineTypes = (await this.machineService.getAllMachineTypes());
    if (machineTypes) {
      this.filter.originMachineTypes = machineTypes.types;
      this.filter.originMachineTypes.forEach((type, idx) => {
        this.filter.originMachineTypes[idx] = this.machineService.camelCaseTypes(type);
      });
      this.filter.machineTypes = JSON.parse(JSON.stringify(this.filter.originMachineTypes));
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
      this.filter.selectedMachineTypes = [];
    }
    this.loadingMachineTypes = false;
  }

  private async _loadFablabs() {
    this.loadingFablabs = true;
    this.filter.selectedFablabs = [];

    const result = await this.fablabService.getFablabs();
    if (result && result.fablabs) {
      this.filter.fablabs = result.fablabs;
      try {
        const loggedInUser = await this.userService.getUser();
        if (!loggedInUser.fablabId) {
          throw Error('User has no Fablab set.');
        }

        const userFablab = this.filter.fablabs.find(elem => {
          return elem._id === loggedInUser.fablabId;
        });

        if (userFablab) {
          this.filter.selectedFablabs = [userFablab];
        } else {
          throw Error('User Fablab not found.');
        }
      } catch (err) {
        this.filter.selectedFablabs = JSON.parse(JSON.stringify(this.filter.fablabs));
      }
    }
    this.loadingFablabs = false;
  }

  public async init() {
    const arr = await this._loadMachinesByTypes(this.filter.selectedMachineTypes);
    if (arr && arr.length > 0) {
      this.displayedMachines = JSON.parse(JSON.stringify(arr));
    } else {
      this.displayedMachines = undefined;
    }
  }

  private async _loadMachinesByTypes(machineTypes: Array<String>) {
    if (!this.loadingMachines) {
      this.loadingMachines = true;
      this.spinner.show();
      this.genericService.scrollIntoView(this.spinnerContainerRef);
      const machines = [];
      const arr = [];
      let promises = [];
      let countObj;
      let totalItems = 0;
      let maxPerPage = this.paginationObj.perPage;

      const query = { $and: [] };

      if (this.filter.selectedFablabs && this.filter.selectedFablabs.length > 0) {
        query.$and.push({ $or: [] });
        this.filter.selectedFablabs.forEach(fablab => {
          query.$and[query.$and.length - 1].$or.push({ fablabId: fablab._id });
        });
      }

      if (this.filter.selectedActivated && this.filter.selectedActivated.length > 0) {
        query.$and.push({ $or: [] });
        this.filter.selectedActivated.forEach(activation => {
          query.$and[query.$and.length - 1].$or.push({ activated: activation === 'active' });
        });
      }

      if (this.filter.searchTerm) {
        query.$and.push({ $text: { $search: this.filter.searchTerm } });
      }
      for (let i = 0; i < machineTypes.length; i++) {
        machineTypes[i] = this.machineService.camelCaseTypes(machineTypes[i]);
      }

      // show all machines if no type is selected in filter
      // see #173
      if (machineTypes.length === 0) {
        machineTypes = this.filter.originMachineTypes;
      }

      machineTypes.forEach(async (type) => {
        promises.push(new Promise(async resolve => {
          countObj = await this.machineService.count(type as string, query);
          this.paginationObj.machines[`${type}`].selected = true;
          this.paginationObj.machines[`${type}`].total = countObj.count;
          if (this.paginationObj.page === 1) {
            this.paginationObj.machines[`${type}`].lastItem = 0;
          }
          resolve(countObj.count);
        }));
      });

      let result = await Promise.all(promises);
      promises = [];
      if (result && result.length) {
        result.forEach((c) => {
          totalItems += c;
        });
      }

      if (totalItems !== this.paginationObj.totalItems) {
        this.paginationObj.totalItems = totalItems;
      }

      for (const type of machineTypes) {
        machines[`${type}`] = await this._resolveMachines(type, maxPerPage, query);
      }

      for (const type of Object.keys(machines)) {
        if (this.paginationObj.machines[`${type}`].selected &&
          this.paginationObj.machines[`${type}`].lastItem < this.paginationObj.machines[`${type}`].total && maxPerPage > 0
          && machines[`${type}`]) {
          for (const machine of machines[`${type}`]) {
            if (this.paginationObj.machines[`${type}`].lastItem < this.paginationObj.machines[`${type}`].total && maxPerPage > 0) {
              maxPerPage -= 1;
              this.paginationObj.machines[`${type}`].lastItem += 1;
              promises.push(this._createTableItem(machine));
            }
          }
        }
      }
      result = await Promise.all(promises);
      if (result && result.length) {
        result.forEach((r) => {
          arr.push(r);
        });
      }

      this.spinner.hide();
      this.loadingMachines = false;
      return arr;
    }
  }

  private async _resolveMachines(type: String, maxPerPage: number, query?: any) {
    // checks for an empty machine type filter.
    // an empty filter should show all machines instead of nothing, see #173
    let hasSelection = false;
    for (var machine of Object.values(this.paginationObj.machines)) {
      if (machine['selected']) {
        hasSelection = true;
      }
    }
    if ((this.paginationObj.machines[`${type}`].selected || !hasSelection) &&
      this.paginationObj.machines[`${type}`].lastItem < this.paginationObj.machines[`${type}`].total && maxPerPage > 0) {
      const resMach = await this.machineService.getAll(type as string,
        query, maxPerPage, this.paginationObj.machines[`${type}`].lastItem);
      if (resMach && resMach[`${type}s`]) {
        return resMach[`${type}s`];
      }
    } else {
      return [];
    }
  }

  private _translate() {
    this.translateService.get(['machineList', 'deviceTypes']).subscribe((translations => {
      this.spinnerConfig = new SpinnerConfig(
        translations['machineList'].spinnerLoadingText, this.config.spinnerConfig.bdColor,
        this.config.spinnerConfig.size, this.config.spinnerConfig.color, this.config.spinnerConfig.type);

      this.filter.machineTypes = [];
      this.filter.shownMachineTypes = [];
      this.filter.translatedActivated = [];
      this.filter.shownActivated = [];

      this.filter.originMachineTypes.forEach((mType) => {
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
      this.filter.originActivated.forEach((oAct) => {
        const translated = translations['machineList'].activations[oAct];
        if (translated) {
          this.filter.translatedActivated.push(translated);
        }
      });
      this.filter.selectedActivated.forEach((sAct) => {
        const translated = translations['machineList'].activations[sAct];
        if (translated) {
          this.filter.shownActivated.push(translated);
        }
      });

      this.translationFields = {
        paginationLabel: translations['machineList'].paginationLabel,
        filterLabel: {
          type: translations['machineList'].filterLabel.type,
          search: translations['machineList'].filterLabel.search,
          fablab: translations['machineList'].filterLabel.fablab,
          activation: translations['machineList'].filterLabel.activation
        },
        spinnerLoadingText: translations['machineList'].spinnerLoadingText,
        buttons: {
          deleteLabel: translations['machineList'].buttons.deleteLabel,
          toggleLabel: translations['machineList'].buttons.toggleLabel,
          updateLabel: translations['machineList'].buttons.updateLabel
        },
        modals: {
          yes: translations['machineList'].modals.yes,
          abort: translations['machineList'].modals.abort,
          deleteValue: translations['machineList'].modals.deleteValue,
          abortValue: translations['machineList'].modals.abortValue,
          deleteHeader: translations['machineList'].modals.deleteHeader,
          deleteQuestion: translations['machineList'].modals.deleteQuestion,
          deleteQuestion2: translations['machineList'].modals.deleteQuestion2
        }
      };
    }));
  }
}
