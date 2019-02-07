import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MachineService } from '../../services/machine.service';
import { FablabService } from '../../services/fablab.service';
import { Machine, Printer3D, MillingMachine, OtherMachine, Lasercutter, Material, Lasertype } from '../../models/machines.model';
import { ConfigService } from '../../config/config.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-machine-form',
  templateUrl: './machine-form.component.html',
  styleUrls: ['./machine-form.component.css']
})
export class MachineFormComponent implements OnInit {
  config: any;
  machineTypes: Array<String> = [];
  selectedType: String = '';
  editView: Boolean;
  submitted: Boolean = false;
  model: Machine;
  fablabs: Array<any>;
  materialsArr: Array<Material>;
  laserTypesArr: Array<Lasertype>;
  loadingFablabs: Boolean;
  loadingMaterials: Boolean;
  loadingLaserTypes: Boolean;
  translationFields = {
    title: '',
    shownMachineTypes: [],
    shownType: '',
    generalData: '',
    labels: {
      submit: '',
      deviceName: '',
      fablab: '',
      manufacturer: '',
      data: '',
      camSoftware: '',
      nozzleDiameter: '',
      materials: '',
      printVolume: '',
      printResolution: '',
      numberOfExtruders: '',
      comment: '',
      movementSpeed: '',
      stepSize: '',
      workspace: '',
      laserTypes: '',
      laserPower: '',
      maxResolution: '',
      typeOfMachine: '',
      isActivated: ''
    },
    buttons: {
      activatedTrue: '',
      activatedFalse: ''
    },
    modals: {
      ok: '',
      error: '',
      successHeader: '',
      successMessage: '',
      errorMessage: ''
    },
    messages: {
      deviceName: '',
      fablab: '',
      manufacturer: '',
      typeOfMachine: ''
    }
  };

  constructor(
    private machineService: MachineService,
    private fablabService: FablabService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private configService: ConfigService,
    private translateService: TranslateService) {
    this.config = this.configService.getConfig();
    this.route.params.subscribe(params => {
      if (params.type && params.id) {
        const type = params.type.substr(0, params.type.length - 1);
        this.machineService.get(type, params.id).then((result) => {
          this.model = result[type];
          this.selectedType = this.machineService.uncamelCase(type);
          this._loadFablabs();
          this._loadMaterials(this.selectedType);
          this._loadLaserTypes();
        });
      }
    });
    this.router.events.subscribe(() => {
      const route = this.location.path();
      if (route.indexOf('/update') >= 0) {
        this.editView = true;
      } else {
        this.editView = false;
      }
      this._loadMachineTypes();
    });
  }

