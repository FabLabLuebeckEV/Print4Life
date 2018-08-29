import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { TableItem } from '../../components/table/table.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent, ModalButton } from '../../components/message-modal/message-modal.component';
import { ConfigService } from '../../config/config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { routes } from '../../config/routes';
import { Icon } from '@fortawesome/fontawesome-svg-core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {
  private config: any;
  filter: any = {
    originMachineTypes: [], // origin for backend containing all machine types
    machineTypes: [], // shown machine types after translation to select in filter
    shownMachineTypes: [], // selected and translated machine types in filter
    selectedMachineTypes: undefined // selected machine types but in origin backend language
  };
  displayedMachines: Array<TableItem> = [];
  listView: Boolean;
  loadingMachineTypes: Boolean;
  plusIcon: Icon;
  jumpArrow: Icon;
  newLink: String;
  spinnerConfig: Object = {};
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
      printer: {
        selected: true,
        total: 0,
        lastItem: 0
      }
    }
  };
  translationFields = {
    paginationLabel: '',
    filterLabel: '',
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
    }
  };


  constructor(private machineService: MachineService,
    private fablabService: FablabService, private router: Router,
    private location: Location, private modalService: NgbModal,
    private spinner: NgxSpinnerService, private configService: ConfigService,
    private translateService: TranslateService) {
    this.config = this.configService.getConfig();
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
      this.changeFilterHandler(this.filter.shownMachineTypes);
      this.paginationObj.page = 1;
      this.filterHandler();
    });
    this.plusIcon = this.config.icons.add;
    this.jumpArrow = this.config.icons.forward;
    this.newLink = `./${routes.paths.frontend.machines.create}`;
    this.router.events.subscribe(() => {
      const route = this.location.path();
      if (!this.listView && route === `/${routes.paths.frontend.machines.root}`) {
        this.listView = true;
        this.ngOnInit();
      } else if (route !== routes.paths.frontend.machines.root) {
        this.listView = false;
      }
    });
  }

  async ngOnInit() {
    if (this.listView && !this.loadingMachineTypes) {
      await this._loadMachineTypes();
      this._translate();
      this._init();
    }
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
    const copy = await this._loadMachinesByTypes(this.filter.selectedMachineTypes);
    if (copy.length > 0) {
      this.displayedMachines = copy;
    } else {
      this.displayedMachines = undefined;
    }
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
      const modalRef = this._openMsgModal(this.translationFields.modals.deleteHeader,
        'modal-header header-danger',
        `${this.translationFields.modals.deleteQuestion} ` +
        `${machine.obj[`Device Name`].label} ${this.translationFields.modals.deleteQuestion2}`
        , deleteButton, abortButton);
      modalRef.result.then((result) => {
        if (result === deleteButton.returnValue) {
          this.machineService.deleteMachine(
            machine.obj[`Device Type`].label, machine.obj.id.label).then(() => {
              this.displayedMachines.splice(machineIdx, 1);
              // XXX: Ugly Hack to trigger update of table component
              const copy = JSON.parse(JSON.stringify(this.displayedMachines));
              this.displayedMachines = copy;
            });
        }
      });
    }
  }

  private async _loadMachineTypes() {
    this.loadingMachineTypes = true;
    this.filter.originMachineTypes = (await this.machineService.getAllMachineTypes()).types;
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
    if (!this.filter.selectedMachineTypes) {
      this.filter.selectedMachineTypes = JSON.parse(JSON.stringify(this.filter.originMachineTypes));
    }
    this.loadingMachineTypes = false;
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


  private async _init() {
    const arr = await this._loadMachinesByTypes(this.filter.selectedMachineTypes);
    if (arr.length > 0) {
      this.displayedMachines = JSON.parse(JSON.stringify(arr));
    } else {
      this.displayedMachines = undefined;
    }
  }

  private async _loadMachinesByTypes(machineTypes: Array<String>) {
    this.spinner.show();
    const machines = [];
    const arr = [];
    let countObj;
    let totalItems = 0;
    let maxPerPage = this.paginationObj.perPage;

    for (let i = 0; i < machineTypes.length; i++) {
      machineTypes[i] = this.machineService.camelCaseTypes(machineTypes[i]);
    }

    for (const type of machineTypes) {
      countObj = await this.machineService.count(type);
      this.paginationObj.machines[`${type}`].selected = true;
      this.paginationObj.machines[`${type}`].total = countObj.count;
      if (this.paginationObj.page === 1) {
        this.paginationObj.machines[`${type}`].lastItem = 0;
      }
      totalItems += countObj.count;
    }

    if (totalItems !== this.paginationObj.totalItems) {
      this.paginationObj.totalItems = totalItems;
    }

    for (const type of machineTypes) {
      if (this.paginationObj.machines[`${type}`].selected &&
        this.paginationObj.machines[`${type}`].lastItem < this.paginationObj.machines[`${type}`].total && maxPerPage > 0) {
        const resMach = await this.machineService.getAll(type, maxPerPage, this.paginationObj.machines[`${type}`].lastItem);
        if (resMach) {
          maxPerPage -= resMach[`${type}s`].length;
          this.paginationObj.machines[`${type}`].lastItem += resMach[`${type}s`].length;
          machines.push(resMach[`${type}s`]);
        }
      }
    }

    for (const type of Object.keys(machines)) {
      for (const elem of machines[type]) {
        const resFab = await this.fablabService.getFablab(elem.fablabId);
        const fablab = resFab.fablab;
        elem.fablab = fablab;
        const item = new TableItem();
        item.obj['id'] = { label: elem._id };
        item.obj[`Device Type`] = { label: elem.type };
        item.obj[`Device Name`] = { label: elem.deviceName, href: `./${elem.type}s/${elem._id}` };
        item.obj[`Manufacturer`] = { label: elem.manufacturer };
        item.obj[`Fablab`] = { label: fablab.name };
        item.obj[`Description`] = { label: '' };
        item.button1.label = this.translationFields.buttons.updateLabel;
        item.button1.href = `./${routes.paths.frontend.machines.update}/${elem.type}s/${elem._id}`;
        item.button1.class = 'btn btn-warning spacing';
        item.button1.icon = this.config.icons.edit;
        item.button2.label = this.translationFields.buttons.deleteLabel;
        item.button2.eventEmitter = true;
        item.button2.class = 'btn btn-danger spacing';
        item.button2.icon = this.config.icons.delete;
        item.button2.refId = elem._id;
        arr.push(item);
      }
    }
    this.spinner.hide();
    return arr;
  }

  private _translate() {
    this.translateService.get(['machineList', 'deviceTypes']).subscribe((translations => {
      this.spinnerConfig = { 'loadingText': translations['machineList'].spinnerLoadingText, ...this.config.spinnerConfig };
      this.filter.machineTypes = [];
      this.filter.shownMachineTypes = [];
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

      this.translationFields = {
        paginationLabel: translations['machineList'].paginationLabel,
        filterLabel: translations['machineList'].filterLabel,
        spinnerLoadingText: translations['machineList'].spinnerLoadingText,
        buttons: {
          deleteLabel: translations['machineList'].buttons.deleteLabel,
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