  async ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this._translate();
    });
    this._selectType('');
    this.loadingFablabs = true;
    this._loadFablabs();
    await this._loadMaterials(this.selectedType);
    await this._loadLaserTypes();
    await this._loadMachineTypes();
    this._translate();
  }

  onSubmit() {
    if (!this.editView) {
      this.machineService.create(this.machineService.camelCaseTypes(this.selectedType), this.model).then((result) => {
        if (result) {
          this.modalService.openSuccessMsg(
            this.translationFields.modals.ok,
            this.translationFields.modals.ok,
            this.translationFields.modals.successHeader,
            this.translationFields.modals.successMessage);
        } else {
          const errMessage = this.editView ? '' : this.translationFields.modals.errorMessage;
          this.modalService.openErrMsg(
            this.translationFields.modals.error, errMessage, this.translationFields.modals.ok, this.translationFields.modals.ok);
        }
        this.submitted = true;
      }).catch((err) => {
        const errMessage = this.editView ? '' : this.translationFields.modals.errorMessage;
        this.modalService.openErrMsg(
          this.translationFields.modals.error, errMessage, this.translationFields.modals.ok, this.translationFields.modals.ok);
      });
    } else {
      this.machineService.update(this.machineService.camelCaseTypes(this.selectedType), this.model._id, this.model).then((result) => {
        if (result) {
          this.modalService.openSuccessMsg(
            this.translationFields.modals.ok,
            this.translationFields.modals.ok,
            this.translationFields.modals.successHeader,
            this.translationFields.modals.successMessage);
        } else {
          const errMessage = this.editView ? '' : this.translationFields.modals.errorMessage;
          this.modalService.openErrMsg(
            this.translationFields.modals.error, errMessage, this.translationFields.modals.ok, this.translationFields.modals.ok);
        }
        this.submitted = true;
      }).catch((err) => {
        const errMessage = this.editView ? '' : this.translationFields.modals.errorMessage;
        this.modalService.openErrMsg(
          this.translationFields.modals.error, errMessage, this.translationFields.modals.ok, this.translationFields.modals.ok);
      });
    }
  }

  // Private Functions

  private async _loadLaserTypes() {
    this.loadingLaserTypes = true;
    this.laserTypesArr = (await this.machineService.getLaserTypes()).laserTypes;
    this.loadingLaserTypes = false;
  }

  private _selectType(type) {
    this.translationFields.shownType = type;
    this.translateService.get(['deviceTypes']).subscribe((translations => {
      this.machineTypes.forEach((machineType) => {
        const type = translations['deviceTypes'][`${this.machineService.camelCaseTypes(machineType)}`];
        if (type) {
          if (this.translationFields.shownType === type) {
            this.selectedType = machineType;
          }
        }
      });
    }));
    this.model = this._initModel(this.selectedType);
    this.loadingMaterials = true;
    this._loadMaterials(this.selectedType);
  }

  private async _loadMachineTypes() {
    this.machineTypes = (await this.machineService.getAllMachineTypes()).types;

  }

  private async _loadFablabs() {
    this.fablabs = (await this.fablabService.getFablabs()).fablabs;
    this.loadingFablabs = false;
  }

  private async _loadMaterials(type) {
    if (type && type !== '') {
      this.materialsArr = (await this.machineService.getMaterialsByMachineType(this.machineService.camelCaseTypes(type))).materials;
      this.loadingMaterials = false;
    }
  }

  private _initModel(type) {
    switch (type) {
      case 'Printer3D':
        return new Printer3D(undefined, undefined, undefined,
          this.machineService.camelCaseTypes(type), undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined);
      case 'Milling Machine':
        return new MillingMachine(undefined, undefined, undefined, this.machineService.camelCaseTypes(type),
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined);
      case 'Other Machine':
        return new OtherMachine(undefined, undefined, undefined, this.machineService.camelCaseTypes(type),
          undefined, undefined, undefined, undefined);
      case 'Lasercutter':
        return new Lasercutter(undefined, undefined, undefined, this.machineService.camelCaseTypes(type),
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined);
      default:
        return new Machine(undefined, undefined, undefined, undefined, this.machineService.camelCaseTypes(type), undefined, undefined);
    }
  }

  private _translate() {
    this.translateService.get(['machineForm', 'deviceTypes']).subscribe((translations => {
      const shownMachineTypes = [];
      this.machineTypes.forEach((mType) => {
        const camelType = this.machineService.camelCaseTypes(mType);
        const translated = translations['deviceTypes'][`${camelType}`];
        if (translated) {
          shownMachineTypes.push(translated);
        }
      });
      this.translationFields = {
        title: this.editView ? translations['machineForm'].editTitle : translations['machineForm'].createTitle,
        shownMachineTypes: shownMachineTypes,
        shownType: translations['deviceTypes'][`${this.machineService.camelCaseTypes(this.selectedType)}`],
        generalData: translations['machineForm'].generalData,
        modals: {
          ok: translations['machineForm'].modals.ok,
          error: translations['machineForm'].modals.error,
          successHeader: this.editView
            ? translations['machineForm'].modals.updatingSuccessHeader
            : translations['machineForm'].modals.creatingSuccessHeader,
          successMessage: this.editView
            ? translations['machineForm'].modals.updatingSuccessMsg
            : translations['machineForm'].modals.creatingSuccessMsg,
          errorMessage: this.editView ? translations['machineForm'].modals.updatingError : ''
        },
        buttons: {
          activatedTrue: translations['machineForm'].buttons.activatedTrue,
          activatedFalse: translations['machineForm'].buttons.activatedFalse
        },
        labels: {
          submit: this.editView ? translations['machineForm'].labels.edit : translations['machineForm'].labels.create,
          deviceName: translations['machineForm'].labels.deviceName,
          fablab: translations['machineForm'].labels.fablab,
          manufacturer: translations['machineForm'].labels.manufacturer,
          data: translations['machineForm'].labels.data,
          camSoftware: translations['machineForm'].labels.camSoftware,
          nozzleDiameter: translations['machineForm'].labels.nozzleDiameter,
          materials: translations['machineForm'].labels.materials,
          printVolume: translations['machineForm'].labels.printVolume,
          printResolution: translations['machineForm'].labels.printResolution,
          numberOfExtruders: translations['machineForm'].labels.numberOfExtruders,
          comment: translations['machineForm'].labels.comment,
          movementSpeed: translations['machineForm'].labels.movementSpeed,
          stepSize: translations['machineForm'].labels.stepSize,
          workspace: translations['machineForm'].labels.workspace,
          laserTypes: translations['machineForm'].labels.laserTypes,
          laserPower: translations['machineForm'].labels.laserPower,
          maxResolution: translations['machineForm'].labels.maxResolution,
          typeOfMachine: translations['machineForm'].labels.typeOfMachine,
          isActivated: translations['machineForm'].labels.isActivated
        },
        messages: {
          deviceName: translations['machineForm'].messages.deviceName,
          fablab: translations['machineForm'].messages.fablab,
          manufacturer: translations['machineForm'].messages.manufacturer,
          typeOfMachine: translations['machineForm'].messages.typeOfMachine,
        }
      };
    }));
  }

}
